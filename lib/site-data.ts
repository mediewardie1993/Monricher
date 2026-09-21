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

// Additional completed work shown lower on the Projects page, below the
// featured Medical City branches.
const rawAdditionalProjects = [
  {
    title: "Ricardo L. Laxamana Hospital",
    detail: "A full hospital construction project in Bulacan, from structural works through interior fit-out.",
    image: "/photos/rll-hospital-1.jpg"
  },
  {
    title: "Moldex Residences",
    detail: "Residential builds across the Jasmine, Ivanah, and Blanche house models.",
    image: "/photos/moldex-jasmine.png"
  }
];

export const additionalProjects = rawAdditionalProjects.map((project) => ({
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

export type ProjectGalleryEntry = {
  title: string;
  location: string;
  cover: string;
  images: string[];
};

export type ProjectGalleryGroup = {
  category: string;
  projects: ProjectGalleryEntry[];
};

const rawProjectGalleries: ProjectGalleryGroup[] = [
  {
    category: "The Medical City Clinics",
    projects: [
      {
        title: "Robinsons Antipolo",
        location: "Antipolo City",
        cover: "/photos/tmcc-antipolo-1.png",
        images: [1, 2, 3, 4, 5, 6, 7].map((n) => `/photos/tmcc-antipolo-${n}.png`)
      },
      {
        title: "Robinsons Cainta",
        location: "Cainta, Rizal",
        cover: "/photos/tmcc-cainta-1.png",
        images: [1, 2, 3, 4].map((n) => `/photos/tmcc-cainta-${n}.png`)
      },
      {
        title: "SM City Cauayan",
        location: "Cauayan, Isabela",
        cover: "/photos/tmcc-cauayan-1.png",
        images: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `/photos/tmcc-cauayan-${n}.png`)
      },
      {
        title: "TriNoma",
        location: "Quezon City",
        cover: "/photos/tmcc-trinoma-1.png",
        images: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `/photos/tmcc-trinoma-${n}.png`)
      }
    ]
  },
  {
    category: "Residences",
    projects: [
      {
        title: "Bliss Tagaytay",
        location: "Tagaytay City",
        cover: "/photos/bliss-tagaytay-front.png",
        images: [
          "front.png",
          "front-2.png",
          "balcony.png",
          "court.png",
          "pool.jpg",
          "rooftop.png",
          "kitchen.png",
          "bedroom-2.png",
          "bedroom-4.png",
          "bedroom-4-2.png",
          "mezzanine.png",
          "toilet-bath.png"
        ].map((file) => `/photos/bliss-tagaytay-${file}`)
      }
    ]
  }
];

export const projectGalleries: ProjectGalleryGroup[] = rawProjectGalleries.map((group) => ({
  ...group,
  projects: group.projects.map((project) => ({
    ...project,
    cover: withBasePath(project.cover),
    images: project.images.map((image) => withBasePath(image))
  }))
}));

// Featured on the homepage / projects hero carousel — the real Medical City
// branch photos, front and center.
const medicalCityBranches = rawProjectGalleries.find(
  (group) => group.category === "The Medical City Clinics"
)?.projects ?? [];

export const featuredProjects = medicalCityBranches.map((project) => ({
  title: `TMCC ${project.title}`,
  subtitle: `The Medical City Clinics • ${project.location}`,
  image: withBasePath(project.cover),
  images: project.images.map((image) => withBasePath(image))
}));
