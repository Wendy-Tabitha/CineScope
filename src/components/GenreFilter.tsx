import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getMovieGenres } from '@/lib/tmdb';
import { searchByTitle } from '@/lib/omdb';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export async function GenreFilter({ selectedGenre }: { selectedGenre?: string }) {
  let genres = [];
  try {
    genres = await getMovieGenres();
  } catch (error) {
    console.error('Failed to fetch genres from TMDB:', error);
    // If TMDB fails, we'll show a reduced set of common genres
    genres = [
      { id: 28, name: 'Action' },
      { id: 35, name: 'Comedy' },
      { id: 18, name: 'Drama' },
      { id: 27, name: 'Horror' },
      { id: 10749, name: 'Romance' },
      { id: 878, name: 'Science Fiction' },
      { id: 53, name: 'Thriller' }
    ];
  }

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
