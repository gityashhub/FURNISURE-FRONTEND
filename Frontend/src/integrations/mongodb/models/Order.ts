// import mongoose from 'mongoose';

// const orderSchema = new mongoose.Schema({
//   customer_name: { type: String, required: true },
//   email: { type: String, required: true },
//   phone: { type: String, required: true },
//   address: { type: String, required: true },
//   pincode: { type: String, required: true },
//   total_amount: { type: Number, required: true },
//   status: { 
//     type: String, 
//     enum: ['new', 'dispatched', 'completed'],
//     default: 'new'
//   },
//   items: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'OrderItem'
//   }]
// }, {
//   timestamps: true
// });

// export const Order = mongoose.model('Order', orderSchema); 