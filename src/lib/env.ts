const env = import.meta.env;

const whatsappNumber = env.VITE_WHATSAPP_NUMBER || "94776737532";

export const appEnv = {
  siteName: env.VITE_SITE_NAME || "Avenix Solutions",
  siteTagline:
    env.VITE_SITE_TAGLINE ||
    "Software, websites, and automation built for serious business growth.",
  siteEmail: env.VITE_SITE_EMAIL || "avenixsolutionsofficial@gmail.com",
  sitePhone: env.VITE_SITE_PHONE || "+94 788385004",
  siteLocation: env.VITE_SITE_LOCATION || "Colombo, Sri Lanka",
  whatsappNumber,
  whatsappUrl: env.VITE_WHATSAPP_URL || `https://wa.me/${whatsappNumber}`,
  apiBaseUrl: env.VITE_API_BASE_URL || "",
  contactEndpoint: env.VITE_CONTACT_ENDPOINT || "",
  analyticsToken: env.VITE_ANALYTICS_TOKEN || "",
  adminEmail: env.VITE_ADMIN_EMAIL || "admin@avenixsolutions.com",
  adminPassword: env.VITE_ADMIN_PASSWORD || "avenixadmin",
  emailjsServiceId: env.VITE_EMAILJS_SERVICE_ID || "",
  emailjsTemplateId: env.VITE_EMAILJS_TEMPLATE_ID || "",
  emailjsPublicKey: env.VITE_EMAILJS_PUBLIC_KEY || "",
};
