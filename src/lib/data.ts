import { User, Event, News, Program, Partner, Media, ContactMessage, UserRole, ContactStatus, MediaType, PartnerType, Lang } from './types';

const dummyDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const dummyUsers: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'ADMIN', createdAt: dummyDate(30), updatedAt: dummyDate(30) },
  { id: '2', name: 'Editor User', email: 'editor@example.com', role: 'EDITOR', createdAt: dummyDate(20), updatedAt: dummyDate(20) },
  { id: '3', name: 'Regular User', email: 'user@example.com', role: 'USER', createdAt: dummyDate(10), updatedAt: dummyDate(10) },
  { id: '4', name: 'Jane Doe', email: 'jane.doe@example.com', role: 'USER', createdAt: dummyDate(5), updatedAt: dummyDate(5) },
  { id: '5', name: 'John Smith', email: 'john.smith@example.com', role: 'EDITOR', createdAt: dummyDate(2), updatedAt: dummyDate(2) },
];

export const dummyMedia: Media[] = [
  { id: '1', url: 'https://picsum.photos/seed/media1/400/300', mediaType: 'IMAGE', altText: 'Abstract colorful pattern', createdAt: dummyDate(3), updatedAt: dummyDate(3) },
  { id: '2', url: 'https://picsum.photos/seed/media2/400/300', mediaType: 'IMAGE', altText: 'Serene nature landscape', createdAt: dummyDate(8), updatedAt: dummyDate(8) },
  { id: '3', url: 'https://www.w3schools.com/html/mov_bbb.mp4', mediaType: 'VIDEO', altText: 'Short clip of a bunny', createdAt: dummyDate(12), updatedAt: dummyDate(12) },
  { id: '4', url: 'https://picsum.photos/seed/media3/400/300', mediaType: 'IMAGE', altText: 'Cityscape at night', createdAt: dummyDate(15), updatedAt: dummyDate(15) },
  { id: '5', url: 'https://picsum.photos/seed/media4/400/300', mediaType: 'IMAGE', altText: 'Architectural detail', createdAt: dummyDate(20), updatedAt: dummyDate(20) },
];

export const dummyEvents: Event[] = [
  { id: '1', title: 'Annual Tech Conference', slug: 'annual-tech-conference', content: 'Join us for the biggest tech conference of the year.', featuredImage: dummyMedia[1].url, isPublished: true, startDate: dummyDate(-30), location: 'Stockholm', language: 'English', createdAt: dummyDate(40), updatedAt: dummyDate(40) },
  { id: '2', title: 'Summer Music Festival', slug: 'summer-music-festival', content: 'A weekend of live music and fun.', isPublished: true, startDate: dummyDate(-60), location: 'Gothenburg', language: 'English', createdAt: dummyDate(70), updatedAt: dummyDate(70) },
  { id: '3-private', title: 'Design Workshop', slug: 'design-workshop', content: 'Learn the fundamentals of modern web design.', featuredImage: dummyMedia[4].url, isPublished: false, startDate: dummyDate(-90), location: 'Malmö', language: 'Swedish', createdAt: dummyDate(100), updatedAt: dummyDate(100) },
];

export const dummyNews: News[] = [
  { id: '1', title: 'New Partnership Announced', slug: 'new-partnership-announced', content: 'We are excited to announce our new partnership...', featuredImage: dummyMedia[0].url, isPublished: true, publishedDate: dummyDate(5), language: 'English', createdAt: dummyDate(5), updatedAt: dummyDate(5) },
  { id: '2', title: 'Q2 Financial Results', slug: 'q2-financial-results', content: 'Our Q2 results show significant growth...', featuredImage: dummyMedia[3].url, isPublished: true, publishedDate: dummyDate(15), language: 'English', createdAt: dummyDate(15), updatedAt: dummyDate(15) },
  { id: '3', title: 'Upcoming Feature Sneak Peek', slug: 'upcoming-feature-sneak-peek', content: 'A look at what\'s coming next.', isPublished: false, publishedDate: dummyDate(2), language: 'Swedish', createdAt: dummyDate(2), updatedAt: dummyDate(2) },
];

// This is a placeholder for the new Project type. Currently we are renaming Program to Project
export const dummyPrograms: any[] = [
  { id: '1', title: 'Community Outreach Program', slug: 'community-outreach-program', content: 'Our initiative to support local communities.', featuredImage: dummyMedia[0].url, isPublished: true },
  { id: '2', title: 'Developer Education Series', slug: 'developer-education-series', content: 'A series of workshops for developers.', isPublished: true },
  { id: '3', title: 'Internal Wellness Program', slug: 'internal-wellness-program', content: 'Focusing on employee well-being.', featuredImage: dummyMedia[4].url, isPublished: false },
];

export const dummyPartners: Partner[] = [
  { id: '1', name: 'TechCorp', slug: 'techcorp', logoUrl: dummyMedia[0].url, website: 'https://example.com', language: 'English', type: 'COLLABORATOR', isPublished: true, order: 1, createdAt: dummyDate(5), updatedAt: dummyDate(5) },
  { id: '2', name: 'Innovate Inc.', slug: 'innovate-inc', logoUrl: dummyMedia[1].url, website: 'https://example.com', language: 'English', type: 'FINANCIER', isPublished: true, order: 2, createdAt: dummyDate(10), updatedAt: dummyDate(10) },
  { id: '3', name: 'Design Solutions', slug: 'design-solutions', logoUrl: dummyMedia[4].url, website: 'https://example.com', language: 'Swedish', type: 'EU_PROJECT', isPublished: false, order: 3, createdAt: dummyDate(15), updatedAt: dummyDate(15) },
];

export const dummyContactMessages: ContactMessage[] = [
  { id: '1', name: 'Alice', email: 'alice@example.com', message: 'I have a question about your services.', status: 'UNREAD', createdAt: dummyDate(1), updatedAt: dummyDate(1) },
  { id: '2', name: 'Bob', email: 'bob@example.com', message: 'Interested in a partnership.', status: 'UNREAD', createdAt: dummyDate(2), updatedAt: dummyDate(2) },
  { id: '3', name: 'Charlie', email: 'charlie@example.com', message: 'Support request: my account is locked.', status: 'READ', createdAt: dummyDate(4), updatedAt: dummyDate(4) },
  { id: '4', name: 'David', email: 'david@example.com', message: 'Feedback on the new feature.', status: 'ARCHIVED', createdAt: dummyDate(10), updatedAt: dummyDate(10) },
];
