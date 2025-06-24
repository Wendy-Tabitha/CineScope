import { getTrending, getMoviesByGenre } from '@/lib/tmdb';
import MediaGrid from '@/components/MediaGrid';
import { GenreFilter } from '@/components/GenreFilter';

export const revalidate = 3600; // Revalidate every hour

export default async function Home({ searchParams }: { searchParams: { genre?: string } }) {
  const selectedGenre = searchParams.genre;
  const media = selectedGenre
    ? await getMoviesByGenre(selectedGenre)
    : await getTrending('all');

  const title = selectedGenre ? `Movies` : 'Trending This Week';

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-headline font-bold mb-4 text-accent">Discover</h1>
        <p className="text-lg text-muted-foreground">Browse movies by genre.</p>
        <GenreFilter selectedGenre={selectedGenre} />
      </div>

      <div>
        <h2 className="text-3xl font-headline font-semibold mb-6">{title}</h2>
        {media.results.length > 0 ? (
          <MediaGrid media={media.results} />
        ) : (
          <p>No content found for this genre.</p>
        )}
      </div>
    </div>
  );
}
