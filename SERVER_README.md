# MediHub Backend API

Complete Node.js/Express backend implementing the class diagram with MongoDB.

## Architecture

### Models (Database Schema)
- **User** - Base user model with authentication
- **Customer** - Customer profile with addresses, orders, cart
- **Vendor** - Vendor profile with store info, products
- **Administrator** - Admin profile with permissions
- **Product** - Product catalog with vendor association
- **Inventory** - Stock management per product
- **Order** - Order processing with items and status tracking
- **Payment** - Payment processing and refunds
- **Prescription** - Prescription management and verification
- **Notification** - User notifications system
- **SalesReport** - Vendor sales analytics

### Controllers (Business Logic)
Each model has a dedicated controller implementing:
- CRUD operations
- Business rules and validations
- Role-based authorization
- Automated notifications
- Inventory management
- Payment processing

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (customer, vendor, administrator)
- Password hashing with bcrypt
- Protected routes with middleware

## Setup Instructions

### 1. Install MongoDB
```bash
# macOS
brew install mongodb-community

# Ubuntu
sudo apt install mongodb

# Windows - Download from mongodb.com
```

### 2. Environment Configuration
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

### 3. Start MongoDB
```bash
# macOS/Linux
mongod --config /usr/local/etc/mongod.conf

# Or using systemctl
sudo systemctl start mongodb
```

### 4. Development
The backend runs as serverless functions on Vercel. For local development:
```bash
npm install
npm run dev
```

### 5. Production Deployment
Deploy to Vercel:
- Add MONGODB_URI environment variable in Vercel dashboard
- Add JWT_SECRET environment variable
- Deploy using: `vercel --prod`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user (customer/vendor/admin)
- `POST /login` - User login
- `GET /profile` - Get user profile (authenticated)
- `PUT /profile` - Update profile (authenticated)
- `POST /logout` - Logout

### Products (`/api/products`)
- `GET /` - List all products (with filters)
- `GET /:id` - Get product details
- `POST /` - Create product (vendor only)
- `PUT /:id` - Update product (vendor only)
- `DELETE /:id` - Delete product (vendor only)
- `GET /vendor/:vendorId` - Get vendor products

### Orders (`/api/orders`)
- `POST /` - Create order (customer only)
- `GET /` - List orders (role-based)
- `GET /:id` - Get order details
- `PUT /:id/status` - Update order status (vendor only)
- `POST /:id/cancel` - Cancel order

### Inventory (`/api/inventory`)
- `GET /` - Get vendor inventory (vendor only)
- `GET /low-stock` - Get low stock items (vendor only)
- `PUT /:productId` - Update stock (vendor only)

### Prescriptions (`/api/prescriptions`)
- `POST /` - Upload prescription (customer only)
- `GET /` - List prescriptions (role-based)
- `GET /:id` - Get prescription details
- `POST /:id/verify` - Verify prescription (admin only)

### Payments (`/api/payments`)
- `GET /` - List payments (role-based)
- `GET /:id` - Get payment details
- `POST /:id/refund` - Refund payment (admin only)

### Notifications (`/api/notifications`)
- `GET /` - Get user notifications
- `PUT /:id/read` - Mark as read
- `DELETE /:id` - Delete notification

### Sales Reports (`/api/sales-reports`)
- `POST /generate` - Generate report (vendor only)
- `GET /` - List reports (vendor only)
- `GET /:id` - Get report details (vendor only)

### Admin (`/api/admin`)
- `GET /users` - List all users
- `PUT /users/:id/status` - Update user status
- `GET /vendors/pending` - Get pending vendor verifications
- `PUT /vendors/:id/verify` - Verify vendor
- `GET /dashboard` - Get admin dashboard stats

## Key Features Implemented

### User Management
- Multi-role authentication (customer, vendor, administrator)
- Profile management per role
- Account activation/deactivation

### Product Management
- Vendor product catalog
- Inventory tracking with low-stock alerts
- Batch and expiry date management
- Prescription requirement flags

### Order Processing
- Multi-item orders
- Automatic inventory deduction
- Order status workflow (placed → processing → shipped → completed)
- Order cancellation with inventory restoration

### Payment System
- Multiple payment methods
- Automatic payment processing
- Refund capabilities
- Transaction tracking

### Prescription System
- Customer prescription uploads
- Admin verification workflow
- Prescription validity tracking
- Medication tracking

### Notifications
- Real-time notifications for order updates
- Low stock alerts for vendors
- Prescription verification alerts
- Priority-based notifications

### Sales Analytics
- Daily/Weekly/Monthly/Yearly reports
- Product-wise sales tracking
- Revenue and tax calculations
- Vendor performance metrics

## Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation
- Protected API endpoints
- Secure payment processing

## Database Indexes
Optimized queries with indexes on:
- User email (unique)
- Vendor license number (unique)
- Product vendor and category
- Order customer and vendor with date
- Inventory vendor
- Notifications user and read status

## Error Handling
- Comprehensive error messages
- HTTP status codes
- Try-catch blocks in all controllers
- Validation error responses

## Notes
- Set strong JWT_SECRET in production
- Use MongoDB Atlas for production database
- Enable MongoDB authentication in production
- Implement rate limiting for API endpoints
- Add request logging for monitoring
- Set up backup strategies for database
