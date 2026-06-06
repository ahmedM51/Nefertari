export type UserRole = 'user' | 'admin';
export type MonumentCategory = 'historical' | 'religious' | 'natural';
export type ProductCategory = 'statues' | 'papyrus' | 'accessories' | 'handicrafts';
export type BookingStatus = 'pending' | 'confirmed' | 'rejected';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  role: UserRole;
  created_at: string;
}

export interface Monument {
  id: string;
  name: string;
  description: string;
  image_urls: string[];
  location_coords?: string;
  governorate: string;
  category: MonumentCategory;
  opening_hours: string;
  ticket_prices: {
    foreign: number;
    local: number;
  };
  created_at?: string;
}

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export interface Tour {
  id: string;
  monument_id?: string | null;
  title: string;
  description: string;
  duration_days: number;
  price: number;
  city: string;
  image_urls: string[];
  itinerary: ItineraryItem[];
  slots_available: number;
  created_at?: string;
  monument?: Monument;
}

export interface Booking {
  id: string;
  user_id: string;
  tour_id: string;
  number_of_people: number;
  tour_date: string;
  contact_info: {
    email: string;
    alt_phone?: string;
  };
  status: BookingStatus;
  created_at: string;
  tour?: Tour;
  user?: Profile;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: ProductCategory;
  image_urls: string[];
  rating: number;
  stock: number;
  created_at?: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  quantity: number;
  price_at_purchase: number;
}

export interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  phone: string;
  shipping_address: string;
  total_price: number;
  status: OrderStatus;
  created_at: string;
  items: OrderItem[];
  user?: Profile;
}

export interface DashboardStats {
  total_users: number;
  total_bookings: number;
  total_orders: number;
  total_revenue: number;
}
