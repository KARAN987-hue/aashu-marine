-- Seed default admin user
-- Default password: admin123 (hashed with bcrypt)
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@aashumarine.com', '$2a$10$kVDSDPePi2RbpxypqCEZ7.aiTT8JDA7ocSd4GFiKSn6jahf8U1312', 'super_admin');

-- Note: The password hash above is a placeholder. 
-- For production, generate a real bcrypt hash using: bcrypt.hash('admin123', 10)
-- You can also create the first admin user via the API after deployment
