import React, { createContext, useContext, ReactNode } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useUser } from '@clerk/clerk-react';

interface OrderContextType {
  orders: any[];
  addOrder: (order: any) => void;
  updateOrderStatus: (orderId: string, status: any) => void;
  getOrdersByStatus: (status: any) => any[];
  loading: boolean;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const orderHook = useOrders(!!user);

  // Wrapper to maintain compatibility
  const contextValue = {
    orders: orderHook.orders,
    addOrder: (orderData: any) => orderHook.createOrder(orderData),
    updateOrderStatus: orderHook.updateOrderStatus,
    getOrdersByStatus: orderHook.getOrdersByStatus,
    loading: orderHook.loading,
  };

  return (
    <OrderContext.Provider value={contextValue}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrdersContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrdersContext must be used within an OrderProvider');
  }
  return context;
};

// Export the hook as the main interface
export { useOrders };
