"use client";

import { useWatchlist } from '@/hooks/useWatchlist';
import type { Media } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { BookmarkPlus, BookmarkCheck, Loader2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface WatchlistButtonProps {
  item: Media;
  className?: string;
}

export function WatchlistButton({ item, className }: WatchlistButtonProps) {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist, isLoaded } = useWatchlist();

  if (!isLoaded) {
    return (
      <Button size="icon" className="rounded-full bg-black/50 hover:bg-primary" disabled>
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  const inWatchlist = isInWatchlist(item.id);
  const title = `item` in item ? ('title' in item ? item.title : item.name) : 'this item'

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist(item);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="secondary"
            className={`rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-primary hover:text-primary-foreground ${className}`}
            onClick={handleToggleWatchlist}
          >
            {inWatchlist ? (
              <BookmarkCheck className="h-5 w-5 text-accent" />
            ) : (
              <BookmarkPlus className="h-5 w-5" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
