import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import '../../styles/ChatBox.css';

const ChatBox = ({ isAdmin = false }) => {
    const [stompClient, setStompClient] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null); // ✅ Admin chọn user
    const [customers, setCustomers] = useState([]); // ✅ Danh sách user chat với admin

    useEffect(() => {
        let role = localStorage.getItem("role");
        let isAdmin = role === "ROLE_ADMIN";

        const socket = new SockJS("http://localhost:8080/ws-auction");
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("✅ Connected to WebSocket!");

            if (isAdmin) {
                client.subscribe("/topic/admin/messages", (msg) => {
                    const newMessage = JSON.parse(msg.body);
                    setMessages((prev) => [...prev, newMessage]);

                    // ✅ Nếu user mới gửi tin nhắn, thêm vào danh sách user (tránh trùng lặp)
                    setCustomers((prev) => {
                        if (!prev.includes(newMessage.sender)) {
                            return [...prev, newMessage.sender];
                        }
                        return prev;
                    });
                });
            } else {
                let customerId = localStorage.getItem("customerId");
                if (!customerId || customerId === "null") {
                    console.error("❌ Lỗi: Không tìm thấy customerId!");
                    return;
                }

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
        if (!stompClient || !stompClient.connected) {
            console.error("❌ STOMP Client is not connected!");
            return;
        }

        let role = localStorage.getItem("role");
        let isAdmin = role === "ROLE_ADMIN";
        let customerId = localStorage.getItem("customerId");

        if (!isAdmin && (!customerId || customerId === "null")) {
            console.error("❌ Lỗi: Không tìm thấy customerId!");
            return;
        }

        if (isAdmin && !selectedCustomerId) {
            console.error("❌ Admin phải chọn khách hàng để trả lời!");
            return;
        }

        const chatMessage = {
            sender: isAdmin ? "admin" : customerId,
            receiverId: isAdmin ? selectedCustomerId : "admin",
            content: message,
            isAdmin: isAdmin
        };

        stompClient.publish({
            destination: isAdmin ? "/app/admin-reply" : "/app/private-message",
            body: JSON.stringify(chatMessage)
        });

        setMessages((prev) => [...prev, chatMessage]);
        setMessage("");
    };

    return (
        <div>
            <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
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

                    {isAdmin && customers.length > 0 && (
                        <div className="chat-customer-select">
                            <label>Chọn khách hàng:</label>
                            <select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)}>
                                <option value="">-- Chọn khách hàng --</option>
                                {customers.map((customer, index) => (
                                    <option key={index} value={customer}>{customer}</option>
                                ))}
                            </select>
                        </div>
                    )}

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
