import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Highlights from './components/Highlights';
import AllCoins from './components/AllCoins';
import CoinDetail from './components/CoinDetail';

function App() {
  const [globalData, setGlobalData] = useState(null);

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/global')
      .then(res => res.json())
      .then(data => setGlobalData(data.data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header globalData={globalData} />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
            <>
              <Highlights />
              <AllCoins />
            </>
          } />
          <Route path="/coins/:id" element={<CoinDetail />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;