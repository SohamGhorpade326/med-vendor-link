# MediHub Backend Server

Backend API for MediHub - Multi-Vendor Medicine Marketplace

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Variables
The `.env` file is already configured with your MongoDB URL. If needed, update:
```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
PORT=5000
```

### 3. Seed Database
```bash
npm run seed
```

This will create:
- 1 Vendor account: `vendor@medihub.com` / `Vendor@123`
- 1 Customer account: `customer@medihub.com` / `Customer@123`
- 15 Medicine products with images

### 4. Start Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm run build
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires auth)

### Products (Public)
- `GET /api/products` - List all products with filters
  - Query params: `q`, `brand`, `minPrice`, `maxPrice`, `prescription`, `inStock`, `sort`

### Products (Vendor Only)
- `GET /api/products/vendor` - Get vendor's products
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders (Customer Only)
- `POST /api/orders` - Create order
- `POST /api/orders/:id/pay` - Process payment (80% success simulation)
- `GET /api/orders/my` - Get my orders

## Tech Stack
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Zod for validation

## Business Rules
- Vendors cannot add expired medicines
- Stock decreases only on successful payment
- Low stock alert when quantity < lowStockThreshold
- Payment has 80% success rate (simulation)
