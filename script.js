const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const siteShell = document.querySelector(".site-shell");
const revealItems = document.querySelectorAll(".reveal");
const interactiveCards = document.querySelectorAll(
  ".hero-panel-inner, .feature-card, .service-card, .project-card, .reason-card, .testimonial-card, .contact-card, .contact-form, .cta-box"
);
const projectsShowcase = document.querySelector("[data-projects-showcase]");
const projectColumns = document.querySelectorAll(".project-column");
const statValues = document.querySelectorAll(".stat-value");
const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const chatbotConfig = {
  name: "Monricher Assistant",
  greeting: "Hi! Welcome to Monricher Construction. How can we help you today?",
  fallback:
    "I'm sorry, I didn't quite understand that. You can ask about our services, pricing, projects, or how to get a quote.",
  quickReplies: ["View Services", "See Projects", "Request a Quote", "Contact Us"],
  intents: [
    {
      keywords: ["services", "what do you offer", "anong services", "offer"],
      response:
        "We offer a full range of construction services including residential and commercial construction, renovations, fit-outs, and project management. Let us know what you have in mind and we’d be happy to assist.",
    },
    {
      keywords: ["price", "cost", "how much", "magkano"],
      response:
        "Project costs vary depending on the size, design, and materials. The best way to get an accurate estimate is to request a quote. We can assess your requirements and provide a detailed breakdown.",
    },
    {
      keywords: ["quote", "estimate", "quotation"],
      response:
        "You can request a quote by contacting us through the form on our website or sending us a message with your project details. We’ll get back to you as soon as possible.",
    },
    {
      keywords: ["projects", "portfolio", "works", "previous"],
      response:
        "You can view our completed and ongoing projects in the Projects section of our website. It showcases the quality and range of our work.",
    },
    {
      keywords: ["location", "where are you", "area", "service area"],
      response:
        "We primarily serve Metro Manila and nearby areas, with our office based in Caloocan City. If your project is outside these locations, feel free to reach out and we’ll see how we can accommodate you.",
    },
    {
      keywords: ["timeline", "how long", "duration"],
      response:
        "Project timelines depend on the size and complexity of the build. Smaller projects may take a few weeks, while larger constructions can take several months. We’ll provide a timeline during planning.",
    },
    {
      keywords: ["materials", "quality", "what materials"],
      response:
        "We use high-quality materials suited to your project requirements and budget. We also guide clients in selecting the best options to ensure durability and value.",
    },
    {
      keywords: ["team", "who are you", "company"],
      response:
        "Monricher Construction is a dedicated team of professionals focused on delivering reliable and high-quality construction solutions. We aim to bring our clients’ visions to life with precision and care.",
    },
    {
      keywords: ["contact", "how to contact", "call", "message"],
      response:
        "You can contact us through the Contact page, or send us a message with your project details. We’ll respond as soon as possible.",
    },
    {
      keywords: ["start", "how to start", "process"],
      response:
        "To get started, simply send us your project details such as location, size, and requirements. From there, we’ll guide you through planning, costing, and execution.",
    },
  ],
};
const scrollEscapeItems = document.querySelectorAll(
  "main section .container > *, main section article, main section h1, main section h2, main section h3, main section p, main section li, main section .button, main section label, main section input, main section select, main section textarea, main section form, footer .container > *, footer h3, footer p, footer a, footer span"
);
let mouseGlowFrame = null;
let mouseGlowPosition = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };

const createMouseGlow = () => {
  if (!siteShell || reduceMotionQuery.matches) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const glow = document.createElement("div");
  glow.className = "mouse-glow";
  glow.setAttribute("aria-hidden", "true");
  siteShell.prepend(glow);
  siteShell.classList.add("has-mouse-glow");

  const applyMouseGlowPosition = () => {
    document.documentElement.style.setProperty("--mouse-x", `${mouseGlowPosition.x}px`);
    document.documentElement.style.setProperty("--mouse-y", `${mouseGlowPosition.y}px`);
    mouseGlowFrame = null;
  };

  const queueMouseGlowPosition = (clientX, clientY) => {
    mouseGlowPosition = { x: clientX, y: clientY };
    if (mouseGlowFrame !== null) return;
    mouseGlowFrame = window.requestAnimationFrame(applyMouseGlowPosition);
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      queueMouseGlowPosition(event.clientX, event.clientY);
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerleave",
    () => {
      siteShell.classList.remove("has-mouse-glow");
    },
    { passive: true }
  );

  window.addEventListener(
    "pointerenter",
    () => {
      siteShell.classList.add("has-mouse-glow");
    },
    { passive: true }
  );
};

const initializeInteractiveCards = () => {
  if (reduceMotionQuery.matches) return;
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  interactiveCards.forEach((card) => {
    card.classList.add("interactive-card");

    const resetCard = () => {
      card.classList.remove("is-pointer-active");
      card.style.setProperty("--card-glow-x", "50%");
      card.style.setProperty("--card-glow-y", "50%");
      card.style.setProperty("--card-shadow-x", "0px");
      card.style.setProperty("--card-shadow-y", "18px");
      card.style.setProperty("--card-shadow-blur", "36px");
      card.style.setProperty("--card-shadow-alpha", "0.2");
    };

    card.addEventListener("pointerenter", () => {
      card.classList.add("is-pointer-active");
    });

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const xRatio = x / rect.width;
      const yRatio = y / rect.height;
      const offsetX = ((xRatio - 0.5) * 20).toFixed(2);
      const offsetY = (14 + yRatio * 16).toFixed(2);
      const blur = (30 + yRatio * 14).toFixed(2);
      const alpha = (0.16 + yRatio * 0.12).toFixed(3);

      card.style.setProperty("--card-glow-x", `${(xRatio * 100).toFixed(2)}%`);
      card.style.setProperty("--card-glow-y", `${(yRatio * 100).toFixed(2)}%`);
      card.style.setProperty("--card-shadow-x", `${offsetX}px`);
      card.style.setProperty("--card-shadow-y", `${offsetY}px`);
      card.style.setProperty("--card-shadow-blur", `${blur}px`);
      card.style.setProperty("--card-shadow-alpha", alpha);
    });

    card.addEventListener("pointerleave", resetCard);
    resetCard();
  });
};

const updateHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 18);
};

updateHeaderState();

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const updateProjectColumns = () => {
  if (!projectsShowcase || !projectColumns.length) return;

  const isMobile = window.innerWidth <= 860;
  if (reduceMotionQuery.matches || isMobile) {
    projectColumns.forEach((column) => {
      column.style.setProperty("--column-shift", "0");
    });
    return;
  }

  const rect = projectsShowcase.getBoundingClientRect();
  const scrollableDistance = Math.max(projectsShowcase.offsetHeight - window.innerHeight, 1);
  const distanceIntoSection = Math.min(Math.max(-rect.top, 0), scrollableDistance);
  const progress = distanceIntoSection / scrollableDistance;

  projectColumns.forEach((column) => {
    const speed = Number(column.dataset.speed || 0);
    const baseTravel = window.innerWidth <= 1120 ? 90 : 140;
    const shift = (progress - 0.5) * baseTravel * speed * 2;
    column.style.setProperty("--column-shift", shift.toFixed(2));
  });
};

const updateDepthScene = () => {
  const isMobile = window.innerWidth <= 640;
  const y = window.scrollY || window.pageYOffset || 0;
  const root = document.documentElement;
  root.style.setProperty("--depth-y-1", `${(y * (isMobile ? -0.24 : -0.52)).toFixed(2)}px`);
  root.style.setProperty("--depth-y-2", `${(y * (isMobile ? -0.2 : -0.46)).toFixed(2)}px`);
  root.style.setProperty("--depth-y-3", `${(y * (isMobile ? -0.16 : -0.4)).toFixed(2)}px`);
  root.style.setProperty("--depth-y-4", `${(y * (isMobile ? -0.14 : -0.34)).toFixed(2)}px`);
  root.style.setProperty("--depth-y-5", `${(y * (isMobile ? -0.12 : -0.28)).toFixed(2)}px`);
  root.style.setProperty("--depth-y-6", `${(y * (isMobile ? -0.1 : -0.24)).toFixed(2)}px`);
};

const randomDigit = () => Math.floor(Math.random() * 10).toString();
const hasAnimatedStat = (element) => element.dataset.animated === "true";

const initializeScrollEscapeItem = (element) => {
  if (element.classList.contains("stat-char")) return;
  element.classList.add("scroll-escape-item");
};

const setStatMarkup = (element, value) => {
  element.innerHTML = value
    .split("")
    .map(
      (char, index) =>
        `<span class="stat-char" style="--char-index:${index}">${char === " " ? "&nbsp;" : char}</span>`
    )
    .join("");
};

const initializeStatDisplay = (element) => {
  element.style.opacity = "0";
  element.style.transition = "opacity 950ms ease";

  if (element.dataset.pattern === "ratio") {
    setStatMarkup(element, "00/0");
    return;
  }

  const suffix = element.dataset.suffix || "";
  setStatMarkup(element, `0${suffix}`);
};

const animateNumberStat = (element) => {
  const target = Number(element.dataset.target || 0);
  const suffix = element.dataset.suffix || "";
  const duration = Number(element.dataset.duration || 1250);
  const start = performance.now();
  let scrambleSnapshot = "";
  let lastScrambleUpdate = start;

  const tick = (timestamp) => {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(target * eased);
    const settledDigits = Math.floor(progress * String(target).length);
    const shouldRefreshScramble =
      !scrambleSnapshot || timestamp - lastScrambleUpdate > 44 || progress > 0.82;

    if (shouldRefreshScramble) {
      scrambleSnapshot = String(currentValue)
        .padStart(String(target).length, "0")
        .split("")
        .map((digit, index) => (index < settledDigits || progress > 0.82 ? digit : randomDigit()))
        .join("");
      lastScrambleUpdate = timestamp;
    }

    setStatMarkup(element, `${Number(scrambleSnapshot)}${suffix}`);

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    setStatMarkup(element, `${target}${suffix}`);
  };

  requestAnimationFrame(tick);
};

const animateRatioStat = (element) => {
  const target = element.dataset.target || "24/6";
  const duration = Number(element.dataset.duration || 1200);
  const chars = "0123456789/";
  const start = performance.now();
  let scrambleSnapshot = "";
  let lastScrambleUpdate = start;

  const tick = (timestamp) => {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const settledChars = Math.floor(progress * target.length);
    const shouldRefreshScramble =
      !scrambleSnapshot || timestamp - lastScrambleUpdate > 48 || progress > 0.84;

    if (shouldRefreshScramble) {
      scrambleSnapshot = target
        .split("")
        .map((char, index) => {
          if (index < settledChars || progress > 0.84) return char;
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      lastScrambleUpdate = timestamp;
    }

    setStatMarkup(element, scrambleSnapshot);

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    setStatMarkup(element, target);
  };

  requestAnimationFrame(tick);
};

const runStatAnimation = (element) => {
  if (hasAnimatedStat(element)) return;

  element.dataset.animated = "true";
  requestAnimationFrame(() => {
    element.style.opacity = "1";
  });

  if (element.dataset.pattern === "ratio") {
    animateRatioStat(element);
  } else {
    animateNumberStat(element);
  }
};

const isStatVisible = (element) => {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < viewportHeight * 0.9 && rect.bottom > viewportHeight * 0.1;
};

const updateStatEscapeState = () => {
  statValues.forEach((element) => {
    if (!hasAnimatedStat(element)) return;

    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const hasScrolledPast = rect.bottom < viewportHeight * 0.18;

    element.classList.toggle("is-escaped", hasScrolledPast);
  });
};

const updateScrollEscapeState = () => {
  scrollEscapeItems.forEach((element) => {
    if (!element.classList.contains("scroll-escape-item")) return;

    const rect = element.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const hasScrolledPast = rect.bottom < viewportHeight * 0.24;
    element.classList.toggle("is-escaped", hasScrolledPast);
  });
};

const checkVisibleStats = () => {
  statValues.forEach((element) => {
    if (!hasAnimatedStat(element) && isStatVisible(element)) {
      runStatAnimation(element);
      statObserver.unobserve(element);
    }
  });

  updateStatEscapeState();
  updateScrollEscapeState();
};

const allStatsAnimated = () =>
  Array.from(statValues).every((element) => hasAnimatedStat(element));

const normalizeQuery = (value) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const getChatbotReply = (message) => {
  const query = normalizeQuery(message);
  const matchedIntent = chatbotConfig.intents.find((intent) =>
    intent.keywords.some((keyword) => query.includes(normalizeQuery(keyword)))
  );

  return matchedIntent ? matchedIntent.response : chatbotConfig.fallback;
};

const createChatbot = () => {
  const shell = document.createElement("aside");
  shell.className = "chatbot-shell";
  shell.setAttribute("aria-label", chatbotConfig.name);

  shell.innerHTML = `
    <div class="chatbot-launcher">
      <div class="chatbot-dialogue">How can I help you today?</div>
      <button class="chatbot-toggle" type="button" aria-expanded="false" aria-controls="chatbot-panel" aria-label="Open ${chatbotConfig.name}">
        <span class="chatbot-toggle-figure" aria-hidden="true">
          <img class="chatbot-toggle-image" src="assets/assistant.png" alt="">
        </span>
      </button>
    </div>
    <section class="chatbot-panel" id="chatbot-panel" hidden>
      <div class="chatbot-panel-header">
        <div class="chatbot-panel-brand">
          <span class="chatbot-panel-avatar" aria-hidden="true">
            <img class="chatbot-panel-avatar-image" src="assets/assistant.png" alt="">
          </span>
          <div>
          <p class="chatbot-eyebrow">Instant Help</p>
          <h2>${chatbotConfig.name}</h2>
          </div>
        </div>
        <button class="chatbot-close" type="button" aria-label="Close assistant">×</button>
      </div>
      <div class="chatbot-messages" aria-live="polite"></div>
      <div class="chatbot-quick-replies" aria-label="Quick replies"></div>
      <form class="chatbot-form">
        <label class="chatbot-field">
          <span class="sr-only">Ask Monricher Assistant a question</span>
          <input
            class="chatbot-input"
            type="text"
            name="message"
            placeholder="Ask about services, pricing, projects, or quotes"
            autocomplete="off"
          >
        </label>
        <button class="chatbot-send" type="submit">Send</button>
      </form>
    </section>
  `;

  document.body.append(shell);

  const toggle = shell.querySelector(".chatbot-toggle");
  const panel = shell.querySelector(".chatbot-panel");
  const close = shell.querySelector(".chatbot-close");
  const messages = shell.querySelector(".chatbot-messages");
  const quickReplies = shell.querySelector(".chatbot-quick-replies");
  const form = shell.querySelector(".chatbot-form");
  const input = shell.querySelector(".chatbot-input");

  const appendMessage = (role, text) => {
    const item = document.createElement("article");
    item.className = `chatbot-message chatbot-message-${role}`;
    item.innerHTML = `<p>${text}</p>`;
    messages.append(item);
    messages.scrollTop = messages.scrollHeight;
  };

  const openPanel = () => {
    shell.classList.add("is-open");
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => input.focus());
  };

  const closePanel = () => {
    shell.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    panel.hidden = true;
  };

  toggle.addEventListener("click", () => {
    if (shell.classList.contains("is-open")) {
      closePanel();
      return;
    }

    openPanel();
  });

  close.addEventListener("click", closePanel);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;

    appendMessage("user", value);
    appendMessage("assistant", getChatbotReply(value));
    input.value = "";
  });

  appendMessage("assistant", chatbotConfig.greeting);

  chatbotConfig.quickReplies.forEach((label) => {
    const chip = document.createElement("button");
    chip.className = "chatbot-chip";
    chip.type = "button";
    chip.textContent = label;
    chip.addEventListener("click", () => {
      appendMessage("user", label);
      appendMessage("assistant", getChatbotReply(label));
      openPanel();
    });
    quickReplies.append(chip);
  });
};

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      runStatAnimation(element);
      statObserver.unobserve(element);
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -10% 0px",
  }
);

const onScroll = () => {
  updateHeaderState();
  updateProjectColumns();
  updateDepthScene();
  checkVisibleStats();
  updateStatEscapeState();
  updateScrollEscapeState();
};

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener(
  "resize",
  () => {
    updateProjectColumns();
    updateDepthScene();
    checkVisibleStats();
  },
  { passive: true }
);
window.addEventListener("load", checkVisibleStats);
if (typeof reduceMotionQuery.addEventListener === "function") {
  reduceMotionQuery.addEventListener("change", updateProjectColumns);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16,
    rootMargin: "0px 0px -40px 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));
statValues.forEach((item) => initializeStatDisplay(item));
statValues.forEach((item) => statObserver.observe(item));
scrollEscapeItems.forEach((item) => initializeScrollEscapeItem(item));
createMouseGlow();
initializeInteractiveCards();
createChatbot();
updateProjectColumns();
updateDepthScene();
checkVisibleStats();
updateStatEscapeState();
updateScrollEscapeState();
setTimeout(checkVisibleStats, 180);
setTimeout(checkVisibleStats, 700);

const statSweep = window.setInterval(() => {
  checkVisibleStats();

  if (allStatsAnimated()) {
    window.clearInterval(statSweep);
  }
}, 350);
