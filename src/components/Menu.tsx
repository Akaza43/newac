'use client';

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigationLinks } from "@/components/data/links";

const Menu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsAuthenticated(!!token);
    };

    checkAuth();

    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isActive = (path: string) => pathname?.startsWith(path);

  // Don't render Menu if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Check if we should hide the menu - more comprehensive check
  const shouldHideMenu = () => {
    if (!pathname) return false;
    
    // Debug log
    console.log('Current pathname for Menu:', pathname);
    
    // List of paths where menu should be hidden
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
    
    console.log('Should hide menu:', shouldHide);
    
    return shouldHide;
  };

  // Hide Menu on course/learning pages
  if (shouldHideMenu()) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-gray-900 z-50">
      <nav className="flex justify-center w-full">
        {/* MODUL */}
        <button
          onClick={() => router.push(navigationLinks.home)}
          className={`flex flex-col items-center p-4 transition-all duration-300 ${
            isActive(navigationLinks.home)
              ? "text-purple-500"
              : "text-gray-500 hover:text-purple-500"
          }`}
        >
          <div className="relative w-6 h-6 mb-1">
            <img
              src="/ac.png"
              alt="Modul"
              className={`w-full h-full object-contain transition-all duration-300 ${
                isActive(navigationLinks.home)
                  ? "brightness-0 saturate-100"
                  : "brightness-75 hover:brightness-100"
              }`}
              style={{
                filter: isActive(navigationLinks.home)
                  ? "brightness(0) saturate(100%) invert(44%) sepia(82%) saturate(3171%) hue-rotate(246deg) brightness(97%) contrast(101%)"
                  : undefined
              }}
            />
          </div>
          <span className="text-xs font-medium">MODUL</span>
        </button>
      </nav>
    </div>
  );
};

export default Menu;