import React, { useState, useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

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
            client.subscribe("/topic/chat", (msg) => {
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
            stompClient.publish({ destination: "/app/chat", body: JSON.stringify(chatMessage) });
            setMessage("");
        } else {
            console.error("STOMP Client is not connected!");
        }
    };

    return (
        <div>
            {/* Nút mở chat */}
            <button
                className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded-full shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
            >
                💬 Chat tư vấn
            </button>

            {/* Khung chat */}
            {isOpen && (
                <div className="fixed bottom-16 right-4 w-80 bg-white border rounded shadow-lg">
                    <div className="p-2 bg-blue-500 text-white text-center font-bold">
                        Hỗ trợ khách hàng
                    </div>
                    <div className="p-2 h-64 overflow-auto border">
                        {messages.map((msg, index) => (
                            <p key={index}>
                                <strong>{msg.sender}:</strong> {msg.content}
                            </p>
                        ))}
                    </div>
                    <div className="p-2 border-t flex">
                        <input
                            type="text"
                            className="border flex-1 p-1"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button className="bg-blue-500 text-white px-3 py-1" onClick={sendMessage}>
                            Gửi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatBox;
