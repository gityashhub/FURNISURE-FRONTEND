
-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  set_price DECIMAL(10,2),
  image TEXT NOT NULL,
  brand TEXT NOT NULL,
  assembly TEXT NOT NULL,
  dimensions_cm TEXT NOT NULL,
  dimensions_inches TEXT NOT NULL,
  primary_material TEXT NOT NULL,
  product_rating DECIMAL(2,1) NOT NULL DEFAULT 0,
  recommended_mattress_size TEXT,
  room_type TEXT NOT NULL,
  seating_height INTEGER,
  storage TEXT NOT NULL,
  warranty TEXT NOT NULL,
  weight TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  has_set_option BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  pincode TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'dispatched', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  selected_set BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (making tables public for now)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you can restrict these later)
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Orders are manageable by everyone" ON public.orders FOR ALL USING (true);
CREATE POLICY "Order items are manageable by everyone" ON public.order_items FOR ALL USING (true);

-- Insert sample products
INSERT INTO public.products (
  name, price, set_price, image, brand, assembly, dimensions_cm, dimensions_inches,
  primary_material, product_rating, recommended_mattress_size, room_type,
  seating_height, storage, warranty, weight, category, description, has_set_option
) VALUES 
(
  'Premium Double Bed with Storage',
  45000,
  NULL,
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
  'Crystal Furnitech',
  'Carpenter Assembly',
  'H 104 x W 191 x D 221',
  'H 41 x W 75 x D 87',
  'Engineered Wood',
  4.8,
  '78 L x 72 W Inch',
  'Bedroom',
  NULL,
  'Yes - Under bed storage',
  '36 Months Warranty',
  '105 KG',
  'beds',
  'Elegant double bed with ample under-bed storage space, perfect for modern bedrooms.',
  false
),
(
  'Executive Office Chair',
  18500,
  65000,
  'https://images.unsplash.com/photo-1549497538-303791108f95?auto=format&fit=crop&w=800&q=80',
  'ErgoMax',
  'Self Assembly',
  'H 120 x W 65 x D 65',
  'H 47 x W 26 x D 26',
  'Premium Leather',
  4.9,
  NULL,
  'Office',
  18,
  'No Storage',
  '24 Months Warranty',
  '25 KG',
  'chairs',
  'Luxurious executive chair with premium leather upholstery and ergonomic design.',
  true
),
(
  'Modern 3-Seater Sofa',
  55000,
  NULL,
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
  'ComfortPlus',
  'Professional Assembly',
  'H 85 x W 210 x D 95',
  'H 33 x W 83 x D 37',
  'Fabric & Solid Wood',
  4.7,
  NULL,
  'Living Room',
  17,
  'No Storage',
  '18 Months Warranty',
  '85 KG',
  'sofas',
  'Contemporary 3-seater sofa with high-quality fabric and solid wood frame.',
  false
);
