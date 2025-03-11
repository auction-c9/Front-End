// src/components/ToggleSection.js
import React, { useState } from 'react';

const ToggleSection = ({
                           children,
                           linkTextCollapsed = 'Xem tất cả',
                           linkTextExpanded = 'Thu gọn',
                       }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggle = (e) => {
        e.preventDefault();
        setIsExpanded((prev) => !prev);
    };

    return (
        <>
            {isExpanded && <div>{children}</div>}
            <a href="#" className="see-all" onClick={toggle}>
                {isExpanded ? linkTextExpanded : linkTextCollapsed}
            </a>
        </>
    );
};

export default ToggleSection;
