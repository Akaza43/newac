"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { blockchainData } from './data';

export default function InvestingPage() {
  const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});
  const [isGrid, setIsGrid] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pathname = usePathname();
  const scrollContainerRef = useRef<HTMLDivElement>(null); // Ref for the scroll container

  useEffect(() => {
    // Default to grid layout if pathname matches /Halaman/1-trading
    if (pathname === "/Halaman/1-trading") {
      setIsGrid(true);
    }

    // Retrieve layout state from local storage
    const savedLayout = localStorage.getItem("layout-3");
    if (savedLayout) {
      setIsGrid(savedLayout === "grid");
    }
  }, [pathname]);

  function toggleLayout(): void {
    const newLayout = !isGrid;
    setIsGrid(newLayout);
    localStorage.setItem("layout-3", newLayout ? "grid" : "normal");

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

  return (
    <div>
      <div className="flex items-center gap-">
        <h1
          onClick={toggleLayout}
          className="text-sm md:text-2xl font-bold text-white mb-2 md:mb-6 cursor-pointer hover:opacity-80 transition-opacity"
        >
          Blockchain Technology
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
        ref={scrollContainerRef} // Attach the ref to the scroll container
        className={`
          transition-all duration-300 ease-in-out
          ${isGrid
            ? "grid grid-cols-4 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-6"
            : "flex overflow-x-auto gap-2 md:gap-6 pb-2 md:pb-4 scrollbar-hide"
          }
        `}
      >
        {blockchainData.map((item, index) => (
          <a
            key={index}
            href={item.link}
            rel="noopener noreferrer"
            className={`
              overflow-hidden hover:scale-[1.02] transition-transform rounded-lg md:rounded-xl
              ${isGrid ? "w-full" : "flex-none w-44 md:w-80"}
            `}
          >
            <div className="aspect-video relative rounded-md md:rounded-lg overflow-hidden">
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
          </a>
        ))}
      </div>
    </div>
  );
}
