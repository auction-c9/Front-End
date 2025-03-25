import React from 'react';
import AuctionListPage from './auctions/AuctionListPage';
import SearchBar from "./search/SearchBar";

const Home = () => {
    return (
        <div className="home-page">
            <div className="bottom-header">
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <SearchBar/>
                </div>
            </div>
            <div className="home-content">
                <main className="home-main">
                    <AuctionListPage/>
                </main>
            </div>
        </div>

    );
};

export default Home;
