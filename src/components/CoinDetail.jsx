import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';

const CoinDetail = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`https://api.coingecko.com/api/v3/coins/${id}`)
      .then(res => {
        setCoin(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load coin details');
        setLoading(false);
      });
  }, [id]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (loading) return <Skeleton height={300} />;

  return (
    <div className="bg-white p-4 rounded shadow">
      <Link to="/" className="text-blue-500 mb-4 block">&larr; Back</Link>
      <div className="flex items-center mb-4">
        <img src={coin.image.large} alt={coin.name} className="w-16 h-16 mr-4" />
        <h1 className="text-2xl font-bold">{coin.name} ({coin.symbol.toUpperCase()})</h1>
      </div>
      <p className="mb-4" dangerouslySetInnerHTML={{ __html: coin.description.en }} />
      <div>
        <p>Current Price: ${coin.market_data.current_price.usd.toLocaleString()}</p>
        <p>Market Cap: ${coin.market_data.market_cap.usd.toLocaleString()}</p>
        <p>24h Change: {coin.market_data.price_change_percentage_24h.toFixed(2)}%</p>
      </div>
    </div>
  );
};

export default CoinDetail;