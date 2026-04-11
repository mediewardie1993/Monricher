const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const revealItems = document.querySelectorAll(".reveal");
const projectsShowcase = document.querySelector("[data-projects-showcase]");
const projectColumns = document.querySelectorAll(".project-column");
const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

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

const onScroll = () => {
  updateHeaderState();
  updateProjectColumns();
};

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", updateProjectColumns, { passive: true });
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
updateProjectColumns();
