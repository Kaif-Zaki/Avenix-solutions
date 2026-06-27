import React, { useState } from "react";
import { 
  db, 
  iconRegistry, 
  DBCompany, 
  DBService, 
  DBProject, 
  DBPricing, 
  DBFaq,
  DBProcessStep
} from "@/lib/db";
import { 
  Lock, 
  Settings, 
  Layers, 
  Briefcase, 
  DollarSign, 
  HelpCircle, 
  Save, 
  Plus, 
  Trash2, 
  LogOut, 
  RotateCcw,
  CheckCircle,
  Sparkles,
  User,
  Edit3,
  Menu,
  X,
  Tag,
  Inbox
} from "lucide-react";
import toast from "react-hot-toast";
import { apiFetch, mediaUrl } from "@/lib/api";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("avenix_admin_authenticated") === "true";
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"general" | "services" | "projects" | "categories" | "pricing" | "faqs" | "process" | "profile" | "inquiries">("general");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // CMS States
  const [company, setCompany] = useState<DBCompany>(() => db.getCompany());
  const [services, setServices] = useState<DBService[]>(() => db.getServices());
  const [projects, setProjects] = useState<DBProject[]>(() => db.getProjects());
  const [pricing, setPricing] = useState<DBPricing[]>(() => db.getPricing());
  const [faqs, setFaqs] = useState<DBFaq[]>(() => db.getFaqs());
  const [process, setProcess] = useState<DBProcessStep[]>(() => db.getProcess());
  const [categories, setCategories] = useState<string[]>(() => db.getCategories());
  const [categoryInput, setCategoryInput] = useState("");
  const [inquiries, setInquiries] = useState<any[]>([]);

  // Edit States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editService, setEditService] = useState<DBService | null>(null);
  const [editProject, setEditProject] = useState<DBProject | null>(null);
  const [editProcess, setEditProcess] = useState<DBProcessStep | null>(null);
  const [editFaq, setEditFaq] = useState<DBFaq | null>(null);

  // Profile States
  const [profileEmail, setProfileEmail] = useState(() => {
    return localStorage.getItem("avenix_admin_email") || "admin@avenixsolutions.com";
  });
  const [profilePassword, setProfilePassword] = useState("");
  const [profileConfirmPassword, setProfileConfirmPassword] = useState("");

  // Features, Outcomes & Metrics Text Field States to avoid caret issues
  const [newServiceOutcomes, setNewServiceOutcomes] = useState("");
  const [newProjectMetrics, setNewProjectMetrics] = useState("");
  const [editServiceOutcomes, setEditServiceOutcomes] = useState("");
  const [editProjectMetrics, setEditProjectMetrics] = useState("");
  const [pricingFeaturesText, setPricingFeaturesText] = useState<string[]>(() => 
    db.getPricing().map(p => p.features.join(", "))
  );

  React.useEffect(() => {
    return db.subscribe(() => {
      setCompany(db.getCompany());
      setServices(db.getServices());
      setProjects(db.getProjects());
      const pr = db.getPricing();
      setPricing(pr);
      setPricingFeaturesText(pr.map(p => p.features.join(", ")));
      setFaqs(db.getFaqs());
      setProcess(db.getProcess());
      const cats = db.getCategories();
      setCategories(cats);
      setNewProject(prev => {
        if (!prev.category && cats.length > 0) {
          return { ...prev, category: cats[0] };
        }
        return prev;
      });
    });
  }, []);

  React.useEffect(() => {
    if (isAuthenticated) {
      const fetchInquiries = async () => {
        try {
          const res = await apiFetch("/api/inquiries");
          if (res.ok) {
            const data = await res.json();
            setInquiries(data);
          }
        } catch (err) {
          console.error("Failed to load inquiries:", err);
        }
      };
      fetchInquiries();
    }
  }, [isAuthenticated]);

  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete/resolve this customer inquiry?")) {
      return;
    }
    try {
      const res = await apiFetch(`/api/inquiries/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setInquiries(prev => prev.filter(i => i._id !== id));
        toast.success("Inquiry removed.");
      } else {
        toast.error("Failed to delete inquiry.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error.");
    }
  };

  // Form templates
  const [newService, setNewService] = useState<Omit<DBService, "id">>({
    title: "",
    description: "",
    iconName: "Code2",
    outcomes: []
  });

  const [newProject, setNewProject] = useState<Omit<DBProject, "id">>(() => {
    const cats = db.getCategories();
    return {
      title: "",
      category: cats[0] || "Web Application",
      description: "",
      iconName: "BriefcaseBusiness",
      palette: "from-sky-600 via-teal-500 to-emerald-700",
      metrics: [],
      imageUrl: "",
      liveUrl: ""
    };
  });

  const [newFaq, setNewFaq] = useState<Omit<DBFaq, "id">>({
    question: "",
    answer: ""
  });

  const [newProcess, setNewProcess] = useState<Omit<DBProcessStep, "id">>({
    title: "",
    description: "",
    iconName: "SearchCheck"
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Email validation regex check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const res = await apiFetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem("avenix_admin_authenticated", "true");
        localStorage.setItem("avenix_admin_email", data.email);
        setProfileEmail(data.email);
        toast.success("Welcome back, Administrator!", { icon: "🔐" });
      } else {
        toast.error(data.error || "Incorrect email or password. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to connect to login server. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("avenix_admin_authenticated");
    localStorage.removeItem("avenix_admin_email");
    setIsAuthenticated(false);
    toast.success("Logged out successfully.");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profileEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (profilePassword && profilePassword !== profileConfirmPassword) {
      toast.error("Passwords do not match. Please verify.");
      return;
    }

    try {
      const res = await apiFetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profileEmail,
          password: profilePassword || undefined
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("avenix_admin_email", data.email);
        setProfilePassword("");
        setProfileConfirmPassword("");
        toast.success("Admin credentials updated successfully!");
      } else {
        toast.error(data.error || "Failed to update profile.");
      }
    } catch (err) {
      toast.error("Failed to connect to backend profile server.");
    }
  };

  // Edit action handlers
  const handleSaveEditService = () => {
    if (!editService || !editService.title) return;
    const updated = {
      ...editService,
      outcomes: editServiceOutcomes.split(",").map(t => t.trim()).filter(Boolean)
    };
    const list = services.map(s => s.id === editService.id ? updated : s);
    db.setServices(list);
    setServices(list);
    setEditingId(null);
    setEditService(null);
    setEditServiceOutcomes("");
    toast.success("Service updated successfully!");
  };

  const handleSaveEditProject = () => {
    if (!editProject || !editProject.title) return;
    const updated = {
      ...editProject,
      metrics: editProjectMetrics.split(",").map(t => t.trim()).filter(Boolean)
    };
    const list = projects.map(p => p.id === editProject.id ? updated : p);
    db.setProjects(list);
    setProjects(list);
    setEditingId(null);
    setEditProject(null);
    setEditProjectMetrics("");
    toast.success("Project updated successfully!");
  };

  const handleSaveEditProcess = () => {
    if (!editProcess || !editProcess.title) return;
    const list = process.map(p => p.id === editProcess.id ? editProcess : p);
    db.setProcess(list);
    setProcess(list);
    setEditingId(null);
    setEditProcess(null);
    toast.success("Process step updated successfully!");
  };

  const handleSaveEditFaq = () => {
    if (!editFaq || !editFaq.question) return;
    const list = faqs.map(f => f.id === editFaq.id ? editFaq : f);
    db.setFaqs(list);
    setFaqs(list);
    setEditingId(null);
    setEditFaq(null);
    toast.success("FAQ updated successfully!");
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to restore default template settings? All custom edits will be lost.")) {
      db.resetToDefaults();
      setCompany(db.getCompany());
      setServices(db.getServices());
      setProjects(db.getProjects());
      setPricing(db.getPricing());
      setFaqs(db.getFaqs());
      setProcess(db.getProcess());
      toast.success("Database restored to template defaults.");
    }
  };

  // General Settings save
  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    db.setCompany(company);
    toast.success("General site configuration updated!");
  };

  const handleClearCloudinary = async () => {
    if (!window.confirm("Are you sure you want to delete ALL images from your Cloudinary folder? This will clean up the folder but any projects using these image URLs will show broken images! This action CANNOT be undone.")) {
      return;
    }

    const toastId = toast.loading("Clearing Cloudinary folder...");
    try {
      const res = await apiFetch("/api/cloudinary/clear", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(`Cloudinary cleared successfully! Deleted ${data.deleted?.length || 0} images.`, { id: toastId });
      } else {
        toast.error(data.error || "Failed to clear Cloudinary folder.", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Network or server connection failed.", { id: toastId });
    }
  };

  // Services actions
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title) return;
    const item: DBService = {
      ...newService,
      id: "s_" + Date.now(),
      outcomes: newServiceOutcomes.split(",").map(t => t.trim()).filter(Boolean)
    };
    const list = [...services, item];
    db.setServices(list);
    setServices(list);
    setNewService({ title: "", description: "", iconName: "Code2", outcomes: [] });
    setNewServiceOutcomes("");
    toast.success("New service added successfully!");
  };

  const handleDeleteService = (id: string) => {
    const list = services.filter(s => s.id !== id);
    db.setServices(list);
    setServices(list);
    toast.success("Service removed.");
  };

  // Projects actions
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, mode: "new" | "edit") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const uploadToast = toast.loading("Uploading image to Cloudinary...");

    try {
      const res = await apiFetch("/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const urlToUse = data.imageUrl || data.filePath;
        if (mode === "new") {
          setNewProject(prev => ({ ...prev, imageUrl: urlToUse }));
        } else if (mode === "edit" && editProject) {
          setEditProject(prev => prev ? ({ ...prev, imageUrl: urlToUse }) : null);
        }
        toast.success("Image uploaded successfully!", { id: uploadToast });
      } else {
        toast.error(data.error || "Image upload failed.", { id: uploadToast });
      }
    } catch (err) {
      toast.error("Connection failed. Could not upload image.", { id: uploadToast });
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title) return;
    const item: DBProject = {
      ...newProject,
      id: "p_" + Date.now(),
      category: newProject.category || categories[0] || "Web Application",
      metrics: newProjectMetrics.split(",").map(t => t.trim()).filter(Boolean)
    };
    const list = [...projects, item];
    db.setProjects(list);
    setProjects(list);
    setNewProject({
      title: "",
      category: categories[0] || "Web Application",
      description: "",
      iconName: "BriefcaseBusiness",
      palette: "from-sky-600 via-teal-500 to-emerald-700",
      metrics: [],
      imageUrl: "",
      liveUrl: ""
    });
    setNewProjectMetrics("");
    toast.success("New project added to portfolio!");
  };

  const handleDeleteProject = (id: string) => {
    const list = projects.filter(p => p.id !== id);
    db.setProjects(list);
    setProjects(list);
    toast.success("Project removed.");
  };

  // Process actions
  const handleAddProcess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProcess.title) return;
    const item: DBProcessStep = {
      ...newProcess,
      id: "ps_" + Date.now()
    };
    const list = [...process, item];
    db.setProcess(list);
    setProcess(list);
    setNewProcess({ title: "", description: "", iconName: "SearchCheck" });
    toast.success("New process timeline step added!");
  };

  const handleDeleteProcess = (id: string) => {
    const list = process.filter(p => p.id !== id);
    db.setProcess(list);
    setProcess(list);
    toast.success("Process step removed.");
  };

  // Pricing actions
  const handleUpdatePricingTier = (index: number, key: keyof DBPricing, value: string | boolean | string[]) => {
    const list = [...pricing];
    list[index] = { ...list[index], [key]: value } as DBPricing;
    setPricing(list);
  };

  const handleUpdateFeaturesText = (tIdx: number, val: string) => {
    setPricingFeaturesText(prev => {
      const copy = [...prev];
      copy[tIdx] = val;
      return copy;
    });
  };

  const handleSavePricing = () => {
    const updatedPricing = pricing.map((tier, idx) => ({
      ...tier,
      features: (pricingFeaturesText[idx] || "").split(",").map(f => f.trim()).filter(Boolean)
    }));
    db.setPricing(updatedPricing);
    toast.success("Pricing tiers saved.");
  };

  // FAQ actions
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaq.question) return;
    const item: DBFaq = {
      ...newFaq,
      id: "f_" + Date.now()
    };
    const list = [...faqs, item];
    db.setFaqs(list);
    setFaqs(list);
    setNewFaq({ question: "", answer: "" });
    toast.success("New FAQ added!");
  };

  const handleDeleteFaq = (id: string) => {
    const list = faqs.filter(f => f.id !== id);
    db.setFaqs(list);
    setFaqs(list);
    toast.success("FAQ removed.");
  };

  // Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#17211f] p-4 text-white">
        {/* Glow ambient effects */}
        <div className="absolute right-[-10%] top-[-10%] h-[30rem] w-[30rem] rounded-full bg-[#e7b464]/5 blur-[100px]" />
        <div className="absolute left-[-10%] bottom-[-10%] h-[30rem] w-[30rem] rounded-full bg-[#4e8f7a]/5 blur-[100px]" />
        
        <div className="relative z-10 w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-md">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#e7b464]/10 text-[#e7b464]">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-center text-2xl font-bold tracking-tight">Avenix CMS Portal</h1>
          <p className="mt-2 text-center text-sm text-stone-400">
            Secure admin content editor portal. Please enter your administrator key.
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@avenixsolutions.com"
                className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white placeholder-stone-500 outline-none transition focus:border-[#e7b464] focus:ring-4 focus:ring-[#e7b464]/10 mb-4"
              />

              <label className="block text-xs font-bold uppercase tracking-wider text-stone-300">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-sm text-white placeholder-stone-500 outline-none transition focus:border-[#e7b464] focus:ring-4 focus:ring-[#e7b464]/10"
              />
            </div>

            <button
              type="submit"
              className="mt-6 flex min-h-12 w-full items-center justify-center rounded-lg bg-[#e7b464] px-6 text-sm font-bold text-stone-950 transition hover:bg-[#f1c77e]"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#17211f] text-white flex flex-col lg:flex-row">
      
      {/* Mobile top bar */}
      <div className="flex items-center justify-between bg-[#1b2724] border-b border-white/10 p-4 lg:hidden sticky top-0 z-30 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="rounded-lg bg-white/5 p-2 border border-white/10 text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-black uppercase tracking-wider">{company.name} CMS</span>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-600/10 border border-red-500/25 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-600 hover:text-white transition"
        >
          Logout
        </button>
      </div>

      {/* Sidebar Backdrop Overlay on Mobile */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-45 lg:hidden" 
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      
      {/* Left Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-[#1b2724] border-r border-white/10 flex flex-col z-50 transition-transform duration-300 lg:static lg:translate-x-0 ${
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-[#e7b464]" />
            <div>
              <h1 className="text-base font-black uppercase tracking-wider">{company.name}</h1>
              <p className="text-[11px] text-stone-400">CMS Control Panel</p>
            </div>
          </div>
          {/* Close button on mobile */}
          <button 
            onClick={() => setMobileSidebarOpen(false)}
            className="rounded-full bg-white/5 p-1.5 border border-white/10 text-stone-400 hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {(
            [
              { id: "general", label: "General Settings", icon: Settings },
              { id: "services", label: "Services CMS", icon: Layers },
              { id: "projects", label: "Portfolio CMS", icon: Briefcase },
              { id: "categories", label: "Categories CMS", icon: Tag },
              { id: "pricing", label: "Pricing Tiers", icon: DollarSign },
              { id: "process", label: "Process Steps", icon: CheckCircle },
              { id: "faqs", label: "FAQs CMS", icon: HelpCircle },
              { id: "inquiries", label: "Customer Leads", icon: Inbox },
              { id: "profile", label: "Profile Settings", icon: User },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-[#e7b464] text-stone-950 shadow-md shadow-[#e7b464]/10"
                  : "text-stone-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <tab.icon className="h-4.5 w-4.5" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-2.5 rounded-lg border border-[#e7b464]/20 bg-[#e7b464]/5 px-4 py-2.5 text-xs font-bold text-[#e7b464] transition hover:bg-[#e7b464]/10 hover:text-white"
          >
            <Sparkles className="h-4 w-4" />
            Preview Live Site
          </a>
          <button
            onClick={handleReset}
            className="flex w-full items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-stone-300 transition hover:bg-white/10 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Defaults
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg bg-red-600/10 border border-red-500/25 px-4 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-600 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout Portal
          </button>
        </div>
      </aside>

      {/* Main Editing Canvas */}
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto h-full">
        <div className="max-w-4xl mx-auto rounded-xl border border-white/10 bg-white/5 p-6 md:p-8 backdrop-blur-md shadow-2xl">
          
          {/* GENERAL INFO PANEL */}
          {activeTab === "general" && (
            <div>
              <h2 className="text-xl font-bold tracking-tight border-b border-white/10 pb-4">General Site Settings</h2>
              <form onSubmit={handleSaveCompany} className="mt-6 space-y-5 max-w-2xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Company Name</span>
                    <input
                      type="text"
                      required
                      value={company.name}
                      onChange={(e) => setCompany({ ...company, name: e.target.value })}
                      className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-4 text-sm text-white outline-none focus:border-[#e7b464]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">WhatsApp Link</span>
                    <input
                      type="text"
                      required
                      value={company.whatsapp}
                      onChange={(e) => setCompany({ ...company, whatsapp: e.target.value })}
                      className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-4 text-sm text-white outline-none focus:border-[#e7b464]"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Site Tagline</span>
                  <input
                    type="text"
                    required
                    value={company.tagline}
                    onChange={(e) => setCompany({ ...company, tagline: e.target.value })}
                    className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-4 text-sm text-white outline-none focus:border-[#e7b464]"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Contact Email</span>
                    <input
                      type="email"
                      required
                      value={company.email}
                      onChange={(e) => setCompany({ ...company, email: e.target.value })}
                      className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-4 text-sm text-white outline-none focus:border-[#e7b464]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Contact Phone</span>
                    <input
                      type="text"
                      required
                      value={company.phone}
                      onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                      className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-4 text-sm text-white outline-none focus:border-[#e7b464]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Office Location</span>
                    <input
                      type="text"
                      required
                      value={company.location}
                      onChange={(e) => setCompany({ ...company, location: e.target.value })}
                      className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-4 text-sm text-white outline-none focus:border-[#e7b464]"
                    />
                  </label>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#e7b464] px-5 py-3 text-sm font-bold text-stone-950 transition hover:bg-[#f1c77e]"
                >
                  <Save className="h-4 w-4" />
                  Save Company Config
                </button>
              </form>

              <div className="mt-8 border-t border-white/10 pt-6 max-w-2xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#e7b464]">Cloudinary Storage Management</h3>
                <p className="mt-1.5 text-xs text-stone-400">
                  Delete all uploaded project images from Cloudinary storage to free up space. This action cannot be undone.
                </p>
                <button
                  type="button"
                  onClick={handleClearCloudinary}
                  className="mt-3.5 inline-flex items-center gap-2 rounded-lg bg-red-650/15 border border-red-500/25 px-4 py-2.5 text-xs font-bold text-red-400 transition hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                  Clean Cloudinary Folder
                </button>
              </div>
            </div>
          )}

          {/* SERVICES CMS PANEL */}
          {activeTab === "services" && (
            <div>
              <h2 className="text-xl font-bold tracking-tight border-b border-white/10 pb-4">Manage Services</h2>
              
              {/* Add form */}
              <form onSubmit={handleAddService} className="mt-5 p-4 rounded-lg bg-white/5 border border-white/5 space-y-4 max-w-3xl">
                <p className="text-xs font-bold uppercase text-[#e7b464]">Add New Service Card</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="block sm:col-span-2">
                    <span className="text-[11px] font-bold text-stone-400">Service Title</span>
                    <input
                      type="text"
                      required
                      value={newService.title}
                      onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                      placeholder="e.g. Mobile Application Builds"
                      className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-bold text-stone-400">Icon Component</span>
                    <select
                      value={newService.iconName}
                      onChange={(e) => setNewService({ ...newService, iconName: e.target.value })}
                      className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                    >
                      {Object.keys(iconRegistry).map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="text-[11px] font-bold text-stone-400">Description</span>
                  <input
                    type="text"
                    required
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    placeholder="Short description summary..."
                    className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-stone-400">Outcome Tags (Comma-separated)</span>
                  <input
                    type="text"
                    value={newServiceOutcomes}
                    onChange={(e) => setNewServiceOutcomes(e.target.value)}
                    placeholder="Fast UI, Database sync, API hooks"
                    className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#e7b464] px-4 py-2 text-xs font-bold text-stone-950 hover:bg-[#f1c77e]"
                >
                  <Plus className="h-4 w-4" />
                  Create Service
                </button>
              </form>

              {/* List */}
              <div className="mt-6 space-y-3 max-w-4xl">
                <p className="text-xs font-bold uppercase text-stone-400 tracking-wider">Current Services</p>
                {services.map((item) => {
                  const isEditing = editingId === item.id && editService;
                  return (
                    <div key={item.id} className="p-4 rounded-lg bg-[#1e2a27] border border-white/5 shadow-sm space-y-3">
                      {isEditing ? (
                        <div className="space-y-3">
                          <p className="text-[11px] font-bold text-[#e7b464] uppercase">Editing Service Card</p>
                          <div className="grid gap-3 sm:grid-cols-3">
                            <label className="block sm:col-span-2">
                              <span className="text-[10px] font-bold text-stone-400">Title</span>
                              <input
                                type="text"
                                required
                                value={editService.title}
                                onChange={(e) => setEditService({ ...editService, title: e.target.value })}
                                className="mt-1 min-h-9 w-full rounded border border-white/10 bg-[#16201d] px-3 text-xs outline-none focus:border-[#e7b464]"
                              />
                            </label>
                            <label className="block">
                              <span className="text-[10px] font-bold text-stone-400">Icon</span>
                              <select
                                value={editService.iconName}
                                onChange={(e) => setEditService({ ...editService, iconName: e.target.value })}
                                className="mt-1 min-h-9 w-full rounded border border-white/10 bg-[#16201d] px-3 text-xs outline-none focus:border-[#e7b464]"
                              >
                                {Object.keys(iconRegistry).map(name => (
                                  <option key={name} value={name}>{name}</option>
                                ))}
                              </select>
                            </label>
                          </div>
                          
                          <label className="block">
                            <span className="text-[10px] font-bold text-stone-400">Description</span>
                            <textarea
                              rows={2}
                              value={editService.description}
                              onChange={(e) => setEditService({ ...editService, description: e.target.value })}
                              className="mt-1 w-full rounded border border-white/10 bg-[#16201d] p-3 text-xs outline-none focus:border-[#e7b464]"
                            />
                          </label>

                          <label className="block">
                            <span className="text-[10px] font-bold text-stone-400">Outcomes (Comma-separated)</span>
                            <input
                              type="text"
                              value={editServiceOutcomes}
                              onChange={(e) => setEditServiceOutcomes(e.target.value)}
                              className="mt-1 min-h-9 w-full rounded border border-white/10 bg-[#16201d] px-3 text-xs outline-none focus:border-[#e7b464]"
                            />
                          </label>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleSaveEditService}
                              className="rounded bg-[#e7b464] px-3 py-1.5 text-[11px] font-bold text-stone-950 hover:bg-[#f1c77e]"
                            >
                              Save Changes
                            </button>
                            <button
                              type="button"
                              onClick={() => { setEditingId(null); setEditService(null); }}
                              className="rounded border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-stone-300 hover:bg-white/10"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-white text-sm flex items-center gap-2">
                              {item.title}
                              <span className="text-xs text-stone-400 font-normal">({item.iconName})</span>
                            </h4>
                            <p className="text-xs text-stone-300 mt-1">{item.description}</p>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {item.outcomes.map(outcome => (
                                <span key={outcome} className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] text-stone-300">{outcome}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(item.id);
                                setEditService(item);
                                setEditServiceOutcomes(item.outcomes.join(", "));
                              }}
                              className="rounded bg-white/5 p-2 border border-white/10 text-stone-300 hover:bg-[#e7b464] hover:text-stone-950"
                              title="Edit service"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteService(item.id)}
                              className="rounded bg-red-600/10 p-2 border border-red-500/15 text-red-400 hover:bg-red-600 hover:text-white"
                              title="Delete service"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PORTFOLIO CMS PANEL */}
          {activeTab === "projects" && (
            <div>
              <h2 className="text-xl font-bold tracking-tight border-b border-white/10 pb-4">Manage Portfolio Projects</h2>
              
              {/* Add form */}
              <form onSubmit={handleAddProject} className="mt-5 p-4 rounded-lg bg-white/5 border border-white/5 space-y-4 max-w-3xl">
                <p className="text-xs font-bold uppercase text-[#e7b464]">Add New Showcase Project</p>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[11px] font-bold text-stone-400">Project Name/Title</span>
                    <input
                      type="text"
                      required
                      value={newProject.title}
                      onChange={(e) => setNewProject(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Retail POS Command Center"
                      className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-bold text-stone-400">Project Category</span>
                    <select
                      required
                      value={newProject.category}
                      onChange={(e) => setNewProject(prev => ({ ...prev, category: e.target.value }))}
                      className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                    >
                      {!categories.includes(newProject.category) && newProject.category && (
                        <option value={newProject.category}>{newProject.category}</option>
                      )}
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-[11px] font-bold text-stone-400">Lucide Icon</span>
                    <select
                      value={newProject.iconName}
                      onChange={(e) => setNewProject(prev => ({ ...prev, iconName: e.target.value }))}
                      className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                    >
                      {Object.keys(iconRegistry).map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-bold text-stone-400">Tailwind Gradient Classes</span>
                    <input
                      type="text"
                      required
                      value={newProject.palette}
                      onChange={(e) => setNewProject(prev => ({ ...prev, palette: e.target.value }))}
                      placeholder="from-emerald-600 via-teal-500 to-stone-700"
                      className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-[11px] font-bold text-stone-400">Description Summary</span>
                  <input
                    type="text"
                    required
                    value={newProject.description}
                    onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Short summary of project features and capabilities..."
                    className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-stone-400">Performance Metrics (Comma-separated)</span>
                  <input
                    type="text"
                    value={newProjectMetrics}
                    onChange={(e) => setNewProjectMetrics(e.target.value)}
                    placeholder="e.g. 3 branches, Live stock, Daily reports"
                    className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-stone-400">Live Project URL (Optional)</span>
                  <input
                    type="url"
                    value={newProject.liveUrl || ""}
                    onChange={(e) => setNewProject(prev => ({ ...prev, liveUrl: e.target.value }))}
                    placeholder="e.g. https://avenixsolutions.com"
                    className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] font-bold text-stone-400">Project Image (Optional)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "new")}
                    className="mt-1.5 w-full text-xs text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-bold file:bg-[#e7b464] file:text-stone-950 hover:file:bg-[#f1c77e]"
                  />
                  {newProject.imageUrl && (
                    <div className="mt-2 relative w-32 h-20 rounded overflow-hidden border border-white/10">
                      <img src={mediaUrl(newProject.imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewProject(prev => ({ ...prev, imageUrl: "" }))}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 text-[10px]"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#e7b464] px-4 py-2 text-xs font-bold text-stone-950 hover:bg-[#f1c77e]"
                >
                  <Plus className="h-4 w-4" />
                  Create Portfolio Project
                </button>
              </form>



              {/* List */}
              <div className="mt-6 space-y-3 max-w-4xl">
                <p className="text-xs font-bold uppercase text-stone-400 tracking-wider">Current Portfolio Items</p>
                {projects.map((item) => {
                  const isEditing = editingId === item.id && editProject;
                  return (
                    <div key={item.id} className="p-4 rounded-lg bg-[#1e2a27] border border-white/5 shadow-sm space-y-3">
                      {isEditing ? (
                        <div className="space-y-3">
                          <p className="text-[11px] font-bold text-[#e7b464] uppercase">Editing Portfolio Project</p>
                           <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block">
                              <span className="text-[10px] font-bold text-stone-400">Project Title</span>
                              <input
                                type="text"
                                required
                                value={editProject.title}
                                onChange={(e) => setEditProject(prev => prev ? ({ ...prev, title: e.target.value }) : null)}
                                className="mt-1 min-h-9 w-full rounded border border-white/10 bg-[#16201d] px-3 text-xs outline-none focus:border-[#e7b464]"
                              />
                            </label>
                            <label className="block">
                              <span className="text-[10px] font-bold text-stone-400">Category</span>
                              <select
                                required
                                value={editProject.category}
                                onChange={(e) => setEditProject(prev => prev ? ({ ...prev, category: e.target.value }) : null)}
                                className="mt-1 min-h-9 w-full rounded border border-white/10 bg-[#16201d] px-3 text-xs outline-none focus:border-[#e7b464]"
                              >
                                {!categories.includes(editProject.category) && editProject.category && (
                                  <option value={editProject.category}>{editProject.category}</option>
                                )}
                                {categories.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block">
                              <span className="text-[10px] font-bold text-stone-400">Icon</span>
                              <select
                                value={editProject.iconName}
                                onChange={(e) => setEditProject(prev => prev ? ({ ...prev, iconName: e.target.value }) : null)}
                                className="mt-1 min-h-9 w-full rounded border border-white/10 bg-[#16201d] px-3 text-xs outline-none focus:border-[#e7b464]"
                              >
                                {Object.keys(iconRegistry).map(name => (
                                  <option key={name} value={name}>{name}</option>
                                ))}
                              </select>
                            </label>
                            <label className="block">
                              <span className="text-[10px] font-bold text-stone-400">Tailwind Gradient Palette</span>
                              <input
                                type="text"
                                required
                                value={editProject.palette}
                                onChange={(e) => setEditProject(prev => prev ? ({ ...prev, palette: e.target.value }) : null)}
                                className="mt-1 min-h-9 w-full rounded border border-white/10 bg-[#16201d] px-3 text-xs outline-none focus:border-[#e7b464]"
                              />
                            </label>
                          </div>

                          <label className="block">
                            <span className="text-[10px] font-bold text-stone-400">Description Summary</span>
                            <textarea
                              rows={2}
                              value={editProject.description}
                              onChange={(e) => setEditProject(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                              className="mt-1 w-full rounded border border-white/10 bg-[#16201d] p-3 text-xs outline-none focus:border-[#e7b464]"
                            />
                          </label>

                          <label className="block">
                            <span className="text-[10px] font-bold text-stone-400">Performance Metrics (Comma-separated)</span>
                            <input
                              type="text"
                              value={editProjectMetrics}
                              onChange={(e) => setEditProjectMetrics(e.target.value)}
                              className="mt-1 min-h-9 w-full rounded border border-white/10 bg-[#16201d] px-3 text-xs outline-none focus:border-[#e7b464]"
                            />
                          </label>

                          <label className="block">
                            <span className="text-[10px] font-bold text-stone-400">Live Project URL (Optional)</span>
                            <input
                              type="url"
                              value={editProject.liveUrl || ""}
                              onChange={(e) => setEditProject(prev => prev ? ({ ...prev, liveUrl: e.target.value }) : null)}
                              placeholder="e.g. https://avenixsolutions.com"
                              className="mt-1 min-h-9 w-full rounded border border-white/10 bg-[#16201d] px-3 text-xs outline-none focus:border-[#e7b464]"
                            />
                          </label>

                          <label className="block">
                            <span className="text-[10px] font-bold text-stone-400">Project Image (Optional)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, "edit")}
                              className="mt-1.5 w-full text-xs text-stone-400 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-[10px] file:font-bold file:bg-[#e7b464] file:text-stone-950 hover:file:bg-[#f1c77e]"
                            />
                            {editProject.imageUrl && (
                              <div className="mt-2 relative w-24 h-16 rounded overflow-hidden border border-white/10">
                                <img src={mediaUrl(editProject.imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setEditProject(prev => prev ? ({ ...prev, imageUrl: "" }) : null)}
                                  className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full p-0.5 text-[8px]"
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </label>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleSaveEditProject}
                              className="rounded bg-[#e7b464] px-3 py-1.5 text-[11px] font-bold text-stone-950 hover:bg-[#f1c77e]"
                            >
                              Save Changes
                            </button>
                            <button
                              type="button"
                              onClick={() => { setEditingId(null); setEditProject(null); }}
                              className="rounded border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-stone-300 hover:bg-white/10"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#e7b464]">{item.category}</span>
                            <h4 className="font-bold text-white text-sm mt-0.5 flex items-center gap-2">
                              {item.title}
                              <span className="text-xs text-stone-400 font-normal">({item.iconName})</span>
                            </h4>
                            <p className="text-xs text-stone-300 mt-1">{item.description}</p>
                            {item.liveUrl && (
                              <p className="text-[10px] text-stone-400 mt-1.5 flex items-center gap-1.5">
                                <span className="font-bold text-[#e7b464]">Live Link:</span> 
                                <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-sky-400 break-all">{item.liveUrl}</a>
                              </p>
                            )}
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {item.metrics.map(metric => (
                                <span key={metric} className="rounded bg-[#23443d]/20 border border-[#23443d]/30 px-2 py-0.5 text-[10px] text-stone-200">{metric}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(item.id);
                                setEditProject(item);
                                setEditProjectMetrics(item.metrics.join(", "));
                              }}
                              className="rounded bg-white/5 p-2 border border-white/10 text-stone-300 hover:bg-[#e7b464] hover:text-stone-950"
                              title="Edit project"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProject(item.id)}
                              className="rounded bg-red-600/10 p-2 border border-red-500/15 text-red-400 hover:bg-red-600 hover:text-white"
                              title="Delete project"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PORTFOLIO CATEGORIES CMS PANEL */}
          {activeTab === "categories" && (
            <div>
              <h2 className="text-xl font-bold tracking-tight border-b border-white/10 pb-4">Manage Portfolio Categories</h2>
              
              {/* Category Management Widget */}
              <div className="mt-5 p-6 rounded-lg bg-white/5 border border-white/5 space-y-4 max-w-3xl">
                <p className="text-xs font-bold uppercase text-[#e7b464] tracking-wider font-semibold">Add New Category</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    placeholder="New category name (e.g. SaaS App)"
                    className="min-h-10 flex-1 rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      const clean = categoryInput.trim();
                      if (!clean) {
                        toast.error("Category name cannot be empty.");
                        return;
                      }
                      if (categories.includes(clean)) {
                        toast.error("Category already exists.");
                        return;
                      }
                      await db.addCategory(clean);
                      setCategories(db.getCategories());
                      setCategoryInput("");
                      toast.success(`Category "${clean}" added!`);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#e7b464] px-4 py-2 text-xs font-bold text-stone-950 hover:bg-[#f1c77e]"
                  >
                    <Plus className="h-4 w-4" />
                    Add Category
                  </button>
                </div>
                
                {/* Active Categories List */}
                <div className="mt-4">
                  <span className="text-[11px] font-bold text-stone-400">Active Categories:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {categories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#1e2a27] border border-white/10 px-3 py-1.5 text-xs text-stone-300"
                      >
                        {cat}
                        <button
                          type="button"
                          onClick={async () => {
                            if (confirm(`Are you sure you want to delete category "${cat}"? Projects using this category won't be deleted but will keep their current category.`)) {
                              await db.deleteCategory(cat);
                              setCategories(db.getCategories());
                              toast.success(`Category "${cat}" deleted.`);
                            }
                          }}
                          className="text-red-400 hover:text-red-200 font-bold ml-1"
                          title="Delete Category"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROCESS CMS PANEL */}
          {activeTab === "process" && (
            <div>
              <h2 className="text-xl font-bold tracking-tight border-b border-white/10 pb-4">Manage Process Steps</h2>
              
              {/* Add form */}
              <form onSubmit={handleAddProcess} className="mt-5 p-4 rounded-lg bg-white/5 border border-white/5 space-y-4 max-w-3xl">
                <p className="text-xs font-bold uppercase text-[#e7b464]">Add New Process Timeline Step</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="block sm:col-span-2">
                    <span className="text-[11px] font-bold text-stone-400">Step Title</span>
                    <input
                      type="text"
                      required
                      value={newProcess.title}
                      onChange={(e) => setNewProcess({ ...newProcess, title: e.target.value })}
                      placeholder="e.g. Maintenance & Support"
                      className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[11px] font-bold text-stone-400">Icon Component</span>
                    <select
                      value={newProcess.iconName}
                      onChange={(e) => setNewProcess({ ...newProcess, iconName: e.target.value })}
                      className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                    >
                      {Object.keys(iconRegistry).map(name => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="text-[11px] font-bold text-stone-400">Description Summary</span>
                  <input
                    type="text"
                    required
                    value={newProcess.description}
                    onChange={(e) => setNewProcess({ ...newProcess, description: e.target.value })}
                    placeholder="Describe what occurs during this process phase..."
                    className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#e7b464] px-4 py-2 text-xs font-bold text-stone-950 hover:bg-[#f1c77e]"
                >
                  <Plus className="h-4 w-4" />
                  Create Process Step
                </button>
              </form>

              {/* List */}
              <div className="mt-6 space-y-3 max-w-4xl">
                <p className="text-xs font-bold uppercase text-stone-400 tracking-wider">Current Process Timeline</p>
                {process.map((item, index) => {
                  const isEditing = editingId === item.id && editProcess;
                  return (
                    <div key={item.id} className="p-4 rounded-lg bg-[#1e2a27] border border-white/5 shadow-sm space-y-3">
                      {isEditing ? (
                        <div className="space-y-3">
                          <p className="text-[11px] font-bold text-[#e7b464] uppercase">Editing Process Step {index + 1}</p>
                          <div className="grid gap-3 sm:grid-cols-3">
                            <label className="block sm:col-span-2">
                              <span className="text-[10px] font-bold text-stone-400">Step Title</span>
                              <input
                                type="text"
                                required
                                value={editProcess.title}
                                onChange={(e) => setEditProcess({ ...editProcess, title: e.target.value })}
                                className="mt-1 min-h-9 w-full rounded border border-white/10 bg-[#16201d] px-3 text-xs outline-none focus:border-[#e7b464]"
                              />
                            </label>
                            <label className="block">
                              <span className="text-[10px] font-bold text-stone-400">Icon</span>
                              <select
                                value={editProcess.iconName}
                                onChange={(e) => setEditProcess({ ...editProcess, iconName: e.target.value })}
                                className="mt-1 min-h-9 w-full rounded border border-white/10 bg-[#16201d] px-3 text-xs outline-none focus:border-[#e7b464]"
                              >
                                {Object.keys(iconRegistry).map(name => (
                                  <option key={name} value={name}>{name}</option>
                                ))}
                              </select>
                            </label>
                          </div>

                          <label className="block">
                            <span className="text-[10px] font-bold text-stone-400">Description Summary</span>
                            <textarea
                              rows={2}
                              value={editProcess.description}
                              onChange={(e) => setEditProcess({ ...editProcess, description: e.target.value })}
                              className="mt-1 w-full rounded border border-white/10 bg-[#16201d] p-3 text-xs outline-none focus:border-[#e7b464]"
                            />
                          </label>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleSaveEditProcess}
                              className="rounded bg-[#e7b464] px-3 py-1.5 text-[11px] font-bold text-stone-950 hover:bg-[#f1c77e]"
                            >
                              Save Changes
                            </button>
                            <button
                              type="button"
                              onClick={() => { setEditingId(null); setEditProcess(null); }}
                              className="rounded border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-stone-300 hover:bg-white/10"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#e7b464]">Step {index + 1}</span>
                            <h4 className="font-bold text-white text-sm mt-0.5 flex items-center gap-2">
                              {item.title}
                              <span className="text-xs text-stone-400 font-normal">({item.iconName})</span>
                            </h4>
                            <p className="text-xs text-stone-300 mt-1">{item.description}</p>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(item.id);
                                setEditProcess(item);
                              }}
                              className="rounded bg-white/5 p-2 border border-white/10 text-stone-300 hover:bg-[#e7b464] hover:text-stone-950"
                              title="Edit step"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProcess(item.id)}
                              className="rounded bg-red-600/10 p-2 border border-red-500/15 text-red-400 hover:bg-red-600 hover:text-white"
                              title="Delete step"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PRICING CMS PANEL */}
          {activeTab === "pricing" && (
            <div>
              <h2 className="text-xl font-bold tracking-tight border-b border-white/10 pb-4">Manage Pricing Tiers</h2>
              
              <div className="mt-6 space-y-6 max-w-4xl">
                {pricing.map((tier, tIdx) => (
                  <div key={tier.id} className="p-5 rounded-lg border border-white/10 bg-white/5 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2">
                      <h4 className="text-lg font-bold text-[#e7b464]">Tier {tIdx + 1}: {tier.name}</h4>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!tier.featured}
                          onChange={(e) => handleUpdatePricingTier(tIdx, "featured", e.target.checked)}
                          className="h-4 w-4 rounded border-stone-600 text-[#e7b464] focus:ring-0 focus:ring-offset-0 bg-transparent"
                        />
                        <span className="text-xs font-semibold">Featured Badge</span>
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="text-[11px] font-bold text-stone-400">Package Name</span>
                        <input
                          type="text"
                          required
                          value={tier.name}
                          onChange={(e) => handleUpdatePricingTier(tIdx, "name", e.target.value)}
                          className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                        />
                      </label>
                      <label className="block">
                        <span className="text-[11px] font-bold text-stone-400">Price text</span>
                        <input
                          type="text"
                          required
                          value={tier.price}
                          onChange={(e) => handleUpdatePricingTier(tIdx, "price", e.target.value)}
                          className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="text-[11px] font-bold text-stone-400">Short Summary description</span>
                      <input
                        type="text"
                        required
                        value={tier.description}
                        onChange={(e) => handleUpdatePricingTier(tIdx, "description", e.target.value)}
                        className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                      />
                    </label>

                    <label className="block">
                      <span className="text-[11px] font-bold text-stone-400">Features List (Comma-separated)</span>
                      <input
                        type="text"
                        value={pricingFeaturesText[tIdx] || ""}
                        onChange={(e) => handleUpdateFeaturesText(tIdx, e.target.value)}
                        className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                      />
                    </label>
                  </div>
                ))}

                <button
                  onClick={handleSavePricing}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#e7b464] px-5 py-3 text-sm font-bold text-stone-950 hover:bg-[#f1c77e]"
                >
                  <Save className="h-4 w-4" />
                  Save Pricing Changes
                </button>
              </div>
            </div>
          )}

          {/* FAQs CMS PANEL */}
          {activeTab === "faqs" && (
            <div>
              <h2 className="text-xl font-bold tracking-tight border-b border-white/10 pb-4">Manage FAQs</h2>
              
              {/* Add form */}
              <form onSubmit={handleAddFaq} className="mt-5 p-4 rounded-lg bg-white/5 border border-white/5 space-y-4 max-w-3xl">
                <p className="text-xs font-bold uppercase text-[#e7b464]">Create New FAQ Question</p>
                <label className="block">
                  <span className="text-[11px] font-bold text-stone-400">Question</span>
                  <input
                    type="text"
                    required
                    value={newFaq.question}
                    onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                    placeholder="e.g. Do you maintain the website after release?"
                    className="mt-1.5 min-h-10 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-3 text-xs outline-none focus:border-[#e7b464]"
                  />
                </label>
                <label className="block">
                  <span className="text-[11px] font-bold text-stone-400">Answer</span>
                  <textarea
                    required
                    rows={4}
                    value={newFaq.answer}
                    onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                    placeholder="e.g. Yes, we support and maintain hosting details..."
                    className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#1e2a27] p-3 text-xs outline-none resize-none focus:border-[#e7b464]"
                  />
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#e7b464] px-4 py-2 text-xs font-bold text-stone-950 hover:bg-[#f1c77e]"
                >
                  <Plus className="h-4 w-4" />
                  Add FAQ
                </button>
              </form>

              {/* List */}
              <div className="mt-6 space-y-3 max-w-4xl">
                <p className="text-xs font-bold uppercase text-stone-400 tracking-wider">Current FAQs</p>
                {faqs.map((item) => {
                  const isEditing = editingId === item.id && editFaq;
                  return (
                    <div key={item.id} className="p-4 rounded-lg bg-[#1e2a27] border border-white/5 shadow-sm space-y-3">
                      {isEditing ? (
                        <div className="space-y-3">
                          <p className="text-[11px] font-bold text-[#e7b464] uppercase">Editing FAQ Question</p>
                          <label className="block">
                            <span className="text-[10px] font-bold text-stone-400">Question</span>
                            <input
                              type="text"
                              required
                              value={editFaq.question}
                              onChange={(e) => setEditFaq({ ...editFaq, question: e.target.value })}
                              className="mt-1 min-h-9 w-full rounded border border-white/10 bg-[#16201d] px-3 text-xs outline-none focus:border-[#e7b464]"
                            />
                          </label>

                          <label className="block">
                            <span className="text-[10px] font-bold text-stone-400">Answer</span>
                            <textarea
                              rows={3}
                              value={editFaq.answer}
                              onChange={(e) => setEditFaq({ ...editFaq, answer: e.target.value })}
                              className="mt-1 w-full rounded border border-white/10 bg-[#16201d] p-3 text-xs outline-none focus:border-[#e7b464]"
                            />
                          </label>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleSaveEditFaq}
                              className="rounded bg-[#e7b464] px-3 py-1.5 text-[11px] font-bold text-stone-950 hover:bg-[#f1c77e]"
                            >
                              Save Changes
                            </button>
                            <button
                              type="button"
                              onClick={() => { setEditingId(null); setEditFaq(null); }}
                              className="rounded border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold text-stone-300 hover:bg-white/10"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-bold text-white text-sm">{item.question}</h4>
                            <p className="text-xs text-stone-300 mt-2 leading-relaxed">{item.answer}</p>
                          </div>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(item.id);
                                setEditFaq(item);
                              }}
                              className="rounded bg-white/5 p-2 border border-white/10 text-stone-300 hover:bg-[#e7b464] hover:text-stone-950"
                              title="Edit FAQ"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteFaq(item.id)}
                              className="rounded bg-red-600/10 p-2 border border-red-500/15 text-red-400 hover:bg-red-600 hover:text-white"
                              title="Delete FAQ"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PROFILE MANAGEMENT PANEL */}
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-bold tracking-tight border-b border-white/10 pb-4">Profile Settings</h2>
              <form onSubmit={handleSaveProfile} className="mt-6 space-y-5 max-w-2xl">
                <label className="block">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Admin Email Address</span>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-4 text-sm text-white outline-none focus:border-[#e7b464]"
                  />
                </label>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">New Password</span>
                    <input
                      type="password"
                      placeholder="Leave blank to keep current"
                      value={profilePassword}
                      onChange={(e) => setProfilePassword(e.target.value)}
                      className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-4 text-sm text-white outline-none focus:border-[#e7b464]"
                    />
                  </label>
                  
                  <label className="block">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Confirm New Password</span>
                    <input
                      type="password"
                      placeholder="Leave blank to keep current"
                      value={profileConfirmPassword}
                      onChange={(e) => setProfileConfirmPassword(e.target.value)}
                      className="mt-2 min-h-12 w-full rounded-lg border border-white/10 bg-[#1e2a27] px-4 text-sm text-white outline-none focus:border-[#e7b464]"
                    />
                  </label>
                </div>
                
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#e7b464] px-5 py-3 text-sm font-bold text-stone-950 hover:bg-[#f1c77e]"
                >
                  <Save className="h-4.5 w-4.5" />
                  Update Profile
                </button>
              </form>
            </div>
          )}

          {/* CUSTOMER LEADS CMS PANEL */}
          {activeTab === "inquiries" && (
            <div>
              <h2 className="text-xl font-bold tracking-tight border-b border-white/10 pb-4">Customer Enquiries & Leads</h2>
              
              {inquiries.length === 0 ? (
                <div className="mt-8 text-center py-12 rounded-lg bg-white/5 border border-white/5 text-stone-400">
                  <Inbox className="h-10 w-10 mx-auto text-stone-500 mb-3" />
                  <p className="text-sm font-semibold">No inquiries captured yet.</p>
                  <p className="text-xs text-stone-500 mt-1">Leads from the chatbot and contact form will appear here.</p>
                </div>
              ) : (
                <div className="mt-6 space-y-4 max-w-4xl">
                  {inquiries.map((item) => (
                    <div key={item._id} className="p-5 rounded-lg bg-[#1e2a27] border border-white/5 shadow-sm space-y-3 relative">
                      <button
                        onClick={() => handleDeleteInquiry(item._id)}
                        className="absolute top-4 right-4 rounded bg-red-600/10 p-2 border border-red-500/15 text-red-400 hover:bg-red-600 hover:text-white transition"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          item.source === "chatbot" 
                            ? "bg-purple-600/25 border border-purple-500/35 text-purple-200" 
                            : "bg-emerald-600/25 border border-emerald-500/35 text-emerald-200"
                        }`}>
                          {item.source === "chatbot" ? "Aveny Chatbot" : "Contact Form"}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {item.createdAt ? new Date(item.createdAt).toLocaleString() : "Date unknown"}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2 mt-2">
                        <div>
                          <p className="text-[10px] font-bold text-stone-450 uppercase">Customer Name</p>
                          <p className="text-sm font-bold text-white mt-0.5">{item.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-stone-450 uppercase">Contact Email</p>
                          <a href={`mailto:${item.email}`} className="text-sm font-semibold text-sky-400 hover:underline mt-0.5 block">{item.email}</a>
                        </div>
                      </div>

                      <div className="mt-3 border-t border-white/5 pt-3">
                        <p className="text-[10px] font-bold text-stone-450 uppercase">Requested Project Type</p>
                        <p className="text-sm font-bold text-[#e7b464] mt-0.5">{item.project}</p>
                      </div>

                      {item.message && (
                        <div className="mt-2.5 bg-black/20 rounded p-3 text-xs text-stone-300 leading-relaxed border border-white/[0.02]">
                          {item.message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
