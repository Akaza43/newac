"use client";

import { useSession } from "next-auth/react";
import { Data } from "./data";
import Loading from "@/ui/loading";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const getSecureYouTubeEmbedUrl = (url: string) => {
  const matches = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  const videoId = matches ? matches[1] : "";
  // Enhanced security parameters
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&controls=1&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&playsinline=1&rel=0&showinfo=0&cc_load_policy=0&hl=en&enablejsapi=0&origin=${typeof window !== 'undefined' ? window.location.origin : ''}&widget_referrer=${typeof window !== 'undefined' ? window.location.origin : ''}`;
};

export default function Container() {
  const { data: session, status } = useSession();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [hideOverlay, setHideOverlay] = useState(false);
  const [videoProgress, setVideoProgress] = useState<{[key: string]: boolean}>({});
  const [currentTime, setCurrentTime] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const videoId = searchParams?.get("id") || Data[0].id;
  const nextModuleLink = searchParams?.get("next") || "";
  const thumbnail = searchParams?.get("thumbnail") || "";
  const videoData = Data.find((item) => item.id === videoId);

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

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

          if (response.ok) {
            setHasAccess(true);
          } else {
            setHasAccess(false);
          }
        } catch (error) {
          console.error("Error verifying role:", error);
          setHasAccess(false);
        }
      } else {
        setHasAccess(false);
      }
      setLoading(false);
    };

    if (status === "authenticated") {
      checkAccess();
    } else if (status === "unauthenticated") {
      setLoading(false);
      setHasAccess(false);
    }
  }, [session, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHideOverlay(true);
    }, 120000);
    return () => clearTimeout(timer);
  }, []);

  // Enhanced security: Disable right-click and developer tools shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+Shift+C
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C')) ||
        (e.ctrlKey && e.key === 'u')
      ) {
        e.preventDefault();
        return false;
      }
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const handleOverlayClick = () => {
    if (nextModuleLink) {
      router.push(nextModuleLink);
    }
  };

  const handleClickLesson = (item: typeof Data[number]) => {
    // Mark as watched
    setVideoProgress(prev => ({
      ...prev,
      [item.id]: true
    }));
    
    router.push(
      `?id=${item.id}&next=${encodeURIComponent(item.link)}&thumbnail=`
    );
  };

  const completedLessons = Object.values(videoProgress).filter(Boolean).length;
  const progressPercentage = (completedLessons / Data.length) * 100;

  if (loading || status === "loading") return <Loading />;
  if (!session || !hasAccess) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white font-sans selection:bg-purple-500/30">
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-30">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 1}px`,
                height: `${Math.random() * 4 + 1}px`,
                backgroundColor: '#8b5cf6',
                borderRadius: '50%',
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/50 backdrop-blur-xl border-b border-purple-500/20">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold">🎓</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Learning Platform
              </h1>
            </div>
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-400">
              <span>Progress: {Math.round(progressPercentage)}%</span>
              <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span>{currentTime}</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row relative z-10">
        {/* Left: Video Player */}
        <div className="lg:w-[65%]">
          <div className="p-4 lg:p-8 lg:sticky lg:top-0">
            <div className="relative">
              {/* Glowing border effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-3xl blur opacity-75 animate-pulse"></div>
              
              <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                {/* Security overlay */}
                <div className="absolute inset-0 z-20 pointer-events-none">
                  <div className="absolute top-4 right-4 bg-black/80 px-3 py-1 rounded-full text-xs text-purple-400 font-medium">
                    🔒 Protected Content
                  </div>
                </div>

                {/* Next module overlay */}
                <div
                  className={`absolute top-0 right-0 w-16 h-16 bg-transparent z-10 transition-all duration-1000 cursor-pointer ${
                    hideOverlay ? "opacity-0" : "opacity-100"
                  } hover:bg-purple-500/20 rounded-bl-2xl`}
                  onClick={handleOverlayClick}
                  title="Next Module"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl">⏭️</span>
                  </div>
                </div>

                {thumbnail ? (
                  <img
                    src={thumbnail}
                    alt="Video Thumbnail"
                    className="w-full h-full object-cover"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                ) : videoData?.drive ? (
                  <div className="relative w-full h-full">
                    {/* Additional security layer */}
                    <div className="absolute inset-0 z-10 pointer-events-none bg-transparent"></div>
                    <iframe
                      src={getSecureYouTubeEmbedUrl(videoData.drive)}
                      width="100%"
                      height="100%"
                      title="Learning Video"
                      allow="encrypted-media; picture-in-picture"
                      frameBorder="0"
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      sandbox="allow-scripts allow-same-origin allow-presentation"
                      style={{ 
                        border: "none",
                        pointerEvents: "auto"
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <div className="text-4xl mb-4">📹</div>
                      <p>No video available</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent leading-tight">
                {videoData?.title || "Untitled Lesson"}
              </h1>
              
              {/* Video info cards */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl px-4 py-2 flex items-center gap-2">
                  <span className="text-purple-400">⏱️</span>
                  <span>Duration: Interactive</span>
                </div>
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl px-4 py-2 flex items-center gap-2">
                  <span className="text-green-400">✅</span>
                  <span>HD Quality</span>
                </div>
                <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl px-4 py-2 flex items-center gap-2">
                  <span className="text-blue-400">🔒</span>
                  <span>Secure Stream</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Lessons List */}
        <div className="lg:w-[35%] bg-gradient-to-b from-gray-900/90 to-black/90 backdrop-blur-xl border-l border-purple-500/20 min-h-screen">
          <div className="p-6 sticky top-0 bg-black/80 backdrop-blur-xl border-b border-purple-500/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="text-purple-400">📚</span>
                Course Content
              </h2>
              <span className="text-sm text-gray-400 bg-purple-500/20 px-3 py-1 rounded-full">
                {Data.length} lessons
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Your Progress</span>
                <span>{completedLessons}/{Data.length}</span>
              </div>
              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 transition-all duration-700 ease-out rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-6 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
            {Data.map((item, index) => (
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                  videoId === item.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/25"
                    : "bg-gradient-to-r from-gray-800 to-gray-700 hover:from-purple-700 hover:to-pink-700"
                }`}
                onClick={() => handleClickLesson(item)}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
                </div>

                <div className="relative flex items-center gap-4 p-4">
                  {/* Lesson number */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    videoProgress[item.id] 
                      ? "bg-green-500 text-white" 
                      : videoId === item.id
                        ? "bg-white text-purple-600"
                        : "bg-gray-600 text-gray-300 group-hover:bg-purple-500 group-hover:text-white"
                  } transition-all duration-300`}>
                    {videoProgress[item.id] ? "✓" : String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold text-sm lg:text-base leading-snug ${
                      videoId === item.id ? "text-white" : "text-gray-100 group-hover:text-white"
                    } transition-colors duration-300`}>
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                      <span>Lesson {index + 1}</span>
                      {videoProgress[item.id] && (
                        <>
                          <span>•</span>
                          <span className="text-green-400">Completed</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Play icon */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    videoId === item.id
                      ? "bg-white/20 text-white"
                      : "bg-gray-700 text-gray-400 group-hover:bg-purple-500 group-hover:text-white"
                  } transition-all duration-300 group-hover:scale-110`}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>

                {/* Active indicator */}
                {videoId === item.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-orange-500"></div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-purple-500/20 bg-black/80 backdrop-blur-xl">
            <div className="text-center text-sm text-gray-400">
              <p>🔐 Content is protected and secure</p>
              <p className="mt-1">Keep learning! 💪</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #8b5cf6, #ec4899);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #7c3aed, #db2777);
        }
      `}</style>
    </div>
  );
}