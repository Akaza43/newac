"use client";
import React, { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import Loading from '@/ui/loading';
import { AccessButton } from '@/components/buttons/AccessButton';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Time formatting utility
const formatTimeAgo = (timestamp: string) => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} minggu yang lalu`;
  return `${Math.floor(diffInSeconds / 31536000)}tahun yang lalu`;
};

// Crypto ticker component
const CryptoTicker = () => {
  const [cryptoData, setCryptoData] = useState<{
    [key: string]: {
      current_price: number;
      price_change_percentage_24h: number;
      symbol: string;
    }
  }>({});
  const [loading, setLoading] = useState(true);

  // Fetch crypto data from CoinGecko API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,ripple,solana&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h'
        );
        const data = await response.json();
        
        const formattedData = data.reduce((acc: any, crypto: any) => {
          acc[crypto.id] = {
            current_price: crypto.current_price,
            price_change_percentage_24h: crypto.price_change_percentage_24h,
            symbol: crypto.symbol.toUpperCase()
          };
          return acc;
        }, {});
        
        setCryptoData(formattedData);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Refresh data every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="h-16 bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-800 h-6 w-6"></div>
          <div className="rounded-full bg-gray-800 h-6 w-6"></div>
          <div className="rounded-full bg-gray-800 h-6 w-6"></div>
          <div className="rounded-full bg-gray-800 h-6 w-6"></div>
        </div>
      </div>
    );
  }

  // Ticker items data
  const tickerItems = [
    { id: 'bitcoin', name: 'Bitcoin', logo: '/images/btc.svg' },
    { id: 'ethereum', name: 'Ethereum', logo: '/images/eth.svg' },
    { id: 'ripple', name: 'XRP', logo: '/images/xrp.svg' },
    { id: 'solana', name: 'Solana', logo: '/images/sol.svg' }
  ];

  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...tickerItems, ...tickerItems];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-b border-gray-800">
      <div className="py-3">
        <div className="relative">
          {/* Infinite scrolling ticker */}
          <div className="animate-infinite-scroll flex items-center whitespace-nowrap">
            {duplicatedItems.map((item, index) => {
              const data = cryptoData[item.id];
              if (!data) return null;
              
              const isPositive = data.price_change_percentage_24h >= 0;
              
              return (
                <div 
                  key={`${item.id}-${index}`} 
                  className="inline-flex items-center mx-8 px-4 py-2 rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:bg-gray-800/60 transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 mr-3 relative">
                      <Image 
                        src={item.logo} 
                        alt={item.name} 
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                    <div className="mr-1">
                      <span className="font-medium text-white">{item.name}</span>
                      <span className="text-gray-400 ml-1">({data.symbol})</span>
                    </div>
                    <div className="ml-2 font-semibold text-white">
                      ${data.current_price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className={`ml-3 px-2 py-1 rounded text-xs font-medium ${isPositive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                      {isPositive ? '+' : ''}{data.price_change_percentage_24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Gradient fade effects */}
          <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-gray-900 to-transparent z-10"></div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes infinite-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-infinite-scroll {
          display: inline-block;
          animation: infinite-scroll 30s linear infinite;
        }
        
        .animate-infinite-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

// Main Component
const NewsPage = () => {
  const { data: session, status } = useSession();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  
  // News data state
  const [news, setNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  // Check user access
  useEffect(() => {
    const checkAccess = async () => {
      if (session?.accessToken) {
        try {
          const response = await fetch("/api/verify-role", {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          });
          
          if (!response.ok && response.status === 429) {
            setTimeout(checkAccess, 5000);
            return;
          }
          
          setHasAccess(response.ok);
        } catch (error) {
          setHasAccess(false);
        }
      } else {
        setHasAccess(false);
      }
      setLoading(false);
    };

    if (status === "authenticated") checkAccess();
    else if (status === "unauthenticated") {
      setLoading(false);
      setHasAccess(false);
    }
  }, [session, status]);

  // Fetch news data
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('createdAt', { ascending: false });

        if (!error) setNews(data || []);
      } finally {
        setLoadingNews(false);
      }
    };

    fetchNews();
  }, []);

  // Loading state
  if (loading || status === "loading" || loadingNews) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-purple-200 font-medium">Loading Crypto Pulse...</p>
        </div>
      </div>
    );
  }

  // Auth states
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950 p-4">
        <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-lg rounded-xl border border-gray-800 p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Crypto Insider Access
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              Unlock premium crypto insights and market analysis
            </p>
          </div>
          
          <ul className="space-y-3 mb-8">
            {['Real-time market data', 'Exclusive research reports', 'Premium community access', 'Daily trading signals'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-300">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
          
          <button
            onClick={() => signIn("discord")}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/20"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 127.14 96.36">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
            </svg>
            Continue with Discord
          </button>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950 p-4">
        <div className="max-w-md w-full bg-gray-900/80 backdrop-blur-lg rounded-xl border border-gray-800 p-8 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-rose-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">
              Restricted Access
            </h2>
            <p className="text-gray-400 mt-2 text-sm">
              Your account doesn't have permission to access this content
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <AccessButton />
            <button
              onClick={() => signOut()}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-rose-600 to-pink-600 text-white font-medium hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // News detail view
  if (selectedNewsId) {
    const selectedNews = news.find(item => item.id === selectedNewsId);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <button
            onClick={() => setSelectedNewsId(null)}
            className="mb-8 flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to News
          </button>
          
          {selectedNews ? (
            <article className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
              <div className="relative h-64 w-full overflow-hidden">
                <img 
                  src={selectedNews.image} 
                  alt={selectedNews.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="inline-block px-3 py-1 bg-purple-600/80 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                    {formatTimeAgo(selectedNews.createdAt)}
                  </span>
                  <h1 className="mt-3 text-3xl font-bold text-white leading-tight">
                    {selectedNews.title}
                  </h1>
                </div>
              </div>
              
              <div className="p-6">
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {selectedNews.content}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                      <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                      </svg>
                      <img src="/ac.png" alt="sc" className="w-10 h-10" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-200">AC News</p>
                      <p className="text-xs text-gray-500">Crypto Journalist</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                    <button className="w-9 h-9 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ) : (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-gray-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-300">Article Not Found</h3>
              <p className="mt-2 text-gray-500">The requested news article could not be loaded.</p>
              <button
                onClick={() => setSelectedNewsId(null)}
                className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"
              >
                Back to News
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main news feed view
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 pb-20">
      <CryptoTicker />
      
      {/* Featured news */}
      {news.length > 0 && (
        <div className="px-4 pt-6">
          <h2 className="text-xl font-bold text-white mb-4 px-2">AC NEWS</h2>
          <div 
            onClick={() => setSelectedNewsId(news[0].id)}
            className="relative rounded-xl overflow-hidden cursor-pointer group"
          >
            <img 
              src={news[0].image} 
              alt={news[0].title}
              className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-block px-3 py-1 bg-purple-600/80 text-white text-xs font-medium rounded-full backdrop-blur-sm">
                {formatTimeAgo(news[0].createdAt)}
              </span>
              <h2 className="mt-3 text-xl font-bold text-white leading-tight">
                {news[0].title}
              </h2>
            </div>
          </div>
        </div>
      )}
      
      {/* News list */}
      <div className="px-4 pt-8">
        <h2 className="text-lg font-bold text-white mb-4 px-2">Terakhir Update</h2>
        <div className="space-y-4">
          {news.slice(1).map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedNewsId(item.id)}
              className="bg-gray-900/50 hover:bg-gray-800/70 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-gray-700 group"
            >
              <div className="p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatTimeAgo(item.createdAt)} • AC News
                  </p>
                </div>
                <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsPage;