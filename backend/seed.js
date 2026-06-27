const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

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
    console.log(`Loaded configuration variables from ${path.relative(rootDir, envFile)}`);
    break;
  }
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Avenix_Db";

// Schemas & Models
const Company = mongoose.model("Company", new mongoose.Schema({
  name: String,
  tagline: String,
  email: String,
  phone: String,
  location: String,
  whatsapp: String
}, { collection: "companies" }));

const Service = mongoose.model("Service", new mongoose.Schema({
  id: String,
  iconName: String,
  title: String,
  description: String,
  outcomes: [String]
}, { collection: "services" }));

const Project = mongoose.model("Project", new mongoose.Schema({
  id: String,
  iconName: String,
  title: String,
  category: String,
  description: String,
  metrics: [String],
  palette: String,
  imageUrl: String,
  liveUrl: String
}, { collection: "projects" }));

const Pricing = mongoose.model("Pricing", new mongoose.Schema({
  id: String,
  name: String,
  price: String,
  description: String,
  features: [String],
  featured: Boolean
}, { collection: "pricings" }));

const ProcessStep = mongoose.model("ProcessStep", new mongoose.Schema({
  id: String,
  iconName: String,
  title: String,
  description: String
}, { collection: "processsteps" }));

const Faq = mongoose.model("Faq", new mongoose.Schema({
  id: String,
  question: String,
  answer: String
}, { collection: "faqs" }));

const AdminUser = mongoose.model("AdminUser", new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
}, { collection: "adminusers" }));

const Category = mongoose.model("Category", new mongoose.Schema({
  name: { type: String, required: true }
}, { collection: "categories" }));

// Sample Seeding Datasets
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
    liveUrl: "https://avenixsolutions.com"
  },
  {
    id: "p2",
    iconName: "DatabaseZap",
    title: "Retail POS Command Center",
    category: "Business Software",
    description: "A branch-ready POS dashboard for stock movement, daily sales, customer credit, and management reports.",
    metrics: ["3 branches", "Live stock", "Daily reports"],
    palette: "from-amber-500 via-orange-500 to-rose-500",
    liveUrl: "https://avenixsolutions.com"
  },
  {
    id: "p3",
    iconName: "LineChart",
    title: "Service Booking Dashboard",
    category: "Web Application",
    description: "A scheduling and CRM workspace that helps a services team manage leads, jobs, invoices, and follow-ups.",
    metrics: ["65% faster ops", "CRM flow", "Invoice sync"],
    palette: "from-sky-600 via-teal-500 to-emerald-700",
    liveUrl: ""
  },
];

const DEFAULT_PRICING = [
  {
    id: "pr1",
    name: "Launch",
    price: "LKR 45,000+",
    description: "For a clean single-page company website or landing page.",
    features: ["Strategy call", "Custom responsive design", "Contact and WhatsApp flow", "Basic SEO setup"],
    featured: false
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
    featured: false
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

async function seed() {
  console.log("🔌 Connecting to MongoDB cluster...");
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("🔑 Connected successfully. Resetting collections...");

    // Empty collections
    await Company.deleteMany({});
    await Service.deleteMany({});
    await Project.deleteMany({});
    await Pricing.deleteMany({});
    await ProcessStep.deleteMany({});
    await Faq.deleteMany({});
    await AdminUser.deleteMany({});
    await Category.deleteMany({});

    // Seed data
    await Company.create(DEFAULT_COMPANY);
    await Service.insertMany(DEFAULT_SERVICES);
    await Project.insertMany(DEFAULT_PROJECTS);
    await Pricing.insertMany(DEFAULT_PRICING);
    await ProcessStep.insertMany(DEFAULT_PROCESS);
    await Faq.insertMany(DEFAULT_FAQS);

    const defaultEmail = process.env.VITE_ADMIN_EMAIL || "admin@avenixsolutions.com";
    const defaultPassword = process.env.VITE_ADMIN_PASSWORD || "avenixadmin";
    await AdminUser.create({ email: defaultEmail.trim().toLowerCase(), password: defaultPassword });
    await Category.insertMany(["B2B Website", "Business Software", "Web Application"].map(name => ({ name })));

    console.log("🎉 Seeding complete. MongoDB database holds Avenix solutions default layouts.");
  } catch (err) {
    console.error("❌ Seeding database failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB. Exiting.");
    process.exit(0);
  }
}

seed();
