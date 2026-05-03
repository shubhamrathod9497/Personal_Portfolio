const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const siteHeader = document.querySelector(".site-header");
const themeToggle = document.querySelector(".theme-toggle");
const scrollTopButton = document.querySelector(".scroll-top");
const contactForm = document.querySelector("#contact-form");
const revealElements = document.querySelectorAll(".reveal");

const savedTheme = localStorage.getItem("portfolio-theme");

const closeMobileMenu = () => {
  navMenu.classList.remove("active");
  navToggle.classList.remove("active");
  document.body.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
};

const updateScrollState = () => {
  const hasScrolled = window.scrollY > 12;

  siteHeader.classList.toggle("scrolled", hasScrolled);
  scrollTopButton.classList.toggle("visible", window.scrollY > 420);
};

if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  themeToggle.setAttribute("aria-label", "Switch to light mode");
}

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("active");

  navToggle.classList.toggle("active", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-mode");

  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
});

scrollTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

window.addEventListener("scroll", updateScrollState);
window.addEventListener("load", updateScrollState);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

document.addEventListener("click", (event) => {
  const clickedInsideNav = event.target.closest(".navbar");

  if (!clickedInsideNav && navMenu.classList.contains("active")) {
    closeMobileMenu();
  }
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const setFieldError = (field, message) => {
  const group = field.closest(".form-group");
  const errorMessage = group.querySelector(".error-message");

  group.classList.toggle("error", Boolean(message));
  errorMessage.textContent = message;
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = contactForm.elements["name"];
  const email = contactForm.elements["email"];
  const message = contactForm.elements["message"];
  const formStatus = contactForm.querySelector(".form-status");
  let isValid = true;

  formStatus.textContent = "";

  if (name.value.trim().length < 2) {
    setFieldError(name, "Please enter your name.");
    isValid = false;
  } else {
    setFieldError(name, "");
  }

  if (!isValidEmail(email.value.trim())) {
    setFieldError(email, "Please enter a valid email address.");
    isValid = false;
  } else {
    setFieldError(email, "");
  }

  if (message.value.trim().length < 10) {
    setFieldError(message, "Message should be at least 10 characters.");
    isValid = false;
  } else {
    setFieldError(message, "");
  }

  if (!isValid) {
    return;
  }

  formStatus.textContent = "Thanks! Your message has been validated.";
  contactForm.reset();
});
