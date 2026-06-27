import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { db } from "@/lib/db";
import { motion } from "framer-motion";

const logoPath = `${import.meta.env.BASE_URL}logo_new.png`;

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "Process" },
  { href: "#contact", label: "Contact" },
];

const Navbar = () => {
  const company = db.getCompany();
  const [open, setOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Handle transparent to floating style change
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Handle show/hide on scroll
      if (currentScrollY < 10) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // Scrolling down -> hide navbar
        setVisible(false);
        setOpen(false); // Auto close mobile menu on scroll down
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> show navbar
        setVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (event: React.MouseEvent, href: string) => {
    event.preventDefault();
    setOpen(false);
    const id = href.replace("#", "");

    if (location.pathname !== "/") {
      navigate(`/${href}`);
      return;
    }

    const element = document.getElementById(id);
    if (!element) return;
    const y = element.getBoundingClientRect().top + window.scrollY - 78;
    window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
  };

  return (
    <header 
      className={`fixed left-1/2 z-50 w-[92%] max-w-6xl -translate-x-1/2 rounded-full border border-stone-200/25 bg-white/70 backdrop-blur-lg shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 ease-in-out ${
        visible ? "top-4 opacity-100" : "-top-24 opacity-0 pointer-events-none"
      } ${isScrolled ? "py-1 px-5 bg-white/85" : "py-2 px-5"}`}
    >
      <div className="flex h-14 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 transition hover:opacity-90" aria-label={`${company.name} home`}>
          <img src={logoPath} alt="" className="h-10 w-10 rounded-md object-contain shadow-sm" />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-stone-950 leading-tight">{company.name}</p>
            <p className="hidden text-[10px] font-semibold text-stone-600 sm:block">Websites & business software</p>
          </div>
        </Link>

        <nav 
          className="hidden items-center gap-1 rounded-full border border-stone-200/50 bg-white/40 p-1 lg:flex shadow-sm"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {navLinks.map((link, idx) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(event) => handleNavClick(event, link.href)}
              onMouseEnter={() => setHoveredIndex(idx)}
              className="relative rounded-full px-4 py-2 text-xs font-bold text-stone-600 transition-colors duration-200 hover:text-stone-950"
            >
              {hoveredIndex === idx && (
                <motion.span
                  layoutId="navHoverBg"
                  className="absolute inset-0 z-0 rounded-full bg-[#23443d]/8"
                  transition={{ type: "spring", stiffness: 350, damping: 26 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          onClick={(event) => handleNavClick(event, "#contact")}
          className="hidden rounded-full bg-[#23443d] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:bg-[#17211f] hover:shadow-md hover:-translate-y-0.5 md:inline-flex"
        >
          Start Project
        </a>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex rounded-full border border-stone-900/10 bg-white p-2 text-stone-950 lg:hidden shadow-sm hover:bg-stone-50"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-4.5 w-4.5" /> : <Menu className="h-4.5 w-4.5" />}
        </button>
      </div>

      {open && (
        <div className="absolute top-[110%] left-0 right-0 rounded-3xl border border-stone-200/25 bg-white/95 backdrop-blur-lg shadow-xl lg:hidden overflow-hidden transition-all duration-200">
          <div className="grid gap-1.5 p-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(event) => handleNavClick(event, link.href)}
                className="rounded-xl px-4 py-3 text-xs font-bold text-stone-700 transition hover:bg-[#23443d]/8 hover:text-stone-950"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
