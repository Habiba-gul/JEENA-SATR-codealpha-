export interface Review {
  id: string;
  user: string;
  rating: number;
  text: string;
  date: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: 'Urdu Novels' | 'English Novels' | 'Science Fiction' | 'Motivational' | 'Funny Comics';
  price: number;
  description: string;
  rating: number;
  featured: boolean;
  isPromo: boolean;
  discountPrice?: number;
  coverColor: string;
  coverPattern: 'minimal' | 'lines' | 'circle' | 'wave' | 'floral';
  reviews: Review[];
  coverImages: string[]; // Mock cover design styles or relative paths
}

export interface CartItem {
  bookId: string;
  quantity: number;
  selected: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'peer' | 'system';
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  contactName: string;
  contactRole: string;
  lastMessage: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface OrderItem {
  bookId: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'ordered' | 'shipping' | 'delivered';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export type UserRole = 'standard' | 'admin';

export interface User {
  fullName: string;
  email: string;
  role: UserRole;
  isLoggedIn: boolean;
}
