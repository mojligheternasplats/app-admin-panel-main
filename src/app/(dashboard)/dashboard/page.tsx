import { StatCard } from '@/components/dashboard/stat-card';
import { Users, Calendar, MessageSquare, Newspaper } from 'lucide-react';
import { api } from '@/lib/api';
import { User, Event, ContactMessage, News , PaginatedResponse} from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ClientDate } from '@/components/dashboard/client-date';

async function getDashboardData() {
  try {
    const usersRes = await api.get<PaginatedResponse<User>>("users");
    const eventsRes = await api.get<PaginatedResponse<Event>>("events");
    const messagesRes = await api.get<PaginatedResponse<ContactMessage>>("contact");
    const newsRes = await api.get<PaginatedResponse<News>>("news");

    return {
      users: usersRes.data,
      events: eventsRes.data,
      messages: messagesRes.data,
      news: newsRes.data,
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data", error);
    return { users: [], events: [], messages: [], news: [] };
  }
}



function processChartData(users: User[]) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthlySignups: { [key: string]: number } = monthNames.reduce((acc, name) => ({ ...acc, [name]: 0 }), {});

  users.forEach(user => {
    const month = new Date(user.createdAt).getMonth();
    const monthName = monthNames[month];
    if (monthlySignups[monthName] !== undefined) {
      monthlySignups[monthName]++;
    }
  });

  return monthNames.map(name => ({ name, total: monthlySignups[name] }));
}

export default async function DashboardPage() {
  const { users, events, messages, news } = await getDashboardData();

  const totalUsers = users.length;
  const publishedEvents = events.filter(e => e.isPublished).length;
  const unreadMessages = messages.filter(m => m.status === 'UNREAD').length;
  const publishedNews = news.filter(n => n.isPublished).length;

  const recentUsers = [...users].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const chartData = processChartData(users);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your application.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Users" value={totalUsers.toString()} icon={<Users className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Published Events" value={publishedEvents.toString()} icon={<Calendar className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Unread Messages" value={unreadMessages.toString()} icon={<MessageSquare className="h-4 w-4 text-muted-foreground" />} />
        <StatCard title="Published News" value={publishedNews.toString()} icon={<Newspaper className="h-4 w-4 text-muted-foreground" />} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>User Registrations</CardTitle>
            <CardDescription>A monthly overview of new user signups this year.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={chartData} />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
            <CardDescription>
              Your newest users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div className="flex items-center gap-4" key={user.id}>
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src={user.avatarUrl || "https://picsum.photos/seed/1/40/40"} alt="Avatar" data-ai-hint="avatar user" />
                    <AvatarFallback>{user.name?.charAt(0)?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1 flex-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="text-sm text-muted-foreground text-right">
                    <ClientDate dateString={user.createdAt} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
