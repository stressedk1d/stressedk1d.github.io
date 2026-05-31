const langToggle = document.querySelector(".lang-toggle");
const cursorGlow = document.querySelector(".cursor-glow");
const particlesCanvas = document.getElementById("particles");
const config = window.SITE_CONFIG || {};

const TYPING_ROLES = {
  ru: ["Full-stack разработчик", "Frontend · React", "Backend · Python"],
  en: ["Full-stack developer", "Frontend · React", "Backend · Python"],
};

function getLang() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("lang");
  if (fromUrl === "ru" || fromUrl === "en") {
    localStorage.setItem("lang", fromUrl);
    return fromUrl;
  }
  return localStorage.getItem("lang") || "ru";
}

function initLangFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("lang");
  if (fromUrl !== "ru" && fromUrl !== "en") return;
  setLang(fromUrl);
  params.delete("lang");
  const query = params.toString();
  const next = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState({}, "", next);
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

  const titleEl = document.querySelector("title[data-i18n]");
  if (titleEl) {
    const key = titleEl.dataset.i18n;
    if (strings[key]) document.title = strings[key];
  }

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

function initVCard() {
  const btn = document.getElementById("vcard-download");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const strings = window.I18N[getLang()] || {};
    const site = config.siteUrl || window.location.origin;
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:0bsession",
      "TITLE:Full-stack Web Developer",
    ];
    if (config.email) lines.push(`EMAIL:${config.email}`);
    if (config.telegram) lines.push(`URL:https://t.me/${config.telegram}`);
    lines.push(`URL:${site}`, "END:VCARD");
    const blob = new Blob([lines.join("\r\n")], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "0bsession.vcf";
    link.click();
    URL.revokeObjectURL(url);
    showToast(strings.vcardSaved || "Contact saved");
  });
}

function initDemo() {
  const demos = [
    ["marketplace-demo", config.projects?.marketplace?.demoUrl],
    ["panorama-demo", config.projects?.panorama?.demoUrl],
  ];

  demos.forEach(([id, url]) => {
    const btn = document.getElementById(id);
    if (!btn || !url) return;
    btn.href = url;
    btn.classList.remove("hidden");
  });
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
    ...document.querySelectorAll(".fab--contact"),
  ];

  const sectionIds = ["top", "projects", "about", "timeline", "skills", "learning", "links", "github", "contact"];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  const setActive = (hash) => {
    document.querySelectorAll(".side-nav__link, .mobile-menu__link, .bottom-nav__link").forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === hash);
    });
  };

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!link.getAttribute("href")?.startsWith("#")) return;
      event.preventDefault();
      scrollToSection(link);
      closeMobileMenu();
    });
  });

  if (!sections.length || !("IntersectionObserver" in window)) return;

  const visible = new Map();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visible.set(entry.target.id, entry.intersectionRatio);
      });

      let bestId = "top";
      let bestRatio = 0;
      visible.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      });

      if (bestRatio > 0) setActive(`#${bestId}`);
    },
    { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.15, 0.35, 0.55] }
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

function initCv() {
  const url = config.cvUrl;
  const btn = document.getElementById("cv-download");
  if (!url || !btn) return;
  btn.href = url;
  btn.classList.remove("hidden");
  if (/\.pdf$/i.test(url)) {
    btn.setAttribute("download", "");
  } else {
    btn.removeAttribute("download");
    btn.removeAttribute("target");
  }

  const printBtn = document.getElementById("cv-print");
  printBtn?.addEventListener("click", () => window.print());
}

function initCvEmail() {
  const el = document.getElementById("cv-email");
  if (!el || !config.email) return;
  el.textContent = config.email;
  el.href = `mailto:${config.email}`;
}

function initContact() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const strings = window.I18N[getLang()] || {};
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !message) {
      showToast(strings.contactError || "Fill in name and message");
      return;
    }

    if (config.formspreeId) {
      try {
        const res = await fetch(`https://formspree.io/f/${config.formspreeId}`, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        if (!res.ok) throw new Error("formspree");
        showToast(strings.contactSent || "Sent");
        form.reset();
        return;
      } catch {
        showToast(strings.contactError || "Error");
        return;
      }
    }

    const telegram = config.telegram || "phaqueu3";
    const lines = [`Привет! Меня зовут ${name}.`];
    if (email) lines.push(`Email: ${email}`);
    lines.push("", message);
    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://t.me/${telegram}?text=${text}`, "_blank", "noopener,noreferrer");
    showToast(strings.contactSent || "Opening Telegram…");
    form.reset();
  });
}

function initTheme() {
  const toggle = document.querySelector(".theme-toggle");
  const saved =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  document.documentElement.setAttribute("data-theme", saved);

  const syncIcon = () => {
    if (!toggle) return;
    toggle.textContent = document.documentElement.getAttribute("data-theme") === "light" ? "🌙" : "☀";
  };

  syncIcon();
  toggle?.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    syncIcon();
    const streak = document.getElementById("github-streak");
    if (streak) streak.src = getGitHubStreakUrl();
  });
}

function initTyping() {
  const el = document.getElementById("typing-text");
  if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    if (el) el.textContent = TYPING_ROLES[getLang()]?.[0] || "";
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const phrases = TYPING_ROLES[getLang()] || TYPING_ROLES.ru;
    const current = phrases[phraseIndex % phrases.length];

    if (!deleting) {
      charIndex += 1;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 55);
      return;
    }

    charIndex -= 1;
    el.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex += 1;
      setTimeout(tick, 400);
      return;
    }
    setTimeout(tick, 35);
  };

  tick();
}

function getGitHubStreakUrl() {
  const user = config.github || "stressedk1d";
  const light = document.documentElement.getAttribute("data-theme") === "light";
  const base = "https://streak-stats.demolab.com/";

  if (light) {
    return `${base}?user=${user}&theme=default&hide_border=false&border_radius=12`;
  }

  const params = new URLSearchParams({
    user,
    background: "00000000",
    border: "7c3aed",
    stroke: "00000000",
    ring: "c084fc",
    fire: "c084fc",
    currStreakNum: "f4f4f5",
    sideNums: "f4f4f5",
    currStreakLabel: "c084fc",
    sideLabels: "b4b4bc",
    dates: "b4b4bc",
    hide_border: "false",
    border_radius: "12",
  });

  return `${base}?${params.toString()}`;
}

function initGitHubStreak() {
  const img = document.getElementById("github-streak");
  if (!img) return;

  const sync = () => {
    img.src = getGitHubStreakUrl();
  };

  sync();
  document.querySelector(".theme-toggle")?.addEventListener("click", () => {
    setTimeout(sync, 0);
  });
}

function initGitHubRepos() {
  const container = document.getElementById("github-repos");
  if (!container) return;

  const user = config.github || "stressedk1d";
  const strings = window.I18N[getLang()] || {};
  const skip = new Set(["stressedk1d.github.io"]);
  const pinned = config.githubPinned || [];

  fetch(`https://api.github.com/users/${user}/repos?sort=updated&per_page=30`)
    .then((res) => res.json())
    .then((repos) => {
      if (!Array.isArray(repos) || !repos.length) {
        container.innerHTML = `<p class="github-repos__empty">${strings.githubEmpty || "No repos"}</p>`;
        return;
      }

      const filtered = repos.filter(
        (repo) =>
          !repo.fork &&
          !skip.has(repo.name) &&
          (pinned.includes(repo.name) || repo.description || repo.stargazers_count > 0 || repo.forks_count > 0)
      );
      const byName = new Map(filtered.map((repo) => [repo.name, repo]));
      const list = [
        ...pinned.map((name) => byName.get(name)).filter(Boolean),
        ...filtered.filter((repo) => !pinned.includes(repo.name)),
      ].slice(0, 6);

      if (!list.length) {
        container.innerHTML = `<p class="github-repos__empty">${strings.githubEmpty || "No repos"}</p>`;
        return;
      }

      container.innerHTML = list
        .map((repo) => {
          const desc = repo.description || "—";
          const lang = repo.language ? `<span class="github-repo__lang">${repo.language}</span>` : "";
          const stars =
            repo.stargazers_count > 0
              ? `<span class="github-repo__stars">★ ${repo.stargazers_count}</span>`
              : "";
          const forks =
            repo.forks_count > 0
              ? `<span class="github-repo__forks">⑂ ${repo.forks_count}</span>`
              : "";
          return `<a class="github-repo" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">
            <span class="github-repo__name">${repo.name}</span>
            <span class="github-repo__desc">${desc}</span>
            <span class="github-repo__meta">${lang}${stars}${forks}</span>
          </a>`;
        })
        .join("");
    })
    .catch(() => {
      container.innerHTML = `<p class="github-repos__empty">${strings.githubEmpty || "No repos"}</p>`;
    });
}

function initNowPlaying() {
  const block = document.getElementById("now-playing");
  const track = config.nowPlaying;
  if (!block || !track?.title) return;

  block.hidden = false;
  const titleEl = document.getElementById("now-playing-title");
  const artistEl = document.getElementById("now-playing-artist");
  const linkEl = document.getElementById("now-playing-link");

  if (titleEl) titleEl.textContent = track.title;
  if (artistEl) artistEl.textContent = track.artist || "";

  if (linkEl) {
    if (track.url) {
      linkEl.href = track.url;
    } else {
      linkEl.hidden = true;
    }
  }
}

function initEasterEgg() {
  const art = [
    "font-family:monospace",
    "font-size:11px",
    "line-height:1.4",
    "color:#c084fc",
    "background:#050508",
    "padding:8px 12px",
    "border-radius:8px",
  ].join(";");
  console.log("%c0bsession%c\nПривет из консоли 👾\nKonami code → сюрприз", art, "font-size:14px;font-weight:bold;color:#c084fc");

  const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let index = 0;

  document.addEventListener("keydown", (event) => {
    if (event.key === sequence[index]) {
      index += 1;
      if (index === sequence.length) {
        index = 0;
        document.documentElement.style.setProperty("--accent-light", "#22d3ee");
        document.documentElement.style.setProperty("--accent", "#0891b2");
        showToast(getLang() === "ru" ? "Neon mode activated ⚡" : "Neon mode activated ⚡");
        setTimeout(() => {
          document.documentElement.style.removeProperty("--accent-light");
          document.documentElement.style.removeProperty("--accent");
        }, 4000);
      }
      return;
    }
    index = event.key === sequence[0] ? 1 : 0;
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
  if (window.matchMedia("(pointer: coarse)").matches) return;

  const ctx = particlesCanvas.getContext("2d");
  let width = 0;
  let height = 0;
  let particles = [];

  const getCount = () => (window.innerWidth < 768 ? 18 : 40);

  function resize() {
    width = particlesCanvas.width = window.innerWidth;
    height = particlesCanvas.height = window.innerHeight;
    particles = Array.from({ length: getCount() }, () => ({
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
initLangFromUrl();
initTheme();
initEmail();
initVCard();
initDemo();
initCv();
initCvEmail();
initContact();
initGitHubRepos();
initGitHubStreak();
initNowPlaying();
initEasterEgg();
initTyping();
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
