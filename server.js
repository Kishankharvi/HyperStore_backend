import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import session from "express-session";
import passport from "passport";
import compression from "compression";
import morgan from "morgan";
// import bcrypt from 'bcryptjs';
// import User from "./models/User.js";

// Import routes
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import userRoutes from "./routes/users.js";

dotenv.config();

// Import passport config after dotenv so environment variables are loaded
import "./config/passport.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Function to create admin user
// const createAdminUser = async () => {
//   try {
//     const existingAdmin = await User.findOne({ role: 'admin' });
//     if (existingAdmin) {
//       console.log('Admin user already exists.');
//       return;
//     }

//     const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "AdminPassword", 10);

//     const adminUser = await User.create({
//       name: 'Admin User',
//       email: process.env.ADMIN_EMAIL || 'admin@example.com',
//       password: hashedPassword,
//       role: 'admin',
//       isVerified: true,
//     });

//     console.log('Default admin user created:', adminUser.email);
//   } catch (error) {
//     console.error('Error creating admin user:', error);
//   }
// };

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
    
    // await createAdminUser();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

startServer();

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// --- Error Handling ---
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});