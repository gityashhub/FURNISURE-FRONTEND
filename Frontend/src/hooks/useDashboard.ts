import { useState, useEffect } from 'react';
import { useOrders } from './useOrders';
import { useProducts } from './useProducts';
import { fetchAllCustomers } from '@/services/customerService';
import { dashboardService, DashboardStats, RecentOrder, LowStockItem } from '@/services/dashboardService';
import { DatabaseOrder, OrderItem } from '@/types/product';
import { useAuth } from '@clerk/clerk-react';

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  lowStockItems: LowStockItem[];
  loading: boolean;
  error: string | null;
}

export const useDashboard = (): DashboardData => {
  const { orders, loading: ordersLoading } = useOrders();
  const { products, loading: productsLoading } = useProducts();
  const [customers, setCustomers] = useState<any[]>([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useApiData, setUseApiData] = useState(false);
  const { getToken } = useAuth();
  const [apiData, setApiData] = useState<Omit<DashboardData, 'loading' | 'error'> | null>(null);

  // Status mapping between backend and UI
  const statusMap: Record<string, string> = {
    new: "Processing",
    dispatched: "Shipped",
    completed: "Delivered",
    cancelled: "Cancelled"
  };

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setCustomersLoading(true);
        setError(null);
        // Wait for Clerk to load and get token
        const token = await getToken();

        console.log('==================================== token in use dashborad');
        console.log(token);
        console.log('====================================');
        if (!token) return; // Wait for token
        const data = await fetchAllCustomers(getToken);

        console.log('========= data in dashborusssssss===========================');
        console.log(data);
        console.log('====================================');
        setCustomers(data || []);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Failed to fetfsfewfefech customers');
        setCustomers([]);
      } finally {
        setCustomersLoading(false);
      }
    };

    fetchCustomers();
  }, [getToken]);

  // Try to fetch dashboard data from API first, fallback to calculated data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {

        const token = await getToken();
        if (!token) return; // Wait for token
        const data = await dashboardService.getDashboardData(getToken);
        setApiData({
          stats: data.stats,
          recentOrders: data.recentOrders,
          lowStockItems: data.lowStockItems
        });
        if (data.stats.totalInventory > 0 || data.stats.totalOrders > 0) {
          setUseApiData(true);
        }
      } catch (error) {
        console.log('Dashboard API not available, using calculated data');
        setUseApiData(false);
      }
    };

    fetchDashboardData();
  }, [getToken]);

  // Calculate dashboard statistics from existing data
  const calculateStats = (): DashboardStats => {
    const totalInventory = products.length;
    const pendingOrders = orders.filter(order => order.status === 'new').length;
    const totalCustomers = customers.length;
    const totalOrders = orders.length;
    const completedOrders = orders.filter(order => order.status === 'completed').length;
    
    // Calculate monthly revenue (orders from last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const monthlyRevenue = orders
      .filter(order => new Date(order.created_at) >= thirtyDaysAgo)
      .reduce((sum, order) => sum + order.total_amount, 0);

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 
      ? orders.reduce((sum, order) => sum + order.total_amount, 0) / totalOrders 
      : 0;

    // Calculate growth percentages (simplified - would need historical data for accurate calculation)
    const revenueGrowth = 12; // Placeholder
    const orderGrowth = 5; // Placeholder
    const customerGrowth = 18; // Placeholder

    return {
      totalInventory,
      pendingOrders,
      totalCustomers,
      monthlyRevenue,
      totalOrders,
      completedOrders,
      averageOrderValue,
      revenueGrowth,
      orderGrowth,
      customerGrowth
    };
  };

  // Get recent orders from existing data
  const getRecentOrders = (): RecentOrder[] => {
    return orders
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 4)
      .map(order => ({
        id: order.id,
        customer: order.customer_name,
        product: (order.items || []).map(item => item.product?.name || 'Unknown Product').join(', '),
        status: statusMap[order.status] || 'Processing',
        amount: `$${order.total_amount.toLocaleString()}`,
        date: new Date(order.created_at).toLocaleDateString()
      }));
  };

  // Get low stock items from existing data
  const getLowStockItems = (): LowStockItem[] => {
    return products
      .filter(product => {
        // For now, we'll use a simple threshold check
        // In a real implementation, you'd have stock levels in your product data
        const stock = (product as any).stock || 0;
        const threshold = (product as any).stock_threshold || 10;
        return stock < threshold;
      })
      .slice(0, 3)
      .map(product => ({
        name: product.name,
        stock: (product as any).stock || 0,
        threshold: (product as any).stock_threshold || 10
      }));
  };

  const loading = ordersLoading || productsLoading || customersLoading;

  if (useApiData && apiData) {
    return {
      ...apiData,
      loading,
      error
    };
  }

  return {
    stats: calculateStats(),
    recentOrders: getRecentOrders(),
    lowStockItems: getLowStockItems(),
    loading,
    error
  };
}; 