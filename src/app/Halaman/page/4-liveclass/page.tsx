"use client";

import { useSession } from "next-auth/react";
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
  const { data: session, status } = useSession();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [hideOverlay, setHideOverlay] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const videoId = searchParams?.get("id") || Data[0].id;
  const nextModuleLink = searchParams?.get("next") || "";
  const thumbnail = searchParams?.get("thumbnail") || "";
  const videoData = Data.find((item) => item.id === videoId);

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

  const handleOverlayClick = () => {
    if (nextModuleLink) {
      router.push(nextModuleLink);
    }
  };

  const handleClickLesson = (item: typeof Data[number]) => {
    router.push(
      `?id=${item.id}&next=${encodeURIComponent(item.link)}&thumbnail=`
    );
  };

  if (loading || status === "loading") return <Loading />;
  if (!session || !hasAccess) return null;

  const currentIndex = Data.findIndex(item => item.id === videoId);
  const progress = Math.round(((currentIndex + 1) / Data.length) * 100);

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden">
      <div className="flex flex-col lg:flex-row relative z-10">
        {/* Left: Video Player */}
        <div className="lg:w-[60%] relative">
          <div className="p-4 lg:p-8 lg:fixed lg:w-[55%] lg:max-w-[900px]">
            {/* Video container with enhanced styling */}
            <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800/50 group">
              {/* Glowing border effect - Changed to purple */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              


              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover rounded-3xl"
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
                  className="rounded-3xl"
                  style={{ border: "none" }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 bg-black rounded-3xl">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium">No video available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced title section */}
            <div className="mt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600/20 to-violet-600/20 rounded-full border border-purple-500/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-300">Lesson {currentIndex + 1} of {Data.length}</span>
                </div>
                <div className="px-3 py-1.5 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-full border border-gray-600/30">
                  <span className="text-xs font-medium text-gray-300">{progress}% Complete</span>
                </div>
              </div>
              <h1 className="text-2xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300 tracking-tight leading-tight">
                {videoData?.title || "Untitled Lesson"}
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full mt-3"></div>
            </div>
          </div>
        </div>

        {/* Right: Lessons List */}
        <div className="lg:w-[40%] bg-black border-l border-gray-800/30 min-h-screen relative">
          <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800/30 p-4 lg:p-6 z-20">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
                LIVECLASS
              </h2>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-full border border-gray-600/30">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="text-sm font-medium text-gray-300">{Data.length} Lessons</span>
              </div>
            </div>
          </div>

          <div className="p-4 lg:p-6 space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar pb-20 lg:pb-8">
            {Data.map((item, index) => (
              <div
                key={item.id}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  videoId === item.id
                    ? "transform scale-[1.02]"
                    : "hover:transform hover:scale-[1.01]"
                }`}
                onClick={() => handleClickLesson(item)}
              >
                {/* Background with gradient and effects - Changed to purple */}
                <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
                  videoId === item.id
                    ? "bg-gradient-to-r from-purple-600/30 via-purple-500/20 to-violet-600/30 shadow-lg shadow-purple-500/25"
                    : "bg-gradient-to-r from-gray-800/40 to-gray-700/40 group-hover:from-purple-600/20 group-hover:to-violet-600/20"
                }`}></div>
                
                {/* Border gradient - Changed to purple */}
                <div className={`absolute inset-0 rounded-2xl border transition-all duration-300 ${
                  videoId === item.id
                    ? "border-purple-500/50 shadow-lg"
                    : "border-gray-700/50 group-hover:border-purple-500/30"
                }`}></div>

                {/* Content */}
                <div className="relative flex items-center gap-4 p-4 lg:p-5">
                  {/* Lesson number - Changed to purple */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    videoId === item.id
                      ? "bg-gradient-to-br from-purple-500 to-violet-500 text-white shadow-lg"
                      : "bg-gray-700/50 text-gray-300 group-hover:bg-gradient-to-br group-hover:from-purple-600/50 group-hover:to-violet-600/50"
                  }`}>
                    {index + 1}
                  </div>



                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm lg:text-base font-semibold truncate transition-all duration-300 ${
                      videoId === item.id
                        ? "text-white"
                        : "text-gray-200 group-hover:text-white"
                    }`}>
                      {item.title}
                    </h3>
                    <div className={`flex items-center gap-2 mt-1 transition-all duration-300 ${
                      videoId === item.id
                        ? "text-purple-200"
                        : "text-gray-500 group-hover:text-purple-300"
                    }`}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                      </svg>
                      <span className="text-xs">Duration varies</span>
                    </div>
                  </div>

                  {/* Status indicator - Changed to purple */}
                  {videoId === item.id && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-violet-400 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, rgb(147, 51, 234), rgb(124, 58, 237));
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, rgb(126, 34, 206), rgb(109, 40, 217));
        }
        
        /* Hide bottom navbar on desktop for this page only */
        @media (min-width: 1024px) {
          nav[class*="flex justify-around"] {
            display: none !important;
          }
          div[class*="fixed bottom-0"] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}