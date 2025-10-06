// User types
export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
  HOTEL_MANAGER: 'hotel_manager',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Hotel types
export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  rating: number;
  amenities?: string[];
  images?: string[];
  isActive: boolean;
  policies?: string;
  checkInTime?: string;
  checkOutTime?: string;
  createdAt: string;
  updatedAt: string;
  rooms?: Room[];
}

// Room types
export const RoomType = {
  SINGLE: 'single',
  DOUBLE: 'double',
  DELUXE: 'deluxe',
  SUITE: 'suite',
  FAMILY: 'family',
} as const;

export type RoomType = typeof RoomType[keyof typeof RoomType];

export const RoomStatus = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  MAINTENANCE: 'maintenance',
  OUT_OF_ORDER: 'out_of_order',
} as const;

export type RoomStatus = typeof RoomStatus[keyof typeof RoomStatus];

export interface Room {
  id: string;
  roomNumber: string;
  type: RoomType;
  description?: string;
  pricePerNight: number;
  capacity: number;
  size: number;
  status: RoomStatus;
  amenities?: string[];
  images?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  hotelId: string;
  hotel: Hotel;
  bookings?: Booking[];
}

// Booking types
export const BookingStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show',
} as const;

export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];

export interface Booking {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalAmount: number;
  status: BookingStatus;
  specialRequests?: string;
  notes?: string;
  cancellationReason?: string;
  cancellationDate?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: User;
  roomId: string;
  room: Room;
  payment?: Payment;
}

// Payment types
export const PaymentStatus = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
} as const;

export type PaymentStatus = typeof PaymentStatus[keyof typeof PaymentStatus];

export const PaymentMethod = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  UPI: 'upi',
  NET_BANKING: 'net_banking',
  WALLET: 'wallet',
} as const;

export type PaymentMethod = typeof PaymentMethod[keyof typeof PaymentMethod];

export interface Payment {
  id: string;
  amount: number;
  status: PaymentStatus;
  method?: PaymentMethod;
  transactionId?: string;
  cashfreeOrderId?: string;
  cashfreePaymentId?: string;
  failureReason?: string;
  refundId?: string;
  refundAmount?: number;
  paymentDate?: string;
  createdAt: string;
  updatedAt: string;
  bookingId: string;
  booking: Booking;
}

// Form types
export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  role?: UserRole;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface HotelForm {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
  email?: string;
  latitude?: number;
  longitude?: number;
  amenities?: string[];
  images?: string[];
  policies?: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface RoomForm {
  roomNumber: string;
  type: RoomType;
  description?: string;
  pricePerNight: number;
  capacity: number;
  size: number;
  amenities?: string[];
  images?: string[];
  hotelId: string;
}

export interface BookingForm {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
}

// Search and filter types
export interface SearchFilters {
  city?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: number;
  minPrice?: number;
  maxPrice?: number;
  roomType?: RoomType;
  amenities?: string[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterForm) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}