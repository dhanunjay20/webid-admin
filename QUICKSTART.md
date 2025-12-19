# WebID Admin Portal - Quick Start Guide

## 🚀 Project Overview

This is a **production-ready admin dashboard** for the CaterBid platform with complete CRUD operations for all entities.

## ✅ What Has Been Built

### Core Features Implemented:
1. ✅ **Authentication System**
   - Login page with JWT authentication
   - Registration page for new admins
   - Protected routes with auto-redirect
   - Persistent sessions with localStorage

2. ✅ **Dashboard**
   - Real-time statistics (users, vendors, orders, bids, menu items, payments)
   - Revenue tracking
   - Order completion metrics
   - Active vendor count

3. ✅ **User Management**
   - List all users with search functionality
   - View user details (addresses, Stripe info)
   - Delete users
   - Responsive data tables

4. ✅ **Vendor Management**
   - Browse all vendors
   - View business details & documents
   - Toggle online/offline status
   - Activate/deactivate vendors
   - Delete vendors

5. ✅ **Order Management**
   - View all orders with filtering
   - Update order status (Pending, Confirmed, In Progress, Completed, Cancelled)
   - View order details & menu items
   - Search by event/customer/vendor
   - Delete orders

6. ✅ **Bid Management**
   - Monitor all vendor bids
   - View bid details & messages
   - Filter by status
   - Delete bids

7. ✅ **Menu Items Management**
   - Browse vendor menus with images
   - View ingredients & spice levels
   - Filter by category
   - Delete items

8. ✅ **Payment Management**
   - Track all transactions
   - View Stripe details
   - Revenue calculations
   - Payment status monitoring

9. ✅ **Admin Management**
   - View all admin accounts
   - Role-based display (SUPER_ADMIN, ADMIN, MODERATOR)
   - Activity tracking

### UI/UX Features:
- ✅ Modern, responsive design with Tailwind CSS
- ✅ Clean sidebar navigation
- ✅ Search & filter functionality on all pages
- ✅ Modal dialogs for detailed views
- ✅ Loading states & error handling
- ✅ Status badges with color coding
- ✅ Professional data tables
- ✅ Mobile-friendly layout

## 🛠️ Tech Stack

```
Frontend: React 18 + TypeScript + Vite
Styling: Tailwind CSS
Routing: React Router v6
HTTP: Axios
Icons: Lucide React
Charts: Recharts
```

## 📦 Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### 3. Start Development Server
```bash
npm run dev
```

Application will run at: **http://localhost:5173**

### 4. Build for Production
```bash
npm run build
```

## 🔌 API Requirements

Your Spring Boot backend must be running with these endpoints:

### Authentication
- `POST /api/admin/register` - Register admin
- `POST /api/admin/login` - Login admin

### Dashboard
- `GET /api/admin/dashboard/stats` - Get statistics

### User Management
- `GET /api/admin/users` - List users
- `GET /api/admin/users/{id}` - Get user details
- `DELETE /api/admin/users/{id}` - Delete user

### Vendor Management
- `GET /api/admin/vendors` - List vendors
- `GET /api/admin/vendors/{id}` - Get vendor details
- `PUT /api/admin/vendors/{id}/status?isActive=true` - Update status
- `DELETE /api/admin/vendors/{id}` - Delete vendor

### Order Management
- `GET /api/admin/orders` - List orders
- `GET /api/admin/orders/{id}` - Get order details
- `PUT /api/admin/orders/{id}/status?status=COMPLETED` - Update status
- `DELETE /api/admin/orders/{id}` - Delete order

### Bid Management
- `GET /api/admin/bids` - List bids
- `GET /api/admin/bids/{id}` - Get bid details
- `DELETE /api/admin/bids/{id}` - Delete bid

### Menu Items Management
- `GET /api/admin/menu-items` - List menu items
- `GET /api/admin/menu-items/{id}` - Get item details
- `DELETE /api/admin/menu-items/{id}` - Delete item

### Payment Management
- `GET /api/admin/payments` - List payments
- `GET /api/admin/payments/{id}` - Get payment details

### Admin Management
- `GET /api/admin` - List admins
- `GET /api/admin/{id}` - Get admin details

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── DataTable.tsx    # Generic data table
│   ├── Layout.tsx       # Main layout wrapper
│   ├── Modal.tsx        # Modal component
│   ├── Navbar.tsx       # Top navigation
│   ├── ProtectedRoute.tsx # Route guard
│   ├── Sidebar.tsx      # Side navigation
│   └── StatCard.tsx     # Statistics card
│
├── contexts/            # React contexts
│   └── AuthContext.tsx  # Authentication state
│
├── pages/               # Page components
│   ├── Dashboard.tsx    # Main dashboard
│   ├── Users.tsx        # User management
│   ├── Vendors.tsx      # Vendor management
│   ├── Orders.tsx       # Order management
│   ├── Bids.tsx         # Bid management
│   ├── MenuItems.tsx    # Menu items
│   ├── Payments.tsx     # Payment tracking
│   ├── Admins.tsx       # Admin management
│   ├── Login.tsx        # Login page
│   └── Register.tsx     # Registration
│
├── services/            # API services
│   └── api.ts          # Axios configuration & API calls
│
├── types/               # TypeScript types
│   └── index.ts        # Type definitions
│
├── App.tsx              # Main app with routing
└── main.tsx             # Entry point
```

## 🔐 Authentication Flow

1. User visits `/login`
2. Submits credentials (username/password)
3. Backend returns JWT token + admin details
4. Token stored in `localStorage`
5. All subsequent API calls include token in `Authorization` header
6. On 401 error, auto-logout and redirect to login

## 🎨 Key Features by Page

### Dashboard
- 8 statistic cards showing platform metrics
- Order status breakdown (pending vs completed)
- Revenue tracking
- Completion rate calculation

### All Management Pages
- Search functionality
- Filter by status/category
- Responsive data tables
- Modal popups for details
- Delete confirmations
- Loading states

### Orders Page (Special Features)
- Status update buttons (5 states)
- Menu items breakdown
- Guest count & event details
- Price calculations

### Vendors Page (Special Features)
- Online/Offline toggle
- License document viewing
- Business information display
- Years in business tracking

### Payments Page (Special Features)
- Stripe integration details
- Revenue totals
- Payment status tracking
- Transaction history

## 🚦 How to Use

1. **Start Backend API** (Spring Boot on port 8080)
2. **Start Frontend** (`npm run dev`)
3. **Register Admin** at `/register`
4. **Login** at `/login`
5. **Navigate** using sidebar menu
6. **Manage** all platform entities

## 📊 Sample Admin Credentials
After registration, use your created credentials. Default roles:
- `SUPER_ADMIN` - Full access
- `ADMIN` - Management access
- `MODERATOR` - View & moderate

## 🔧 Customization

### Change API URL
Edit `.env`:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Change Colors
Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: { ... }
    }
  }
}
```

### Add New Pages
1. Create page in `src/pages/`
2. Add route in `App.tsx`
3. Add nav item in `Sidebar.tsx`

## 🐛 Troubleshooting

### CORS Errors
Configure backend to allow frontend origin:
```java
@CrossOrigin(origins = "http://localhost:5173")
```

### 401 Unauthorized
- Check if backend is running
- Verify token in localStorage
- Check token expiration

### No Data Showing
- Verify API endpoints are working
- Check browser console for errors
- Ensure backend has data

## 📈 Production Deployment

### Build
```bash
npm run build
```

### Deploy Options
- **Vercel**: Connect GitHub repo, auto-deploy
- **Netlify**: Drag & drop `dist` folder
- **AWS S3**: Upload `dist` to S3 bucket
- **Docker**: Use provided Dockerfile

### Environment Variables
Set `VITE_API_BASE_URL` in your hosting platform's environment settings.

## ✨ What Makes This Production-Ready

1. ✅ **TypeScript** - Type safety throughout
2. ✅ **Error Handling** - Try-catch on all API calls
3. ✅ **Loading States** - Spinners while fetching data
4. ✅ **Authentication** - JWT with auto-logout
5. ✅ **Responsive Design** - Works on all devices
6. ✅ **Search & Filter** - Easy data navigation
7. ✅ **Modular Code** - Reusable components
8. ✅ **Clean Architecture** - Organized file structure
9. ✅ **Modern UI** - Professional Tailwind design
10. ✅ **Security** - Protected routes, XSS protection

## 🎯 Next Steps (Optional Enhancements)

- [ ] Add data export (CSV/PDF)
- [ ] Implement pagination for large datasets
- [ ] Add charts for analytics
- [ ] Create email notification system
- [ ] Add admin permission management
- [ ] Implement audit logging
- [ ] Add bulk operations
- [ ] Create advanced filtering

## 📞 Support

For questions or issues:
- Check `DOCUMENTATION.md` for detailed API docs
- Review error messages in browser console
- Ensure backend API is running and accessible

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

© 2025 WebID Admin Portal
