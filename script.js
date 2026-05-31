const langToggle = document.querySelector(".lang-toggle");
const cursorGlow = document.querySelector(".cursor-glow");
const particlesCanvas = document.getElementById("particles");
const config = window.SITE_CONFIG || {};

function getLang() {
  return localStorage.getItem("lang") || "ru";
}

function setLang(lang) {
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  applyTranslations(lang);
}

function applyTranslations(lang) {
  const strings = window.I18N[lang];
  if (!strings) return;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (strings[key]) el.textContent = strings[key];
  });

  document.querySelectorAll("[data-i18n-content]").forEach((el) => {
    const key = el.dataset.i18nContent;
    if (strings[key]) el.setAttribute("content", strings[key]);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.dataset.i18nAria;
    if (strings[key]) el.setAttribute("aria-label", strings[key]);
  });

  if (langToggle) {
    langToggle.textContent = lang === "ru" ? "EN" : "RU";
  }
}

langToggle?.addEventListener("click", () => {
  setLang(getLang() === "ru" ? "en" : "ru");
});

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function initEmail() {
  const email = config.email;
  const link = document.getElementById("email-link");
  const desc = document.getElementById("email-desc");
  if (!email || !link) return;

  link.href = `mailto:${email}`;
  link.classList.remove("hidden");
  if (desc) desc.textContent = email;

  link.addEventListener("click", (event) => {
    event.preventDefault();
    navigator.clipboard.writeText(email).then(() => {
      const msg = window.I18N[getLang()]?.emailCopied || "Email copied";
      showToast(msg);
    });
  });
}

function initDemo() {
  const demoUrl = config.projects?.marketplace?.demoUrl;
  const demoBtn = document.getElementById("marketplace-demo");
  if (!demoUrl || !demoBtn) return;

  demoBtn.href = demoUrl;
  demoBtn.classList.remove("hidden");
}

function scrollToSection(link) {
  const target = document.querySelector(link.getAttribute("href"));
  if (!target) return;
  target.scrollIntoView({ behavior: "smooth" });
}

function closeMobileMenu() {
  const menu = document.getElementById("mobile-menu");
  const toggle = document.querySelector(".menu-toggle");
  if (!menu || !toggle) return;
  menu.hidden = true;
  toggle.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}

function initNav() {
  const navLinks = [
    ...document.querySelectorAll(".side-nav__link"),
    ...document.querySelectorAll(".mobile-menu__link"),
    ...document.querySelectorAll(".bottom-nav__link"),
    ...document.querySelectorAll('.hero-cta a[href^="#"]'),
  ];

  const sections = [...new Set(
    navLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean)
  )];

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!link.getAttribute("href")?.startsWith("#")) return;
      event.preventDefault();
      scrollToSection(link);
      closeMobileMenu();
    });
  });

  const desktopLinks = [...document.querySelectorAll(".side-nav__link")];

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        desktopLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === id);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const isOpen = !menu.hidden;
    menu.hidden = isOpen;
    toggle.classList.toggle("is-open", !isOpen);
    toggle.setAttribute("aria-expanded", String(!isOpen));
    document.body.style.overflow = isOpen ? "" : "hidden";
  });
}

function initReveal() {
  document.documentElement.classList.add("js");

  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

function initSkillBars() {
  const section = document.getElementById("skills");
  const fills = document.querySelectorAll(".bar__fill");
  if (!fills.length) return;

  const animateAll = () => {
    fills.forEach((fill) => {
      if (fill.classList.contains("is-animated")) return;
      const pct = fill.dataset.width;
      if (!pct) return;
      fill.style.width = "0";
      requestAnimationFrame(() => {
        fill.style.width = `${pct}%`;
        fill.classList.add("is-animated");
      });
    });
  };

  if (!section || !("IntersectionObserver" in window)) {
    animateAll();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      animateAll();
      observer.disconnect();
    },
    { threshold: 0.15 }
  );

  observer.observe(section);
}

function initImages() {
  document.querySelectorAll(".img-skeleton img").forEach((img) => {
    const skeleton = img.closest(".img-skeleton");
    const markLoaded = () => skeleton?.classList.add("is-loaded");

    if (img.complete) markLoaded();
    else {
      img.addEventListener("load", markLoaded);
      img.addEventListener("error", markLoaded);
    }
  });
}

function initBackToTop() {
  const btn = document.querySelector(".back-to-top");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => {
      btn.classList.toggle("is-visible", window.scrollY > 400);
    },
    { passive: true }
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initPageTransition() {
  document.querySelectorAll('a[href*="projects/"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (link.target === "_blank" || link.classList.contains("lightbox-trigger")) return;
      event.preventDefault();
      document.body.style.opacity = "0";
      document.body.style.transition = "opacity 0.2s ease";
      setTimeout(() => {
        window.location.href = link.href;
      }, 180);
    });
  });
}

function initScrollProgress() {
  const bar = document.querySelector(".scroll-progress");
  if (!bar) return;

  window.addEventListener(
    "scroll",
    () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = `${pct}%`;
    },
    { passive: true }
  );
}

function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const img = lightbox?.querySelector(".lightbox__img");
  const closeBtn = lightbox?.querySelector(".lightbox__close");
  if (!lightbox || !img) return;

  const open = (src, alt) => {
    img.src = src;
    img.alt = alt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    closeBtn?.focus();
  };

  const close = () => {
    lightbox.hidden = true;
    img.src = "";
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".lightbox-trigger").forEach((btn) => {
    btn.addEventListener("click", () => open(btn.dataset.src, btn.dataset.alt));
  });

  closeBtn?.addEventListener("click", close);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) close();
  });
}

function initTilt() {
  if (window.matchMedia("(pointer: coarse)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${y * -4}deg) rotateY(${x * 4}deg) translateY(-2px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function initAnalytics() {
  const siteCode = config.goatCounter;
  if (!siteCode) return;

  window.goatcounter = { no_onload: true };
  const script = document.createElement("script");
  script.async = true;
  script.dataset.goatcounter = `https://${siteCode}.goatcounter.com/count`;
  script.src = `https://${siteCode}.goatcounter.com/count.js`;
  document.head.appendChild(script);

  document.querySelectorAll("[data-track]").forEach((el) => {
    el.addEventListener("click", () => {
      if (window.goatcounter?.count) {
        window.goatcounter.count({ path: el.dataset.track, event: true });
      }
    });
  });
}

function initPWA() {
  if (!("serviceWorker" in navigator)) return;
  const swPath = document.body.classList.contains("project-page") ? "../sw.js" : "/sw.js";
  navigator.serviceWorker.register(swPath).catch(() => {});
}

function initCursor() {
  if (!cursorGlow || window.matchMedia("(pointer: coarse)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let visible = false;

  document.addEventListener(
    "mousemove",
    (event) => {
      cursorGlow.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
      if (!visible) {
        cursorGlow.style.opacity = "1";
        visible = true;
      }
    },
    { passive: true }
  );

  document.addEventListener("mouseleave", () => {
    cursorGlow.style.opacity = "0";
    visible = false;
  });
}

function initParticles() {
  if (!particlesCanvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const ctx = particlesCanvas.getContext("2d");
  let width = 0;
  let height = 0;
  let particles = [];
  const count = window.innerWidth < 768 ? 30 : 45;

  function resize() {
    width = particlesCanvas.width = window.innerWidth;
    height = particlesCanvas.height = window.innerHeight;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.35 + 0.08,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "#c084fc";
      ctx.globalAlpha = p.a;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener("resize", resize, { passive: true });
}

setLang(getLang());
initEmail();
initDemo();
initNav();
initMobileMenu();
initReveal();
initSkillBars();
initImages();
initBackToTop();
initPageTransition();
initScrollProgress();
initLightbox();
initTilt();
initAnalytics();
initPWA();
initCursor();
initParticles();

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("page-load");
});
