// =========================================================
// StudentHub Portal — client-side scripts (Practical 4)
// Dynamic UI: theme switcher, hamburger menu, notification
// banner, collapsible FAQ, modal popup, content slider.
// Every init function checks for its markup before wiring up,
// so this single file works unchanged across all 13 pages.
// =========================================================

const THEME_KEY = "sh-theme";
const BANNER_KEY = "sh-banner-dismissed";

/* ---------- Light / Dark Theme Switcher ---------- */

const THEME_KEY = "studenthub-theme";

function applyStoredTheme() {
    const stored = localStorage.getItem(THEME_KEY);

    const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    const theme = stored || (prefersDark ? "dark" : "light");

    if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }
}

function toggleTheme(btn) {
    const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";

    if (isDark) {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem(THEME_KEY, "light");
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem(THEME_KEY, "dark");
    }

    updateThemeButton(btn);
}

function updateThemeButton(btn) {
    const nowDark =
        document.documentElement.getAttribute("data-theme") === "dark";

    btn.textContent = nowDark ? "☀️" : "🌙";
    btn.setAttribute("aria-pressed", String(nowDark));
    btn.setAttribute(
        "aria-label",
        nowDark ? "Switch to light mode" : "Switch to dark mode"
    );
}


/* ---------- Start Theme ---------- */

applyStoredTheme();

const themeButton = document.getElementById("themeToggle");

if (themeButton) {
    updateThemeButton(themeButton);

    themeButton.addEventListener("click", function () {
        toggleTheme(themeButton);
    });
}
/* ---------- Header controls: theme toggle + hamburger ---------- */
function initHeaderControls() {
  const header = document.querySelector("header");
  if (!header) return;

  // Theme toggle button
  const themeBtn = document.createElement("button");
  themeBtn.type = "button";
  themeBtn.className = "theme-toggle";
  updateThemeButton(themeBtn);
  themeBtn.addEventListener("click", () => toggleTheme(themeBtn));

  const actions = header.querySelector(".auth-actions, .account-actions");
  if (actions) {
    actions.insertAdjacentElement("beforebegin", themeBtn);
  } else {
    header.appendChild(themeBtn);
  }

  // Hamburger menu — only on pages with a primary nav (public pages)
  const primaryNav = header.querySelector('nav[aria-label="Primary"]');
  if (primaryNav) {
    const navList = primaryNav.querySelector("ul");
    if (navList) {
      if (!navList.id) navList.id = "primary-nav-list";

      const burger = document.createElement("button");
      burger.type = "button";
      burger.className = "hamburger";
      burger.setAttribute("aria-label", "Toggle navigation menu");
      burger.setAttribute("aria-expanded", "false");
      burger.setAttribute("aria-controls", navList.id);
      burger.innerHTML = "<span></span><span></span><span></span>";
      primaryNav.parentNode.insertBefore(burger, primaryNav);

      burger.addEventListener("click", () => {
        const open = navList.classList.toggle("nav-open");
        burger.setAttribute("aria-expanded", String(open));
      });

      navList.querySelectorAll("a").forEach((a) => {
        a.addEventListener("click", () => {
          navList.classList.remove("nav-open");
          burger.setAttribute("aria-expanded", "false");
        });
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && navList.classList.contains("nav-open")) {
          navList.classList.remove("nav-open");
          burger.setAttribute("aria-expanded", "false");
          burger.focus();
        }
      });
    }
  }
}

/* ---------- Dismissible notification banner ---------- */
function initNotificationBanner() {
  if (localStorage.getItem(BANNER_KEY) === "true") return;
  const header = document.querySelector("header");
  if (!header) return;

  const banner = document.createElement("div");
  banner.className = "notification-banner";
  banner.setAttribute("role", "status");
  banner.innerHTML =
    '<p>\u{1F4E2} Semester registration closes on <strong>30 Aug 2026</strong>. Complete your course enrollment on the Courses page.</p>' +
    '<button type="button" class="banner-close" aria-label="Dismiss notification">&times;</button>';

  header.insertAdjacentElement("afterend", banner);

  banner.querySelector(".banner-close").addEventListener("click", () => {
    banner.remove();
    localStorage.setItem(BANNER_KEY, "true");
  });
}

/* ========================================
   COLLAPSIBLE FAQ
   ======================================== */

const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach(function(question) {

    question.addEventListener("click", function() {

        const answer = question.nextElementSibling;
        const icon = question.querySelector("span");

        if (answer.style.display === "block") {

            answer.style.display = "none";
            icon.textContent = "+";

        } else {

            answer.style.display = "block";
            icon.textContent = "−";

        }

    });

});


/* ---------- Modal popup ---------- */
function initModals() {
  document.querySelectorAll("[data-modal-target]").forEach((trigger) => {
    const modal = document.getElementById(trigger.getAttribute("data-modal-target"));
    if (!modal) return;

    const closeModal = () => {
      modal.hidden = true;
      trigger.focus();
    };

    trigger.addEventListener("click", () => {
      modal.hidden = false;
      const focusable = modal.querySelector("button, input, select, textarea, [href]");
      if (focusable) focusable.focus();
    });

    modal.querySelectorAll("[data-modal-close]").forEach((btn) => {
      btn.addEventListener("click", closeModal);
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  });
}

/* ---------- Image / content slider ---------- */
function initSliders() {
  document.querySelectorAll(".slider").forEach((slider) => {
    const track = slider.querySelector(".slider-track");
    const dotsWrap = slider.querySelector(".slider-dots");
    const prevBtn = slider.querySelector(".slider-prev");
    const nextBtn = slider.querySelector(".slider-next");
    if (!track || !dotsWrap) return;

    const slides = Array.from(track.children);
    let index = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      dot.addEventListener("click", () => {
        goTo(i);
        resetTimer();
      });
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function update() {
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach((d, i) => d.setAttribute("aria-current", i === index ? "true" : "false"));
    }
    function goTo(i) {
      index = (i + slides.length) % slides.length;
      update();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    if (nextBtn) nextBtn.addEventListener("click", () => { next(); resetTimer(); });
    if (prevBtn) prevBtn.addEventListener("click", () => { prev(); resetTimer(); });

    function startTimer() { timer = setInterval(next, 5000); }
    function resetTimer() { clearInterval(timer); startTimer(); }

    slider.addEventListener("mouseenter", () => clearInterval(timer));
    slider.addEventListener("mouseleave", startTimer);
    slider.addEventListener("focusin", () => clearInterval(timer));
    slider.addEventListener("focusout", startTimer);

    update();
    startTimer();
  });
}

/* ---------- Boot ---------- */
applyStoredTheme();
document.addEventListener("DOMContentLoaded", () => {
  initHeaderControls();
  initNotificationBanner();
  initFaqAccordion();
  initModals();
  initSliders();
});
