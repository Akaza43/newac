"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { liveclassData } from './data';

export default function LiveclassPage() {
  const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});
  const [isGrid, setIsGrid] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);

    // Listen for auth changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        setIsAuthenticated(!!e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    // Default to grid layout if pathname matches
    if (pathname === "/Halaman/4-liveclass") {
      setIsGrid(true);
    }

    // Retrieve layout state from local storage
    const savedLayout = localStorage.getItem("layout-4");
    if (savedLayout) {
      setIsGrid(savedLayout === "grid");
    }
  }, [pathname]);

  function toggleLayout(): void {
    const newLayout = !isGrid;
    setIsGrid(newLayout);
    localStorage.setItem("layout-4", newLayout ? "grid" : "normal");

    if (!newLayout) {
      setIsTransitioning(true);
    }
  }

  useEffect(() => {
    if (isTransitioning && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      
      // First set scroll to end instantly
      container.style.scrollBehavior = 'auto';
      container.scrollLeft = container.scrollWidth;
      
      // Then scroll to start smoothly after a brief delay
      setTimeout(() => {
        container.style.scrollBehavior = 'smooth';
        container.scrollLeft = 0;
        setIsTransitioning(false);
      }, 50);
    }
  }, [isTransitioning]);

  function handleImageError(title: string): void {
    setImgError((prev) => ({ ...prev, [title]: true }));
  }

  const handleItemClick = (e: React.MouseEvent, link: string) => {
    // If user is not authenticated, prevent default and redirect to home
    if (!isAuthenticated) {
      e.preventDefault();
      router.push('/');
      return;
    }
    // If authenticated, allow normal navigation
    window.location.href = link;
  };

  return (
    <div>
      <div className="flex items-center gap-">
        <h1
          onClick={toggleLayout}
          className="text-sm md:text-2xl font-bold text-white mb-2 md:mb-6 cursor-pointer hover:opacity-80 transition-opacity"
        >
          Webinar & Liveclass
        </h1>
        <button
          onClick={toggleLayout}
          className="mb-2 md:mb-6 text-white hover:opacity-80 transition-opacity"
        >
          <MdKeyboardArrowDown
            className={`text-xl md:text-3xl transform transition-transform duration-300 ${isGrid ? "rotate-180" : ""}`}
          />
        </button>
      </div>
      <div
        ref={scrollContainerRef}
        className={`
          transition-all duration-300 ease-in-out
          ${isGrid
            ? "grid grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6"
            : "flex overflow-x-auto gap-2 md:gap-6 pb-2 md:pb-4 scrollbar-hide"
          }
        `}
      >
        {liveclassData.map((item, index) => (
          <div
            key={index}
            onClick={(e) => handleItemClick(e, item.link)}
            className={`
              overflow-hidden hover:scale-[1.02] transition-transform rounded-lg md:rounded-xl cursor-pointer
              ${isGrid ? "w-full" : "flex-none w-44 md:w-80"}
              ${!isAuthenticated ? "opacity-75 hover:opacity-90" : ""}
            `}
          >
            <div className="aspect-video relative rounded-md md:rounded-lg overflow-hidden">
              {!isAuthenticated && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-8 h-8 mx-auto mb-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <p className="text-xs text-white font-medium">Login Required</p>
                  </div>
                </div>
              )}
              {imgError[item.title] ? (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[8px] md:text-base text-gray-400">{item.title}</span>
                </div>
              ) : (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 176px, 320px"
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  onError={() => handleImageError(item.title)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}