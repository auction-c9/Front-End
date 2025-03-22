// NotificationDropdown.js
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

const NotificationDropdown = ({ notifications }) => {

    return (
        <Dropdown.Menu style={{ minWidth: "300px" }}>
            <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                {notifications && notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                        <Dropdown.Item key={index}>
                            <div>
                                <strong>{notification.message}</strong>
                                <div style={{ fontSize: "0.9rem" }}>
                                    {new Date(notification.timestamp).toLocaleString()}
                                </div>
                            </div>
                        </Dropdown.Item>
                    ))
                ) : (
                    <Dropdown.Item disabled>Không có thông báo</Dropdown.Item>
                )}
            </div>
        </Dropdown.Menu>
    );
};

export default NotificationDropdown;