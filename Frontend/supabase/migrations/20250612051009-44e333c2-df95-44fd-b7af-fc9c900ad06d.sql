
-- Add support for multiple images in products table
ALTER TABLE products ADD COLUMN images text[] DEFAULT '{}';

-- Update existing products to move single image to images array
UPDATE products SET images = ARRAY[image] WHERE image IS NOT NULL AND images = '{}';

-- Keep the single image column for backward compatibility
-- ALTER TABLE products DROP COLUMN image; -- Uncomment this line if you want to remove the single image column
