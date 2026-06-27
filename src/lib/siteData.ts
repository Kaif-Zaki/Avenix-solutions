import {
  BarChart3,
  Blocks,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  Cloud,
  Code2,
  CreditCard,
  DatabaseZap,
  Figma,
  Globe2,
  Layers3,
  LineChart,
  MonitorSmartphone,
  Rocket,
  SearchCheck,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { appEnv } from "@/lib/env";

export type Service = {
  icon: LucideIcon;
  title: string;
  description: string;
  outcomes: string[];
};

export type Project = {
  icon: LucideIcon;
  title: string;
  category: string;
  description: string;
  metrics: string[];
  palette: string;
};

export type ProcessStep = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const company = {
  name: appEnv.siteName,
  tagline: appEnv.siteTagline,
  email: appEnv.siteEmail,
  phone: appEnv.sitePhone,
  location: appEnv.siteLocation,
  whatsapp: appEnv.whatsappUrl,
};

export const services: Service[] = [
  {
    icon: MonitorSmartphone,
    title: "Company Websites",
    description:
      "Fast, polished marketing sites for service brands, consultants, startups, and local businesses.",
    outcomes: ["Responsive UI", "SEO structure", "Lead forms"],
  },
  {
    icon: Code2,
    title: "Web Applications",
    description:
      "Custom dashboards, portals, booking systems, and operational tools designed around your workflow.",
    outcomes: ["React apps", "Role access", "API integration"],
  },
  {
    icon: ShoppingCart,
    title: "Ecommerce Builds",
    description:
      "Conversion-focused product catalogs, checkout flows, payment setup, and store management systems.",
    outcomes: ["Catalog UX", "Payments", "Order flows"],
  },
  {
    icon: CreditCard,
    title: "POS & Business Systems",
    description:
      "Retail and restaurant software with sales, stock, reporting, invoicing, and branch-ready operations.",
    outcomes: ["Inventory", "Reports", "Receipts"],
  },
  {
    icon: Cloud,
    title: "Cloud & Deployment",
    description:
      "Reliable hosting, deployment pipelines, domain setup, analytics, backups, and production monitoring.",
    outcomes: ["Hosting", "CI/CD", "Monitoring"],
  },
  {
    icon: BrainCircuit,
    title: "Automation & AI",
    description:
      "Smart automations that remove repetitive work from sales, support, content, and internal processes.",
    outcomes: ["Workflows", "Chat flows", "Data sync"],
  },
];

export const projects: Project[] = [
  {
    icon: BriefcaseBusiness,
    title: "Corporate Portfolio Platform",
    category: "B2B Website",
    description:
      "A premium multi-section company site with case studies, enquiry routing, performance SEO, and analytics.",
    metrics: ["+42% enquiries", "98 Lighthouse", "10 day launch"],
    palette: "from-emerald-600 via-teal-500 to-stone-700",
  },
  {
    icon: DatabaseZap,
    title: "Retail POS Command Center",
    category: "Business Software",
    description:
      "A branch-ready POS dashboard for stock movement, daily sales, customer credit, and management reports.",
    metrics: ["3 branches", "Live stock", "Daily reports"],
    palette: "from-amber-500 via-orange-500 to-rose-500",
  },
  {
    icon: LineChart,
    title: "Service Booking Dashboard",
    category: "Web Application",
    description:
      "A scheduling and CRM workspace that helps a services team manage leads, jobs, invoices, and follow-ups.",
    metrics: ["65% faster ops", "CRM flow", "Invoice sync"],
    palette: "from-sky-600 via-teal-500 to-emerald-700",
  },
];

export const process: ProcessStep[] = [
  {
    icon: SearchCheck,
    title: "Discover",
    description: "We clarify the offer, audience, workflows, competitors, and the exact outcome the build must create.",
  },
  {
    icon: Figma,
    title: "Design",
    description: "We turn the strategy into responsive screens, sharp content structure, and conversion-focused UI.",
  },
  {
    icon: Blocks,
    title: "Build",
    description: "We develop the site or app with clean components, reusable data, integrations, and secure foundations.",
  },
  {
    icon: Rocket,
    title: "Launch",
    description: "We deploy, test, optimize speed, wire analytics, and support your team after the release.",
  },
];

export const techStack = [
  { name: "React", icon: Code2 },
  { name: "TypeScript", icon: ShieldCheck },
  { name: "Tailwind CSS", icon: Layers3 },
  { name: "Node.js", icon: Workflow },
  { name: "Laravel", icon: Globe2 },
  { name: "MySQL", icon: DatabaseZap },
  { name: "Cloud Hosting", icon: Cloud },
  { name: "Analytics", icon: BarChart3 },
];

export const pricing = [
  {
    name: "Launch",
    price: "LKR 45,000+",
    description: "For a clean single-page company website or landing page.",
    features: ["Strategy call", "Custom responsive design", "Contact and WhatsApp flow", "Basic SEO setup"],
  },
  {
    name: "Growth",
    price: "LKR 95,000+",
    description: "For a complete company portfolio with multiple conversion sections.",
    features: ["Portfolio sections", "Service pages/anchors", "Performance optimization", "Analytics integration"],
    featured: true,
  },
  {
    name: "Custom System",
    price: "LKR 180,000+",
    description: "For dashboards, POS, ecommerce, booking, or internal business software.",
    features: ["Discovery workshop", "Custom app architecture", "Database and admin flows", "Launch support"],
  },
];

export const faqs = [
  {
    question: "Can you build a full company portfolio website?",
    answer:
      "Yes. We design and develop complete portfolio sites with strong positioning, service sections, case studies, pricing, contact flows, SEO basics, and launch support.",
  },
  {
    question: "Do you only create websites?",
    answer:
      "No. We also build web applications, ecommerce systems, POS software, dashboards, automations, and integrations for business operations.",
  },
  {
    question: "How long does a website take?",
    answer:
      "A focused landing page usually takes 1-2 weeks. A fuller company website commonly takes 2-4 weeks, depending on content, revisions, and integrations.",
  },
  {
    question: "Can you maintain the site after launch?",
    answer:
      "Yes. We can handle hosting, monitoring, security updates, content changes, backups, analytics, and new feature requests after launch.",
  },
  {
    question: "What do you need before starting?",
    answer:
      "We start with your business goals, services, preferred style, contact details, brand assets, and examples of websites or systems you like.",
  },
];

export const trustSignals = [
  { value: "35+", label: "Projects delivered" },
  { value: "12", label: "Business categories" },
  { value: "99%", label: "Mobile ready builds" },
  { value: "4wk", label: "Typical website launch" },
];

export const heroHighlights = [
  "Portfolio websites",
  "Custom systems",
  "POS & ecommerce",
  "Automation",
];

export const proofPoints = [
  { icon: CheckCircle2, text: "Performance-first builds" },
  { icon: ShieldCheck, text: "Secure launch setup" },
  { icon: Smartphone, text: "Mobile polished UI" },
];
