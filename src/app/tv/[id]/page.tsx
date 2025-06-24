import Image from 'next/image';
import { getTvDetails } from '@/lib/tmdb';
import { IMAGE_BASE_URL, POSTER_PLACEHOLDER } from '@/lib/tmdb';
import { Badge } from '@/components/ui/badge';
import { WatchlistButton } from '@/components/WatchlistButton';
import { Star, Tv, Calendar } from 'lucide-react';
import type { Metadata } from 'next';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const show = await getTvDetails(params.id);
    return {
      title: `${show.name} - CineScope`,
      description: show.overview,
    };
  } catch (error) {
    return {
        title: 'TV Show Not Found - CineScope',
    };
  }
}

export default async function TVShowDetailPage({ params }: Props) {
  try {
    const show = await getTvDetails(params.id);
    const posterUrl = show.poster_path ? `${IMAGE_BASE_URL}${show.poster_path}` : POSTER_PLACEHOLDER;
    const backdropUrl = show.backdrop_path ? `https://image.tmdb.org/t/p/w1280${show.backdrop_path}` : '';

    return (
      <div className="space-y-8">
        <div className="relative h-[30vh] md:h-[50vh] w-full -ml-4 -mr-4 -mt-8">
             {backdropUrl && <Image src={backdropUrl} alt={`${show.name} backdrop`} layout="fill" objectFit="cover" className="opacity-20" />}
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        <div className="grid md:grid-cols-12 gap-8 -mt-32 relative">
          <div className="md:col-span-4 lg:col-span-3">
            <Image
              src={posterUrl}
              alt={show.name}
              width={500}
              height={750}
              className="rounded-lg shadow-2xl shadow-black/50"
              data-ai-hint="tv show poster"
            />
          </div>
          <div className="md:col-span-8 lg:col-span-9 space-y-4">
            <h1 className="text-4xl lg:text-5xl font-headline font-bold text-primary">{show.name}</h1>
            {show.tagline && <p className="text-lg text-muted-foreground italic">&quot;{show.tagline}&quot;</p>}

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span>{show.vote_average.toFixed(1)} / 10</span>
                </div>
                <div className="flex items-center gap-2">
                    <Tv className="w-5 h-5" />
                    <span>{show.number_of_seasons} seasons</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>{new Date(show.first_air_date).getFullYear()}</span>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {show.genres.map((genre) => (
                <Badge key={genre.id} variant="secondary">{genre.name}</Badge>
              ))}
            </div>

            <p className="text-lg leading-relaxed max-w-prose">{show.overview}</p>
            <WatchlistButton item={{...show, media_type: 'tv'}} className="h-12 w-48 text-lg" />
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-headline font-semibold mb-4">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {show.credits.cast.slice(0, 12).map((member) => (
              <div key={member.id} className="text-center">
                <Image
                  src={member.profile_path ? `${IMAGE_BASE_URL}${member.profile_path}` : `https://placehold.co/200x300/222222/E6E6FA?text=${member.name.split(' ').map(n=>n[0]).join('')}`}
                  alt={member.name}
                  width={200}
                  height={300}
                  className="rounded-lg mb-2 object-cover aspect-[2/3]"
                   data-ai-hint="person photo"
                />
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.character}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return <p>TV show not found.</p>;
  }
}
