
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  km: number;
  color: string;
  description: string;
  images: string[];
  featured: boolean;
  status: 'available' | 'sold' | 'exchanged' | 'deleted';
  createdAt: string;
  updatedAt: string;
}

export interface CarFilters {
  brand?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  minKm?: number;
  maxKm?: number;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
}

export interface Transaction {
  id: string;
  carId: string;
  type: 'sale' | 'exchange';
  amount: number;
  date: string;
  notes?: string;
}

export interface AuthUser {
  email: string;
  isAuthenticated: boolean;
}
