import api, { authApiRequest } from './api';

export interface DashboardStats {
  totalInventory: number;
  pendingOrders: number;
  totalCustomers: number;
  monthlyRevenue: number;
  totalOrders: number;
  completedOrders: number;
  averageOrderValue: number;
  revenueGrowth: number;
  orderGrowth: number;
  customerGrowth: number;
}

export interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  status: string;
  amount: string;
  date: string;
}

export interface LowStockItem {
  name: string;
  stock: number;
  threshold: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentOrders: RecentOrder[];
  lowStockItems: LowStockItem[];
}

export const dashboardService = {
  // Fetch dashboard statistics
  getDashboardStats: async (getToken: () => Promise<string>): Promise<DashboardStats> => {
    try {
      const response = await authApiRequest('get', '/admin/dashboard/stats', getToken);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Return default stats if API fails
      return {
        totalInventory: 0,
        pendingOrders: 0,
        totalCustomers: 0,
        monthlyRevenue: 0,
        totalOrders: 0,
        completedOrders: 0,
        averageOrderValue: 0,
        revenueGrowth: 0,
        orderGrowth: 0,
        customerGrowth: 0
      };
    }
  },

  // Fetch recent orders
  getRecentOrders: async (getToken: () => Promise<string>, limit: number = 4): Promise<RecentOrder[]> => {
    try {
      const response = await authApiRequest('get', `/admin/dashboard/recent-orders?limit=${limit}`, getToken);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent orders:', error);
      return [];
    }
  },

  // Fetch low stock items
  getLowStockItems: async (getToken: () => Promise<string>, limit: number = 3): Promise<LowStockItem[]> => {
    try {
      const response = await authApiRequest('get', `/admin/dashboard/low-sffewewwfewewfeftock?limit=${limit}`, getToken);
      return response.data;
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      return [];
    }
  },

  // Fetch complete dashboard data
  getDashboardData: async (getToken: () => Promise<string>): Promise<DashboardData> => {
    try {
      const [stats, recentOrders, lowStockItems] = await Promise.all([
        dashboardService.getDashboardStats(getToken),
        dashboardService.getRecentOrders(getToken),
        dashboardService.getLowStockItems(getToken)
      ]);

      return {
        stats,
        recentOrders,
        lowStockItems
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      return {
        stats: {
          totalInventory: 0,
          pendingOrders: 0,
          totalCustomers: 0,
          monthlyRevenue: 0,
          totalOrders: 0,
          completedOrders: 0,
          averageOrderValue: 0,
          revenueGrowth: 0,
          orderGrowth: 0,
          customerGrowth: 0
        },
        recentOrders: [],
        lowStockItems: []
      };
    }
  },

  // Fetch revenue analytics
  getRevenueAnalytics: async (getToken: () => Promise<string>, period: 'week' | 'month' | 'year' = 'month') => {
    try {
      const response = await authApiRequest('get', `/admin/dashboard/revenue?period=${period}`, getToken);
      return response.data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      return [];
    }
  },

  // Fetch order analytics
  getOrderAnalytics: async (getToken: () => Promise<string>, period: 'week' | 'month' | 'year' = 'month') => {
    try {
      const response = await authApiRequest('get', `/admin/dashboard/orders?period=${period}`, getToken);
      return response.data;
    } catch (error) {
      console.error('Error fetching order analytics:', error);
      return [];
    }
  },

  // Fetch top selling products
  getTopSellingProducts: async (getToken: () => Promise<string>, limit: number = 5) => {
    try {
      const response = await authApiRequest('get', `/admin/dashboard/top-products?limit=${limit}`, getToken);
      return response.data;
    } catch (error) {
      console.error('Error fetching top selling products:', error);
      return [];
    }
  }
}; 