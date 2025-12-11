import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/hooks/useDashboard";

export function Dashboard() {
  const { stats, recentOrders, lowStockItems, loading, error } = useDashboard();

  const statsData = [
    {
      title: "Total Inventory",
      value: stats.totalInventory.toString(),
      change: `+${stats.revenueGrowth}%`,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders.toString(),
      change: `+${stats.orderGrowth}%`,
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers.toString(),
      change: `+${stats.customerGrowth}%`,
      icon: Users,
      color: "bg-purple-500",
    },
    {
      title: "Monthly Revenue",
      value: `₹${stats.monthlyRevenue.toLocaleString()}`,
      change: `+${stats.revenueGrowth}%`,
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Loading dashboard data...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-0 shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 font-medium">Error loading dashboard data</p>
              <p className="text-red-500 text-sm mt-1">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Welcome back! Here's your business overview.
        </p>
      </div>

      {/* Scrollable Stats */}
      <div className="overflow-x-auto">
        <div className="flex gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-4 min-w-max sm:min-w-full">
          {statsData.map((stat, index) => (
            <Card
              key={index}
              className="min-w-[250px] border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change} from last month</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-2"
                  >
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-gray-600">{order.customer}</p>
                      <p className="text-gray-500">{order.product}</p>
                      <p className="text-xs text-gray-400">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{order.amount}</p>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No orders found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold">Low Stock Alert</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200 gap-2"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">Threshold: {item.threshold} units</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-red-600">{item.stock}</p>
                      <p className="text-xs text-red-500">units left</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>All products are well stocked</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
