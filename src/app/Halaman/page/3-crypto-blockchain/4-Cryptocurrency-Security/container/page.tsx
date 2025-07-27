"use client";
import { useSession } from "next-auth/react";
import { Data } from "./data";

import PlayList from "../page";
import Loading from '@/ui/loading';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const getGoogleDriveEmbedUrl = (url: string) => {
  
  const matches = url.match(/\/d\/(.+?)(?:\/|$|\?)/);
  const fileId = matches ? matches[1] : '';
  
  return `https://drive.google.com/file/d/${fileId}/preview`;
};

type PageProps = {
  searchParams: { id?: string; next?: string };
}

export default function Container({ searchParams }: PageProps) {
  const videoId = searchParams.id || "";
  const nextModuleLink = searchParams.next || ""; 
  const { data: session, status } = useSession();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [hideOverlay, setHideOverlay] = useState(false); 
  const router = useRouter();

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
            const data = await response.json();
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
      console.log("Navigating to:", nextModuleLink); 
      router.push(nextModuleLink);
    }
  };

  if (loading || status === "loading") {
    return <Loading />;
  }

  if (!session || !hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-[60%] lg:h-screen lg:overflow-hidden">
          <div className="p-6 lg:fixed lg:w-[55%] lg:max-w-[800px]">
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-gray-900">
              {/* Overlay for "Pop Out" button area */}
              <div
                className={`absolute top-0 right-0 w-16 h-16 bg-transparent z-10 transition-opacity duration-1000 ${hideOverlay ? "opacity-0" : "opacity-100"}`}
                onClick={handleOverlayClick}
              />
              {videoData?.drive && (
                <iframe
                  src={getGoogleDriveEmbedUrl(videoData.drive)}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              )}
            </div>
            <h1 className="text-xl font-bold mt-3 text-gray-200">{videoData?.title}</h1>
          </div>
        </div>
        <div className="lg:w-[40%] bg-black border-l border-gray-900">
          <PlayList />
        </div>
      </div>
    </div>
  );
}
