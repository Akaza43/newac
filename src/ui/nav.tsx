"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut, signIn } from "next-auth/react";
import { AiOutlineHome } from 'react-icons/ai';
import { BiInfoCircle, BiUser, BiLogOut, BiSearch } from 'react-icons/bi';
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { usePathname } from 'next/navigation';
import SearchPopup from './searchPopup';

const Nav = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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

  const handleLinkClick = () => {
    setIsOpen(false);
  };

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
            <Link href="/about" onClick={handleLinkClick} className="text-gray-200 hover:text-purple-600 px-3 py-2 flex items-center space-x-2">
              <BiInfoCircle className="text-xl" />
              <span>About</span>
            </Link>
            
            {/* Profile Section */}
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-gray-600 animate-pulse" />
            ) : session ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-200 hover:text-purple-600"
                >
                  <img
                    src={session.user?.image || ''}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span>{session.user?.name}</span>
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
                        onClick={() => signOut()}
                        className="flex w-full text-left px-4 py-2 text-gray-200 hover:text-purple-600 items-center space-x-2"
                      >
                        <BiLogOut className="text-xl" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn("discord")}
                className="text-gray-200 hover:text-purple-600 px-3 py-2"
              >
                Sign In
              </button>
            )}
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
            {session ? (
              <div className="px-4 py-3 border-b border-purple-800/30 bg-black/70 backdrop-blur-2xl">
                <div className="flex items-center space-x-3">
                  <img
                    src={session.user?.image || ''}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="text-gray-200">{session.user?.name}</span>
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
                    onClick={() => signOut()}
                    className="flex w-full text-left px-3 py-2 text-gray-200 hover:text-purple-600 items-center space-x-2"
                  >
                    <BiLogOut className="text-xl" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4 py-3 border-b border-purple-800/30 bg-black/70 backdrop-blur-2xl">
                <button
                  onClick={() => signIn("discord")}
                  className="w-full text-left px-3 py-2 text-gray-200 hover:text-purple-600"
                >
                  Sign In
                </button>
              </div>
            )}
            
            <div className="px-5 py-3 space-y-1">
              <Link 
                href="/" 
                onClick={handleLinkClick}
                className="flex px-3 py-2 text-gray-200 hover:text-purple-600 rounded-md text-base font-medium items-center space-x-2"
              >
                <AiOutlineHome className="text-xl" />
                <span>Home</span>
              </Link>
              <Link 
                href="/about" 
                onClick={handleLinkClick}
                className="flex px-3 py-2 text-gray-200 hover:text-purple-600 rounded-md text-base font-medium items-center space-x-2"
              >
                <BiInfoCircle className="text-xl" />
                <span>About</span>
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
