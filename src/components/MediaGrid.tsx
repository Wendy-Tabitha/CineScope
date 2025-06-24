import type { Media } from '@/lib/types';
import MediaCard from './MediaCard';

interface MediaGridProps {
  media: Media[];
}

export default function MediaGrid({ media }: MediaGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {media.map((item) => (
        item.media_type !== 'person' && <MediaCard key={`${item.media_type}-${item.id}`} item={item} />
      ))}
    </div>
  );
}
