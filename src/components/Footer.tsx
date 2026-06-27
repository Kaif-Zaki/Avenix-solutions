import { db } from "@/lib/db";
import { Link } from "react-router-dom";

const footerLinks = [
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "Process" },
  { href: "#contact", label: "Contact" },
];

const Footer = () => {
  const company = db.getCompany();
  return (
    <footer className="border-t border-white/10 bg-[#17211f] text-white">
      <div className="section-container grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <p className="text-lg font-black uppercase tracking-[0.18em]">{company.name}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-300">
            {company.tagline || "Software company websites, web applications, ecommerce, POS systems, and automations for brands that want a sharper digital presence."}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#e7b464]">Explore</h3>
          <div className="mt-4 grid gap-2">
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-stone-300 transition hover:text-white">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#e7b464]">Contact</h3>
          <div className="mt-4 grid gap-2 text-sm text-stone-300">
            <a href={`mailto:${company.email}`} className="transition hover:text-white">{company.email}</a>
            <a href={company.whatsapp} target="_blank" rel="noreferrer" className="transition hover:text-white">{company.phone}</a>
            <p>{company.location}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="section-container flex flex-col gap-2 py-4 text-xs text-stone-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <p>Built for company portfolios.</p>
            <span className="text-stone-700">|</span>
            <Link to="/admin" className="text-[#e7b464] hover:text-[#f1c77e] hover:underline font-bold transition">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
