import React from "react";

export const Table = ({ children, className = "", ...props }) => {
    return (
        <table
            className={`min-w-full border-collapse border border-gray-200 ${className}`}
            {...props}
        >
            {children}
        </table>
    );
};
