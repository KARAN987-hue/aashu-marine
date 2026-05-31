# API Testing Guide

Complete guide for testing all Aashumarine API endpoints.

## Setup

1. Start the server: `npm run dev`
2. Server runs on: `http://localhost:5000`
3. Default admin credentials:
   - Email: `admin@aashumarine.com`
   - Password: `admin123`

## Authentication Flow

### 1. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@aashumarine.com",
    "password": "admin123"
  }'
```

**Response:**
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

**Save the token for authenticated requests!**

### 2. Get Profile (Protected)

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 3. Change Password

```bash
curl -X PUT http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "admin123",
    "newPassword": "newpassword123"
  }'
```

## Products API

### Get All Products (Public)

```bash
# Basic request
curl http://localhost:5000/api/products

# With pagination
curl "http://localhost:5000/api/products?page=1&limit=5"

# Filter by category
curl "http://localhost:5000/api/products?category=Engines"

# Search products
curl "http://localhost:5000/api/products?search=diesel"

# Multiple filters
curl "http://localhost:5000/api/products?category=Hydraulics&condition=Refurbished&page=1&limit=10"
```

### Get Single Product

```bash
curl http://localhost:5000/api/products/1
```

### Get Categories

```bash
curl http://localhost:5000/api/products/categories
```

### Get Manufacturers

```bash
curl http://localhost:5000/api/products/manufacturers
```

### Create Product (Admin Only)

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Test Marine Engine",
    "category": "Engines",
    "product_type": "Auxiliary Engine",
    "manufacturer": "Test Manufacturer",
    "condition": "New",
    "model": "TEST-001",
    "short_description": "Test engine for API testing",
    "main_description": "This is a detailed description of the test engine.",
    "search_keyword": "test, engine, marine",
    "owner": "Aashumarine Test Division",
    "is_active": true
  }'
```

### Update Product (Admin Only)

```bash
curl -X PUT http://localhost:5000/api/products/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "product_name": "Updated Product Name",
    "short_description": "Updated description"
  }'
```

### Delete Product (Admin Only)

```bash
curl -X DELETE http://localhost:5000/api/products/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Testimonials API

### Get All Testimonials (Public - Approved Only)

```bash
curl http://localhost:5000/api/testimonials
```

### Get All Testimonials (Admin - Including Unapproved)

```bash
curl http://localhost:5000/api/testimonials \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get only unapproved
curl "http://localhost:5000/api/testimonials?is_approved=false" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Testimonial (Public)

```bash
curl -X POST http://localhost:5000/api/testimonials \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "company": "Test Shipping Co.",
    "text": "Great service and quality products!",
    "rating": 5
  }'
```

### Approve Testimonial (Admin Only)

```bash
curl -X PUT http://localhost:5000/api/testimonials/1/approve \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Testimonial (Admin Only)

```bash
curl -X PUT http://localhost:5000/api/testimonials/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Updated testimonial text",
    "rating": 4
  }'
```

### Delete Testimonial (Admin Only)

```bash
curl -X DELETE http://localhost:5000/api/testimonials/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Contact Leads API

### Submit Contact Form (Public)

```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "message": "I am interested in your marine equipment.",
    "source": "Contact Page"
  }'
```

### Get All Leads (Admin Only)

```bash
# All leads
curl http://localhost:5000/api/leads \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by status
curl "http://localhost:5000/api/leads?status=new" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# With pagination
curl "http://localhost:5000/api/leads?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Lead Statistics (Admin Only)

```bash
curl http://localhost:5000/api/leads/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Lead Status (Admin Only)

```bash
curl -X PUT http://localhost:5000/api/leads/1/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "contacted"
  }'
```

**Valid statuses:** `new`, `contacted`, `converted`, `closed`

### Delete Lead (Admin Only)

```bash
curl -X DELETE http://localhost:5000/api/leads/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Quote Requests API

### Submit Quote Request (Public)

```bash
curl -X POST http://localhost:5000/api/quotes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Johnson",
    "email": "bob@example.com",
    "phone": "+1234567890",
    "message": "Please provide a quote for the diesel engine",
    "product_id": 1,
    "product_name": "Marine Diesel Engine MAN B&W 6S50MC",
    "source": "Product Page"
  }'
```

### Get All Quotes (Admin Only)

```bash
# All quotes
curl http://localhost:5000/api/quotes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by status
curl "http://localhost:5000/api/quotes?status=new" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Filter by product
curl "http://localhost:5000/api/quotes?product_id=1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Quote Statistics (Admin Only)

```bash
curl http://localhost:5000/api/quotes/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Update Quote Status (Admin Only)

```bash
curl -X PUT http://localhost:5000/api/quotes/1/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "quoted"
  }'
```

**Valid statuses:** `new`, `quoted`, `converted`, `closed`

### Delete Quote (Admin Only)

```bash
curl -X DELETE http://localhost:5000/api/quotes/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Newsletter API

### Subscribe (Public)

```bash
curl -X POST http://localhost:5000/api/newsletter/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "subscriber@example.com"
  }'
```

### Unsubscribe (Public)

```bash
curl -X POST http://localhost:5000/api/newsletter/unsubscribe \
  -H "Content-Type: application/json" \
  -d '{
    "email": "subscriber@example.com"
  }'
```

### Get All Subscribers (Admin Only)

```bash
# All subscribers
curl http://localhost:5000/api/newsletter \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Only active
curl "http://localhost:5000/api/newsletter?is_active=true" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Subscriber Statistics (Admin Only)

```bash
curl http://localhost:5000/api/newsletter/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Delete Subscriber (Admin Only)

```bash
curl -X DELETE http://localhost:5000/api/newsletter/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Testing with Postman

1. Import the following as environment variables:
   - `BASE_URL`: `http://localhost:5000`
   - `TOKEN`: (set after login)

2. Create a login request and save the token to environment:
   ```javascript
   // In Postman Tests tab
   pm.environment.set("TOKEN", pm.response.json().token);
   ```

3. Use `{{BASE_URL}}` and `{{TOKEN}}` in your requests

## Common Response Codes

- `200 OK` - Success
- `201 Created` - Resource created successfully
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate entry
- `500 Internal Server Error` - Server error

## Error Response Format

```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Tips

1. Always include `Content-Type: application/json` header for POST/PUT requests
2. Save your JWT token after login for authenticated requests
3. Tokens expire after 24 hours (configurable in .env)
4. Use pagination for large datasets
5. Public endpoints don't require authentication
6. Admin endpoints require valid JWT token with admin/super_admin role
