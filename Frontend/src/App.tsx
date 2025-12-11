import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { OrderProvider } from "@/contexts/OrderContext";

import Layout from "@/components/Layout";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import BrowseProducts from "./pages/BrowseProducts";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import AdminPanel from "./pages/admin/AdminPanel";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Header from './pages/header';
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      
        <CartProvider>
          <OrderProvider>
            <Toaster />
            <Sonner />
            {/* <Header /> */}
            <BrowserRouter>
              <Routes>
                <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminPanel />
                    </AdminProtectedRoute>
                  }
                />
                <Route path="/auth" element={<Auth />} />
                {/* <Route path="/auth" element={<Header />} /> */}
                <Route element={<Layout />}>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/products" element={<BrowseProducts />} />
                  <Route path="/browse" element={<BrowseProducts />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </OrderProvider>
        </CartProvider>
      
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
