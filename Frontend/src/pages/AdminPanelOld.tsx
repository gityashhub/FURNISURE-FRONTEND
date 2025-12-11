import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOrders } from '@/hooks/useOrders';
import { useToast } from '@/hooks/use-toast';
import { Package, PackageOpen, Check, Settings, Loader2 } from 'lucide-react';
import ProductManagement from '@/components/ProductManagement';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';

const AdminPanelOld = () => {
  const { user } = useUser();
  const { orders, loading, updateOrderStatus, getOrdersByStatus } = useOrders(!!user);
  const { toast } = useToast();

  const newOrders = getOrdersByStatus('new');
  const dispatchedOrders = getOrdersByStatus('dispatched');
  const completedOrders = getOrdersByStatus('completed');

  const handleStatusUpdate = async (orderId: string, newStatus: 'new' | 'dispatched' | 'completed') => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      toast({
        title: "Order status updated",
        description: `Order has been marked as ${newStatus}.`,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="secondary" className="bg-[#bb9a65]/10 text-[#bb9a65] border border-[#bb9a65]/20">New</Badge>;
      case 'dispatched':
        return <Badge variant="default" className="bg-[#bb9a65]/20 text-[#bb9a65] border border-[#bb9a65]/30">Dispatched</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-[#bb9a65]/5 text-[#bb9a65] border border-[#bb9a65]/40">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const OrderCard = ({ order }: { order: any }) => (
    <Card className="mb-4 hover:shadow-lg transition-shadow border-l-4 border-l-[#bb9a65] bg-gradient-to-br from-white to-gray-50">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-domine">Order #{order.id.slice(-8)}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}
            </p>
          </div>
          {getStatusBadge(order.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-[#bb9a65]">Customer:</span>
              <span className="ml-2">{order.customer_name}</span>
            </div>
            <div>
              <span className="font-medium text-[#bb9a65]">Email:</span>
              <span className="ml-2">{order.email}</span>
            </div>
            <div>
              <span className="font-medium text-[#bb9a65]">Phone:</span>
              <span className="ml-2">{order.phone}</span>
            </div>
            <div>
              <span className="font-medium text-[#bb9a65]">Pincode:</span>
              <span className="ml-2">{order.pincode}</span>
            </div>
          </div>
          
          <div>
            <span className="font-medium text-sm text-[#bb9a65]">Address:</span>
            <p className="text-sm text-muted-foreground mt-1">{order.address}</p>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="font-medium text-sm mb-2 text-[#bb9a65]">Items:</h4>
            <div className="space-y-2">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center text-sm bg-[#bb9a65]/5 p-2 rounded">
                  <div className="flex items-center space-x-2">
                    {item.product?.image && (
                      <img
                        src={item.product.image}
                        alt={item.product?.name || 'Product'}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <span>
                      {item.product?.name || 'Unknown Product'} 
                      {item.selected_set && ' (Complete Set)'} x {item.quantity}
                    </span>
                  </div>
                  <span className="font-medium text-[#bb9a65]">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[#bb9a65]/20">
            <div className="text-lg font-semibold text-[#bb9a65]">
              Total: ₹{order.total_amount.toLocaleString()}
            </div>
            <div className="flex space-x-2">
              {order.status === 'new' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(order.id, 'dispatched')}
                  className="bg-[#bb9a65] hover:bg-[#bb9a65]/90 text-white"
                >
                  <Package className="h-4 w-4 mr-1" />
                  Mark as Dispatched
                </Button>
              )}
              {order.status === 'dispatched' && (
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(order.id, 'completed')}
                  className="bg-[#bb9a65] hover:bg-[#bb9a65]/90 text-white"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Mark as Completed
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#bb9a65]" />
            <span className="ml-2 text-[#bb9a65]">Loading admin panel...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[#bb9a65]/5 to-background p-2">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#bb9a65] to-[#bb9a65]/80 py-8 sm:py-12 md:py-16 lg:py-20 mb-8 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-domine text-white mb-2 pt-8"
            >
              Admin Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/90 text-base sm:text-lg md:text-xl max-w-2xl mx-auto"
            >
              Manage your store's orders, products, and track delivery status
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-[#bb9a65] hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#bb9a65]">New Orders</CardTitle>
              <Package className="h-4 w-4 text-[#bb9a65]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#bb9a65]">{newOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                Orders awaiting processing
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#bb9a65] hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#bb9a65]">Dispatched Orders</CardTitle>
              <PackageOpen className="h-4 w-4 text-[#bb9a65]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#bb9a65]">{dispatchedOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                Orders in transit
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#bb9a65] hover:shadow-lg transition-shadow bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#bb9a65]">Completed Orders</CardTitle>
              <Check className="h-4 w-4 text-[#bb9a65]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#bb9a65]">{completedOrders.length}</div>
              <p className="text-xs text-muted-foreground">
                Successfully delivered
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="orders" className="space-y-4">
          <TabsList className="bg-[#bb9a65]/10">
            <TabsTrigger value="orders" className="data-[state=active]:bg-[#bb9a65] data-[state=active]:text-white">
              Order Management
            </TabsTrigger>
            <TabsTrigger value="products" className="data-[state=active]:bg-[#bb9a65] data-[state=active]:text-white">
              <Settings className="h-4 w-4 mr-2" />
              Product Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Tabs defaultValue="new" className="space-y-4">
              <TabsList className="bg-[#bb9a65]/5">
                <TabsTrigger value="new" className="data-[state=active]:bg-[#bb9a65] data-[state=active]:text-white">
                  New Orders ({newOrders.length})
                </TabsTrigger>
                <TabsTrigger value="dispatched" className="data-[state=active]:bg-[#bb9a65] data-[state=active]:text-white">
                  Dispatched ({dispatchedOrders.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-[#bb9a65] data-[state=active]:text-white">
                  Completed ({completedOrders.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="new">
                <div className="space-y-4">
                  {newOrders.length > 0 ? (
                    newOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))
                  ) : (
                    <Card className="bg-gradient-to-br from-white to-gray-50">
                      <CardContent className="p-8 text-center">
                        <Package className="h-12 w-12 mx-auto text-[#bb9a65]/50 mb-4" />
                        <p className="text-muted-foreground">No new orders at the moment.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="dispatched">
                <div className="space-y-4">
                  {dispatchedOrders.length > 0 ? (
                    dispatchedOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))
                  ) : (
                    <Card className="bg-gradient-to-br from-white to-gray-50">
                      <CardContent className="p-8 text-center">
                        <PackageOpen className="h-12 w-12 mx-auto text-[#bb9a65]/50 mb-4" />
                        <p className="text-muted-foreground">No dispatched orders at the moment.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed">
                <div className="space-y-4">
                  {completedOrders.length > 0 ? (
                    completedOrders.map((order) => (
                      <OrderCard key={order.id} order={order} />
                    ))
                  ) : (
                    <Card className="bg-gradient-to-br from-white to-gray-50">
                      <CardContent className="p-8 text-center">
                        <Check className="h-12 w-12 mx-auto text-[#bb9a65]/50 mb-4" />
                        <p className="text-muted-foreground">No completed orders yet.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanelOld;
