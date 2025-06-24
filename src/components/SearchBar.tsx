"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { Input } from '@/components/ui/input';
import type { Media } from '@/lib/types';
import { searchMedia as searchMediaApi } from '@/lib/tmdb';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const router = useRouter();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery) {
      setIsLoading(true);
      try {
        const data = await searchMediaApi(searchQuery);
        setResults(data.results.filter(item => item.media_type !== 'person').slice(0, 7));
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      }
      setIsLoading(false);
    } else {
      setResults([]);
    }
  }, []);

  useEffect(() => {
    handleSearch(debouncedQuery);
  }, [debouncedQuery, handleSearch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
      setIsFocused(false);
    }
  };

  return (
    <div className="relative w-full max-w-xs" ref={searchContainerRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search movies & TV shows..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
          {isLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />}
        </div>
      </form>
      {isFocused && (query.length > 0 || results.length > 0) && (
        <div className="absolute top-full mt-2 w-full rounded-md border bg-popover shadow-lg">
          {results.length > 0 ? (
            <ul className="py-1">
              {results.map((item) => {
                const title = 'title' in item ? item.title : item.name;
                const year = 'release_date' in item ? item.release_date?.substring(0,4) : item.first_air_date?.substring(0,4);
                const link = `/${item.media_type}/${item.id}`;
                return (
                  <li key={item.id}>
                    <Link href={link} className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setIsFocused(false)}>
                      {title} {year && `(${year})`}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : !isLoading && debouncedQuery && (
            <p className="p-4 text-sm text-muted-foreground">No results found.</p>
          )}
        </div>
      )}
    </div>
  );
}
