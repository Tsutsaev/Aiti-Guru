export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  sku: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
}

export interface LoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

export interface AddProductFormValues {
  title: string;
  price: number;
  brand: string;
  sku: string;
}

export type SortOrder = 'asc' | 'desc';

export interface SortState {
  field: keyof Product | null;
  order: SortOrder;
}