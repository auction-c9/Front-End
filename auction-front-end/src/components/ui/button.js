import React from "react";
import { motion } from "framer-motion";

export const Button = ({ children, whileHover, className = "", ...props }) => {
    return (
        <motion.button
            whileHover={whileHover}
            className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};
