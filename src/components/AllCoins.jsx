import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import debounce from 'lodash.debounce';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const AllCoins = () => {
  const [coins, setCoins] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('market_cap_desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCoins = useCallback(async (reset = false) => {
    try {
      const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: sortBy,
          per_page: 50,
          page: reset ? 1 : page,
          sparkline: true,
          price_change_percentage: '24h'
        }
      });
      setCoins(prev => reset ? res.data : [...prev, ...res.data]);
      setHasMore(res.data.length > 0);
      setPage(prev => reset ? 2 : prev + 1);
      setLoading(false);
    } catch (err) {
      setError('Failed to load coins');
      setLoading(false);
    }
  }, [page, sortBy]);

  useEffect(() => {
    fetchCoins(true);
  }, [sortBy]);

  const debouncedSearch = debounce(e => setSearch(e.target.value.toLowerCase()), 300);

  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(search) || coin.symbol.toLowerCase().includes(search)
  );

  const sortedCoins = [...filteredCoins].sort((a, b) => {
    if (sortBy === 'current_price_desc') return b.current_price - a.current_price;
    if (sortBy === 'current_price_asc') return a.current_price - b.current_price;
    if (sortBy === 'price_change_percentage_24h_desc') return b.price_change_percentage_24h - a.price_change_percentage_24h;
    if (sortBy === 'price_change_percentage_24h_asc') return a.price_change_percentage_24h - b.price_change_percentage_24h;
    return 0;
  });

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">All Coins</h2>
      <div className="mb-4 flex justify-between">
        <input 
          type="text" 
          placeholder="Search by name/symbol" 
          onChange={debouncedSearch}
          className="border p-2 rounded"
        />
        <select 
          value={sortBy} 
          onChange={e => setSortBy(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="market_cap_desc">Market Cap Desc</option>
          <option value="market_cap_asc">Market Cap Asc</option>
          <option value="volume_desc">Volume Desc</option>
          <option value="volume_asc">Volume Asc</option>
          <option value="current_price_desc">Price Desc (Client)</option>
          <option value="current_price_asc">Price Asc (Client)</option>
          <option value="price_change_percentage_24h_desc">24h Change Desc (Client)</option>
          <option value="price_change_percentage_24h_asc">24h Change Asc (Client)</option>
        </select>
      </div>
      <InfiniteScroll
        dataLength={sortedCoins.length}
        next={() => fetchCoins()}
        hasMore={hasMore}
        loader={<Skeleton count={10} height={40} />}
        endMessage={<p>No more coins</p>}
      >
        <table className="w-full bg-white shadow rounded overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">#</th>
              <th className="p-2">Coin</th>
              <th className="p-2">Price</th>
              <th className="p-2">24h %</th>
              <th className="p-2">Market Cap</th>
              <th className="p-2">24h Volume</th>
              <th className="p-2">Last 7 Days</th>
            </tr>
          </thead>
          <tbody>
            {sortedCoins.length === 0 && !loading ? (
              <tr><td colSpan="7" className="p-4 text-center">No results found</td></tr>
            ) : sortedCoins.map(coin => (
              <tr key={coin.id} className="border-b">
                <td className="p-2">{coin.market_cap_rank}</td>
                <td className="p-2 flex items-center">
                  <img src={coin.image} alt={coin.name} className="w-6 h-6 mr-2" />
                  <Link to={`/coins/${coin.id}`} className="font-bold">{coin.name} ({coin.symbol.toUpperCase()})</Link>
                </td>
                <td className="p-2">${coin.current_price.toLocaleString()}</td>
                <td className={`p-2 ${coin.price_change_percentage_24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {coin.price_change_percentage_24h}%
                </td>
                <td className="p-2">${coin.market_cap.toLocaleString()}</td>
                <td className="p-2">${coin.total_volume.toLocaleString()}</td>
                <td className="p-2">
                  <ResponsiveContainer width={100} height={40}>
                    <LineChart data={coin.sparkline_in_7d.price.map(p => ({ price: p }))}>
                      <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </td>
              </tr>
            ))}
            {loading && <tr><td colSpan="7"><Skeleton count={10} height={40} /></td></tr>}
          </tbody>
        </table>
      </InfiniteScroll>
    </section>
  );
};

export default AllCoins;