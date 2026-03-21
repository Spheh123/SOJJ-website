const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const yearElement = document.querySelector("#year");
const siteHeader = document.querySelector(".site-header");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

if (menuToggle && siteNav) {
  const closeMenu = () => {
    siteNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

if (siteHeader) {
  const updateHeaderState = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

document.querySelectorAll("[data-leadership-slider]").forEach((slider) => {
  const slides = Array.from(slider.querySelectorAll("[data-slide]"));
  const dots = Array.from(slider.querySelectorAll("[data-slide-dot]"));
  const prevButton = slider.querySelector("[data-slider-prev]");
  const nextButton = slider.querySelector("[data-slider-next]");
  let currentIndex = 0;

  const showSlide = (index) => {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === currentIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === currentIndex);
    });
  };

  prevButton?.addEventListener("click", () => showSlide(currentIndex - 1));
  nextButton?.addEventListener("click", () => showSlide(currentIndex + 1));

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => showSlide(dotIndex));
  });

  showSlide(0);
});

const adminAccessPage = document.querySelector("[data-admin-access]");
const adminTriggers = document.querySelectorAll("[data-admin-trigger]");

if (adminTriggers.length) {
  let clickCount = 0;
  let lastClickTime = 0;
  const hiddenRoute = "elroi-console.html";

  adminTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      const now = Date.now();
      clickCount = now - lastClickTime < 1400 ? clickCount + 1 : 1;
      lastClickTime = now;

      if (clickCount >= 5) {
        event.preventDefault();
        window.location.href = hiddenRoute;
      }
    });
  });
}

if (adminAccessPage) {
  const form = adminAccessPage.querySelector("[data-admin-form]");
  const passwordInput = adminAccessPage.querySelector("[data-admin-password]");
  const errorMessage = adminAccessPage.querySelector("[data-admin-error]");
  const loginPanel = adminAccessPage.querySelector("[data-admin-login]");
  const timerPanel = adminAccessPage.querySelector("[data-admin-timer]");
  const logoutButton = adminAccessPage.querySelector("[data-admin-logout]");
  const storageKey = "sojj_admin_timer_unlocked";
  const hashedPasscode = "342348c58fc6415bbb9ee29930abc2bd4cf458e67581a5353f3513944cb28168";

  const setUnlockedState = (isUnlocked) => {
    loginPanel?.classList.toggle("admin-hidden", isUnlocked);
    timerPanel?.classList.toggle("is-visible", isUnlocked);
    timerPanel?.classList.toggle("admin-hidden", !isUnlocked);
  };

  const hashValue = async (value) => {
    const encoded = new TextEncoder().encode(value);
    const digest = await crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

  const unlock = () => {
    sessionStorage.setItem(storageKey, "unlocked");
    if (errorMessage) {
      errorMessage.textContent = "";
    }
    setUnlockedState(true);
  };

  if (sessionStorage.getItem(storageKey) === "unlocked") {
    setUnlockedState(true);
  } else {
    setUnlockedState(false);
  }

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submittedValue = passwordInput?.value.trim() ?? "";
    const submittedHash = await hashValue(submittedValue);

    if (submittedHash === hashedPasscode) {
      unlock();
      form.reset();
      return;
    }

    if (errorMessage) {
      errorMessage.textContent = "That passcode is not correct.";
    }
  });

  logoutButton?.addEventListener("click", () => {
    sessionStorage.removeItem(storageKey);
    setUnlockedState(false);
  });
}
