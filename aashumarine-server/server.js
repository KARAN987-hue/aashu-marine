import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './src/database/db.js';

// TEMP: Create admin user
app.get('/create-admin', async (req, res) => {
  const bcrypt = await import('bcryptjs');
  const hash = await bcrypt.default.hash('admin123', 10);
  const [result] = await db.query(
    'DELETE FROM users WHERE email = ?', 
    ['admin@aashumarine.com']
  );
  await db.query(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    ['admin', 'admin@aashumarine.com', hash, 'super_admin']
  );
  res.json({ message: 'Admin created!', hash });
});

// Import routes
import authRoutes from './src/routes/auth.routes.js';
import productRoutes from './src/routes/product.routes.js';
import testimonialRoutes from './src/routes/testimonial.routes.js';
import leadRoutes from './src/routes/lead.routes.js';
import quoteRoutes from './src/routes/quote.routes.js';
import newsletterRoutes from './src/routes/newsletter.routes.js';

// Import middleware
import { errorHandler, notFoundHandler } from './src/middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for uploads with caching and CORS
app.use('/uploads', cors(), express.static('uploads', {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Health check route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Aashumarine API Server 🚢', 
    version: '1.0.0',
    status: 'running'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/newsletter', newsletterRoutes);

// 404 handler
app.use(notFoundHandler);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Database: ${process.env.DB_NAME}`);
});
