// import mongoose from 'mongoose';

// const orderItemSchema = new mongoose.Schema({
//   order: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Order',
//     required: true
//   },
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     default: 1
//   },
//   price: {
//     type: Number,
//     required: true
//   },
//   selected_set: {
//     type: Boolean,
//     default: false
//   }
// }, {
//   timestamps: true
// });

// export const OrderItem = mongoose.model('OrderItem', orderItemSchema); 