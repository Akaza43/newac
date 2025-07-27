"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { BsGrid3X3GapFill, BsListUl } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa';
import Loading from "@/ui/loading";

interface ModuleItem {
  id: string;
  title: string;
  description: string;
  link: string;
  thumbnailUrl: string;
}

interface ModuleContainerProps {
  modules: ModuleItem[];
  title: string;
  description: string;
  storageKey?: string;
}

export default function ModuleContainer({ 
  modules, 
  title, 
  description,
  storageKey = 'moduleProgress' 
}: ModuleContainerProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [progress, setProgress] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/?redirect=${pathname}`);
    }
  }, [status, router, pathname]);

  useEffect(() => {
    const savedViewMode = localStorage.getItem('viewMode');
    if (savedViewMode === 'grid' || savedViewMode === 'list') {
      setViewMode(savedViewMode);
    }
  }, []);

  useEffect(() => {
    const savedProgress = localStorage.getItem(storageKey);
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, [storageKey]);

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('viewMode', mode);
  };

  const toggleProgress = (moduleId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newProgress = {
      ...progress,
      [moduleId]: !progress[moduleId]
    };
    setProgress(newProgress);
    localStorage.setItem(storageKey, JSON.stringify(newProgress));
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              {title}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => handleViewModeChange('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-red-500/20 text-red-600' 
                    : 'text-gray-400 hover:text-red-600'
                }`}
              >
                <BsGrid3X3GapFill size={20} />
              </button>
              <button
                onClick={() => handleViewModeChange('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-red-500/20 text-red-600' 
                    : 'text-gray-400 hover:text-red-600'
                }`}
              >
                <BsListUl size={20} />
              </button>
            </div>
          </div>
          <p className="text-gray-400 mb-6">{description}</p>
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8' 
              : 'flex flex-col gap-4'
          }`}>
            {modules.map((module) => (
              <Link 
                key={module.id}
                href={module.link}
                className={`group relative block rounded-xl overflow-hidden hover:shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:transform hover:-translate-y-1 transition-all duration-300 ${
                  viewMode === 'list' 
                    ? 'flex items-center p-4 bg-gray-800/50' 
                    : 'aspect-video'
                }`}
              >
                {viewMode === 'grid' ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={module.thumbnailUrl}
                      alt={module.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-start gap-3">
                        <span className="text-red-500 font-medium drop-shadow-lg">{module.id}.</span>
                        <div className="flex-1">
                          <h3 className="text-white font-bold mb-2 drop-shadow-lg">
                            {module.title}
                          </h3>
                          <p className="text-gray-200 text-sm mb-4 drop-shadow-lg">
                            {module.description}
                          </p>
                        </div>
                        <button
                          onClick={(e) => toggleProgress(module.id, e)}
                          className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                            progress[module.id]
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          <FaCheck className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-red-600 font-medium">{module.id}.</span>
                    <div className="flex-1">
                      <h3 className="text-gray-300 font-medium mb-1">{module.title}</h3>
                      <p className="text-gray-400 text-sm">{module.description}</p>
                    </div>
                    <button
                      onClick={(e) => toggleProgress(module.id, e)}
                      className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                        progress[module.id]
                          ? 'bg-green-500/20 text-green-500'
                          : 'bg-gray-700/50 text-gray-400 group-hover:text-red-600'
                      }`}
                    >
                      <FaCheck className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
