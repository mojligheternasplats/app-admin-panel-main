// ---- Shared ----
export type ID = string;

export type Lang = "Swedish" | "English";

export type UserRole = "ADMIN" | "EDITOR" | "USER";

export type PartnerType =
  | "FINANCIER"
  | "COLLABORATOR"
  | "EU_PROJECT"
  | "INTERNATIONAL_PROJECT";

export type ContactStatus = "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";

export type MediaType = "IMAGE" | "VIDEO"; // ✅ matches Prisma

export type ProjectCategory = "LOCAL" | "EU" | "INTERNATIONAL";

export type EntityType =
  | "NEWS"
  | "EVENT"
  | "PROJECT"
  | "PARTNER"
  | "HERO_SECTION"
  | "GALLERY_COMPONENT";

export interface Pagination {
  page?: number;
  limit?: number;
  q?: string;
  sort?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ---- Auth / Users ----

export interface User {
  id: ID;
  email: string;
  password?: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  name?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;

  createdNews?: News[];
  createdEvents?: Event[];
  createdProjects?: Project[];
}

// ---- News ----

export interface News {
  id: ID;
  slug?: string;
  title: string;
  description?: string;
  content?: string;
  language: Lang;
  isPublished: boolean;
  publishedDate: string;
  createdAt: string;
  updatedAt: string;
  createdById?: string;

  creator?: User;
  media?: Media[];
}

// ---- Projects ----

export interface Project {
  id: ID;
  slug: string;
  title: string;
  description?: string;
  content?: string;
  language: Lang;
  isPublished: boolean;
  order: number;
  category: ProjectCategory;
  createdAt: string;
  updatedAt: string;
  createdById?: string;

  creator?: User;
  media?: Media[];
}

// ---- Events ----

export interface Event {
  id: ID;
  slug?: string;
  title: string;
  description?: string;
  content?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  language: Lang;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  createdById?: string;
 openForRegistration: boolean;
  creator?: User;
  media?: Media[];
}

// ---- Partners ----

export interface Partner {
  id: ID;
  slug?: string;
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

  media?: Media[];
}

// ---- Media ----

export interface Media {
  id: ID;
  url: string;
  publicId?: string | null; // Cloudinary public ID
  mediaType: MediaType;
  title?: string | null;
  description?: string | null;
  altText?: string | null;
  createdAt: string;
  updatedAt: string;

  associations?: MediaAssociation[];
}

export interface MediaAssociation {
  id: ID;
  mediaId: ID;
  entityId: ID;
  entityType: EntityType;
  order?: number | null;
  createdAt: string;
}
// ---- Hero Sections ----

export type HeroStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface HeroSection {
  id: ID;
  page: string; // e.g. "home", "events", "projects"
  title: string;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonLink?: string | null;
  language: Lang; // ✅ uses shared type "Swedish" | "English"
  status: HeroStatus;
  createdAt: string;
  updatedAt: string;

  media?: Media[]; // ✅ so hero sections can store images/videos
}
// ---- Contact Messages ----

export interface ContactMessage {
  id: ID;
  name: string;
  email: string;
  message: string;
  subject?: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}


// ---- Event Attendance ----

export interface EventAttendanceUser {
    id: ID;
    name: string;
    email: string;
    phone?: string;
    createdAt: string;
}

export interface EventAttendance {
    id: ID;
    title: string;
    registrations: EventAttendanceUser[];
    registrationCount: number;
    startDate: string;
}

export interface EventAttendanceResponse {
    event: {
        id: ID;
        title: string;
    };
    registrations: EventAttendanceUser[];
}

// ---- Youth Testimonials ----
export interface YouthTestimonial {
  id: ID;
  name: string;
  age: number;
  message: string;
  program: string;
  imageUrl?: string;
  isPublished: boolean;
  createdAt: string;
}
