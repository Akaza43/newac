import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const SearchPopup = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState("");
  const [pages, setPages] = useState<Array<{ name: string; path: string }>>([]);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/get-pages')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch pages');
          return res.json();
        })
        .then((data) => {
          const formattedPages = data.map((page: { name: string; path: string }) => {
            // Clean the path and ensure it's properly formatted
            const cleanPath = page.path
              .replace(/^\/+/, '')  // Remove leading slashes
              .replace(/\/+/g, '/') // Replace multiple slashes with single
              .replace(/^(Halaman\/)*/, 'Halaman/'); // Ensure single Halaman prefix

            return {
              ...page,
              name: page.name.replace(/-/g, ' '),
              path: `/${cleanPath}` // Ensure single leading slash
            };
          });
          setPages(formattedPages);
        })
        .catch((err) => console.error('Error fetching pages:', err));
    }
  }, [isOpen]);

  const filteredPages = query
    ? pages.filter((page) =>
        page.name.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-[90vw] max-w-xl">
        <div
          ref={popupRef}
          className="bg-black/95 backdrop-blur-xl p-4 rounded-xl w-full shadow-2xl border border-gray-800/50 animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Input Section */}
          <div className="mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Type to search for pages..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-900/90 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-gray-500 text-base pr-10"
                autoFocus
              />
              <span 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white cursor-pointer px-2 py-1 text-sm bg-gray-800/50 rounded"
                onClick={onClose}
              >
                Esc
              </span>
            </div>
            <p className="text-gray-400 mt-2 text-xs px-1">
              {filteredPages.length} result{filteredPages.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Results Section */}
          <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
            <ul className="space-y-2">
              {filteredPages.map((page) => (
                <li key={page.path}>
                  <Link
                    href={page.path}
                    onClick={onClose}
                    className="block px-4 py-2 rounded-lg bg-gray-900/80 hover:bg-purple-900/40 text-gray-300 hover:text-white transition-all duration-200"
                  >
                    {page.name}
                  </Link>
                </li>
              ))}
              {query && filteredPages.length === 0 && (
                <li className="text-gray-400 text-center py-8">No results found</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
