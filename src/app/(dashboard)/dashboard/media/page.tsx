import { api } from '@/lib/api';
import { Media } from '@/lib/types';
import { MediaDataTable } from '@/components/dashboard/media/data-table';

async function getMedia() {
  try {
    const media: Media[] = await api.get('media/all');
    
    return media;
  } catch (error) {
    console.error("Failed to fetch media", error);
    return [];
  }
}

export default async function MediaPage() {
  const data = await getMedia();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Media</h1>
      </div>
      <MediaDataTable data={data} />
    </div>
  );
}
