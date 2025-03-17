import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import '../styles/ChatBox.css'

const ChatBox = () => {
    const [stompClient, setStompClient] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false); // Điều khiển hiển thị chat box

    useEffect(() => {
        // Khởi tạo kết nối WebSocket
        const socket = new SockJS("http://localhost:8080/ws-auction");
        const client = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            reconnectDelay: 5000, // Tự động kết nối lại sau 5 giây nếu mất kết nối
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("Connected to WebSocket!");
            client.subscribe("/topic/messages", (msg) => {
                const newMessage = JSON.parse(msg.body);
                setMessages((prev) => [...prev, newMessage]);
            });
        };

        client.onStompError = (frame) => {
            console.error("STOMP Error:", frame);
        };

        client.activate();
        setStompClient(client);

        return () => {
            if (client) {
                client.deactivate();
                console.log("WebSocket Disconnected!");
            }
        };
    }, []);

    const sendMessage = () => {
        if (stompClient && stompClient.connected) {
            const chatMessage = { sender: "User", content: message };
            stompClient.publish({ destination: "/app/sendMessage", body: JSON.stringify(chatMessage) });
            setMessage("");
        } else {
            console.error("STOMP Client is not connected!");
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
                            <p key={index}>
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