
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import bcrypt from 'bcryptjs';
import products from './productsData.js';

dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String },
  tags: [{ type: String }],
  location: { type: String },
  imageUrl: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  isAvailable: { type: Boolean, default: true },
  type: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'client'], default: 'client' },
  name: { type: String, required: true },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, default: 1 }
  }],
  rentalStart: { type: Date, required: true },
  rentalEnd: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env');
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Cleared existing products');

    // Clear existing users
    console.log('Clearing existing users...');
    await User.deleteMany({});
    console.log('✅ Cleared existing users');

    // Clear existing orders
    console.log('Clearing existing orders...');
    await Order.deleteMany({});
    console.log('✅ Cleared existing orders');

    // Insert new products
    console.log('Seeding products...');
    const insertedProducts = await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${insertedProducts.length} products`);

    // Insert admin user
    console.log('Seeding users...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const clientPassword = await bcrypt.hash('client123', 10);

    const insertedUsers = await User.create([
      {
        email: 'admin@rentit.com',
        password:adminPassword,
        role: 'admin',
        name: 'Admin User',
        phone: '1234567890'
      },
      {
        email: 'user@rentit.com',
        password: clientPassword,
        role: 'client',
        name: 'Test Client',
        phone: '0987654321'
      }
    ]);
    const clientUser = insertedUsers[1];
    console.log('✅ Successfully seeded users (Admin: admin@rentit.com / admin123)');

    // Insert sample orders
    console.log('Seeding orders...');
    const sampleProducts = insertedProducts.slice(0, 2);
    await Order.create([
      {
        user: clientUser._id,
        products: [
          { product: sampleProducts[0]._id, quantity: 1 },
          { product: sampleProducts[1]._id, quantity: 1 }
        ],
        rentalStart: new Date(),
        rentalEnd: new Date(Date.now() + 86400000 * 3), // 3 days later
        totalPrice: sampleProducts[0].price + sampleProducts[1].price,
        status: 'pending'
      },
      {
        user: clientUser._id,
        products: [
          { product: sampleProducts[0]._id, quantity: 1 }
        ],
        rentalStart: new Date(Date.now() - 86400000 * 5), // 5 days ago
        rentalEnd: new Date(Date.now() - 86400000 * 2), // 2 days ago
        totalPrice: sampleProducts[0].price,
        status: 'completed'
      }
    ]);
    console.log('✅ Successfully seeded sample orders');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
