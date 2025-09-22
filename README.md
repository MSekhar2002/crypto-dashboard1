# Crypto Dashboard

This is a small production-like crypto dashboard built with Vite, React.js, JavaScript, and TailwindCSS. It fetches live market data from the CoinGecko API and displays an All Coins overview with infinite scrolling and a Highlights section.

## Tech Stack and Architecture Overview
- **Framework**: Vite with React
- **Language**: JavaScript
- **Styling**: TailwindCSS
- **Routing**: react-router-dom for detail page
- **API Fetching**: axios with error handling and loading states
- **Infinite Scroll**: react-infinite-scroll-component
- **Charts**: recharts for sparkline
- **Skeletons**: react-loading-skeleton
- **State Management**: React hooks (useState, useEffect)
- **Debouncing**: lodash.debounce for search
- Architecture: Component-based, with main App routing to home (Highlights + AllCoins) and detail page. Client-side filtering/sorting on loaded data.

## Design Patterns Used and Rationale
- **Singleton-like API calls**: Used hooks for fetching, avoiding god components.
- **Adapter Pattern**: API responses mapped to domain models in components 
- **State Management**: Local state for simplicity, no over-engineering with Redux.
- **Composition**: Small composable components (Header, Highlights, AllCoins, CoinDetail).
- **Error Boundaries/Resilience**: Basic error states, retries not implemented but could use react-query.
- Rationale: Kept simple for 6-8h scope, focused on separation of concerns (UI vs data fetching). Alternatives: Redux for global state if scaled.

## Assumptions, Limitations, and Future Improvements
- **Assumptions**: Free API tier sufficient (no key needed). USD currency. Match CoinGecko UI closely.
- **Limitations**: 
  - Filtering/Sorting: Client-side on loaded coins only (via infinite scroll). API doesn't support search or full sorting (e.g., 24h change), so applies to partial data. Full search would require fetching all pages (not feasible for 17k coins).
  - Highlights: Fetched top 250 and sorted client-side for gainers/losers/7d (API no direct order).
  - No real-time updates (polling/websockets).
  - Basic responsive (Tailwind mobile-first).
- **Future Improvements**: Use react-query for caching/retries. Server-side rendering with Vite SSR. Full search with API /search integration. Add tests. Websockets for live prices.

## How to Set Up and Run
1. Clone the repo.
2. Install dependencies: `npm install`
3. Start the app: `npm run dev`
4. Open http://localhost:5173


## API Key Instructions
CoinGecko free tier used, no key required.