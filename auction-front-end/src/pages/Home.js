import React from 'react';
import Header from './Header';
import AuctionListPage from './auctions/AuctionListPage';
import Footer from "./Footer";

const Home = () => {
    return (
        <div className="home-page">
            <Header />
            <div className="home-content">
                <main className="home-main">
                    <AuctionListPage />
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Home;
