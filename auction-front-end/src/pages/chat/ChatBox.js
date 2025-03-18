import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import '../../styles/ChatBox.css';

const ChatBox = ({ isAdmin = false }) => {
    const [stompClient, setStompClient] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false); // Điều khiển hiển thị chat box

    useEffect(() => {
        let customerId = localStorage.getItem("customerId");
        let role = localStorage.getItem("role");

        // ✅ Nếu là admin mà không có customerId, đặt customerId = "admin"
        if (!customerId || customerId === "null") {
            if (role === "ROLE_ADMIN") {
                customerId = "admin";
                console.warn("⚠️ Không có customerId, sử dụng 'admin' làm ID.");
            } else {
                console.error("❌ Lỗi: Không tìm thấy customerId!");
                return; // Dừng kết nối WebSocket nếu không có customerId
            }
        }

        // 🔗 Khởi tạo kết nối WebSocket
        const socket = new SockJS("http://localhost:8080/ws-auction");
        const client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: { customerId }, // Đảm bảo luôn có customerId
            debug: (str) => console.log(str),
            reconnectDelay: 5000, // Tự động kết nối lại sau 5 giây nếu mất kết nối
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("✅ Connected to WebSocket!");

            if (isAdmin) {
                client.subscribe("/topic/admin/messages", (msg) => {
                    const newMessage = JSON.parse(msg.body);
                    setMessages((prev) => [...prev, newMessage]);
                });
            } else {
                client.subscribe(`/user/${customerId}/queue/private-messages`, (msg) => {
                    const newMessage = JSON.parse(msg.body);
                    setMessages((prev) => [...prev, newMessage]);
                });
            }
        };

        client.onStompError = (frame) => {
            console.error("❌ STOMP Error:", frame);
        };

        client.activate();
        setStompClient(client);

        return () => {
            if (client) {
                client.deactivate();
                console.log("❌ WebSocket Disconnected!");
            }
        };
    }, []);

    const sendMessage = () => {
        if (stompClient && stompClient.connected) {
            let customerId = localStorage.getItem("customerId");
            let role = localStorage.getItem("role");

            if (!customerId || customerId === "null") {
                customerId = role === "ROLE_ADMIN" ? "admin" : "anonymous";
            }

            const chatMessage = {
                sender: customerId,
                content: message,
                isAdmin: isAdmin
            };

            stompClient.publish({
                destination: isAdmin ? "/app/admin-reply" : "/app/private-message",
                body: JSON.stringify(chatMessage)
            });

            setMessage("");
        } else {
            console.error("❌ STOMP Client is not connected!");
        }
    };


    return (
        <div>
            <button
                className="chat-toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                💬
            </button>

            {isOpen && (
                <div className="chat-box">
                    <div className="chat-header">
                        <div className="chat-header custom-shadow">
                            Hỗ trợ tư vấn
                        </div>
                        <button className="chat-close-btn" onClick={() => setIsOpen(false)}>⨉</button>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <p key={index} className={msg.isAdmin ? "admin-message" : "user-message"}>
                                <strong>{msg.sender}:</strong> {msg.content}
                            </p>
                        ))}
                    </div>
                    <div className="chat-input-container">
                        <input
                            type="text"
                            className="chat-input"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button className="chat-send-btn" onClick={sendMessage}>
                            Gửi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBox;
