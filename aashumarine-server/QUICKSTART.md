# Quick Start Guide

Get the Aashumarine backend up and running in 5 minutes!

## Prerequisites

- Node.js installed
- MySQL installed and running
- Terminal/Command Prompt

## Step 1: Install Dependencies

```bash
npm install
```

This will install:
- express
- mysql2
- dotenv
- bcryptjs
- jsonwebtoken
- cors
- nodemon (dev)

## Step 2: Configure Database

1. Open `.env` file
2. Update your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=aashumarine
```

## Step 3: Generate Admin Password

```bash
node src/utils/generateHash.js admin123
```

Copy the generated hash and update `src/database/seed/sql/001_users.sql`:

```sql
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@aashumarine.com', 'PASTE_YOUR_HASH_HERE', 'super_admin');
```

## Step 4: Setup Database

```bash
npm run reset
```

This will:
- Drop existing database (if any)
- Create fresh database
- Run all migrations (create tables)
- Run all seeds (insert sample data)

You should see:
```
✅ Success: 001_users.sql
✅ Success: 002_products.sql
✅ Success: 003_testimonials.sql
✅ Success: 004_contact_leads.sql
✅ Success: 005_quote_requests.sql
✅ Success: 006_newsletter_subscribers.sql
🎉 All migrations executed successfully!
🌱 Seeding completed!
```

## Step 5: Start the Server

```bash
npm run dev
```

You should see:
```
✅ Server running on http://localhost:5000
📝 Environment: development
🔗 Database: aashumarine
```

## Step 6: Test the API

### Test Health Check

```bash
curl http://localhost:5000
```

Expected response:
```json
{
  "message": "Aashumarine API Server 🚢",
  "version": "1.0.0",
  "status": "running"
}
```

### Test Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@aashumarine.com","password":"admin123"}'
```

Expected response:
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

### Test Get Products

```bash
curl http://localhost:5000/api/products
```

You should see 6 sample products!

## Step 7: Explore the API

Check out these files for more details:
- `README.md` - Complete documentation
- `API_TESTING.md` - All API endpoints with examples

## Common Issues

### Issue: "Cannot connect to database"
**Solution:** Check your MySQL credentials in `.env` and ensure MySQL is running

### Issue: "ER_BAD_DB_ERROR: Unknown database"
**Solution:** Run `npm run reset` to create the database

### Issue: "Authentication failed"
**Solution:** Make sure you updated the password hash in `001_users.sql`

### Issue: "Port 5000 already in use"
**Solution:** Change `PORT` in `.env` to another port (e.g., 5001)

## Next Steps

1. ✅ Test all API endpoints (see `API_TESTING.md`)
2. ✅ Integrate with your frontend
3. ✅ Customize the seed data
4. ✅ Add more products
5. ✅ Configure CORS for your frontend URL
6. ✅ Deploy to production

## Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper `CORS_ORIGIN`
- [ ] Use strong database password
- [ ] Enable HTTPS
- [ ] Set up database backups
- [ ] Configure logging
- [ ] Add rate limiting

## Support

Need help? Check:
- `README.md` for detailed documentation
- `API_TESTING.md` for API examples
- GitHub issues (if applicable)

Happy coding! 🚢
