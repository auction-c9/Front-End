// src/components/Home.js
import React from 'react';
import Header from './Header';
import AuctionListPage from './auctions/AuctionListPage';

const Home = () => {
    return (
        <div>
            <Header />
            <div
                className="content-wrapper"
                style={{ display: 'flex', gap: '20px', padding: '20px' }}
            >
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

export default Home;
