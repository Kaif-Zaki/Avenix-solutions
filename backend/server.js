const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const dotenv = require("dotenv");
const multer = require("multer");

const rootDir = path.join(__dirname, "..");
const envFiles = [
  path.join(__dirname, ".env.local"),
  path.join(__dirname, ".env"),
  path.join(rootDir, ".env.local"),
  path.join(rootDir, ".env"),
];

for (const envFile of envFiles) {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
    break;
  }
}

const app = express();

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()).filter(Boolean)
  : true;

app.use(cors({ origin: corsOrigins }));
app.use(express.json());
app.use("/uploads", express.static(path.join(rootDir, "public", "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  folder: process.env.CLOUDINARY_FOLDER || "nexora/projects",
};

const isCloudinaryConfigured = Boolean(
  cloudinaryConfig.cloudName &&
  cloudinaryConfig.apiKey &&
  cloudinaryConfig.apiSecret
);

const createCloudinarySignature = (params) => {
  const payload = Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== "")
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${payload}${cloudinaryConfig.apiSecret}`)
    .digest("hex");
};

const uploadToCloudinary = async (file) => {
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.");
  }

  const timestamp = Math.round(Date.now() / 1000);
  const params = {
    folder: cloudinaryConfig.folder,
    timestamp,
  };
  const signature = createCloudinarySignature(params);
  const formData = new FormData();

  formData.append("file", new Blob([file.buffer], { type: file.mimetype }), file.originalname);
  formData.append("api_key", cloudinaryConfig.apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("folder", cloudinaryConfig.folder);
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error?.message || "Cloudinary upload failed.");
  }

  return payload;
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpeg, jpg, png, webp, gif) are allowed!"));
  }
});

// Image Upload API
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please select an image to upload." });
    }
    const uploadedImage = await uploadToCloudinary(req.file);
    res.json({
      success: true,
      filePath: uploadedImage.secure_url,
      imageUrl: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
    });
  } catch (err) {
    res.status(500).json({ error: "File upload failed: " + err.message });
  }
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI ;

// Connect to MongoDB
const maskedUri = MONGODB_URI ? MONGODB_URI.replace(/:([^@]+)@/, ":******@") : "undefined";
console.log(`📡 Connecting to MongoDB URI: ${maskedUri}`);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("🚀 Connected to MongoDB cluster successfully.");
    seedDatabase();
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB cluster:", err.message);
  });

// Schemas
const CompanySchema = new mongoose.Schema({
  name: { type: String, default: "Avenix Solutions" },
  tagline: { type: String, default: "" },
  email: { type: String, default: "" },
  phone: { type: String, default: "" },
  location: { type: String, default: "" },
  whatsapp: { type: String, default: "" }
}, { timestamps: true });

const ServiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  iconName: { type: String, default: "Code2" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  outcomes: [String]
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  iconName: { type: String, default: "BriefcaseBusiness" },
  title: { type: String, required: true },
  category: { type: String, default: "" },
  description: { type: String, default: "" },
  metrics: [String],
  palette: { type: String, default: "from-sky-600 via-teal-500 to-emerald-700" },
  imageUrl: { type: String, default: "" }
}, { timestamps: true });

const PricingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, default: "" },
  features: [String],
  featured: { type: Boolean, default: false }
}, { timestamps: true });

const ProcessSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  iconName: { type: String, default: "SearchCheck" },
  title: { type: String, required: true },
  description: { type: String, default: "" }
}, { timestamps: true });

const FaqSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { timestamps: true });

// Models
const Company = mongoose.model("Company", CompanySchema);
const Service = mongoose.model("Service", ServiceSchema);
const Project = mongoose.model("Project", ProjectSchema);
const Pricing = mongoose.model("Pricing", PricingSchema);
const ProcessStep = mongoose.model("ProcessStep", ProcessSchema);
const Faq = mongoose.model("Faq", FaqSchema);

const AdminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

const AdminUser = mongoose.model("AdminUser", AdminUserSchema);

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
}, { timestamps: true });

const Category = mongoose.model("Category", CategorySchema);

// Initial Default Content Arrays (Seeder Data)
const DEFAULT_COMPANY = {
  name: "Avenix Solutions",
  tagline: "Software, websites, and automation built for serious business growth.",
  email: "hello@avenixsolutions.com",
  phone: "+94 77 673 7532",
  location: "Colombo, Sri Lanka",
  whatsapp: "https://wa.me/94776737532",
};

const DEFAULT_SERVICES = [
  {
    id: "s1",
    iconName: "MonitorSmartphone",
    title: "Company Websites",
    description: "Fast, polished marketing sites for service brands, consultants, startups, and local businesses.",
    outcomes: ["Responsive UI", "SEO structure", "Lead forms"],
  },
  {
    id: "s2",
    iconName: "Code2",
    title: "Web Applications",
    description: "Custom dashboards, portals, booking systems, and operational tools designed around your workflow.",
    outcomes: ["React apps", "Role access", "API integration"],
  },
  {
    id: "s3",
    iconName: "ShoppingCart",
    title: "Ecommerce Builds",
    description: "Conversion-focused product catalogs, checkout flows, payment setup, and store management systems.",
    outcomes: ["Catalog UX", "Payments", "Order flows"],
  },
  {
    id: "s4",
    iconName: "CreditCard",
    title: "POS & Business Systems",
    description: "Retail and restaurant software with sales, stock, reporting, invoicing, and branch-ready operations.",
    outcomes: ["Inventory", "Reports", "Receipts"],
  },
  {
    id: "s5",
    iconName: "Cloud",
    title: "Cloud & Deployment",
    description: "Reliable hosting, deployment pipelines, domain setup, analytics, backups, and production monitoring.",
    outcomes: ["Hosting", "CI/CD", "Monitoring"],
  },
  {
    id: "s6",
    iconName: "BrainCircuit",
    title: "Automation & AI",
    description: "Smart automations that remove repetitive work from sales, support, content, and internal processes.",
    outcomes: ["Workflows", "Chat flows", "Data sync"],
  },
];

const DEFAULT_PROJECTS = [
  {
    id: "p1",
    iconName: "BriefcaseBusiness",
    title: "Corporate Portfolio Platform",
    category: "B2B Website",
    description: "A premium multi-section company site with case studies, enquiry routing, performance SEO, and analytics.",
    metrics: ["+42% enquiries", "98 Lighthouse", "10 day launch"],
    palette: "from-emerald-600 via-teal-500 to-stone-700",
  },
  {
    id: "p2",
    iconName: "DatabaseZap",
    title: "Retail POS Command Center",
    category: "Business Software",
    description: "A branch-ready POS dashboard for stock movement, daily sales, customer credit, and management reports.",
    metrics: ["3 branches", "Live stock", "Daily reports"],
    palette: "from-amber-500 via-orange-500 to-rose-500",
  },
  {
    id: "p3",
    iconName: "LineChart",
    title: "Service Booking Dashboard",
    category: "Web Application",
    description: "A scheduling and CRM workspace that helps a services team manage leads, jobs, invoices, and follow-ups.",
    metrics: ["65% faster ops", "CRM flow", "Invoice sync"],
    palette: "from-sky-600 via-teal-500 to-emerald-700",
  },
];

const DEFAULT_PRICING = [
  {
    id: "pr1",
    name: "Launch",
    price: "LKR 45,000+",
    description: "For a clean single-page company website or landing page.",
    features: ["Strategy call", "Custom responsive design", "Contact and WhatsApp flow", "Basic SEO setup"],
  },
  {
    id: "pr2",
    name: "Growth",
    price: "LKR 95,000+",
    description: "For a complete company portfolio with multiple conversion sections.",
    features: ["Portfolio sections", "Service pages/anchors", "Performance optimization", "Analytics integration"],
    featured: true,
  },
  {
    id: "pr3",
    name: "Custom System",
    price: "LKR 180,000+",
    description: "For dashboards, POS, ecommerce, booking, or internal business software.",
    features: ["Discovery workshop", "Custom app architecture", "Database and admin flows", "Launch support"],
  },
];

const DEFAULT_PROCESS = [
  {
    id: "ps1",
    iconName: "SearchCheck",
    title: "Discover",
    description: "We clarify the offer, audience, workflows, competitors, and the exact outcome the build must create.",
  },
  {
    id: "ps2",
    iconName: "Figma",
    title: "Design",
    description: "We turn the strategy into responsive screens, sharp content structure, and conversion-focused UI.",
  },
  {
    id: "ps3",
    iconName: "Blocks",
    title: "Build",
    description: "We develop the site or app with clean components, reusable data, integrations, and secure foundations.",
  },
  {
    id: "ps4",
    iconName: "Rocket",
    title: "Launch",
    description: "We deploy, test, optimize speed, wire analytics, and support your team after the release.",
  },
];

const DEFAULT_FAQS = [
  {
    id: "f1",
    question: "Can you build a full company portfolio website?",
    answer: "Yes. We design and develop complete portfolio sites with strong positioning, service sections, case studies, pricing, contact flows, SEO basics, and launch support.",
  },
  {
    id: "f2",
    question: "Do you only create websites?",
    answer: "No. We also build web applications, ecommerce systems, POS software, dashboards, automations, and integrations for business operations.",
  },
  {
    id: "f3",
    question: "How long does a website take?",
    answer: "A focused landing page usually takes 1-2 weeks. A fuller company website commonly takes 2-4 weeks, depending on content, revisions, and integrations.",
  },
  {
    id: "f4",
    question: "Can you maintain the site after launch?",
    answer: "Yes. We can handle hosting, monitoring, security updates, content changes, backups, analytics, and new feature requests after launch.",
  },
  {
    id: "f5",
    question: "What do you need before starting?",
    answer: "We start with your business goals, services, preferred style, contact details, brand assets, and examples of websites or systems you like.",
  },
];

const DEFAULT_CATEGORIES = ["B2B Website", "Business Software", "Web Application"];

// Seed Function
async function seedDatabase() {
  try {
    const compCount = await Company.countDocuments();
    if (compCount === 0) {
      await Company.create(DEFAULT_COMPANY);
      console.log("🌱 Seeded initial company configuration.");
    }
    const servCount = await Service.countDocuments();
    if (servCount === 0) {
      await Service.insertMany(DEFAULT_SERVICES);
      console.log("🌱 Seeded services collection.");
    }
    const projCount = await Project.countDocuments();
    if (projCount === 0) {
      await Project.insertMany(DEFAULT_PROJECTS);
      console.log("🌱 Seeded portfolio projects.");
    }
    const priceCount = await Pricing.countDocuments();
    if (priceCount === 0) {
      await Pricing.insertMany(DEFAULT_PRICING);
      console.log("🌱 Seeded pricing packages.");
    }
    const procCount = await ProcessStep.countDocuments();
    if (procCount === 0) {
      await ProcessStep.insertMany(DEFAULT_PROCESS);
      console.log("🌱 Seeded timeline process steps.");
    }
    const faqCount = await Faq.countDocuments();
    if (faqCount === 0) {
      await Faq.insertMany(DEFAULT_FAQS);
      console.log("🌱 Seeded FAQs list.");
    }

    const adminCount = await AdminUser.countDocuments();
    if (adminCount === 0) {
      const defaultEmail = process.env.VITE_ADMIN_EMAIL || "admin@avenixsolutions.com";
      const defaultPassword = process.env.VITE_ADMIN_PASSWORD || "avenixadmin";
      await AdminUser.create({ email: defaultEmail.trim().toLowerCase(), password: defaultPassword });
      console.log("🌱 Seeded initial Admin user credentials.");
    }

    const catCount = await Category.countDocuments();
    if (catCount === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES.map(name => ({ name })));
      console.log("🌱 Seeded default categories.");
    }
  } catch (err) {
    console.error("❌ Seeding database failed:", err.message);
  }
}

// REST API Endpoints

// GET /api/site-data
app.get("/api/site-data", async (req, res) => {
  try {
    const company = await Company.findOne() || DEFAULT_COMPANY;
    const services = await Service.find();
    const projects = await Project.find();
    const pricing = await Pricing.find();
    const process = await ProcessStep.find();
    const faqs = await Faq.find();
    const categories = await Category.find();

    res.json({
      company,
      services,
      projects,
      pricing,
      process,
      faqs,
      categories
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load database site-data: " + err.message });
  }
});

// Reset Database API
app.post("/api/reset", async (req, res) => {
  try {
    await Company.deleteMany({});
    await Service.deleteMany({});
    await Project.deleteMany({});
    await Pricing.deleteMany({});
    await ProcessStep.deleteMany({});
    await Faq.deleteMany({});
    await AdminUser.deleteMany({});
    await Category.deleteMany({});

    await Company.create(DEFAULT_COMPANY);
    await Service.insertMany(DEFAULT_SERVICES);
    await Project.insertMany(DEFAULT_PROJECTS);
    await Pricing.insertMany(DEFAULT_PRICING);
    await ProcessStep.insertMany(DEFAULT_PROCESS);
    await Faq.insertMany(DEFAULT_FAQS);

    const defaultEmail = process.env.VITE_ADMIN_EMAIL || "admin@avenixsolutions.com";
    const defaultPassword = process.env.VITE_ADMIN_PASSWORD || "avenixadmin";
    await AdminUser.create({ email: defaultEmail.trim().toLowerCase(), password: defaultPassword });
    await Category.insertMany(DEFAULT_CATEGORIES.map(name => ({ name })));

    res.json({ message: "Database successfully reset to original seed values." });
  } catch (err) {
    res.status(500).json({ error: "Resetting database failed: " + err.message });
  }
});

// Company Info Update API
app.put("/api/company", async (req, res) => {
  try {
    const data = req.body;
    let company = await Company.findOne();
    if (company) {
      Object.assign(company, data);
      await company.save();
    } else {
      company = await Company.create(data);
    }
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Services APIs
app.post("/api/services", async (req, res) => {
  try {
    const item = await Service.create(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/services/:id", async (req, res) => {
  try {
    const item = await Service.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, upsert: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/services/:id", async (req, res) => {
  try {
    await Service.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Projects APIs
app.post("/api/projects", async (req, res) => {
  try {
    const item = await Project.create(req.body);
    res.json(item);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/projects/:id", async (req, res) => {
  try {
    const item = await Project.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, upsert: true });
    res.json(item);
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/projects/:id", async (req, res) => {
  try {
    await Project.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Process steps APIs
app.post("/api/process", async (req, res) => {
  try {
    const item = await ProcessStep.create(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/process/:id", async (req, res) => {
  try {
    const item = await ProcessStep.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, upsert: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/process/:id", async (req, res) => {
  try {
    await ProcessStep.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Pricing APIs
app.put("/api/pricing", async (req, res) => {
  try {
    const tiers = req.body;
    await Pricing.deleteMany({});
    const inserted = await Pricing.insertMany(tiers);
    res.json(inserted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// FAQs APIs
app.post("/api/faqs", async (req, res) => {
  try {
    const item = await Faq.create(req.body);
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/faqs/:id", async (req, res) => {
  try {
    const item = await Faq.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, upsert: true });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/faqs/:id", async (req, res) => {
  try {
    await Faq.deleteOne({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin credentials routes
app.post("/api/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }
    const admin = await AdminUser.findOne({ email: email.trim().toLowerCase() });
    if (!admin || admin.password !== password) {
      return res.status(401).json({ success: false, error: "Incorrect email or password. Please try again." });
    }
    res.json({ success: true, email: admin.email });
  } catch (err) {
    res.status(500).json({ error: "Login failed: " + err.message });
  }
});

app.put("/api/admin/profile", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }
    let admin = await AdminUser.findOne();
    if (!admin) {
      admin = new AdminUser({ email: email.trim().toLowerCase(), password });
    } else {
      admin.email = email.trim().toLowerCase();
      if (password) {
        admin.password = password;
      }
    }
    await admin.save();
    res.json({ success: true, email: admin.email });
  } catch (err) {
    res.status(500).json({ error: "Profile update failed: " + err.message });
  }
});

// Categories routes
app.get("/api/categories", async (req, res) => {
  try {
    const list = await Category.find();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: "Failed to get categories: " + err.message });
  }
});

app.post("/api/categories", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }
    const item = await Category.create({ name: name.trim() });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to add category: " + err.message });
  }
});

app.delete("/api/categories/:name", async (req, res) => {
  try {
    const name = req.params.name;
    await Category.deleteOne({ name: name });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category: " + err.message });
  }
});

// Serve frontend build in production if the folder exists
if (process.env.NODE_ENV === "production" && fs.existsSync(path.join(rootDir, "dist"))) {
  app.use(express.static(path.join(rootDir, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(rootDir, "dist", "index.html"));
  });
} else {
  // Standalone backend configuration or local development fallback
  app.get("/", (req, res) => {
    res.json({ 
      message: "Nexora Tech Backend API is running successfully.", 
      status: "healthy",
      endpoints: {
        health: "/api/health",
        siteData: "/api/site-data"
      }
    });
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`Express API server listening on http://127.0.0.1:${PORT}`);
});
