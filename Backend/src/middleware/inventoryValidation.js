import { check } from "express-validator";

export const validateInventory = [
  check("name", "Name is required").not().isEmpty(),
  check("description", "Description is required").not().isEmpty(),
  check("category", "Category is required").not().isEmpty(),
  check("price", "Price must be a positive number").isFloat({ gt: 0 }),
  check("image", "Main image is required").not().isEmpty(),
  check("brand", "Brand is required").not().isEmpty(),
  check("dimensions_cm", "Dimensions (cm) are required").not().isEmpty(),
  check("dimensions_inches", "Dimensions (inches) are required").not().isEmpty(),
  check("primary_material", "Primary material is required").not().isEmpty(),
  check("warranty", "Warranty is required").not().isEmpty(),
  check("product_rating", "Product rating must be between 0 and 5").optional().isFloat({ min: 0, max: 5 }),
  check("set_price", "Set price must be a number").optional().isFloat({ gt: 0 }),
];
