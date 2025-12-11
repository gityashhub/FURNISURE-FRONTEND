# FurniSURE - Furniture Store

## Overview
A full-stack furniture e-commerce application with a React frontend and Express.js backend.

## Project Architecture

### Frontend (Port 5000)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Clerk
- **State Management**: React Context + TanStack Query
- **Location**: `/Frontend`

### Backend (Port 3000)
- **Framework**: Express.js
- **Database**: MongoDB (external - MongoDB Atlas)
- **Authentication**: Clerk (JWT verification)
- **File Uploads**: Multer
- **Location**: `/Backend`

## Environment Variables Required

### Secrets (configured in Replit Secrets)
- `MONGODB_URI` - MongoDB Atlas connection string
- `CLERK_SECRET_KEY` - Clerk backend secret key
- `VITE_CLERK_PUBLISHABLE_KEY` - Clerk frontend publishable key

### Optional (for payments)
- `RAZORPAY_KEY_ID` - Razorpay API key
- `RAZORPAY_SECRET` - Razorpay secret

### Development Environment Variables
- `VITE_BACKENDURL` - Backend API URL (set to `http://localhost:3000/api`)
- `PORT` - Backend port (defaults to 3000)

## Running the Application

The application runs two workflows:
1. **Frontend**: `cd Frontend && npm run dev` (port 5000)
2. **Backend**: `cd Backend && npm start` (port 3000)

## Key Features
- Product browsing and search
- User authentication via Clerk
- Shopping cart functionality
- Admin dashboard for inventory management
- Contact form
- Payment integration (Razorpay - optional)

## API Routes
- `/api/auth` - Authentication routes
- `/api/products` - Product/inventory management
- `/api/orders` - Order management (protected)
- `/api/payment` - Payment processing (protected)
- `/api/contact` - Contact form submissions
- `/api/upload` - File uploads
