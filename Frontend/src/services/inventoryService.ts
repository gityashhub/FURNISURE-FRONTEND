import api from './api';
import { Product } from '@/types/product';
import { authApiRequest } from './api';

export interface CreateProductDTO {
  name: string;
  category: string;
  price: number;
  image: string;
  images?: string[];
  brand: string;
  assembly: string;
  dimensions_cm: string;
  dimensions_inches: string;
  primary_material: string;
  product_rating: number;
  recommended_mattress_size?: string;
  room_type: string;
  seating_height?: number;
  storage: string;
  warranty: string;
  weight: string;
  description: string;
  has_set_option?: boolean;
  set_price?: number;
}

export const inventoryService = {
  // Fetch all products
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get('/products');
    // Map _id to id for frontend
    return response.data.map((product: any) => ({ ...product, id: product._id }));
  },

  // Create a new product
  createProduct: async (product: CreateProductDTO, getToken: () => Promise<string | null>): Promise<Product> => {
    // Map id to _id for backend if present
    const payload = { ...product };
    if ((payload as any).id) {
      (payload as any)._id = (payload as any).id;
      delete (payload as any).id;
    }
    const response = await authApiRequest('post', '/products', getToken, payload);
    // Map _id to id for frontend
    return { ...response.data, id: response.data._id };
  },

  // Update a product
  updateProduct: async (id: string, product: Partial<CreateProductDTO>, getToken: () => Promise<string | null>): Promise<Product> => {
    // Map id to _id for backend if present
    const payload = { ...product };
    if ((payload as any).id) {
      (payload as any)._id = (payload as any).id;
      delete (payload as any).id;
    }
    const response = await authApiRequest('put', `/products/${id}`, getToken, payload);
    // Map _id to id for frontend
    return { ...response.data, id: response.data._id };
  },

  // Delete a product
  deleteProduct: async (id: string, getToken: () => Promise<string | null>): Promise<{ message: string }> => {
    // Do not send a body for DELETE requests
    const response = await authApiRequest('delete', `/products/${id}`, getToken);
    // The backend returns a message in the response
    return response.data;
  },

  // Search products
  searchProducts: async (searchTerm: string): Promise<Product[]> => {
    const response = await api.get(`/products/search?q=${searchTerm}`);
    // Map _id to id for frontend
    return response.data.map((product: any) => ({ ...product, id: product._id }));
  },

  // Fetch a single product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return { ...response.data, id: response.data._id };
  }
}; 