// import { connectDB, disconnectDB } from './config';
// import { Product } from './models/Product';
// import { Order } from './models/Order';
// import { OrderItem } from './models/OrderItem';

// // Product operations
// export const getProducts = async () => {
//   await connectDB();
//   const products = await Product.find().sort({ createdAt: -1 });
//   return products;
// };

// export const getProductById = async (id: string) => {
//   await connectDB();
//   const product = await Product.findById(id);
//   return product;
// };

// export const createProduct = async (productData: any) => {
//   await connectDB();
//   const product = new Product(productData);
//   await product.save();
//   return product;
// };

// export const updateProduct = async (id: string, productData: any) => {
//   await connectDB();
//   try {
//     const product = await Product.findByIdAndUpdate(
//       id,
//       { $set: productData },
//       { new: true }
//     );
//     return !!product;
//   } catch (error) {
//     console.error('Error updating product:', error);
//     return false;
//   }
// };

// export const deleteProduct = async (id: string) => {
//   await connectDB();
//   try {
//     const result = await Product.findByIdAndDelete(id);
//     return !!result;
//   } catch (error) {
//     console.error('Error deleting product:', error);
//     return false;
//   }
// };

// // Order operations
// export const getOrders = async () => {
//   await connectDB();
//   const orders = await Order.find().populate('items');
//   return orders;
// };

// export const getOrderById = async (id: string) => {
//   await connectDB();
//   const order = await Order.findById(id).populate('items');
//   return order;
// };

// export const createOrder = async (orderData: any) => {
//   await connectDB();
//   const order = new Order(orderData);
//   await order.save();
//   return order;
// };

// // OrderItem operations
// export const createOrderItem = async (orderItemData: any) => {
//   await connectDB();
//   const orderItem = new OrderItem(orderItemData);
//   await orderItem.save();
  
//   // Update the order with the new order item
//   await Order.findByIdAndUpdate(
//     orderItemData.order,
//     { $push: { items: orderItem._id } }
//   );
  
//   return orderItem;
// };

// export const getOrderItems = async (orderId: string) => {
//   await connectDB();
//   const orderItems = await OrderItem.find({ order: orderId }).populate('product');
//   return orderItems;
// }; 