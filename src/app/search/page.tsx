import { searchMedia } from '@/lib/tmdb';
import MediaGrid from '@/components/MediaGrid';
import { PaginationControls } from '@/components/PaginationControls';

export const revalidate = 3600;

export default async function SearchPage({ searchParams }: { searchParams: { q?: string; page?: string } }) {
  const query = searchParams.q || '';
  const page = Number(searchParams.page) || 1;

  if (!query) {
    return (
      <div>
        <h1 className="text-3xl font-headline font-bold mb-4">Search</h1>
        <p>Please enter a search term to find movies and TV shows.</p>
      </div>
    );
  }

  const results = await searchMedia(query, page);
  const totalPages = Math.min(results.total_pages, 500); // TMDB API limit

  return (
    <div>
      <h1 className="text-3xl font-headline font-bold mb-6">
        Search Results for <span className="text-accent">&quot;{query}&quot;</span>
      </h1>
      {results.results.length > 0 ? (
        <>
          <MediaGrid media={results.results} />
          <PaginationControls totalPages={totalPages} />
        </>
      ) : (
        <p>No results found for &quot;{query}&quot;.</p>
      )}
    </div>
  );
}
