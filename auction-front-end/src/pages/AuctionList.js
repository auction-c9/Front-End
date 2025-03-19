import React from 'react';
import AuctionListPage from './auctions/AuctionListPage';

const AuctionList = () => {
    return (
        <div
            style={{
                // Xóa hoàn toàn margin, padding cho trang
                margin: 0,
                padding: 0,
            }}
        >
            <div
                className="content-wrapper"
                style={{
                    display: 'flex',
                    width: '100%',
                    // gap để tạo khoảng trống giữa 2 cột,
                    // nhưng không tạo khoảng trống ở 2 mép màn hình
                    gap: '20px',
                    margin: 0,
                    padding: 0,
                    boxSizing: 'border-box',
                }}
            >
                {/* Cột 1 */}
                <AuctionListPage
                    style={{
                        flex: 1,
                        // Nếu AuctionListPage có sẵn margin/padding, có thể cần bỏ
                        // margin: 0,
                        // padding: 0,
                    }}
                />

                {/* Cột 2 */}
                <main
                    style={{
                        flex: 1,
                        border: '1px solid #ddd',
                        padding: '10px',
                        background: '#fff',
                    }}
                >
                    {/* Nội dung phần main */}
                </main>
            </div>
        </div>
    );
};

export default AuctionList;
