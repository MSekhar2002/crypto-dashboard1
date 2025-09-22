import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';

const HighlightCard = ({ title, coins }) => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-bold mb-2">{title}</h3>
    <ul>
      {coins ? coins.map(coin => (
        <li key={coin.id} className="flex justify-between mb-1">
          <span>{coin.name}</span>
          <span className={coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}>
            {coin.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </li>
      )) : <Skeleton count={5} />}
    </ul>
  </div>
);

const Highlights = () => {
  const [highlights, setHighlights] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const marketsRes = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
          params: { vs_currency: 'usd', per_page: 250, page: 1, price_change_percentage: '24h,7d' }
        });
        const allCoins = marketsRes.data;
        
        const topGainers = [...allCoins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 10);
        const topLosers = [...allCoins].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 10);
        const highestVolume = [...allCoins].sort((a, b) => b.total_volume - a.total_volume).slice(0, 10);

        const trendingRes = await axios.get('https://api.coingecko.com/api/v3/search/trending');
        const trending = trendingRes.data.coins.map(c => c.item).slice(0, 10);

        const top7d = [...allCoins].sort((a, b) => b.price_change_percentage_7d_in_currency - a.price_change_percentage_7d_in_currency).slice(0, 10);

        setHighlights({ topGainers, topLosers, highestVolume, trending, top7d });
        setLoading(false);
      } catch (err) {
        setError('Failed to load highlights');
        setLoading(false);
      }
    };
    fetchHighlights();
  }, []);

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-bold mb-4">Highlights</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <HighlightCard title="Top Gainers (24h)" coins={loading ? null : highlights.topGainers} />
        <HighlightCard title="Top Losers (24h)" coins={loading ? null : highlights.topLosers} />
        <HighlightCard title="Highest Volume" coins={loading ? null : highlights.highestVolume} />
        <HighlightCard title="Trending Coins" coins={loading ? null : highlights.trending} />
        <HighlightCard title="Top by 7d Performance" coins={loading ? null : highlights.top7d} />
      </div>
    </section>
  );
};

export default Highlights;