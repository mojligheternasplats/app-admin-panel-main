import { api } from '@/lib/api';
import { EventAttendance } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClientDate } from '@/components/dashboard/client-date';
import Link from 'next/link';
import { Users } from 'lucide-react';

async function getEventAttendances(): Promise<EventAttendance[]> {
  try {
    const response: any = await api.get('eventAttendance');

    console.log("Fetched Event Attendance:", response);

    // ✅ If backend returns correct array format
    if (Array.isArray(response)) return response as EventAttendance[];

    // ❌ If backend still returns { success, registrations: [...] }
    if (response?.registrations) {
      // Convert old format -> new format
      const grouped = Object.values(
        response.registrations.reduce((acc: any, r: any) => {
          if (!acc[r.eventId]) {
            acc[r.eventId] = {
              id: r.eventId,
              title: r.event?.title ?? "Untitled Event",
              startDate: r.event?.startDate ?? "",
              registrationCount: 0,
            };
          }
          acc[r.eventId].registrationCount += 1;
          return acc;
        }, {})
      );
      return grouped as EventAttendance[];
    }

    return [];
  } catch (error) {
    console.error("Failed to fetch event attendance", error);
    return [];
  }
}

export default async function EventAttendancePage() {
  const data = await getEventAttendances();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Event Attendance</h1>
        <p className="text-muted-foreground">
          Events with registered attendees.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.length > 0 ? data.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle>{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <ClientDate dateString={event.startDate} />
              </div>

              <div className="flex items-center text-sm">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{event.registrationCount} registered</span>
              </div>

              <Button asChild className="w-full">
                <Link href={`/dashboard/event-attendance/${event.id}`}>
                  View Attendees
                </Link>
              </Button>
            </CardContent>
          </Card>
        )) : (
          <p>No events with attendees found.</p>
        )}
      </div>
    </div>
  );
}
