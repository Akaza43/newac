"use client";

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
// MdKeyboardArrowDown dihapus karena sudah tidak digunakan
import { liveclassData } from './data';

export default function LiveclassPage() {
  const [imgError, setImgError] = useState<{ [key: string]: boolean }>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  function handleImageError(title: string): void {
    setImgError((prev) => ({ ...prev, [title]: true }));
  }

  const handleItemClick = (e: React.MouseEvent, link: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      router.push('/');
      return;
    }
    window.location.href = link;
  };

  return (
    <div>
      {/* Header: Judul dibuat statis, tombol panah dan fungsi klik dihapus */}
      <div className="flex items-center">
        <h1 className="text-sm md:text-2xl font-bold text-white mb-2 md:mb-6">
          Webinar & Liveclass
        </h1>
      </div>

      {/* Konten: Dikunci ke mode horizontal (flex) */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-2 md:gap-6 pb-2 md:pb-4 scrollbar-hide transition-all duration-300 ease-in-out"
      >
        {liveclassData.map((item, index) => (
          <div
            key={index}
            onClick={(e) => handleItemClick(e, item.link)}
            className={`
              overflow-hidden hover:scale-[1.02] transition-transform rounded-lg md:rounded-xl cursor-pointer
              flex-none w-44 md:w-80
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