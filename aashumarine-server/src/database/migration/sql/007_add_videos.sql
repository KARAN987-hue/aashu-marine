-- Migration to add videos column to products table
-- Adds JSON column to store array of video file paths

-- Add videos column for storing multiple video paths
ALTER TABLE products 
ADD COLUMN videos JSON NULL AFTER thumbnails;

-- Set empty array for all existing products
UPDATE products 
SET videos = JSON_ARRAY() 
WHERE videos IS NULL;

-- Note: The videos column stores an array of video file paths in JSON format
-- Example: ["uploads/products/videos/video1.mp4", "uploads/products/videos/video2.mp4"]
