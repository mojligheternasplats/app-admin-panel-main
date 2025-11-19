import { StatCard } from '@/components/dashboard/stat-card';
import { Users, Calendar, MessageSquare, Newspaper } from 'lucide-react';
import { dummyUsers, dummyEvents, dummyContactMessages, dummyNews } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { OverviewChart } from '@/components/dashboard/overview-chart';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default async function DashboardPage() {
  const totalUsers = dummyUsers.length;
  const publishedEvents = dummyEvents.filter(e => e.isPublished).length;
  const unreadMessages = dummyContactMessages.filter(m => m.status === 'UNREAD').length;
  const publishedNews = dummyNews.filter(n => n.isPublished).length;

  const recentUsers = [...dummyUsers].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const chartData = dummyUsers.reduce((acc, user) => {
    const month = new Date(user.createdAt).getMonth();
    const monthName = monthNames[month];
    const existing = acc.find(item => item.name === monthName);
    if (existing) {
      existing.total++;
    } else {
      acc.push({ name: monthName, total: 1 });
    }
    return acc;
  }, [] as { name: string; total: number }[]);

  monthNames.forEach(name => {
      if (!chartData.find(item => item.name === name)) {
          chartData.push({ name, total: 0 });
      }
  });

  chartData.sort((a,b) => monthNames.indexOf(a.name) - monthNames.indexOf(b.name));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back!</p>
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
            <CardTitle>Overview</CardTitle>
            <CardDescription>Users registered this year.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <OverviewChart data={chartData} />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
            <CardDescription>
              You have a few new users this week.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div className="flex items-center gap-4" key={user.id}>
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarImage src="https://picsum.photos/seed/1/40/40" alt="Avatar" data-ai-hint="avatar user" />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
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
