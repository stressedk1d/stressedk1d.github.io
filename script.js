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

  if (langToggle) langToggle.textContent = strings.langToggle;
}

langToggle?.addEventListener("click", () => {
  setLang(getLang() === "ru" ? "en" : "ru");
});

function initEmail() {
  const email = config.email;
  const link = document.getElementById("email-link");
  const desc = document.getElementById("email-desc");
  if (!email || !link) return;

  link.href = `mailto:${email}`;
  link.classList.remove("hidden");
  if (desc) desc.textContent = email;
}

function initDemo() {
  const demoUrl = config.projects?.marketplace?.demoUrl;
  const demoBtn = document.getElementById("marketplace-demo");
  if (!demoUrl || !demoBtn) return;

  demoBtn.href = demoUrl;
  demoBtn.classList.remove("hidden");
}

function initNav() {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  const links = [...nav.querySelectorAll(".site-nav__link")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        links.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === id);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
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
  const count = window.innerWidth < 768 ? 35 : 55;

  function resize() {
    width = particlesCanvas.width = window.innerWidth;
    height = particlesCanvas.height = window.innerHeight;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.5 + 0.1,
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
      ctx.fillStyle = Math.random() > 0.7 ? "#22d3ee" : "#c084fc";
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
initAnalytics();
initPWA();
initCursor();
initParticles();
