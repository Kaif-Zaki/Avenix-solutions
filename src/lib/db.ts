import * as Icons from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { apiFetch } from "@/lib/api";

// Lucide Icon Registry for dynamic database lookups
export const iconRegistry: Record<string, LucideIcon> = {
  MonitorSmartphone: Icons.MonitorSmartphone,
  Code2: Icons.Code2,
  ShoppingCart: Icons.ShoppingCart,
  CreditCard: Icons.CreditCard,
  Cloud: Icons.Cloud,
  BrainCircuit: Icons.BrainCircuit,
  BriefcaseBusiness: Icons.BriefcaseBusiness,
  DatabaseZap: Icons.DatabaseZap,
  LineChart: Icons.LineChart,
  SearchCheck: Icons.SearchCheck,
  Figma: Icons.Figma,
  Blocks: Icons.Blocks,
  Rocket: Icons.Rocket,
  ShieldCheck: Icons.ShieldCheck,
  CheckCircle2: Icons.CheckCircle2,
  Smartphone: Icons.Smartphone,
  BarChart3: Icons.BarChart3,
  Workflow: Icons.Workflow,
  Globe2: Icons.Globe2,
  Layers3: Icons.Layers3,
  Mail: Icons.Mail,
  Phone: Icons.Phone,
  MapPin: Icons.MapPin,
  MessageSquare: Icons.MessageSquare,
  User: Icons.User,
  Send: Icons.Send,
  HelpCircle: Icons.HelpCircle,
};

export const getIcon = (name: string): LucideIcon => {
  return iconRegistry[name] || Icons.HelpCircle;
};

// Types
export interface DBCompany {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  whatsapp: string;
}

export interface DBService {
  id: string;
  iconName: string;
  title: string;
  description: string;
  outcomes: string[];
}

export interface DBProject {
  id: string;
  iconName: string;
  title: string;
  category: string;
  description: string;
  metrics: string[];
  palette: string;
  imageUrl?: string;
}

export interface DBPricing {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  featured?: boolean;
}

export interface DBProcessStep {
  id: string;
  iconName: string;
  title: string;
  description: string;
}

export interface DBFaq {
  id: string;
  question: string;
  answer: string;
}

export interface DBCategory {
  name: string;
}

// LocalStorage Keys
const KEYS = {
  COMPANY: "avenix_cms_company",
  SERVICES: "avenix_cms_services",
  PROJECTS: "avenix_cms_projects",
  PRICING: "avenix_cms_pricing",
  PROCESS: "avenix_cms_process",
  FAQS: "avenix_cms_faqs",
  CATEGORIES: "avenix_cms_categories",
};

const getStorage = () => {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
};

// Initial Default Content (matching siteData.ts but structured for serializing)
const DEFAULT_COMPANY: DBCompany = {
  name: "Avenix Solutions",
  tagline: "Software, websites, and automation built for serious business growth.",
  email: "hello@avenixsolutions.com",
  phone: "+94 77 673 7532",
  location: "Colombo, Sri Lanka",
  whatsapp: "https://wa.me/94776737532",
};

const DEFAULT_SERVICES: DBService[] = [
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

const DEFAULT_PROJECTS: DBProject[] = [
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

const DEFAULT_PRICING: DBPricing[] = [
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

const DEFAULT_PROCESS: DBProcessStep[] = [
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

const DEFAULT_FAQS: DBFaq[] = [
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

// Database operations class
class CMSDatabase {
  constructor() {
    this.init();
  }

  // Ensure database keys are initialized locally
  private init() {
    const storage = getStorage();
    if (!storage) return;
    
    if (!storage.getItem(KEYS.COMPANY)) {
      storage.setItem(KEYS.COMPANY, JSON.stringify(DEFAULT_COMPANY));
    }
    if (!storage.getItem(KEYS.SERVICES)) {
      storage.setItem(KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
    }
    if (!storage.getItem(KEYS.PROJECTS)) {
      storage.setItem(KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
    }
    if (!storage.getItem(KEYS.PRICING)) {
      storage.setItem(KEYS.PRICING, JSON.stringify(DEFAULT_PRICING));
    }
    if (!storage.getItem(KEYS.PROCESS)) {
      storage.setItem(KEYS.PROCESS, JSON.stringify(DEFAULT_PROCESS));
    }
    if (!storage.getItem(KEYS.FAQS)) {
      storage.setItem(KEYS.FAQS, JSON.stringify(DEFAULT_FAQS));
    }
    if (!storage.getItem(KEYS.CATEGORIES)) {
      storage.setItem(KEYS.CATEGORIES, JSON.stringify(["B2B Website", "Business Software", "Web Application"].map(name => ({ name }))));
    }
  }

  private listeners: (() => void)[] = [];

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (err) {
        console.error("Error in DB subscriber listener callback:", err);
      }
    });
  }

  // Sync whole payload from Mongo to localStorage
  public syncFromMongo(data: {
    company: DBCompany;
    services: DBService[];
    projects: DBProject[];
    pricing: DBPricing[];
    process: DBProcessStep[];
    faqs: DBFaq[];
    categories?: DBCategory[];
  }) {
    const storage = getStorage();
    if (!storage) return;

    if (data.company) storage.setItem(KEYS.COMPANY, JSON.stringify(data.company));
    if (data.services) storage.setItem(KEYS.SERVICES, JSON.stringify(data.services));
    if (data.projects) storage.setItem(KEYS.PROJECTS, JSON.stringify(data.projects));
    if (data.pricing) storage.setItem(KEYS.PRICING, JSON.stringify(data.pricing));
    if (data.process) storage.setItem(KEYS.PROCESS, JSON.stringify(data.process));
    if (data.faqs) storage.setItem(KEYS.FAQS, JSON.stringify(data.faqs));
    if (data.categories) storage.setItem(KEYS.CATEGORIES, JSON.stringify(data.categories));
    this.notify();
  }

  // Reset to Defaults
  public async resetToDefaults() {
    const storage = getStorage();
    if (storage) {
      storage.setItem(KEYS.COMPANY, JSON.stringify(DEFAULT_COMPANY));
      storage.setItem(KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
      storage.setItem(KEYS.PROJECTS, JSON.stringify(DEFAULT_PROJECTS));
      storage.setItem(KEYS.PRICING, JSON.stringify(DEFAULT_PRICING));
      storage.setItem(KEYS.PROCESS, JSON.stringify(DEFAULT_PROCESS));
      storage.setItem(KEYS.FAQS, JSON.stringify(DEFAULT_FAQS));
      this.notify();
    }

    try {
      await apiFetch("/api/reset", { method: "POST" });
    } catch (err) {
      console.error("Backend reset API call failed:", err);
    }
  }

  // Company Get/Set
  public getCompany(): DBCompany {
    try {
      const stored = getStorage()?.getItem(KEYS.COMPANY);
      return stored ? JSON.parse(stored) as DBCompany : DEFAULT_COMPANY;
    } catch {
      return DEFAULT_COMPANY;
    }
  }

  public async setCompany(data: DBCompany) {
    getStorage()?.setItem(KEYS.COMPANY, JSON.stringify(data));
    this.notify();
    try {
      await apiFetch("/api/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.error("Backend setCompany API call failed:", err);
    }
  }

  // Services CRUD
  public getServices(): DBService[] {
    try {
      const stored = getStorage()?.getItem(KEYS.SERVICES);
      return stored ? JSON.parse(stored) as DBService[] : DEFAULT_SERVICES;
    } catch {
      return DEFAULT_SERVICES;
    }
  }

  public async setServices(data: DBService[]) {
    const old = this.getServices();
    getStorage()?.setItem(KEYS.SERVICES, JSON.stringify(data));
    this.notify();

    try {
      // Find deleted
      const deleted = old.filter(o => !data.some(d => d.id === o.id));
      for (const item of deleted) {
        await apiFetch(`/api/services/${item.id}`, { method: "DELETE" });
      }
      
      // Find added
      const added = data.filter(d => !old.some(o => o.id === d.id));
      for (const item of added) {
        await apiFetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        });
      }

      // Find updated
      const updated = data.filter(d => old.some(o => o.id === d.id && JSON.stringify(o) !== JSON.stringify(d)));
      for (const item of updated) {
        await apiFetch(`/api/services/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        });
      }
    } catch (err) {
      console.error("Backend setServices API delta sync failed:", err);
    }
  }

  // Projects CRUD
  public getProjects(): DBProject[] {
    try {
      const stored = getStorage()?.getItem(KEYS.PROJECTS);
      return stored ? JSON.parse(stored) as DBProject[] : DEFAULT_PROJECTS;
    } catch {
      return DEFAULT_PROJECTS;
    }
  }

  public async setProjects(data: DBProject[]) {
    const old = this.getProjects();
    getStorage()?.setItem(KEYS.PROJECTS, JSON.stringify(data));
    this.notify();

    try {
      const deleted = old.filter(o => !data.some(d => d.id === o.id));
      for (const item of deleted) {
        await apiFetch(`/api/projects/${item.id}`, { method: "DELETE" });
      }
      
      const added = data.filter(d => !old.some(o => o.id === d.id));
      for (const item of added) {
        await apiFetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        });
      }

      // Find updated
      const updated = data.filter(d => old.some(o => o.id === d.id && JSON.stringify(o) !== JSON.stringify(d)));
      for (const item of updated) {
        await apiFetch(`/api/projects/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        });
      }
    } catch (err) {
      console.error("Backend setProjects API delta sync failed:", err);
    }
  }

  // Pricing CRUD
  public getPricing(): DBPricing[] {
    try {
      const stored = getStorage()?.getItem(KEYS.PRICING);
      return stored ? JSON.parse(stored) as DBPricing[] : DEFAULT_PRICING;
    } catch {
      return DEFAULT_PRICING;
    }
  }

  public async setPricing(data: DBPricing[]) {
    getStorage()?.setItem(KEYS.PRICING, JSON.stringify(data));
    this.notify();
    try {
      await apiFetch("/api/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    } catch (err) {
      console.error("Backend setPricing API sync failed:", err);
    }
  }

  // Process CRUD
  public getProcess(): DBProcessStep[] {
    try {
      const stored = getStorage()?.getItem(KEYS.PROCESS);
      return stored ? JSON.parse(stored) as DBProcessStep[] : DEFAULT_PROCESS;
    } catch {
      return DEFAULT_PROCESS;
    }
  }

  public async setProcess(data: DBProcessStep[]) {
    const old = this.getProcess();
    getStorage()?.setItem(KEYS.PROCESS, JSON.stringify(data));
    this.notify();

    try {
      const deleted = old.filter(o => !data.some(d => d.id === o.id));
      for (const item of deleted) {
        await apiFetch(`/api/process/${item.id}`, { method: "DELETE" });
      }
      
      const added = data.filter(d => !old.some(o => o.id === d.id));
      for (const item of added) {
        await apiFetch("/api/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        });
      }

      // Find updated
      const updated = data.filter(d => old.some(o => o.id === d.id && JSON.stringify(o) !== JSON.stringify(d)));
      for (const item of updated) {
        await apiFetch(`/api/process/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        });
      }
    } catch (err) {
      console.error("Backend setProcess API delta sync failed:", err);
    }
  }

  // FAQs CRUD
  public getFaqs(): DBFaq[] {
    try {
      const stored = getStorage()?.getItem(KEYS.FAQS);
      return stored ? JSON.parse(stored) as DBFaq[] : DEFAULT_FAQS;
    } catch {
      return DEFAULT_FAQS;
    }
  }

  public async setFaqs(data: DBFaq[]) {
    const old = this.getFaqs();
    getStorage()?.setItem(KEYS.FAQS, JSON.stringify(data));
    this.notify();

    try {
      const deleted = old.filter(o => !data.some(d => d.id === o.id));
      for (const item of deleted) {
        await apiFetch(`/api/faqs/${item.id}`, { method: "DELETE" });
      }
      
      const added = data.filter(d => !old.some(o => o.id === d.id));
      for (const item of added) {
        await apiFetch("/api/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        });
      }

      // Find updated
      const updated = data.filter(d => old.some(o => o.id === d.id && JSON.stringify(o) !== JSON.stringify(d)));
      for (const item of updated) {
        await apiFetch(`/api/faqs/${item.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item)
        });
      }
    } catch (err) {
      console.error("Backend setFaqs API delta sync failed:", err);
    }
  }

  // Categories helper methods
  public getCategories(): string[] {
    try {
      const stored = getStorage()?.getItem(KEYS.CATEGORIES);
      if (!stored) return ["B2B Website", "Business Software", "Web Application"];
      const items = JSON.parse(stored);
      return items.map((c: string | DBCategory) => typeof c === "string" ? c : c.name);
    } catch {
      return ["B2B Website", "Business Software", "Web Application"];
    }
  }

  public async addCategory(name: string) {
    const cleanName = name.trim();
    if (!cleanName) return;
    const cats = this.getCategories();
    if (cats.includes(cleanName)) return;
    const list = [...cats, cleanName];
    getStorage()?.setItem(KEYS.CATEGORIES, JSON.stringify(list.map(n => ({ name: n }))));
    this.notify();
    try {
      await apiFetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName })
      });
    } catch (err) {
      console.error("Backend addCategory failed:", err);
    }
  }

  public async deleteCategory(name: string) {
    const cats = this.getCategories().filter(c => c !== name);
    getStorage()?.setItem(KEYS.CATEGORIES, JSON.stringify(cats.map(n => ({ name: n }))));
    this.notify();
    try {
      await apiFetch(`/api/categories/${encodeURIComponent(name)}`, { method: "DELETE" });
    } catch (err) {
      console.error("Backend deleteCategory failed:", err);
    }
  }
}

export const db = new CMSDatabase();
