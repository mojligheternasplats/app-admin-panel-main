// 🟢 Generic Helpers
export type ID = string;

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// 🟢 Generic CRUD responses
export type CreateResponse<T> = T;
export type UpdateResponse<T> = T;
export type DeleteResponse = { success: boolean; id: ID };

// 🟢 Shared
export type Lang = "Swedish" | "English";
export type MediaType = "IMAGE" | "VIDEO";
export type UserRole = "ADMIN" | "EDITOR" | "USER";
export type PartnerType = "FINANCIER" | "COLLABORATOR" | "EU_PROJECT" | "INTERNATIONAL_PROJECT";
export type ContactStatus = "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";

// 🟢 User
export interface User {
  id: ID;
  email: string;
  firstName?: string;
  lastName?: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Form input (utan id, timestamps)
export type UserInput = Omit<User, "id" | "createdAt" | "updatedAt" | "name">;

// 🟢 News
export interface News {
  id: ID;
  slug: string;
  title: string;
  description?: string;
  content?: string;
  language: Lang;
  isPublished: boolean;
  publishedDate: string;
  featuredImage?: string;
  createdAt: string;
  updatedAt: string;
}

export type NewsInput = Omit<News, "id" | "createdAt" | "updatedAt">;

// 🟢 Event
export interface Event {
  id: ID;
  slug: string;
  title: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description?: string;
  content?: string;
  featuredImage?: string;
  language: Lang;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EventInput = Omit<Event, "id" | "createdAt" | "updatedAt">;

// 🟢 Project
export interface Project {
  id: ID;
  slug: string;
  title: string;
  description?: string;
  content?: string;
  language: Lang;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">;

// 🟢 Partner
export interface Partner {
  id: ID;
  slug: string;
  name: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  language: Lang;
  type: PartnerType;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type PartnerInput = Omit<Partner, "id" | "createdAt" | "updatedAt">;

// 🟢 Media
export interface Media {
  id: ID;
  url: string;
  mediaType: MediaType;
  title?: string;
  description?: string;
  altText?: string;
  createdAt: string;
  updatedAt: string;
}

export type MediaInput = Omit<Media, "id" | "createdAt" | "updatedAt">;

// 🟢 Contact
export interface ContactMessage {
  id: ID;
  name: string;
  email: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

export type ContactMessageInput = Omit<ContactMessage, "id" | "createdAt" | "updatedAt">;
