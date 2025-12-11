import { Product } from "../models/Inventory.js";

// Get all inventory
export const getInventory = async (req, res) => {
  try {
    const inventory = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res
      .status(500)
      .json({ message: "Error fetching inventory", error: error.message });
  }
};

// Get inventory by ID
export const getInventoryById = async (req, res) => {
  try {
    const inventory = await Product.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    res
      .status(500)
      .json({ message: "Error fetching inventory", error: error.message });
  }
};

// Create new inventory
export const createInventory = async (req, res) => {
  try {
    // Only accept fields defined in the new product schema
    const {
      name,
      price,
      set_price,
      image,
      images,
      brand,
      dimensions_cm,
      dimensions_inches,
      primary_material,
      product_rating,
      warranty,
      category,
      description,
    } = req.body;

    const requiredFields = [
      "name",
      "price",
      "image",
      "brand",
      "dimensions_cm",
      "dimensions_inches",
      "primary_material",
      "warranty",
      "category",
      "description",
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
      });
    }

    // Validate numeric fields
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    if (product_rating && (isNaN(product_rating) || product_rating < 0 || product_rating > 5)) {
      return res.status(400).json({ message: "Product rating must be between 0 and 5" });
    }

    const inventory = new Product({
      name,
      price,
      set_price,
      image,
      images,
      brand,
      dimensions_cm,
      dimensions_inches,
      primary_material,
      product_rating,
      warranty,
      category,
      description,
    });
    await inventory.save();
    res.status(201).json(inventory);
  } catch (error) {
    console.error("Error creating inventory:", error);
    res
      .status(500)
      .json({ message: "Error creating inventory", error: error.message });
  }
};

// Update inventory
export const updateInventory = async (req, res) => {
  try {
    const inventory = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    res.status(200).json(inventory);
  } catch (error) {
    console.error("Error updating inventory:", error);
    res
      .status(500)
      .json({ message: "Error updating inventory", error: error.message });
  }
};

// Delete inventory
export const deleteInventory = async (req, res) => {
  try {
    const id = req.params.id;

    // console.log('===============req id=====================');
    // console.log(id ," ++++++ ", req.params.id);
    // console.log('====================================');
    const inventory = await Product.findByIdAndDelete(id);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    res.status(200).json({ message: "Inventory deleted successfully" });
  } catch (error) {
    console.error("Error deleting inventory:", error);
    res
      .status(500)
      .json({ message: "Error deleting inventory", error: error.message });
  }
};
