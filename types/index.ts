export interface User {
  id: string;
  kindeId: string;
  name: string | null;
  email: string | null;
  image: string | null;
  darkMode: boolean;
  anonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  location: string;
  rating: number;
  content: string;
  images: string | null;
  anonymous: boolean;
  dynamicFields: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

export interface ReviewWithUser extends Review {
  user: User;
}

export interface AnonymousSettingsProps {
  anonymousGlobal: boolean;
  onToggleAnonymous: () => Promise<void>;
}

export interface ReviewCardProps {
  review: ReviewWithUser;
  currentUser: User | null;
  isAdmin: boolean;
}