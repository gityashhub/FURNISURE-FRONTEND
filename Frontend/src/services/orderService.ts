import api, { authApiRequest } from './api';
import { DatabaseOrder, OrderItem } from '@/types/product';

export const orderService = {
  // Fetch all orders
  getAllOrders: async (getToken: () => Promise<string | null>): Promise<(DatabaseOrder & { items: OrderItem[] })[]> => {
    const response = await authApiRequest('get', '/orders', getToken);
    return response.data;
  },

  // Update order status
  updateOrderStatus: async (orderId: string, status: string, getToken: () => Promise<string | null>): Promise<DatabaseOrder> => {
    const response = await authApiRequest('put', `/orders/${orderId}/status`, getToken, { status });
    return response.data;
  },

  // Get order by ID
  getOrderById: async (orderId: string, getToken: () => Promise<string | null>): Promise<DatabaseOrder & { items: OrderItem[] }> => {
    const response = await authApiRequest('get', `/orders/${orderId}`, getToken);
    return response.data;
  },

  // Create a new order
  createOrder: async (orderData: any, getToken: () => Promise<string | null>): Promise<DatabaseOrder> => {
    const response = await authApiRequest('post', '/orders', getToken, orderData);
    return response.data;
  }
}; 