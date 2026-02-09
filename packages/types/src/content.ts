export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  sourceId: string;
  sourceName: string;
  categoryId: string;
  imageUrl: string | null;
  publishedAt: string;
  url: string;
  readingTimeMinutes: number;
}

export interface PulsePost {
  id: string;
  authorId: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  caption: string;
  likes: number;
  shares: number;
  createdAt: string;
}

export interface Novel {
  id: string;
  authorId: string;
  title: string;
  synopsis: string;
  coverUrl: string;
  genre: string;
  chapterCount: number;
  status: "ongoing" | "completed" | "hiatus";
  createdAt: string;
}

export interface Chapter {
  id: string;
  novelId: string;
  number: number;
  title: string;
  content: string;
  wordCount: number;
  isPremium: boolean;
  price: number | null;
}

export interface Event {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  venue: string;
  location: { lat: number; lng: number };
  startDate: string;
  endDate: string;
  ticketPrice: number | null;
  currency: string;
  capacity: number;
  attendeeCount: number;
  imageUrl: string;
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  memberCount: number;
  creatorId: string;
  isPrivate: boolean;
  rules: string[];
  createdAt: string;
}
