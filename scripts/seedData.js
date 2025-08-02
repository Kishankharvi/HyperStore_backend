import mongoose from "mongoose"
import dotenv from "dotenv"
import Product from "../models/Product.js"

dotenv.config()

const sampleProducts = [
  {
    name: "Neural Interface Headset",
    description: "Advanced brain-computer interface for seamless digital interaction and enhanced cognitive abilities.",
    price: 4999.99,
    image: "/images/NeuralVrHeadset.jpeg",
    category: "Technology",
    inStock: true,
    stock: 10,
    features: [
      "Direct neural connection",
      "Real-time thought processing",
      "Enhanced memory capabilities",
      "Wireless connectivity",
    ],
    specifications: {
      "Processing Power": "Quantum Neural Processor",
      "Battery Life": "24 hours",
      Connectivity: "Neural-Link 5.0",
      Weight: "0.5 kg",
    },
    tags: ["neural", "interface", "technology", "future"],
  },
  {
    name: "Holographic Display Pro",
    description: "Ultra-high resolution holographic display with 360-degree viewing angles and gesture controls.",
    price: 7999.99,
    image: "/images/holo.jpeg",
    category: "Displays",
    inStock: true,
    stock: 5,
    features: [
      "360-degree holographic projection",
      "4K resolution per viewing angle",
      "Gesture control interface",
      "Voice command integration",
    ],
    specifications: {
      Resolution: "4K x 360°",
      "Projection Range": "2 meters",
      "Power Consumption": "150W",
      Dimensions: "30cm x 30cm x 15cm",
    },
    tags: ["holographic", "display", "3d", "projection"],
  },
  {
    name: "Nano-Material Jacket",
    description: "Self-healing smart fabric jacket with temperature regulation and built-in health monitoring.",
    price: 899.99,
    image: "/images/cyberjacket.jpeg",
    category: "Clothing",
    inStock: true,
    stock: 25,
    features: [
      "Self-healing nano-fabric",
      "Temperature regulation",
      "Health monitoring sensors",
      "Water and stain resistant",
    ],
    specifications: {
      Material: "Nano-enhanced polymer fibers",
      "Temperature Range": "-20°C to 50°C",
      "Battery Life": "7 days",
      Sizes: "XS to XXL",
    },
    tags: ["smart", "clothing", "nano", "technology"],
  },
  {
    name: "Anti-Gravity Boots",
    description: "Revolutionary footwear with magnetic levitation technology for enhanced mobility.",
    price: 1299.99,
    image: "/images/antigravitysneeakers.jpeg",
    category: "Footwear",
    inStock: true,
    stock: 15,
    features: ["Magnetic levitation system", "Enhanced mobility", "Shock absorption", "Smart balance control"],
    specifications: {
      "Levitation Height": "Up to 5cm",
      "Battery Life": "12 hours",
      Weight: "1.2 kg per pair",
      Sizes: "US 6-14",
    },
    tags: ["anti-gravity", "footwear", "levitation", "mobility"],
  },
  {
    name: "Plasma Energy Drink",
    description: "Molecularly enhanced energy drink with sustained release formula for peak performance.",
    price: 49.99,
    image: "/images/plasmaenergydrink.jpeg",
    category: "Beverages",
    inStock: true,
    stock: 100,
    features: [
      "Molecular enhancement",
      "Sustained energy release",
      "Zero crash formula",
      "Enhanced cognitive function",
    ],
    specifications: {
      Volume: "500ml",
      Caffeine: "200mg",
      "Energy Duration": "8 hours",
      Flavors: "Cosmic Blue, Stellar Orange",
    },
    tags: ["energy", "drink", "plasma", "performance"],
  },
  {
    name: "Quantum Laptop Pro",
    description: "Next-generation quantum computing laptop with unprecedented processing power.",
    price: 15999.99,
    image: "/images/quantumlaptop.jpeg",
    category: "Electronics",
    inStock: true,
    stock: 8,
    features: [
      "Quantum processing unit",
      "Holographic keyboard",
      "Neural interface compatibility",
      "Unlimited cloud storage",
    ],
    specifications: {
      Processor: "Quantum Core X1",
      RAM: "128GB Quantum Memory",
      Storage: "Unlimited Quantum Cloud",
      Display: '15.6" 8K OLED',
    },
    tags: ["quantum", "laptop", "computing", "professional"],
  },
  {
    name: "Biometric Backpack",
    description: "Smart backpack with biometric security and integrated charging station.",
    price: 599.99,
    image: "/images/biometricBackpack.jpeg",
    category: "Accessories",
    inStock: true,
    stock: 30,
    features: ["Biometric lock system", "Integrated charging ports", "GPS tracking", "Weather-resistant design"],
    specifications: {
      Capacity: "35 liters",
      Battery: "20,000 mAh",
      Security: "Fingerprint + Face ID",
      Material: "Carbon fiber composite",
    },
    tags: ["biometric", "backpack", "security", "smart"],
  },
  {
    name: "Holographic Watch",
    description: "Advanced smartwatch with holographic display and health monitoring capabilities.",
    price: 2499.99,
    image: "/images/holographicwatch.jpeg",
    category: "Accessories",
    inStock: true,
    stock: 20,
    features: [
      "3D holographic display",
      "Advanced health monitoring",
      "Voice assistant integration",
      "Wireless charging",
    ],
    specifications: {
      Display: '1.5" Holographic OLED',
      "Battery Life": "5 days",
      "Water Resistance": "100m",
      Connectivity: "5G, WiFi, Bluetooth",
    },
    tags: ["holographic", "watch", "smartwatch", "health"],
  },
]

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/nexus-store")
    console.log("Connected to MongoDB")

    // Clear existing products
    await Product.deleteMany({})
    console.log("Cleared existing products")

    // Insert sample products
    await Product.insertMany(sampleProducts)
    console.log("Sample products inserted successfully")

    console.log("Database seeded successfully!")
    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
