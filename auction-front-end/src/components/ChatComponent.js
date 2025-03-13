import React, { useState, useEffect } from 'react';
import ChatService from '../services/ChatService';

const ChatComponent = () => {
    const [messages, setMessages] = useState([]); // Danh sách tin nhắn
    const [inputValue, setInputValue] = useState(''); // Nội dung tin nhắn nhập vào

    useEffect(() => {
        // Kết nối WebSocket khi component được tạo
        ChatService.connect((message) => {
            setMessages((prevMessages) => [...prevMessages, message]); // Thêm tin nhắn mới vào danh sách
        });

        return () => {
            ChatService.disconnect(); // Ngắt kết nối khi component bị hủy
        };
    }, []);

    const sendMessage = () => {
        if (inputValue.trim()) {
            ChatService.sendMessage(inputValue); // Gửi tin nhắn
            setInputValue(''); // Xóa nội dung ô nhập
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '5px', maxWidth: '400px', margin: '0 auto' }}>
            <h2>Chat với Admin</h2>
            <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <strong>Người dùng:</strong> {msg}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                style={{ width: '70%', padding: '10px', marginRight: '10px' }}
            />
            <button onClick={sendMessage} style={{ padding: '10px' }}>Gửi</button>
        </div>
    );
};

export default ChatComponent;