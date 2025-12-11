import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  set_price: { type: Number },
  image: { type: String, required: true },
  images: [{ type: String }],
  brand: { type: String, required: true },
  dimensions_cm: { type: String, required: true },
  dimensions_inches: { type: String, required: true },
  primary_material: { type: String, required: true },
  product_rating: { type: Number, default: 0 },
  warranty: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
}, {
  timestamps: true
});

export const Product = mongoose.model('Product', inventorySchema);
