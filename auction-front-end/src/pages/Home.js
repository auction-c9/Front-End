import React from 'react';
import Header from './Header';
import AuctionListPage from './auctions/AuctionListPage';

const Home = () => {
    return (
        <div className="home-page">
            <Header />
            <div className="home-content">
                <main className="home-main">
                    <AuctionListPage />
                </main>
            </div>
        </div>
    );
};

export default Home;
