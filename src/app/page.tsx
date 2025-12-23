"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Loading from '@/ui/loading';
import Nav from '@/ui/nav';
import Menu from '@/components/Menu';
import BlockchainPage from './Halaman/3-blockchain/page';
import InvestingPage from './Halaman/2-investing/page';
import LiveclassPage from './Halaman/4-liveclass/page';
import TradingPage from './Halaman/1-trading/page';
import AllClassesPage from './Halaman/0-all-classes/page';
import { FaPlay } from 'react-icons/fa';

// Function to get Supabase client (lazy initialization)
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(supabaseUrl, supabaseAnonKey);
};

export default function HomePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const links = {
    startLearning: "/Halaman/page/4-liveclass/1-The-Art-of-Crypto-Trading",
    moreInfo: "/Halaman/page/4-liveclass/1-The-Art-of-Crypto-Trading"
  };

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for storage changes (when user logs out from Nav component)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' && !e.newValue) {
        // Token was removed, log out
        setIsAuthenticated(false);
        setUsername('');
        setPassword('');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      // Initialize Supabase client only when needed
      const supabase = getSupabaseClient();
      
      // Query user from Supabase
      const { data: users, error: supabaseError } = await supabase
        .from('User')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .limit(1);

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        setError('Terjadi kesalahan pada server');
        setIsLoggingIn(false);
        return;
      }

      if (!users || users.length === 0) {
        setError('Username atau password salah');
        setIsLoggingIn(false);
        return;
      }

      const user = users[0];

      // Generate token and store in localStorage
      const token = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        username: user.username,
      }));

      setIsAuthenticated(true);
      
      // Trigger storage event for Nav component in same window
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4 relative overflow-hidden">
        <div className="relative z-10 w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img 
                src="/ac.png" 
                alt="Akademi Crypto Logo" 
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-semibold text-white text-center mb-12">
            Akademi Crypto Login
          </h1>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Username atau Email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukan Username / Alamat Email"
                className="w-full px-4 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukan Password"
                  className="w-full px-4 py-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-gray-300 placeholder-gray-600 focus:outline-none focus:border-purple-500/50 transition-colors pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                'LOGIN'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black">
      {/* Navigation Bar - Only show when authenticated */}
      <Nav />

      <div className="relative z-10 pt-16 pb-16 md:pb-8">
        <div className="container mx-auto px-3 pt-0 pb-0">
          <div className="mb-6 mt-0">
            <div className="p-2 md:p-6 rounded-xl transition-all duration-300 relative overflow-visible" style={{marginTop: '-90px', background: 'transparent'}}>
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <div className="w-full order-1 mb-3 md:mb-0 md:order-1 md:w-1/2 flex flex-col justify-center">
                  <div className="hidden md:block mb-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full border border-purple-500/30 mb-4">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-gray-300">Akademi Crypto Classes</span>
                    </div>
                  </div>
                  
                  <h1 className="hidden md:block text-xl md:text-5xl font-bold text-white leading-tight mb-4">
                    The Art of <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 animate-pulse">
                      Crypto Trading
                    </span>
                  </h1>
                  
                  <p className="hidden md:block text-gray-400 mb-6 text-lg leading-relaxed">
                    Master the art of cryptocurrency trading with our comprehensive course designed for both beginners and advanced traders.
                  </p>
                  
                  <div className="hidden md:flex gap-4 mt-3">
                    <a 
                      href={links.startLearning} 
                      className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-white to-gray-100 text-black text-base font-semibold rounded-xl hover:from-gray-100 hover:to-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      <FaPlay className="group-hover:animate-pulse" />
                      Tonton
                    </a>
                    <a 
                      href={links.moreInfo} 
                      className="flex items-center justify-center px-6 py-3 border border-purple-500/50 text-white text-base font-medium rounded-xl hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 backdrop-blur-sm"
                    >
                      Selengkapnya
                    </a>
                  </div>
                </div>
                <div className="w-full md:w-1/2 space-y-2 order-2 md:order-2 flex flex-col items-center md:items-end">
                  <div className="relative group border border-gray-800/30 rounded-xl overflow-hidden w-full max-w-xl">
                    <img
                      src="/images/art-of-crypto-trading.jpg"
                      alt="The Art of Crypto Trading"
                      className="w-full h-auto max-h-[480px] mt-0 md:mt-8"
                      style={{ display: 'block' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />
                  </div>
                  <div className="grid grid-cols-2 md:hidden gap-2 w-full">
                    <a href={links.startLearning} className="flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-white to-white text-black text-sm font-semibold rounded-lg">
                      <FaPlay className="text-xs" />
                      Tonton
                    </a>
                    <a href={links.moreInfo} className="flex items-center justify-center px-3 py-2 border border-gray-700 text-white text-sm font-medium rounded-lg">
                      Selengkapnya
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 md:mt-8 scale">
            <AllClassesPage />
          </div>
          <div className="mt-2 md:mt-8">
            <TradingPage />
          </div>
          <div className="mt-2 md:mt-8">
            <InvestingPage />
          </div>
          <div className="mt-2 md:mt-8">
            <BlockchainPage />
          </div>
          <div className="mt-2 md:mt-8">
            <LiveclassPage />
          </div>
        </div>
      </div>

      {/* Bottom Menu - Only show when authenticated */}
      <Menu />
    </div>
  );
}