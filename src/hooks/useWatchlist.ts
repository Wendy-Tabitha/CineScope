"use client";

import { useState, useEffect, useCallback } from 'react';
import type { WatchlistItem, Media } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

const WATCHLIST_KEY = 'cinescope_watchlist';

export function useWatchlist() {
  const { toast } = useToast();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedWatchlist = localStorage.getItem(WATCHLIST_KEY);
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
    } catch (error) {
      console.error("Failed to load watchlist from localStorage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
      } catch (error) {
        console.error("Failed to save watchlist to localStorage", error);
      }
    }
  }, [watchlist, isLoaded]);

  const addToWatchlist = useCallback((item: Media) => {
    const title = 'title' in item ? item.title : item.name;
    const newItem: WatchlistItem = {
      id: item.id,
      type: item.media_type === 'movie' ? 'movie' : 'tv',
      title: title,
      poster_path: item.poster_path,
      watched: false,
    };
    setWatchlist(prev => [newItem, ...prev.filter(i => i.id !== newItem.id)]);
    toast({ title: "Added to Watchlist", description: `${title} has been added.` });
  }, [toast]);

  const removeFromWatchlist = useCallback((id: number) => {
    const item = watchlist.find(i => i.id === id);
    setWatchlist(prev => prev.filter(i => i.id !== id));
    if (item) {
        toast({ title: "Removed from Watchlist", description: `${item.title} has been removed.` });
    }
  }, [watchlist, toast]);

  const toggleWatched = useCallback((id: number) => {
    setWatchlist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, watched: !item.watched } : item
      )
    );
    const item = watchlist.find(i => i.id === id);
    if(item) {
        toast({ title: "Watchlist Updated", description: `${item.title} marked as ${!item.watched ? 'watched' : 'unwatched'}.`});
    }
  }, [watchlist, toast]);

  const isInWatchlist = useCallback((id: number) => {
    return watchlist.some(item => item.id === id);
  }, [watchlist]);

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatched,
    isInWatchlist,
    isLoaded
  };
}
