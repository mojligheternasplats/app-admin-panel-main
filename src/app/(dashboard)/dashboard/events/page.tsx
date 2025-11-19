import { api } from '@/lib/api';
import { EventDataTable } from '@/components/dashboard/events/data-table';
import { Event } from '@/lib/types';

async function getEvents(): Promise<Event[]> {
  try {
    const response = await api.getAll<Event>('events'); // ✅ use getAll
    return response.data; // ✅ extract items from PaginatedResponse
  } catch (error) {
    console.error("Failed to fetch events", error);
    return [];
  }
}

export default async function EventsPage() {
  const data = await getEvents();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-bold font-headline">Events</h1>
      <EventDataTable data={data} />
    </div>
  );
}
