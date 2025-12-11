import { Home, Package, ShoppingCart, Users, Settings, X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface AdminSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const menuItems = [
  {
    title: "Dashboard",
    id: "dashboard",
    icon: Home,
  },
  {
    title: "Inventory",
    id: "inventory",
    icon: Package,
  },
  {
    title: "Orders",
    id: "orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    id: "customers",
    icon: Users,
  },
  // {
  //   title: "Settings",
  //   id: "settings",
  //   icon: Settings,
  // },
];

export function AdminSidebar({ 
  activeView, 
  setActiveView
}: AdminSidebarProps) {
  
  const handleMenuItemClick = (viewId: string) => {
    setActiveView(viewId);
  };

  const handleBackToHome = () => {
    // You can replace this with your router navigation logic
    window.location.href = '/';
  };

  return (
    <Sidebar className="w-64 bg-white border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Furnisure Admin</h2>
              <p className="text-sm text-gray-500">Management Panel</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex-1 overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleMenuItemClick(item.id)}
                    isActive={activeView === item.id}
                    className={`w-full justify-start transition-colors rounded-lg px-3 py-2 text-sm font-medium ${
                      activeView === item.id
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <div className="p-6 mt-auto border-t border-gray-200">
        <button
          onClick={handleBackToHome}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors w-full text-white font-medium justify-center text-sm"
          title="Back to Home"
        >
          <Home className="w-5 h-5" />
          <span>Back to Home</span>
        </button>
      </div>
    </Sidebar>
  );
}