
import { api } from '@/lib/api';
import { EventAttendanceResponse } from '@/lib/types';
import { AttendanceDataTable } from '@/components/dashboard/event-attendance/data-table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

async function getEventAttendance(eventId: string) {
  try {
          
    const response: EventAttendanceResponse = await api.get(`eventAttendance/${eventId}`);
    return response;
  } catch (error) {
    console.error("Failed to fetch event attendance", error);

    return {
      event: { id: eventId, title: "Unknown Event" },
      registrations: [],
      total: 0,
      success: false
    } as EventAttendanceResponse;
  }
}

export default async function EventAttendanceDetailsPage({ params }: { params: { id: string } }) {
 console.log(params.id)
  const { event, registrations } = await getEventAttendance(params.id);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/dashboard/event-attendance">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-headline">Event Attendees</h1>
          <p className="text-muted-foreground">
            For event: {event.title}
          </p>
        </div>
      </div>

      <AttendanceDataTable data={registrations} />
    </div>
  );
}
