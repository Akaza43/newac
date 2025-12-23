"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AiOutlineHome } from 'react-icons/ai';
import { BiInfoCircle, BiUser, BiLogOut, BiSearch } from 'react-icons/bi';
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import SearchPopup from './searchPopup';

const Nav = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          handleLogout();
        }
      }
    };

    checkAuth();

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' || e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && 
          menuRef.current && 
          buttonRef.current && 
          !menuRef.current.contains(event.target as Node) && 
          !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setIsProfileOpen(false);
    setIsOpen(false);
    
    // Redirect to home page to trigger login screen
    window.location.href = '/';
  };

  const handleLogin = () => {
    // Redirect to home page which will show login form
    window.location.href = '/';
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.username) return 'U';
    return user.username.charAt(0).toUpperCase();
  };

  // Don't render Nav if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Check if we should hide the nav - more comprehensive check
  const shouldHideNav = () => {
    if (!pathname) return false;
    
    // Debug log
    console.log('Current pathname:', pathname);
    
    // List of paths where nav should be hidden
    const hiddenPaths = [
      '/course',
      '/courses', 
      '/learn',
      '/learning',
      '/modul',
      '/module',
      '/video',
      '/watch'
    ];
    
    // Check if pathname starts with any hidden path
    const shouldHide = hiddenPaths.some(path => pathname.startsWith(path));
    
    console.log('Should hide nav:', shouldHide);
    
    return shouldHide;
  };

  // Hide Nav on course/learning pages
  if (shouldHideNav()) {
    return null;
  }

  return (
    <nav id="navbar" className="fixed top-0 left-0 right-0 w-full bg-black/30 backdrop-blur-xl border-b border-gray-800/30 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 lg:h-16">
          <div className="flex items-center space-x-4">
            {pathname !== '/' && (
              <Link href="/" className="text-gray-200 hover:text-purple-600">
                <IoIosArrowDropleftCircle className="text-2xl" />
              </Link>
            )}
          </div>
          
          <div className="flex-1 flex justify-start items-center">
            <h2 className="text-white text-xl md:text-4xl font-bold tracking-wide text-left">New & For You</h2>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-200 hover:text-purple-600 px-3 py-2 flex items-center space-x-2"
            >
              <BiSearch className="text-xl" />
              <span>Search</span>
            </button>
            <Link href="/" onClick={handleLinkClick} className="text-gray-200 hover:text-purple-600 px-3 py-2 flex items-center space-x-2">
              <AiOutlineHome className="text-xl" />
              <span>Home</span>
            </Link>
            
            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-gray-200 hover:text-purple-600"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold text-sm">
                  {getUserInitials()}
                </div>
                <span>{user?.username}</span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black border border-purple-800 rounded-md shadow-lg">
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-200 hover:text-purple-600"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full text-left px-4 py-2 text-gray-200 hover:text-purple-600 items-center space-x-2"
                    >
                      <BiLogOut className="text-xl" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-200 hover:text-purple-600 p-2"
              aria-label="Search"
            >
              <BiSearch className="text-2xl" />
            </button>
            <button
              ref={buttonRef}
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-200 hover:text-purple-600 p-2"
              aria-label="Menu"
            >
              <IoSettingsOutline className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div 
            ref={menuRef}
            className="md:hidden fixed top-16 left-0 right-0 bg-black/60 backdrop-blur-2xl border-t border-purple-800/30 max-h-[calc(100vh-4rem)] overflow-y-auto"
          >
            {/* Mobile Profile Section */}
            <div className="px-4 py-3 border-b border-purple-800/30 bg-black/70 backdrop-blur-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold text-sm">
                  {getUserInitials()}
                </div>
                <span className="text-gray-200">{user?.username}</span>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="/profile"
                  onClick={handleLinkClick}
                  className="flex px-3 py-2 text-gray-200 hover:text-purple-600 items-center space-x-2"
                >
                  <BiUser className="text-xl" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full text-left px-3 py-2 text-gray-200 hover:text-purple-600 items-center space-x-2"
                >
                  <BiLogOut className="text-xl" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
            
            <div className="px-5 py-3 space-y-1">
              <Link 
                href="/" 
                onClick={handleLinkClick}
                className="flex px-3 py-2 text-gray-200 hover:text-purple-600 rounded-md text-base font-medium items-center space-x-2"
              >
                <AiOutlineHome className="text-xl" />
                <span>Home</span>
              </Link>
            </div>
          </div>
        )}
      </div>
      <SearchPopup isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </nav>
  );
};

export default Nav;