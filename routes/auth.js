import express from "express"
import jwt from "jsonwebtoken"
import passport from "passport"
import User from "../models/User.js"
import { validateRegister, validateLogin } from "../middleware/validation.js"
import bcrypt from "bcryptjs"

const router = express.Router()

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "your-jwt-secret", {
    expiresIn: "7d",
  })
}

// Register
router.post("/register", validateRegister, async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email" })
    }

    const user = new User({
      name,
      email,
      password,
      provider: "local",
    })

    await user.save()
    const token = generateToken(user._id)

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error during registration" })
  }
})

// Login
router.post("/login", validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body
    console.log('Login attempt:', { email });

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }
    console.log('User found:', { email: user.email, id: user._id });

    const isMatch = await user.comparePassword(password)
    console.log('Password match:', isMatch); 
    if (!isMatch) {
       console.log('Password does not match:', { email: user.email });
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = generateToken(user._id)

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), async (req, res) => {
  console.log("Google callback successful, user:", req.user)

  if (!req.user) {
    return res.status(401).json({ message: "Authentication failed" })
  }
  try {
    const token = generateToken(req.user._id)
    console.log("Generated token for user:", req.user._id)
    res.redirect(`${process.env.CLIENT_URL}/auth/success?token=${token}`)
  } catch (error) {
    console.error("Google callback error:", error)
    res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`)
  }
})

// Get current user
router.get("/me", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    const user = {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      role: req.user.role,
      address: req.user.address,
      phone: req.user.phone,
    };
    res.json({ user });
  } catch (error) {
    console.error("Error in /api/auth/me:", error);
    res.status(500).json({ message: "Failed to retrieve user", error: error.message });
  }
});

// Create Admin
router.post('/create-admin', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ message: 'An admin user already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const adminUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
    });

    await adminUser.save();
    res.status(201).json({ message: 'Admin user created successfully', userId: adminUser._id });
  } catch (error) {
    console.error('Error creating admin user:', error);
    res.status(500).json({ message: 'Failed to create admin user', error: error.message });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" })
    }
    res.json({ message: "Logged out successfully" })
  })
})

export default router