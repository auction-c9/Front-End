// src/components/AuctionList.js
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import AuctionListPage from './auctions/AuctionListPage';

const AuctionList = () => {
    return (
        <div>
            <Header />
            <div
                className="content-wrapper"
                style={{ display: 'flex', gap: '20px', padding: '20px' }}
            >
                <Sidebar />
                <main
                    style={{
                        flex: 1,
                        border: '1px solid #ddd',
                        padding: '10px',
                        background: '#fff',
                    }}
                >
                    <AuctionListPage />
                </main>
            </div>
        </div>
    );
};

export default AuctionList