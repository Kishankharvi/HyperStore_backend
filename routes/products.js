import express from "express"
import Product from "../models/Product.js"
import { authenticateToken, isAdmin } from "../middleware/auth.js"

const router = express.Router()

// Get all products with filtering and pagination
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, sort = "createdAt", order = "desc", minPrice, maxPrice } = req.query

    // Build filter object
    const filter = { isActive: true }

    if (category) {
      filter.category = category
    }

    if (search) {
      filter.$text = { $search: search }
    }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number.parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = Number.parseFloat(maxPrice)
    }

    // Build sort object
    const sortObj = {}
    sortObj[sort] = order === "desc" ? -1 : 1

    // Execute query with pagination
    const products = await Product.find(filter)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec()

    // Get total count for pagination
    const total = await Product.countDocuments(filter)

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get products error:", error)
    res.status(500).json({ message: "Server error fetching products" })
  }
})

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product || !product.isActive) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    console.error("Get product error:", error)
    res.status(500).json({ message: "Server error fetching product" })
  }
})

// Create product (Admin only)
router.post("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()
    res.status(201).json(product)
  } catch (error) {
    console.error("Create product error:", error)
    res.status(500).json({ message: "Server error creating product" })
  }
})

// Update product (Admin only)
router.put("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    console.error("Update product error:", error)
    res.status(500).json({ message: "Server error updating product" })
  }
})

// Delete product (Admin only)
router.delete("/:id", authenticateToken, isAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    res.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Delete product error:", error)
    res.status(500).json({ message: "Server error deleting product" })
  }
})

// Get categories
router.get("/categories/list", async (req, res) => {
  try {
    const categories = await Product.distinct("category", { isActive: true })
    res.json(categories)
  } catch (error) {
    console.error("Get categories error:", error)
    res.status(500).json({ message: "Server error fetching categories" })
  }
})

export default router
