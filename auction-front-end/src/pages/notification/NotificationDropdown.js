import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = ({ notifications, updateNotifications }) => {
    const navigate = useNavigate();

    // Hàm xử lý khi click vào 1 nhóm thông báo (hoặc 1 thông báo đơn lẻ)
    function handleNotificationClick(notificationGroup) {
        // Ở đây notificationGroup có thể là 1 đối tượng đại diện cho nhóm tin
        console.log('Notification group:', notificationGroup);
        if (!notificationGroup) {
            console.error('Đối tượng notification là null hoặc undefined');
            return;
        }

        // Lấy customerId từ đối tượng notification (giả sử chúng ta dùng tin đầu tiên trong nhóm)
        let customerId;
        if (typeof notificationGroup.customer === 'object' && notificationGroup.customer !== null) {
            customerId = notificationGroup.customer.customerId;
        } else if (typeof notificationGroup.customer === 'number') {
            customerId = notificationGroup.customer;
        }
        if (!customerId) {
            console.error('customerId không tồn tại');
            return;
        }
        const auctionId = notificationGroup.auction?.auctionId;
        if (!auctionId) {
            console.error('auctionId không tồn tại');
            return;
        }
        const token = localStorage.getItem("token");

        fetch(`http://localhost:8080/api/notifications/read/${customerId}/${auctionId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // Sau khi cập nhật, fetch lại danh sách thông báo
                updateNotifications(auctionId);
                // Điều hướng sang trang chi tiết phiên đấu giá
                navigate(`/auction/${auctionId}`);
            })
            .catch((error) => console.error("Error updating notifications:", error));
    }

    // Nhóm các tin chưa đọc theo auctionId (gộp chung nếu cùng phiên đấu giá)
    const unreadGrouped = Object.values(
        notifications
            .filter(n => !n.isRead)
            .reduce((acc, n) => {
                const auctionId = n.auction?.auctionId;
                if (auctionId) {
                    if (!acc[auctionId]) {
                        // Lưu tin đầu tiên của nhóm và thêm thuộc tính count
                        acc[auctionId] = { ...n, count: 1 };
                    } else {
                        acc[auctionId].count += 1;
                    }
                }
                return acc;
            }, {})
    );

    // Các tin đã đọc (hiển thị riêng, không cần gộp)
    const readNotifications = notifications.filter(n => n.isRead);

    return (
        <Dropdown.Menu style={{ minWidth: "300px" }}>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {/* Hiển thị các tin chưa đọc (được gộp theo auctionId) */}
                {unreadGrouped.length > 0 &&
                    unreadGrouped.map((notification, index) => (
                        <Dropdown.Item
                            key={`unread-${index}`}
                            onClick={() => handleNotificationClick(notification)}
                            style={{ fontWeight: 'bold' }} // in đậm để nổi bật tin chưa đọc
                        >
                            <div>
                                <strong>
                                    {notification.count > 1
                                        ? `Có ${notification.count} tin thông báo mới cho phiên đấu giá này`
                                        : notification.message}
                                </strong>
                                <div style={{ fontSize: "0.9rem" }}>
                                    {new Date(notification.timestamp).toLocaleString()}
                                </div>
                            </div>
                        </Dropdown.Item>
                    ))
                }

                {/* Hiển thị các tin đã đọc */}
                {readNotifications.length > 0 &&
                    readNotifications.map((notification, index) => (
                        <Dropdown.Item
                            key={`read-${index}`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div>
                                <strong>{notification.message}</strong>
                                <div style={{ fontSize: "0.9rem" }}>
                                    {new Date(notification.timestamp).toLocaleString()}
                                </div>
                            </div>
                        </Dropdown.Item>
                    ))
                }

                {/* Nếu không có thông báo */}
                {notifications.length === 0 && (
                    <Dropdown.Item disabled>Không có thông báo</Dropdown.Item>
                )}
            </div>
        </Dropdown.Menu>
    );
};

export default NotificationDropdown;
