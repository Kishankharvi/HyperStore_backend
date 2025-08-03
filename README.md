# Nexus Store 🚀

A cutting-edge, full-stack e-commerce Progressive Web App (PWA) built with the MERN stack. Experience the future of online shopping with advanced authentication, real-time interactions, and offline capabilities.

![Nexus Store](./public/icons/icon-192x192.png)

## 🏗️ System Architecture

### High-Level Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  React App (SPA) + PWA Features                                │
│  ├── Components (Header, ProductCard, etc.)                    │
│  ├── Pages (Home, Cart, Checkout, etc.)                        │
│  ├── Context (Auth, Cart State Management)                     │
│  ├── Service Worker (Offline Caching)                          │
│  └── Web App Manifest (Installation)                           │
└─────────────────────────────────────────────────────────────────┘
                                  │
                              HTTP/HTTPS
                              RESTful API
                                  │
┌─────────────────────────────────────────────────────────────────┐
│                       API GATEWAY LAYER                        │
├─────────────────────────────────────────────────────────────────┤
│  Express.js Server                                             │
│  ├── CORS Configuration                                        │
│  ├── Rate Limiting                                             │
│  ├── Security Headers (Helmet)                                 │
│  ├── JWT Authentication                                        │
│  └── Request/Response Middleware                               │
└─────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                      │
├─────────────────────────────────────────────────────────────────┤
│  Route Controllers                                              │
│  ├── Auth Routes (/api/auth/*)                                 │
│  ├── Product Routes (/api/products/*)                          │
│  ├── Order Routes (/api/orders/*)                              │
│  ├── User Routes (/api/users/*)                                │
│  └── Middleware (Authentication, Validation)                   │
└─────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────────────────────────────────────┐
│                        DATA ACCESS LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│  Mongoose ODM                                                  │
│  ├── User Model (Schema + Methods)                             │
│  ├── Product Model (Schema + Indexing)                         │
│  ├── Order Model (Schema + Population)                         │
│  └── Data Validation & Relationships                           │
└─────────────────────────────────────────────────────────────────┘
                                  │
┌─────────────────────────────────────────────────────────────────┐
│                         DATABASE LAYER                         │
├─────────────────────────────────────────────────────────────────┤
│  MongoDB Atlas/Local Instance                                  │
│  ├── Users Collection                                          │
│  ├── Products Collection (Text Indexed)                        │
│  ├── Orders Collection                                         │
│  └── Automatic Scaling & Replication                           │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Architecture

### 1. User Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant React App
    participant Express API
    participant MongoDB
    participant Google OAuth

    Note over User,Google OAuth: Login Process
    User->>React App: Click "Login"
    React App->>Express API: POST /api/auth/login
    Express API->>MongoDB: Query user by email
    MongoDB-->>Express API: Return user data
    Express API->>Express API: Compare password hash
    Express API-->>React App: Return JWT + user data
    React App->>React App: Store JWT in localStorage
    React App->>React App: Update AuthContext
    React App-->>User: Redirect to dashboard

    Note over User,Google OAuth: Google OAuth Flow
    User->>React App: Click "Continue with Google"
    React App->>Express API: GET /api/auth/google
    Express API->>Google OAuth: Redirect to Google
    Google OAuth-->>Express API: Return user profile
    Express API->>MongoDB: Find or create user
    Express API->>Express API: Generate JWT
    Express API-->>React App: Redirect with token
    React App->>React App: Extract token & update context
```

### 2. E-commerce Transaction Flow

```mermaid
sequenceDiagram
    participant User
    participant React App
    participant Cart Context
    participant Express API
    participant MongoDB

    Note over User,MongoDB: Shopping & Checkout Process
    User->>React App: Browse products
    React App->>Express API: GET /api/products
    Express API->>MongoDB: Query products with filters
    MongoDB-->>Express API: Return product list
    Express API-->>React App: Return formatted products
    React App-->>User: Display product grid

    User->>React App: Add to cart
    React App->>Cart Context: addToCart(product)
    Cart Context->>Cart Context: Update localStorage
    Cart Context-->>React App: Update cart state

    User->>React App: Proceed to checkout
    React App->>Express API: POST /api/orders (with JWT)
    Express API->>Express API: Verify JWT & extract user
    Express API->>MongoDB: Validate products & stock
    Express API->>MongoDB: Create order document
    Express API->>MongoDB: Update product stock
    MongoDB-->>Express API: Confirm order creation
    Express API-->>React App: Return order confirmation
    React App->>Cart Context: clearCart()
    React App-->>User: Show success message
```

### 3. PWA Caching Strategy

```mermaid
graph TD
    A[User Request] --> B{Network Available?}
    B -->|Yes| C[Service Worker Intercepts]
    B -->|No| D[Service Worker Cache Only]
    
    C --> E{Resource in Cache?}
    E -->|Yes| F[Return Cached Resource]
    E -->|No| G[Fetch from Network]
    
    G --> H[Cache Resource]
    H --> I[Return to User]
    F --> I
    
    D --> J{Resource in Cache?}
    J -->|Yes| K[Return Cached Resource]
    J -->|No| L[Show Offline Message]
    
    style F fill:#90EE90
    style K fill:#90EE90
    style L fill:#FFB6C1
```

## ✨ Core Features

### 🛍️ E-commerce Functionality
- **Product Catalog**: Advanced filtering, searching, and sorting
- **Shopping Cart**: Persistent cart with localStorage integration
- **Secure Checkout**: Complete order processing with validation
- **Order Management**: Real-time order tracking and history
- **User Profiles**: Address management and order history

### 🔐 Authentication & Security
- **Dual Authentication**: Email/password + Google OAuth 2.0
- **JWT Security**: Stateless authentication with secure tokens
- **Password Encryption**: bcrypt hashing with salt rounds
- **Route Protection**: Middleware-based access control
- **Rate Limiting**: DDoS protection and API throttling

### 📱 Progressive Web App
- **Offline Functionality**: Service worker with cache-first strategy
- **Installable**: Add to home screen capability
- **App-like Experience**: Native feel with modern web technologies
- **Push Notifications**: Real-time updates (future enhancement)

### 🎨 Modern User Experience
- **Responsive Design**: Mobile-first approach
- **Real-time Feedback**: Toast notifications and loading states
- **Smooth Animations**: CSS transitions and transforms
- **Accessibility**: WCAG compliant components

## 🛠️ Technology Stack

### Frontend Architecture
```
React 18.2 (Component Library)
├── Vite (Build Tool & Dev Server)
├── React Router 6.30 (Client-side Routing)
├── Context API (State Management)
│   ├── AuthContext (User Authentication)
│   └── CartContext (Shopping Cart)
├── Custom CSS (Styling)
├── Lucide React (Icon System)
└── React Hot Toast (Notifications)
```

### Backend Architecture
```
Node.js (Runtime Environment)
├── Express.js (Web Framework)
├── MongoDB + Mongoose (Database & ODM)
├── Passport.js (Authentication Middleware)
│   ├── JWT Strategy
│   └── Google OAuth 2.0 Strategy
├── Security Stack
│   ├── Helmet (Security Headers)
│   ├── CORS (Cross-Origin Requests)
│   ├── bcryptjs (Password Hashing)
│   └── express-rate-limit (Rate Limiting)
└── Validation
    ├── Joi (Request Validation)
    └── express-validator (Input Sanitization)
```

### Database Schema Design

```javascript
// User Document Structure
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  googleId: String (sparse index),
  role: ["user", "admin"],
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  timestamps: { createdAt, updatedAt }
}

// Product Document Structure
{
  _id: ObjectId,
  name: String (text indexed),
  description: String (text indexed),
  price: Number (min: 0),
  image: String,
  category: String (enum),
  stock: Number,
  inStock: Boolean,
  features: [String],
  specifications: Map<String, String>,
  isActive: Boolean (soft delete),
  timestamps: { createdAt, updatedAt }
}

// Order Document Structure
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  items: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    price: Number,
    name: String
  }],
  shippingAddress: Object,
  total: Number,
  status: ["pending", "confirmed", "shipped", "delivered"],
  timestamps: { createdAt, updatedAt }
}
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Git

### Installation & Setup

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/nexus-store.git
cd nexus-store
```

2. **Backend Setup**
```bash
# Install backend dependencies
npm install

# Create environment file
cp .env.example .env

# Configure environment variables
MONGODB_URI=mongodb://localhost:27017/nexus-store
JWT_SECRET=your-super-secret-jwt-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@nexusstore.com
ADMIN_PASSWORD=SecureAdminPassword123

# Seed database with sample data
npm run seed

# Create admin user
npm run seed:admin

# Start backend server
npm run dev
```

3. **Frontend Setup**
```bash
# Navigate to frontend directory (if separate)
cd frontend

# Install frontend dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

4. **Access Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Admin Login: Use credentials from ADMIN_EMAIL/ADMIN_PASSWORD

## 📁 Project Structure

```
nexus-store/
├── 📁 config/
│   └── passport.js          # Passport authentication strategies
├── 📁 middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── validation.js        # Request validation middleware
├── 📁 models/
│   ├── User.js              # User schema with methods
│   ├── Product.js           # Product schema with indexing
│   └── Order.js             # Order schema with population
├── 📁 routes/
│   ├── auth.js              # Authentication endpoints
│   ├── products.js          # Product CRUD operations
│   ├── orders.js            # Order management
│   └── users.js             # User profile management
├── 📁 scripts/
│   ├── seed.js              # Admin user creation
│   └── seedData.js          # Sample product data
├── 📁 frontend/src/
│   ├── 📁 components/       # Reusable React components
│   ├── 📁 pages/            # Page-level components
│   ├── 📁 utils/            # API service & contexts
│   ├── 📁 styles/           # CSS modules
│   └── App.jsx              # Root component
├── 📁 public/
│   ├── manifest.json        # PWA manifest
│   ├── sw.js               # Service worker
│   └── 📁 icons/           # PWA icons
├── server.js                # Express server entry point
├── package.json             # Dependencies & scripts
└── README.md               # This file
```

## 🔌 API Reference

### Authentication Endpoints
```http
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
GET    /api/auth/me                # Get current user (Protected)
GET    /api/auth/google            # Google OAuth login
GET    /api/auth/google/callback   # Google OAuth callback
POST   /api/auth/logout            # User logout
POST   /api/auth/create-admin      # Create admin user
```

### Product Endpoints
```http
GET    /api/products               # Get products (with filters)
GET    /api/products/:id           # Get single product
POST   /api/products               # Create product (Admin)
PUT    /api/products/:id           # Update product (Admin)
DELETE /api/products/:id           # Delete product (Admin)
GET    /api/products/categories/list # Get all categories
```

### Order Endpoints
```http
POST   /api/orders                 # Create order (Protected)
GET    /api/orders/my-orders       # Get user orders (Protected)
GET    /api/orders/:id             # Get single order (Protected)
PUT    /api/orders/:id/status      # Update order status (Admin)
GET    /api/orders                 # Get all orders (Admin)
```

### User Endpoints
```http
GET    /api/users/profile          # Get user profile (Protected)
PUT    /api/users/profile          # Update user profile (Protected)
GET    /api/users                  # Get all users (Admin)
```

## 🔒 Security Implementation

### Authentication Flow
```javascript
// JWT Middleware Implementation
export const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};
```

### Password Security
- **bcrypt Hashing**: 10 salt rounds for password encryption
- **Pre-save Middleware**: Automatic password hashing on user save
- **Password Comparison**: Secure password verification methods

### API Security
- **Rate Limiting**: 100 requests per 15-minute window
- **CORS Configuration**: Controlled cross-origin access
- **Helmet**: Security headers for protection
- **Input Validation**: Joi schema validation for all inputs

## 🎯 PWA Implementation

### Service Worker Strategy
```javascript
// Cache-First Strategy Implementation
self.addEventListener('fetch', event => {
  if (event.request.destination === 'document' || 
      event.request.destination === 'script' ||
      event.request.destination === 'style') {
    
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
        .then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseClone));
          return response;
        })
    );
  }
});
```

### Offline Capabilities
- **App Shell Caching**: Core UI components cached for offline access
- **Static Asset Caching**: CSS, JS, and image files cached
- **API Response Caching**: Strategic caching of product data
- **Background Sync**: Order synchronization when connectivity returns

## 🚀 Deployment Guide

### Production Environment Variables
```env
# Backend (.env)
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nexus-store
JWT_SECRET=your-production-jwt-secret-key-min-32-chars
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
CLIENT_URL=https://your-frontend-domain.com
SESSION_SECRET=your-session-secret-key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend (.env)
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

### Deployment Platforms

#### Backend (Heroku/Railway)
```bash
# Build and deploy
npm run build
git push heroku main

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
```

#### Frontend (Netlify/Vercel)
```bash
# Build for production
npm run build

# Deploy dist folder
netlify deploy --prod --dir=dist

# Set environment variables in Netlify dashboard
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## 📊 Performance Optimizations

### Frontend Performance
- **Code Splitting**: Dynamic imports for route-based splitting
- **Lazy Loading**: Components loaded only when needed
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Webpack bundle analyzer for optimization

### Backend Performance
- **Database Indexing**: Text and compound indexes on frequently queried fields
- **Query Optimization**: Populated queries with field selection
- **Compression**: Gzip compression for response payloads
- **Caching Headers**: Appropriate cache control headers

### Database Optimization
```javascript
// Product text search index
productSchema.index({ 
  name: "text", 
  description: "text", 
  category: "text" 
});

// User email unique index
userSchema.index({ email: 1 }, { unique: true });

// Order user compound index
orderSchema.index({ user: 1, createdAt: -1 });
```

## 🧪 Testing Strategy

### Unit Testing
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### API Testing
```bash
# Test API endpoints
npm run test:api

# Load testing
npm run test:load
```

### End-to-End Testing
```bash
# Run e2e tests
npm run test:e2e

# Run in headless mode
npm run test:e2e:headless
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes with tests
4. Run linting: `npm run lint`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Create Pull Request

### Code Standards
- **ESLint**: Enforced code style and best practices
- **Prettier**: Automated code formatting
- **Conventional Commits**: Structured commit messages
- **JSDoc**: Documentation for complex functions

## 🐛 Troubleshooting

### Common Issues

#### Database Connection
```bash
# Check MongoDB connection
mongo --eval "db.adminCommand('ismaster')"

# Verify environment variables
echo $MONGODB_URI
```

#### JWT Authentication
```bash
# Verify JWT secret is set
echo $JWT_SECRET

# Check token expiration in browser dev tools
localStorage.getItem('token')
```

#### CORS Issues
```bash
# Verify CLIENT_URL matches frontend domain
echo $CLIENT_URL

# Check browser console for CORS errors
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MERN Stack Community** - For excellent documentation and tutorials
- **PWA Community** - For offline-first development patterns
- **Open Source Contributors** - For the amazing libraries and tools

## 📞 Support & Contact

- **Email**: support@nexusstore.com
- **Documentation**: [docs.nexusstore.com](https://docs.nexusstore.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/nexus-store/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/nexus-store/discussions)

---

**Built with ❤️ by the Nexus Store Team**

*Revolutionizing e-commerce with modern web technologies*
