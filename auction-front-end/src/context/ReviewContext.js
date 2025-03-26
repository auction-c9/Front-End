// src/contexts/ReviewContext.js
import { createContext, useContext, useState } from 'react';

const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
    const [needsRefresh, setNeedsRefresh] = useState(false);

    return (
        <ReviewContext.Provider value={{ needsRefresh, setNeedsRefresh }}>
            {children}
        </ReviewContext.Provider>
    );
};

export const useReview = () => useContext(ReviewContext);