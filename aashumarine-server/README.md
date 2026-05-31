# Aashumarine Marine Equipment Backend API

Production-ready REST API for the Aashumarine marine equipment website built with Node.js, Express, and MySQL.

## Features

- ✅ Complete REST API with authentication
- ✅ JWT-based authentication and authorization
- ✅ Product management with filtering and search
- ✅ Testimonial management with approval system
- ✅ Contact form and quote request handling
- ✅ Newsletter subscription management
- ✅ Role-based access control (admin/super_admin)
- ✅ Input validation and sanitization
- ✅ Error handling and logging
- ✅ Database migrations and seeding
- ✅ CORS support

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** MySQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Environment Variables:** dotenv

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Update `.env` file with your database credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=aashumarine
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRES_IN=24h
   NODE_ENV=development
   CORS_ORIGIN=*
   ```

3. **Generate admin password hash:**
   ```bash
   node src/utils/generateHash.js admin123
   ```
   Copy the generated hash and update `src/database/seed/sql/001_users.sql`

4. **Setup database:**
   ```bash
   # Run migrations and seeds
   npm run reset
   
   # Or run separately:
   npm run migrate  # Create tables
   npm run seed     # Insert sample data
   ```

## Running the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new admin (super_admin only)
- `GET /api/auth/profile` - Get current user profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Products
- `GET /api/products` - Get all products (with filtering & pagination)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/manufacturers` - Get all manufacturers
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Testimonials
- `GET /api/testimonials` - Get testimonials (public: approved only)
- `GET /api/testimonials/:id` - Get single testimonial
- `POST /api/testimonials` - Create testimonial (public/admin)
- `PUT /api/testimonials/:id` - Update testimonial (admin only)
- `PUT /api/testimonials/:id/approve` - Approve testimonial (admin only)
- `DELETE /api/testimonials/:id` - Delete testimonial (admin only)

### Contact Leads
- `GET /api/leads` - Get all leads (admin only)
- `GET /api/leads/stats` - Get lead statistics (admin only)
- `GET /api/leads/:id` - Get single lead (admin only)
- `POST /api/leads` - Submit contact form (public)
- `PUT /api/leads/:id/status` - Update lead status (admin only)
- `DELETE /api/leads/:id` - Delete lead (admin only)

### Quote Requests
- `GET /api/quotes` - Get all quotes (admin only)
- `GET /api/quotes/stats` - Get quote statistics (admin only)
- `GET /api/quotes/:id` - Get single quote (admin only)
- `POST /api/quotes` - Submit quote request (public)
- `PUT /api/quotes/:id/status` - Update quote status (admin only)
- `DELETE /api/quotes/:id` - Delete quote (admin only)

### Newsletter
- `GET /api/newsletter` - Get all subscribers (admin only)
- `GET /api/newsletter/stats` - Get subscriber statistics (admin only)
- `POST /api/newsletter/subscribe` - Subscribe to newsletter (public)
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter (public)
- `DELETE /api/newsletter/:id` - Delete subscriber (admin only)

## Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Login Example

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aashumarine.com",
    "password": "admin123"
  }'
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@aashumarine.com",
    "role": "super_admin"
  }
}
```

## Database Schema

### Tables
- `users` - Admin users with authentication
- `products` - Marine equipment products
- `testimonials` - Customer testimonials
- `contact_leads` - Contact form submissions
- `quote_requests` - Quote request submissions
- `newsletter_subscribers` - Newsletter subscriptions

## Project Structure

```
aashumarine-server/
├── src/
│   ├── controllers/        # Business logic
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── testimonial.controller.js
│   │   ├── lead.controller.js
│   │   ├── quote.controller.js
│   │   └── newsletter.controller.js
│   ├── routes/            # API routes
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   ├── testimonial.routes.js
│   │   ├── lead.routes.js
│   │   ├── quote.routes.js
│   │   └── newsletter.routes.js
│   ├── middleware/        # Custom middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/            # Utility functions
│   │   ├── jwt.js
│   │   ├── validation.js
│   │   └── generateHash.js
│   └── database/         # Database setup
│       ├── db.js
│       ├── migration/
│       │   ├── run.js
│       │   └── sql/      # Migration files
│       ├── seed/
│       │   ├── run.js
│       │   └── sql/      # Seed files
│       └── reset.js
├── server.js             # Entry point
├── package.json
├── .env
└── README.md
```

## Security Best Practices

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with expiration
- ✅ Input validation and sanitization
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS configuration
- ✅ Role-based access control
- ✅ Environment variable protection

## Error Handling

The API uses consistent error responses:

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

## Development

**Reset database:**
```bash
npm run reset
```

**Run migrations only:**
```bash
npm run migrate
```

**Run seeds only:**
```bash
npm run seed
```

**Generate password hash:**
```bash
node src/utils/generateHash.js <your-password>
```

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Use environment-specific database credentials
5. Enable HTTPS
6. Set up proper logging
7. Configure rate limiting (recommended)
8. Set up database backups

## License

ISC

## Support

For issues or questions, contact: admin@aashumarine.com
