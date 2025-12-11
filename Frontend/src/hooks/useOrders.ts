import { useState, useEffect } from 'react';
import { orderService } from '@/services/orderService';
import { DatabaseOrder, OrderItem } from '@/types/product';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@clerk/clerk-react';

export const useOrders = (enabled: boolean = true) => {
  const [orders, setOrders] = useState<(DatabaseOrder & { items: OrderItem[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { getToken, isLoaded } = useAuth();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      if (!isLoaded) return; // Wait for Clerk to load
      const token = await getToken();
      if (!token) return; // Wait for token
      const data = await orderService.getAllOrders(getToken);
      setOrders(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error fetching orders",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled && isLoaded) {
      fetchOrders();
    }
  }, [enabled, isLoaded]);

  const updateOrderStatus = async (orderId: string, status: 'new' | 'dispatched' | 'completed') => {
    try {
      await orderService.updateOrderStatus(orderId, status, getToken);
      toast({
        title: "Success",
        description: `Order status updated to ${status}`,
      });
      await fetchOrders();
      return true;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
      return false;
    }
  };

  const createOrder = async (orderData: {
    customer_name: string;
    email: string;
    phone: string;
    address: string;
    pincode: string;
    total_amount: number;
    payment_method: 'cod' | 'gateway';
    payment_status: 'pending' | 'paid' | 'failed' | 'unverified';
    items: Array<{
      product_id: string;
      quantity: number;
      price: number;
      selected_set: boolean;
    }>;
    delivery_instructions?: string;
    payment_reference_id?: string | null;
    razorpay_order_id?: string | null;
    user_id?: string;
    ip_address: string;
    payment_error_message?: string | null;
  }) => {
    try {
      const order = await orderService.createOrder(orderData, getToken);
      toast({
        title: "Success",
        description: "Order created successfully",
      });
      await fetchOrders();
      return order;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
      return null;
    }
  };

  const getOrdersByStatus = (status: 'new' | 'dispatched' | 'completed') => {
    return orders.filter(order => order.status === status);
  };

  return {
    orders,
    loading,
    fetchOrders,
    updateOrderStatus,
    createOrder,
    getOrdersByStatus
  };
};
