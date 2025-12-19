# WebID Admin Portal

A comprehensive, production-ready admin dashboard for managing the CaterBid platform. Built with React, TypeScript, Tailwind CSS, and Vite.

## Features

### 🔐 Authentication & Authorization
- Secure admin login and registration
- JWT token-based authentication
- Role-based access control (SUPER_ADMIN, ADMIN, MODERATOR)
- Protected routes with automatic redirects

### 📊 Dashboard
- Real-time statistics overview
- Total users, vendors, orders, bids, menu items, and payments
- Revenue tracking and analytics
- Order completion rates
- Active vendor metrics

### 👥 User Management
- View all registered users
- User profile details
- Address management
- Search and filter functionality
- Delete user accounts

### 🏪 Vendor Management
- Complete vendor directory
- Business profile viewing
- License document verification
- Online/Offline status toggle
- Vendor activation/deactivation
- Search by business name or contact

### 📦 Order Management
- View all customer orders
- Order status tracking (Pending, Confirmed, In Progress, Completed, Cancelled)
- Update order status
- View order details and menu items
- Event information tracking
- Search and filter by status

### 💬 Bid Management
- Monitor vendor bids
- Bid status tracking
- Proposed pricing information
- View bid details and messages
- Search and filter functionality

### 🍽️ Menu Items Management
- Browse all vendor menu items
- View item details with images
- Category and sub-category filtering
- Ingredient and spice level information
- Availability status
- Search by name or category

### 💳 Payment Management
- Track all payment transactions
- Stripe integration details
- Payment status monitoring
- Revenue calculations
- Customer and vendor payment history
- Search by transaction ID

### 🛡️ Admin Management
- View all admin accounts
- Role-based permissions
- Admin activity tracking
- Last login information

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **Recharts** - Data visualization

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DataTable.tsx   # Generic table component
│   ├── Layout.tsx      # Main layout wrapper
│   ├── Modal.tsx       # Modal dialog component
│   ├── Navbar.tsx      # Top navigation bar
│   ├── ProtectedRoute.tsx # Route guard
│   ├── Sidebar.tsx     # Side navigation
│   └── StatCard.tsx    # Statistics card
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── pages/              # Page components
│   ├── Admins.tsx      # Admin management
│   ├── Bids.tsx        # Bid management
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Login.tsx       # Login page
│   ├── MenuItems.tsx   # Menu items management
│   ├── Orders.tsx      # Order management
│   ├── Payments.tsx    # Payment management
│   ├── Register.tsx    # Registration page
│   ├── Users.tsx       # User management
│   └── Vendors.tsx     # Vendor management
├── services/           # API services
│   └── api.ts          # API client and endpoints
├── types/              # TypeScript types
│   └── index.ts        # Type definitions
├── App.tsx             # Main app component
└── main.tsx            # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Java Spring Boot backend API running

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd webid-admin
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and set your API base URL:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The application connects to a Spring Boot backend API. Ensure the following endpoints are available:

### Admin Authentication
- POST `/api/admin/register` - Register new admin
- POST `/api/admin/login` - Admin login
- GET `/api/admin/{id}` - Get admin by ID
- GET `/api/admin` - Get all admins

### Dashboard
- GET `/api/admin/dashboard/stats` - Get dashboard statistics

### User Management
- GET `/api/admin/users` - Get all users
- GET `/api/admin/users/{id}` - Get user by ID
- DELETE `/api/admin/users/{id}` - Delete user

### Vendor Management
- GET `/api/admin/vendors` - Get all vendors
- GET `/api/admin/vendors/{id}` - Get vendor by ID
- PUT `/api/admin/vendors/{id}/status` - Update vendor status
- DELETE `/api/admin/vendors/{id}` - Delete vendor

### Order Management
- GET `/api/admin/orders` - Get all orders
- GET `/api/admin/orders/{id}` - Get order by ID
- PUT `/api/admin/orders/{id}/status` - Update order status
- DELETE `/api/admin/orders/{id}` - Delete order

### Bid Management
- GET `/api/admin/bids` - Get all bids
- GET `/api/admin/bids/{id}` - Get bid by ID
- DELETE `/api/admin/bids/{id}` - Delete bid

### Menu Items Management
- GET `/api/admin/menu-items` - Get all menu items
- GET `/api/admin/menu-items/{id}` - Get menu item by ID
- DELETE `/api/admin/menu-items/{id}` - Delete menu item

### Payment Management
- GET `/api/admin/payments` - Get all payments
- GET `/api/admin/payments/{id}` - Get payment by ID

## Authentication Flow

1. Admin logs in with username and password
2. Backend returns JWT token and admin details
3. Token stored in localStorage
4. Token sent in Authorization header for all API requests
5. Automatic logout on 401 Unauthorized responses

## Deployment

### Build for Production

```bash
npm run build
```

The optimized build will be created in the `dist` folder.

### Deployment Options

1. **Static Hosting** (Vercel, Netlify, GitHub Pages)
   - Deploy the `dist` folder
   - Configure environment variables in hosting platform

2. **Docker**
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build
   EXPOSE 5173
   CMD ["npm", "run", "preview"]
   ```

3. **Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/webid-admin/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## Security Considerations

- JWT tokens stored in localStorage
- Automatic token refresh on API calls
- Protected routes with authentication checks
- CORS configured on backend
- Input validation on all forms
- XSS protection through React's built-in escaping

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2025 WebID Admin. All rights reserved.
