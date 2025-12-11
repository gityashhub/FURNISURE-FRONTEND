import { useState, useEffect } from "react";
import { Search, Eye, Package, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatabaseOrder, OrderItem } from '@/types/product';
import { orderService } from '@/services/orderService';
import { useAuth } from '@clerk/clerk-react';

// Status mapping between backend and UI
const statusMap: Record<string, string> = {
  new: "New",
  processing: "Processing",
  dispatched: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled"
};
const reverseStatusMap: Record<string, string> = {
  New: "new",
  Processing: "processing",
  Shipped: "dispatched",
  Delivered: "delivered",
  Cancelled: "cancelled"
};

export function OrderManager() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<(DatabaseOrder & { items: OrderItem[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded } = useAuth();

  // Fetch orders
  useEffect(() => {
    if (isLoaded) fetchOrders();
  }, [isLoaded]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      if (!isLoaded) return;
      const data = await orderService.getAllOrders(getToken);

      // console.log('====================================');
      // console.log(data);
      // console.log('====================================');
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // Map backend order to UI order (CLEANED, only valid fields)
  const mapOrder = (order: DatabaseOrder & { items: OrderItem[] }) => ({
    id: order.id,
    customer_name: order.customer_name,
    email: order.email,
    phone: order.phone,
    products: (order.items ?? []).map(item => ({
      id: item.id,
      name: item.product?.name || 'Unknown Product',
      quantity: item.quantity,
      price: item.price,
      selected_set: !!item.selected_set,
      productDetails: item.product
        ? {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            brand: item.product.brand,
            category: item.product.category,
            description: item.product.description,
          }
        : null,
    })),
    total_amount: order.total_amount,
    payment_method: order.payment_method,
    payment_status: order.payment_status,
    payment_reference_id: (order as any).payment_reference_id || '',
    status: statusMap[order.status] || 'Processing',
    created_at: order.created_at,
    address: order.address,
    pincode: order.pincode,
  });
  

  const mappedOrders = orders.map(mapOrder);

  // console.log('====================================');
  // console.log(mappedOrders);
  // console.log('====================================');

  const filteredOrders = mappedOrders.filter(order => {
    const matchesSearch =
      (order.id ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer_name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.email ?? "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedOrder = filteredOrders.find(o => o.id === selectedOrderId) || null;

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const backendStatus = reverseStatusMap[newStatus] || 'new';
      await orderService.updateOrderStatus(orderId, backendStatus, getToken);
      // Refresh orders after status update
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-green-100 text-gray-800 border-gray-200";
      case "Processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "Failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "Refunded":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "New":
        return <Package className="w-4 h-4" />;
      case "Processing":
        return <Clock className="w-4 h-4" />;
      case "Shipped":
        return <Truck className="w-4 h-4" />;
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Paid":
        return <CheckCircle className="w-4 h-4" />;
      case "Failed":
        return <XCircle className="w-4 h-4" />;
      case "Refunded":
        return <Truck className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500">Track and manage customer orders</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders by ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="overflow-x-auto">
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading orders...</div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">{order.customer_name}</p>
                        <p className="text-gray-500">{order.email}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Order Date</p>
                        <p className="text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Total Amount</p>
                        <p className="text-xl font-bold text-gray-900">₹{order.total_amount}</p>
                        <p className="text-sm text-gray-700 mt-1">Payment: <span className="font-semibold">{order.payment_method?.toUpperCase()}</span></p>
                        <p className="text-sm text-gray-700">Status: <span className="font-semibold">{order.payment_status?.charAt(0).toUpperCase() + order.payment_status?.slice(1)}</span></p>
                      </div>
                    </div>
                    <div className="mt-4 text-sm">
                      <p className="font-medium text-gray-700">Products:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {order.products.map((product, index) => (
                          <span key={index} className="bg-gray-100 px-2 py-1 rounded text-gray-700">
                            {product.name} (×{product.quantity})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrderId(order.id)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
                        </DialogHeader>
                        {selectedOrder && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Customer Information</h4>
                                <p className="text-sm"><strong>Name:</strong> {selectedOrder.customer_name}</p>
                                <p className="text-sm"><strong>Email:</strong> {selectedOrder.email}</p>
                                <p className="text-sm"><strong>Phone:</strong> {selectedOrder.phone}</p>
                                <p className="text-sm"><strong>Order Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                                <p className="text-sm"><strong>Payment Method:</strong> {selectedOrder.payment_method?.toUpperCase()}</p>
                                <p className="text-sm"><strong>Payment Status:</strong> {selectedOrder.payment_status?.charAt(0).toUpperCase() + selectedOrder.payment_status?.slice(1)}</p>
                                {selectedOrder.payment_reference_id && (
                                  <p className="text-sm"><strong>Payment Ref. ID:</strong> {selectedOrder.payment_reference_id}</p>
                                )}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                                <p className="text-sm">{selectedOrder.address}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Order Items</h4>
                              <div className="space-y-2">
                                {selectedOrder.products.map((product, index) => (
                                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <div>
                                      <p className="font-medium">{product.name}</p>
                                      <p className="text-sm text-gray-500">Quantity: {product.quantity}</p>
                                    </div>
                                    <p className="font-semibold">₹{product.price * product.quantity}</p>
                                  </div>
                                ))}
                                <div className="border-t pt-2 mt-2">
                                  <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total:</span>
                                    <span>₹{selectedOrder.total_amount}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Select
                      value={order.status}
                      onValueChange={(value: string) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {(!loading && filteredOrders.length === 0) && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">Try adjusting your search criteria.</p>
          </CardContent>
        </Card>
      )}
      </div>
    </div>
  );
}
