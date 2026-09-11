import { withBasePath } from "@/lib/base-path";

const rawNavItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/contact" }
];

export const navItems = rawNavItems.map((item) => ({ ...item, href: withBasePath(item.href) }));

const rawServiceItems = [
  {
    title: "Consultation",
    text: "Our team of experienced professionals and certified experts ensures a seamless project conceptualization and planning process, delivering a foundation that aligns with your design vision and objectives.",
    image: "/photos/consultation.jpg"
  },
  {
    title: "Architectural Design",
    text: "Our team of skilled professionals delivers architectural designs that blend innovation with functionality.",
    image: "/photos/design.jpg"
  },
  {
    title: "Electrical Design",
    text: "Our team of skilled professionals provides electrical designs that prioritize efficiency and reliability.",
    image: "/photos/electrical-design.jpg"
  },
  {
    title: "Demolition Works",
    text: "Starting anew? Let us set a new ground for a better purpose.",
    image: "/photos/demolition-works.png"
  },
  {
    title: "Cabinet Works",
    text: "Have your cabinetry offer the utmost convenience. We craft customized cabinets that fit your lifestyle perfectly.",
    image: "/photos/cabinet-works.jpg"
  },
  {
    title: "Painting Works",
    text: "We have skilled painters that can actualize any finish or design you want in the highest quality.",
    image: "/photos/painting-works.png"
  },
  {
    title: "Fire Protection",
    text: "Have your spaces safe from potential fire. We install sprinklers, fire detection and alarm systems, and fire hose cabinets.",
    image: "/photos/fire-protection.jpg"
  },
  {
    title: "Electrical and Electronics Installation",
    text: "Installation of lighting fixtures, power outlets, switches, panel boards, CCTV, and other electrical works — our team ensures a safe and efficient electrical system in your spaces.",
    image: "/photos/electrical-works.png"
  },
  {
    title: "Mechanical Works and Aircon Installation",
    text: "We offer installation of aircon units, exhaust fans, ducting, and other mechanical works.",
    image: "/photos/aircon-installation.png"
  },
  {
    title: "Plumbing Installation",
    text: "Installation of plumbing fixtures, waterlines, sanitary lines, water tanks, water meters, and other plumbing works.",
    image: "/photos/plumbing-works.png"
  }
];

export const serviceItems = rawServiceItems.map((item) => ({ ...item, image: withBasePath(item.image) }));

// Grounded in Monricher's real Mission Statement.
export const reasons = [
  "Honesty and integrity in every client relationship",
  "Consistent, quality-driven workmanship on every project",
  "Client relationships built for the long term",
  "Motivated, flexible, and focused project teams",
  "Open leadership with owners, architects, and engineers alike",
  "Cost-effective projects delivered on schedule"
];

// Monricher's actual completed work — Metro Manila & Bulacan, Philippines.
const rawFeaturedProjects = [
  {
    title: "The Medical City Clinics",
    subtitle: "Medical Clinics • TriNoma, SM & Robinsons Malls",
    image: "/photos/medical-city-reception.jpg"
  },
  {
    title: "Ricardo L. Laxamana Hospital",
    subtitle: "Hospital Construction • Bulacan",
    image: "/photos/rll-hospital-1.jpg"
  },
  {
    title: "Moldex Residences",
    subtitle: "Residential Development • Jasmine, Ivanah & Blanche Models",
    image: "/photos/moldex-jasmine.png"
  }
];

export const featuredProjects = rawFeaturedProjects.map((project) => ({
  ...project,
  image: withBasePath(project.image)
}));

export const companyInfo = {
  legalName: "Monricher Construction and Development Corp",
  address: "San Jose, Patag, Sta. Maria, Bulacan",
  phone: "0917-822-7367",
  email: "monricher317@gmail.com",
  facebook: "facebook.com/MonricherCDC",
  facebookUrl: "https://facebook.com/MonricherCDC"
};
