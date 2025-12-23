"use client";

import { Data } from "./data";
import Loading from "@/ui/loading";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const getGoogleDriveEmbedUrl = (url: string) => {
  const matches = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const videoId = matches ? matches[1] : "";
  return `https://www.youtube.com/embed/${videoId}`;
};

export default function Container() {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [hideOverlay, setHideOverlay] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [user, setUser] = useState<{ id: string; username: string } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const videoId = searchParams?.get("id") || Data[0].id;
  const nextModuleLink = searchParams?.get("next") || "";
  const thumbnail = searchParams?.get("thumbnail") || "";
  const videoData = Data.find((item) => item.id === videoId);

  useEffect(() => {
    const checkAccess = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setHasAccess(true);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setHasAccess(false);
          router.push('/');
        }
      } else {
        setHasAccess(false);
        router.push('/');
      }
      setLoading(false);
    };

    checkAccess();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' && !e.newValue) {
        setHasAccess(false);
        setUser(null);
        router.push('/');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHideOverlay(true);
    }, 120000);
    return () => clearTimeout(timer);
  }, []);

  const handleOverlayClick = () => {
    if (nextModuleLink) {
      router.push(nextModuleLink);
    }
  };

  const handleClickLesson = (item: typeof Data[number]) => {
    router.push(
      `?id=${item.id}&next=${encodeURIComponent(item.link)}&thumbnail=`
    );
    setIsMobileMenuOpen(false); // Close mobile menu after selecting
  };

  const handleCompleteAndContinue = () => {
    // Find the next lesson
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < Data.length) {
      // Go to next lesson
      const nextLesson = Data[nextIndex];
      handleClickLesson(nextLesson);
    } else {
      // If it's the last lesson, you can redirect to home or show completion message
      if (nextModuleLink) {
        router.push(nextModuleLink);
      } else {
        // Optional: Show completion message or redirect to home
        alert('Congratulations! You have completed all lessons.');
        router.push('/');
      }
    }
  };

  if (loading) return <Loading />;
  if (!hasAccess || !user) return null;

  const currentIndex = Data.findIndex(item => item.id === videoId);
  const progress = Math.round(((currentIndex + 1) / Data.length) * 100);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] text-white font-sans flex flex-col lg:flex-row overflow-hidden">
      {/* Left Sidebar */}
      <div className="hidden lg:flex lg:w-80 bg-[#1a1a1a] border-r border-gray-800 flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            {/* Back Button */}
            <button
              onClick={() => router.push('/')}
              className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center transition-colors group border border-gray-700/50"
              aria-label="Back to home"
            >
              <svg 
                className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            {/* Logo and Info */}
            <div className="flex items-center gap-3 flex-1">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-purple-400 via-violet-500 to-purple-600 p-0.5">
                  <div className="w-full h-full rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                    <img 
                      src="/ac.png" 
                      alt="Akademi Crypto" 
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1a1a1a] animate-pulse"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-base font-bold text-white">Akademi Crypto</div>
                <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                  <span>Belajar Crypto</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-gray-900 via-[#0a0a0a] to-gray-900 rounded-xl p-4 border border-gray-800/50 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-400">Progress</span>
                <span className="text-xs font-bold text-purple-500">{progress}%</span>
              </div>
              <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>{currentIndex + 1} of {Data.length} lessons</span>
              </div>
            </div>
          </div>
        </div>

        {/* List Course */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="flex items-center justify-between w-full mb-4 px-2 hover:bg-gray-800/30 rounded-lg py-2 transition-colors"
            >
              <h3 className="text-sm font-semibold text-gray-300">List Course</h3>
              <svg 
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isSidebarCollapsed ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            
            <div 
              className={`space-y-2 transition-all duration-300 overflow-hidden ${
                isSidebarCollapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'
              }`}
            >
              {Data.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    videoId === item.id
                      ? "bg-gradient-to-r from-purple-600/20 to-violet-600/20 border-l-4 border-purple-500"
                      : "hover:bg-gray-800/50"
                  }`}
                  onClick={() => handleClickLesson(item)}
                >
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    videoId === item.id
                      ? "bg-purple-500 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}>
                    {videoId === item.id ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      </svg>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${
                      videoId === item.id ? "text-white" : "text-gray-300"
                    }`}>
                      {index + 1}. {item.title}
                    </div>
                  </div>
                  
                  <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Sidebar */}
          <div className="lg:hidden fixed inset-y-0 left-0 w-80 bg-[#1a1a1a] border-r border-gray-800 flex flex-col z-50 transform transition-transform duration-300">
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center gap-3 mb-6">
                {/* Back Button */}
                <button
                  onClick={() => router.push('/')}
                  className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center transition-colors group border border-gray-700/50"
                  aria-label="Back to home"
                >
                  <svg 
                    className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>

                {/* Logo and Info */}
                <div className="flex items-center gap-3 flex-1">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gradient-to-br from-purple-400 via-violet-500 to-purple-600 p-0.5">
                      <div className="w-full h-full rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                        <img 
                          src="/ac.png" 
                          alt="Akademi Crypto" 
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1a1a1a] animate-pulse"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-base font-bold text-white">Akademi Crypto</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                      </svg>
                      <span>Belajar Crypto</span>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex-shrink-0 text-gray-400 hover:text-white p-2 hover:bg-gray-800/50 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-900 via-[#0a0a0a] to-gray-900 rounded-xl p-4 border border-gray-800/50 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-400">Progress</span>
                    <span className="text-xs font-bold text-purple-500">{progress}%</span>
                  </div>
                  <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    <span>{currentIndex + 1} of {Data.length} lessons</span>
                  </div>
                </div>
              </div>
            </div>

            {/* List Course */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="flex items-center justify-between w-full mb-4 px-2 hover:bg-gray-800/30 rounded-lg py-2 transition-colors"
                >
                  <h3 className="text-sm font-semibold text-gray-300">List Course</h3>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isSidebarCollapsed ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                
                <div 
                  className={`space-y-2 transition-all duration-300 overflow-hidden ${
                    isSidebarCollapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'
                  }`}
                >
                  {Data.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                        videoId === item.id
                          ? "bg-gradient-to-r from-purple-600/20 to-violet-600/20 border-l-4 border-purple-500"
                          : "hover:bg-gray-800/50"
                      }`}
                      onClick={() => handleClickLesson(item)}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                        videoId === item.id
                          ? "bg-purple-500 text-white"
                          : "bg-gray-700 text-gray-400"
                      }`}>
                        {videoId === item.id ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                          </svg>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate ${
                          videoId === item.id ? "text-white" : "text-gray-300"
                        }`}>
                          {index + 1}. {item.title}
                        </div>
                      </div>
                      
                      <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Bar */}
        <div className="bg-gradient-to-r from-purple-600 to-violet-600 px-4 lg:px-6 py-3 flex items-center justify-between lg:justify-end gap-4">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <button 
            onClick={handleCompleteAndContinue}
            className="flex items-center gap-2 text-white text-sm lg:text-base font-medium hover:opacity-90 transition-opacity"
          >
            {currentIndex < Data.length - 1 ? (
              <>
                <span className="hidden sm:inline">Complete and Continue</span>
                <span className="sm:hidden">Continue</span>
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Complete Course</span>
                <span className="sm:hidden">Finish</span>
                <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Video Section */}
        <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">{currentIndex + 1}. {videoData?.title || "Untitled Lesson"}</h1>
          
          <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl" style={{ aspectRatio: "16/9" }}>
            {thumbnail ? (
              <img
                src={thumbnail}
                alt="Video Thumbnail"
                className="w-full h-full object-cover"
              />
            ) : videoData?.drive ? (
              <iframe
                src={getGoogleDriveEmbedUrl(videoData.drive)}
                width="100%"
                height="100%"
                title="YouTube video player"
                allow="autoplay"
                frameBorder="0"
                allowFullScreen
                style={{ border: "none" }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 bg-black">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-medium">No video available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Remove any default body margins/padding */
        body {
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
        }
        
        /* Ensure main content area takes full viewport */
        #__next,
        main {
          height: 100vh !important;
          overflow: hidden !important;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.3);
        }
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgb(168, 85, 247), rgb(139, 92, 246));
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgb(147, 51, 234), rgb(124, 58, 237));
        }
        
        /* Force hide Nav and Menu on this page */
        #navbar {
          display: none !important;
        }
        
        /* Hide any bottom navigation/menu */
        nav[class*="fixed bottom-0"],
        div[class*="fixed bottom-0"] {
          display: none !important;
        }
      `}</style>
    </div>
  );
}