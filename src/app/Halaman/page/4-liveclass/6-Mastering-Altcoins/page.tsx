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

  return (
    <div className="min-h-screen bg-black text-black font-sans">
      <div className="flex flex-col lg:flex-row">
        {/* Left: Video Player */}
        <div className="lg:w-[60%]">
          <div className="p-4 lg:p-6 lg:fixed lg:w-[55%] lg:max-w-[900px]">
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-black shadow-lg">
              <div
                className={`absolute top-0 right-0 w-16 h-16 bg-transparent z-10 transition-opacity duration-1000 cursor-pointer ${
                  hideOverlay ? "opacity-0" : "opacity-100"
                }`}
                onClick={handleOverlayClick}
                title="Next Module"
              />
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : videoData?.drive ? (
                <iframe
                  src={getGoogleDriveEmbedUrl(videoData.drive)}
                  width="100%"
                  height="100%"
                  title="YouTube video player"
                  allow="autoplay"
                  frameBorder="1"
                  allowFullScreen
                  style={{ border: "none" }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No video available
                </div>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold mt-4 text-white tracking-tight">
              {videoData?.title || "Untitled Lesson"}
            </h1>
          </div>
        </div>

        {/* Right: Lessons List */}
        <div className="lg:w-[40%] bg-black border-l border-black min-h-screen p-4 lg:p-6">
          <h2 className="text-lg font-semibold mb-4 text-white">
            Lessons ({Data.length})
          </h2>
          <div className="space-y-3">
            {Data.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-300 cursor-pointer group ${
                  videoId === item.id
                    ? "bg-purple-700 ring-2 ring-purple-800 text-black"
                    : "bg-purple-600 hover:bg-purple-700 text-black"
                }`}
                onClick={() => handleClickLesson(item)}
              >
                <img
                  src="/images/play.svg"
                  alt="Play Icon"
                  className="h-5 w-5 group-hover:scale-110 transition-transform"
                />
                <span className="text-sm lg:text-base font-medium">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}