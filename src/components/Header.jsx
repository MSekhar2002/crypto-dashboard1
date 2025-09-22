import React from 'react';

const Header = ({ globalData }) => {
  if (!globalData) return <div className="bg-white p-4 shadow">Loading...</div>;

  return (
    <header className="bg-white p-4 shadow">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">CoinGecko</h1>
        <div className="text-sm">
          <span>Coins: {globalData.active_cryptocurrencies}</span> | 
          <span> Market Cap: ${globalData.total_market_cap.usd.toLocaleString()} ({globalData.market_cap_change_percentage_24h_usd.toFixed(1)}%)</span> | 
          <span> 24h Vol: ${globalData.total_volume.usd.toLocaleString()}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;