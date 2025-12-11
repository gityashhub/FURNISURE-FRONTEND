import { useState, useEffect } from "react";
import { AdminSidebar } from "@/components/adminComponents/AdminSidebar";
import { Dashboard } from "@/components/adminComponents/Dashboard";
import { InventoryManager } from "@/components/adminComponents/InventoryManager";
import { OrderManager } from "@/components/adminComponents/OrderManager";
import { CustomerManager } from "@/components/adminComponents/CustomerManager";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Menu, Package } from "lucide-react";

const AdminPanel = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "inventory":
        return <InventoryManager />;
      case "orders":
        return <OrderManager />;
      case "customers":
        return <CustomerManager />;
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: "Dashboard",
      inventory: "Inventory",
      orders: "Orders",
      customers: "Customers"
    };
    return titles[activeView] || "Dashboard";
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50">
        <AdminSidebar 
          activeView={activeView} 
          setActiveView={setActiveView}
        />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Header */}
          <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <SidebarTrigger />
                <h1 className="text-lg font-semibold text-gray-900">
                  {getPageTitle()}
                </h1>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {renderActiveView()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminPanel;