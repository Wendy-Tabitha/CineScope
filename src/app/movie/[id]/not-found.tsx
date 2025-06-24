'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { searchByTitle } from '@/lib/omdb';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock } from 'lucide-react';

export default function MovieNotFound() {
  const [omdbData, setOmdbData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchFromOmdb = async () => {
      try {
        // Try to fetch from OMDB using the ID (which might be a title)
        const data = await searchByTitle(decodeURIComponent(params.id as string));
        setOmdbData(data);
      } catch (err) {
        setError('Movie not found in both TMDB and OMDB databases.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFromOmdb();
  }, [params.id]);

  if (isLoading) {
    return <div>Searching alternative sources...</div>;
  }

  if (error || !omdbData) {
    return (
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Movie Not Found</h1>
        <p>{error || 'Unable to find the requested movie.'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          {omdbData.Poster && omdbData.Poster !== 'N/A' ? (
            <Image
              src={omdbData.Poster}
              alt={omdbData.Title}
              width={500}
              height={750}
              className="rounded-lg shadow-lg w-full"
              priority
            />
          ) : (
            <div className="aspect-[2/3] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">No poster available</p>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold mb-2">{omdbData.Title}</h1>
          <p className="text-xl text-muted-foreground mb-6">{omdbData.Year}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {omdbData.Genre.split(',').map((genre: string) => (
              <Badge key={genre.trim()} variant="secondary">
                {genre.trim()}
              </Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {omdbData.imdbRating !== 'N/A' && (
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <span>{omdbData.imdbRating}/10</span>
              </div>
            )}
            {omdbData.Runtime !== 'N/A' && (
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{omdbData.Runtime}</span>
              </div>
            )}
          </div>

          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-2">Overview</h2>
            <p className="text-muted-foreground">{omdbData.Plot}</p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {omdbData.Director !== 'N/A' && (
              <div>
                <h2 className="font-semibold mb-1">Director</h2>
                <p className="text-muted-foreground">{omdbData.Director}</p>
              </div>
            )}
            {omdbData.Actors !== 'N/A' && (
              <div>
                <h2 className="font-semibold mb-1">Cast</h2>
                <p className="text-muted-foreground">{omdbData.Actors}</p>
              </div>
            )}
            {omdbData.Awards !== 'N/A' && (
              <div>
                <h2 className="font-semibold mb-1">Awards</h2>
                <p className="text-muted-foreground">{omdbData.Awards}</p>
              </div>
            )}
            {omdbData.BoxOffice !== 'N/A' && (
              <div>
                <h2 className="font-semibold mb-1">Box Office</h2>
                <p className="text-muted-foreground">{omdbData.BoxOffice}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 