import express from "express"
import Order from "../models/Order.js"
import Product from "../models/Product.js"
import { authenticateToken, isAdmin } from "../middleware/auth.js"

const router = express.Router()

// Create new order
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" })
    }

    // Verify products exist and calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.product)
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product ${item.product} not found` })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        })
      }

      const orderItem = {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      }

      orderItems.push(orderItem)
      subtotal += product.price * item.quantity
    }

    // Calculate tax and shipping
    const tax = subtotal * 0.08 // 8% tax
    const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
    const total = subtotal + tax + shipping

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shipping,
      total,
    })

    await order.save()

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })
    }

    res.status(201).json(order)
  } catch (error) {
    console.error("Create order error:", error)
    res.status(500).json({ message: "Server error creating order" })
  }
})

// Get user orders
router.get("/my-orders", authenticateToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name image")
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    console.error("Get user orders error:", error)
    res.status(500).json({ message: "Server error fetching orders" })
  }
})

// Get single order
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name image")
      .populate("user", "name email")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Check if user owns the order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json(order)
  } catch (error) {
    console.error("Get order error:", error)
    res.status(500).json({ message: "Server error fetching order" })
  }
})

// Update order status (Admin only)
router.put("/:id/status", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status } = req.body

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(status === "delivered" && { isDelivered: true, deliveredAt: new Date() }),
      },
      { new: true },
    )

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    res.json(order)
  } catch (error) {
    console.error("Update order status error:", error)
    res.status(500).json({ message: "Server error updating order status" })
  }
})

// Get all orders (Admin only)
router.get("/", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query

    const filter = {}
    if (status) filter.status = status

    const orders = await Order.find(filter)
      .populate("user", "name email")
      .populate("items.product", "name image")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Order.countDocuments(filter)

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get all orders error:", error)
    res.status(500).json({ message: "Server error fetching orders" })
  }
})

export default router
