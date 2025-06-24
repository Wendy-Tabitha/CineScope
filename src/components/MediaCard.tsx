import Image from 'next/image';
import Link from 'next/link';
import type { Media } from '@/lib/types';
import { IMAGE_BASE_URL, POSTER_PLACEHOLDER } from '@/lib/tmdb';
import { Card, CardContent } from '@/components/ui/card';
import { WatchlistButton } from '@/components/WatchlistButton';
import { Star } from 'lucide-react';

interface MediaCardProps {
  item: Media;
}

export default function MediaCard({ item }: MediaCardProps) {
  const title = 'title' in item ? item.title : item.name;
  const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
  const posterUrl = item.poster_path ? `${IMAGE_BASE_URL}${item.poster_path}` : POSTER_PLACEHOLDER;
  const linkPath = `/${item.media_type}/${item.id}`;

  return (
    <Card className="overflow-hidden group transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-accent/20 hover:scale-105">
      <CardContent className="p-0">
        <div className="relative">
          <Link href={linkPath}>
            <Image
              src={posterUrl}
              alt={title}
              width={500}
              height={750}
              className="object-cover w-full h-auto"
              data-ai-hint="movie poster"
            />
          </Link>
          <div className="absolute top-2 right-2">
            <WatchlistButton item={item} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
             <div className="flex items-center gap-2 text-sm text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <span>{item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
            </div>
            <Link href={linkPath}>
              <h3 className="font-bold text-lg text-white truncate group-hover:text-primary transition-colors">{title}</h3>
            </Link>
            <p className="text-sm text-gray-300">{year}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
