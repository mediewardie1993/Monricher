export type ChatIntent = {
  id: string;
  keywords: string[];
  response: string;
};

export type LeadData = {
  projectType: string;
  location: string;
  scope: string;
  budget: string;
  timeline: string;
  name: string;
  contact: string;
};

export const chatbotName = "Monricher Assistant";

export const greetingMessage =
  "Hi! Welcome to Monricher Construction. How can we help you today?";

export const fallbackMessage =
  "I'm sorry, I didn't quite catch that. You can ask about our services, projects, timelines, service areas, or request a quote.";

export const quickReplies = [
  "Our Services",
  "View Projects",
  "Request a Quote",
  "Service Areas",
  "Project Timeline",
  "Contact Us"
] as const;

export const defaultLeadData: LeadData = {
  projectType: "",
  location: "",
  scope: "",
  budget: "",
  timeline: "",
  name: "",
  contact: ""
};

export const leadSteps: Array<{
  key: keyof LeadData;
  question: string;
}> = [
  {
    key: "projectType",
    question:
      "What type of project do you have? (Example: residential, commercial, renovation, fit-out)"
  },
  {
    key: "location",
    question: "Where is the project located?"
  },
  {
    key: "scope",
    question: "Could you briefly describe the work you need done?"
  },
  {
    key: "budget",
    question: "Do you have an estimated budget range?"
  },
  {
    key: "timeline",
    question: "What is your target timeline?"
  },
  {
    key: "name",
    question: "May we have your name?"
  },
  {
    key: "contact",
    question: "What is the best contact number or email for follow-up?"
  }
];

export const inquiryKeywords = [
  "i need a quote",
  "need a quote",
  "request a quote",
  "paquote",
  "i have a project",
  "may project",
  "we have a project",
  "we need renovation",
  "need renovation",
  "we need construction",
  "need construction",
  "can you estimate",
  "estimate this",
  "can you visit the site",
  "site visit",
  "i want to inquire",
  "project inquiry",
  "need fit out",
  "need fit-out",
  "quotation",
  "inquire"
];

export const chatbotIntents: ChatIntent[] = [
  {
    id: "services",
    keywords: ["services", "what do you offer", "offer", "anong services", "service"],
    response:
      "We offer construction services for residential and commercial projects, including build, renovation, fit-out, and project planning support."
  },
  {
    id: "projects",
    keywords: [
      "projects",
      "portfolio",
      "works",
      "previous projects",
      "sample works",
      "completed projects"
    ],
    response:
      "You can explore our featured and completed projects in the Projects section to see the quality and style of our work."
  },
  {
    id: "pricing",
    keywords: ["price", "pricing", "cost", "how much", "magkano", "estimate cost", "budget"],
    response:
      "Project pricing depends on the size, design, materials, and site conditions. For a more accurate estimate, we recommend requesting a quote and sharing your project details."
  },
  {
    id: "quote",
    keywords: ["quote", "quotation", "estimate", "request a quote", "paquote", "inquire"],
    response:
      "We'd be happy to help with that. To prepare a quote, please share your project type, location, and a short description of what you need."
  },
  {
    id: "location",
    keywords: [
      "location",
      "service area",
      "where do you operate",
      "area",
      "nearby areas",
      "saan location"
    ],
    response:
      "We primarily serve Metro Manila and nearby areas. You may still send your location and project details so we can confirm availability."
  },
  {
    id: "timeline",
    keywords: ["timeline", "how long", "duration", "gaano katagal", "completion time"],
    response:
      "Project timelines vary based on scope and complexity. Smaller works may take a few weeks, while larger builds can take several months. We can give a clearer timeline after reviewing your requirements."
  },
  {
    id: "materials",
    keywords: ["materials", "quality", "what materials", "material quality"],
    response:
      "We aim to use quality materials suited to your project requirements, design goals, and budget, while maintaining durability and workmanship standards."
  },
  {
    id: "about",
    keywords: ["about", "company", "who are you", "who is monricher", "team"],
    response:
      "Monricher Construction is focused on delivering reliable, high-quality construction solutions with a strong emphasis on workmanship, trust, and professional service."
  },
  {
    id: "contact",
    keywords: ["contact", "phone", "email", "message", "how to contact", "reach you"],
    response:
      "You can contact us through the Contact section of the website, or send your project details here and we'll guide you to the next step."
  },
  {
    id: "start_project",
    keywords: [
      "start",
      "how to start",
      "begin",
      "project inquiry",
      "i have a project",
      "need construction",
      "need renovation"
    ],
    response:
      "Great - we can help you get started. Please tell us your project type, location, and what kind of work you need."
  }
];
