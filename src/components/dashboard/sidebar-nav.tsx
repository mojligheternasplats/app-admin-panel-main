'use client';

import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Newspaper,
  BookOpen,
  Handshake,
  Image as ImageIcon,
  MessageSquare,
  HelpCircle, Star, UserCheck, Quote
} from 'lucide-react';
import Link from 'next/link';

const sidebarNav = {
  dashboard: 'Dashboard',
  users: 'Users',
  events: 'Events',
  eventAttendance: 'Event Attendance',
  news: 'News',
  programs: 'Programs',
  partners: 'Partners',
  heroSections: 'Hero Sections',
  testimonials: 'Testimonials',
  media: 'Media',
  contacts: 'Contact Messages',
  
  faq: 'FAQ'
};

export function SidebarNav() {
  const pathname = usePathname();

  const menuItems = [
    { href: `/dashboard`, label: sidebarNav.dashboard, icon: <LayoutDashboard /> },
    { href: `/dashboard/users`, label: sidebarNav.users, icon: <Users /> },
    { href: `/dashboard/events`, label: sidebarNav.events, icon: <Calendar /> },
    { href: `/dashboard/event-attendance`, label: sidebarNav.eventAttendance, icon: <UserCheck /> },
    { href: `/dashboard/news`, label: sidebarNav.news, icon: <Newspaper /> },
    { href: `/dashboard/programs`, label: sidebarNav.programs, icon: <BookOpen /> },
    { href: `/dashboard/partners`, label: sidebarNav.partners, icon: <Handshake /> },
    { href: `/dashboard/hero-sections`, label: sidebarNav.heroSections, icon: <Star /> },
     { href: `/dashboard/testimonials`, label: sidebarNav.testimonials, icon: <Quote /> },

    { href: `/dashboard/media`, label: sidebarNav.media, icon: <ImageIcon /> },
    { href: `/dashboard/contacts`, label: sidebarNav.contacts, icon: <MessageSquare /> },
    { href: `/dashboard/faq`, label: sidebarNav.faq, icon: <HelpCircle /> },
  ];

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname === item.href || (item.href !== `/dashboard` && pathname.startsWith(item.href))}
              tooltip={item.label}
            >
              {item.icon}
              <span>{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
