import { Client } from '@stomp/stompjs';

const ChatService = {
    client: null,
    connect: (onMessageReceived) => {
        const client = new Client({
            brokerURL: 'ws://localhost:8080/ws', // Kết nối đến WebSocket backend
            onConnect: () => {
                // Đăng ký kênh nhận tin nhắn
                client.subscribe('/topic/public', (message) => {
                    onMessageReceived(message.body); // Gọi callback khi nhận tin nhắn
                });
            },
            debug: (str) => {
                console.log(str); // Log lỗi (nếu có)
            }
        });

        client.activate();
        ChatService.client = client;
    },
    sendMessage: (message) => {
        if (ChatService.client && ChatService.client.connected) {
            // Gửi tin nhắn đến backend
            ChatService.client.publish({
                destination: '/app/chat.sendMessage',
                body: message
            });
        }
    },
    disconnect: () => {
        if (ChatService.client) {
            ChatService.client.deactivate(); // Ngắt kết nối
        }
    }
};

export default ChatService;