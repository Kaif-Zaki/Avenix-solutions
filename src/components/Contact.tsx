import { FormEvent, useState } from "react";
import { CheckCircle2, Mail, MapPin, MessageSquare, Phone, Send, User, MessageCircle } from "lucide-react";
import { db } from "@/lib/db";
import { appEnv } from "@/lib/env";
import toast from "react-hot-toast";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const company = db.getCompany();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setSending(true);

    try {
      if (appEnv.emailjsServiceId && appEnv.emailjsTemplateId && appEnv.emailjsPublicKey) {
        // Send email via EmailJS
        const templateParams = {
          name: formData.get("name")?.toString() || "",
          email: formData.get("email")?.toString() || "",
          project: formData.get("project")?.toString() || "",
          title: formData.get("project")?.toString() || "",
          message: formData.get("message")?.toString() || "",
          time: new Date().toLocaleString(),
        };
        await emailjs.send(
          appEnv.emailjsServiceId,
          appEnv.emailjsTemplateId,
          templateParams,
          appEnv.emailjsPublicKey
        );
      } else if (appEnv.contactEndpoint) {
        // Fallback to custom backend endpoint
        await fetch(appEnv.contactEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(formData.entries())),
        });
      } else {
        // Fallback simulate API response delay when no email keys or backend URL is wired
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      toast.success("Enquiry sent! We will contact you shortly.", {
        icon: "✨",
        style: {
          border: "1px solid rgba(231, 180, 100, 0.4)",
          background: "#17211f",
          color: "#fff",
          fontSize: "14px",
          fontWeight: "600",
        },
      });

      setSubmitted(true);
      form.reset();
      window.setTimeout(() => setSubmitted(false), 3200);
    } catch (err) {
      console.error("Email sending error:", err);
      toast.error("Something went wrong. Please try again or WhatsApp us.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-stone-50/60 py-20 sm:py-24 lg:py-28">
      {/* Mesh Grid overlay */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(35,68,61,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(35,68,61,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70" />
      
      {/* Ambient background glows */}
      <div className="absolute left-[-10%] top-[-10%] h-[35rem] w-[35rem] rounded-full bg-[#4e8f7a]/4 blur-[130px] pointer-events-none" />
      <div className="absolute right-[-10%] bottom-[-10%] h-[35rem] w-[35rem] rounded-full bg-[#e7b464]/4 blur-[130px] pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Left Column Information */}
          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9a6a2d]">Contact</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-stone-900 sm:text-5xl tracking-tight">
              Tell us what you want your website or system to achieve.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-stone-600">
              Share your company, services, and goals. We’ll reply with the best next step, whether that is a portfolio website, a custom app, or a complete business system.
            </p>

            <div className="mt-8 grid gap-4">
              {[
                { icon: Mail, label: "Email", value: company.email, href: `mailto:${company.email}` },
                { icon: Phone, label: "Phone", value: company.phone, href: company.whatsapp },
                { icon: MapPin, label: "Location", value: company.location, href: undefined },
              ].map((item) => {
                const CardWrapper = item.href ? "a" : "div";
                return (
                  <CardWrapper
                    key={item.label}
                    href={item.href}
                    target={item.href?.startsWith("http") ? "_blank" : undefined}
                    rel={item.href ? "noopener noreferrer" : undefined}
                    className={`flex items-center gap-4 rounded-xl border border-stone-200/50 bg-white/70 p-4 transition-all duration-300 shadow-sm ${
                      item.href ? "hover:-translate-y-0.5 hover:border-[#23443d]/30 hover:bg-white hover:shadow-md cursor-pointer" : ""
                    }`}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#23443d] text-white shadow-md shadow-[#23443d]/15">
                      <item.icon className="h-5 w-5 text-[#e7b464]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-stone-450">{item.label}</p>
                      <p className="mt-0.5 font-bold text-stone-900 truncate tracking-tight">{item.value}</p>
                    </div>
                  </CardWrapper>
                );
              })}
            </div>
          </div>

          {/* Right Column Form */}
          <form 
            onSubmit={handleSubmit} 
            className="rounded-2xl border border-stone-200/60 bg-white/80 p-6 shadow-xl shadow-stone-900/5 backdrop-blur-md sm:p-8 hover:shadow-2xl transition-all duration-500"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
                  <User className="h-3.5 w-3.5 text-[#9a6a2d]" />
                  Name
                </span>
                <input
                  name="name"
                  required
                  type="text"
                  placeholder="Your name"
                  className="min-h-12 w-full rounded-lg border border-stone-200 bg-white/80 px-4 text-sm text-stone-950 outline-none transition duration-300 focus:border-[#23443d] focus:ring-4 focus:ring-[#23443d]/5 focus:bg-white"
                />
              </label>
              <label className="block">
                <span className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
                  <Mail className="h-3.5 w-3.5 text-[#9a6a2d]" />
                  Email
                </span>
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="you@company.com"
                  className="min-h-12 w-full rounded-lg border border-stone-200 bg-white/80 px-4 text-sm text-stone-950 outline-none transition duration-300 focus:border-[#23443d] focus:ring-4 focus:ring-[#23443d]/5 focus:bg-white"
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
                <MessageSquare className="h-3.5 w-3.5 text-[#9a6a2d]" />
                Project Type
              </span>
              <input
                name="project"
                required
                type="text"
                placeholder="e.g. Portfolio website, Custom POS software, Web app..."
                className="min-h-12 w-full rounded-lg border border-stone-200 bg-white/80 px-4 text-sm text-stone-950 outline-none transition duration-300 focus:border-[#23443d] focus:ring-4 focus:ring-[#23443d]/5 focus:bg-white"
              />
            </label>

            <label className="mt-5 block">
              <span className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-stone-500">
                <MessageSquare className="h-3.5 w-3.5 text-[#9a6a2d]" />
                Message Details
              </span>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Tell us about your company, timeline, budget, and the features you want."
                className="w-full resize-none rounded-lg border border-stone-200 bg-white/80 px-4 py-3 text-sm text-stone-950 outline-none transition duration-300 focus:border-[#23443d] focus:ring-4 focus:ring-[#23443d]/5 focus:bg-white"
              />
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={sending}
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#23443d] px-6 py-3 text-sm font-bold text-white shadow-sm shadow-[#23443d]/10 transition hover:bg-[#1a332e] hover:shadow-md disabled:bg-stone-400"
              >
                {sending ? (
                  <>
                    <Send className="h-4 w-4 animate-pulse" />
                    Sending...
                  </>
                ) : submitted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    Send Enquiry
                    <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                  </>
                )}
              </button>
              <a
                href={company.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-bold text-stone-900 shadow-sm transition hover:bg-stone-50 hover:border-[#23443d]/30"
              >
                <MessageCircle className="h-4.5 w-4.5 text-[#25d366]" />
                WhatsApp Us
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
