import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getMovieGenres } from '@/lib/tmdb';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export async function GenreFilter({ selectedGenre }: { selectedGenre?: string }) {
  const genres = await getMovieGenres();

  return (
    <ScrollArea className="w-full whitespace-nowrap py-4">
      <div className="flex w-max space-x-2">
        <Button asChild variant={!selectedGenre ? 'default' : 'outline'}>
          <Link href="/">Trending</Link>
        </Button>
        {genres.map(genre => (
          <Button
            key={genre.id}
            asChild
            variant={selectedGenre === String(genre.id) ? 'default' : 'outline'}
          >
            <Link href={`/?genre=${genre.id}`}>{genre.name}</Link>
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
