// src/ui/loading.tsx
import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)] overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 animate-spin">
          <div className="h-20 w-20 rounded-full border-4 border-purple-600/20 border-t-purple-600"></div>
        </div>
        <div className="flex items-center justify-center h-20 w-20 animate-pulse">
          <Image 
            src="/ac.png" 
            alt="Loading" 
            width={48} 
            height={48}
          />
        </div>
      </div>
    </div>
  );
}