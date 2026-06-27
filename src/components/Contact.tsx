import { FormEvent, useState } from "react";
import { CheckCircle2, Mail, MapPin, MessageSquare, Phone, Send, User } from "lucide-react";
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
    <section id="contact" className="bg-[#f6f2e8] py-20 sm:py-24 lg:py-28">
      <div className="section-container">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#9a6a2d]">Contact</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-stone-950 sm:text-5xl">
              Tell us what you want your website or system to achieve.
            </h2>
            <p className="mt-5 text-base leading-8 text-stone-700">
              Share your company, services, and goals. We’ll reply with the best next step, whether that is a portfolio website, a custom app, or a complete business system.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                { icon: Mail, label: "Email", value: company.email },
                { icon: Phone, label: "Phone", value: company.phone },
                { icon: MapPin, label: "Location", value: company.location },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 rounded-lg border border-stone-900/10 bg-white/75 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#23443d] text-white">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-stone-500">{item.label}</p>
                    <p className="mt-1 font-semibold text-stone-950">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-lg border border-stone-900/10 bg-white p-5 shadow-xl shadow-stone-900/10 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-600">
                  <User className="h-3.5 w-3.5" />
                  Name
                </span>
                <input
                  name="name"
                  required
                  type="text"
                  placeholder="Your name"
                  className="min-h-12 w-full rounded-lg border border-stone-200 bg-[#fbfaf6] px-4 text-sm text-stone-950 outline-none transition focus:border-[#4e8f7a] focus:ring-4 focus:ring-[#4e8f7a]/10"
                />
              </label>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-600">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </span>
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="you@company.com"
                  className="min-h-12 w-full rounded-lg border border-stone-200 bg-[#fbfaf6] px-4 text-sm text-stone-950 outline-none transition focus:border-[#4e8f7a] focus:ring-4 focus:ring-[#4e8f7a]/10"
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-600">
                <MessageSquare className="h-3.5 w-3.5" />
                Project
              </span>
              <input
                name="project"
                required
                type="text"
                placeholder="Company website, POS system, web app..."
                className="min-h-12 w-full rounded-lg border border-stone-200 bg-[#fbfaf6] px-4 text-sm text-stone-950 outline-none transition focus:border-[#4e8f7a] focus:ring-4 focus:ring-[#4e8f7a]/10"
              />
            </label>

            <label className="mt-5 block">
              <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-600">
                <MessageSquare className="h-3.5 w-3.5" />
                Message
              </span>
              <textarea
                name="message"
                required
                rows={6}
                placeholder="Tell us about your company, timeline, budget, and the result you want."
                className="w-full resize-none rounded-lg border border-stone-200 bg-[#fbfaf6] px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-[#4e8f7a] focus:ring-4 focus:ring-[#4e8f7a]/10"
              />
            </label>

            <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#23443d] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#17211f]"
              >
                {sending ? (
                  <>
                    <Send className="h-4 w-4" />
                    Sending...
                  </>
                ) : submitted ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Message Ready
                  </>
                ) : (
                  <>
                    Send Enquiry
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>
              <a
                href={company.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-stone-900/15 px-5 py-3 text-sm font-bold text-stone-950 transition hover:bg-[#e7b464]"
              >
                WhatsApp
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
