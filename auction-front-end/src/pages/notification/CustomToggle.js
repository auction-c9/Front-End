// CustomToggle.js
import React from 'react';

const CustomToggle = React.forwardRef(({ children, onClick, ...props }, ref) => (
    <a
        href="#"
        ref={ref}
        {...props}
        onClick={(e) => {
            e.preventDefault();
            if (onClick) onClick(e);
        }}
        style={{ cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}
    >
        {children}
    </a>
));

export default CustomToggle;
