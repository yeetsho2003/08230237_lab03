document.addEventListener("DOMContentLoaded", () => {
  console.log("🌸 Portfolio JavaScript loaded!");

  initNavigation();
  initFormValidation();
  initScrollEffects();
  initProjectInteractions();
  initSkillAnimations();
});

/* ================================
   1. Navigation with Sound & Smooth Scrolling
================================ */
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-links a");
  const hamburger = document.querySelector(".hamburger");
  const navLinksContainer = document.querySelector(".nav-links");

  // Navigation scroll effect (sticky with blur)
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
      navbar.style.backdropFilter = "blur(8px)";
    } else {
      navbar.style.backgroundColor = "var(--white)";
      navbar.style.backdropFilter = "none";
    }
  });

  // Hamburger menu toggle
  if (hamburger) {
    hamburger.addEventListener("click", () => {
      navLinksContainer.classList.toggle("active");
      hamburger.classList.toggle("active");
      playClickSound();
    });
  }

  // Nav links with smooth scroll + sound
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      // Mobile menu close if active
      if (navLinksContainer.classList.contains("active")) {
        navLinksContainer.classList.remove("active");
        hamburger.classList.remove("active");
      }

      playClickSound();

      const targetId = link.getAttribute("href");
      if (targetId.startsWith("#")) {
        e.preventDefault();
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 80, // adjust for navbar height
            behavior: "smooth"
          });
        }
      }
    });
  });

  // Cute click sound using Web Audio API (fallback to tiny beep if not supported)
  function playClickSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 880; // higher-pitched "cute" click
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
    } catch (err) {
      console.log("⚠️ Sound not supported:", err);
    }
  }
}

/* ================================
   2. Contact Form Validation + Notifications
================================ */
function initFormValidation() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    let isValid = true;

    if (name === "") {
      showError("name", "Please enter your name");
      isValid = false;
    } else {
      clearError("name");
    }

    if (email === "") {
      showError("email", "Please enter your email");
      isValid = false;
    } else if (!isValidEmail(email)) {
      showError("email", "Enter a valid email address");
      isValid = false;
    } else {
      clearError("email");
    }

    if (message === "") {
      showError("message", "Please enter your message");
      isValid = false;
    } else {
      clearError("message");
    }

    if (isValid) {
      simulateFormSubmission(name, email, message);
    }
  });
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.classList.add("error");

  let errorEl = field.parentElement.querySelector(".error-message");
  if (!errorEl) {
    errorEl = document.createElement("div");
    errorEl.className = "error-message";
    field.parentElement.appendChild(errorEl);
  }
  errorEl.textContent = message;
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  field.classList.remove("error");

  const errorEl = field.parentElement.querySelector(".error-message");
  if (errorEl) {
    errorEl.remove();
  }
}

function simulateFormSubmission(name, email, message) {
  const submitBtn = document.querySelector("#contactForm .btn");
  if (!submitBtn) return;

  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  setTimeout(() => {
    showNotification("✅ Message sent successfully! I'll get back to you soon.", "success");
    document.getElementById("contactForm").reset();
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }, 2000);
}

function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.textContent = message;

  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 12px 18px;
    border-radius: 8px;
    font-weight: 500;
    color: white;
    z-index: 9999;
    transform: translateX(120%);
    transition: transform 0.3s ease;
    max-width: 280px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  `;

  if (type === "success") {
    notification.style.backgroundColor = "var(--primary-color)";
  } else {
    notification.style.backgroundColor = "#e74c3c";
  }

  document.body.appendChild(notification);

  // Slide in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Slide out after 4s
  setTimeout(() => {
    notification.style.transform = "translateX(120%)";
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

/* ================================
   3. Scroll Effects (Reveal + Active Nav Highlight)
================================ */
function initScrollEffects() {
  const revealEls = document.querySelectorAll(".education-item, .skills-category, .project-card");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  revealEls.forEach(el => observer.observe(el));

  // Active nav highlight
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (scrollY >= sectionTop - 120) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  });
}

/* ================================
   4. Project Interactions
================================ */
function initProjectInteractions() {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach(card => {
    card.addEventListener("click", () => {
      const title = card.querySelector("h3")?.textContent || "Project";
      showNotification(`Viewing details for: ${title}`, "success");
    });

    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-10px) scale(1.02)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)";
    });
  });
}

/* ================================
   5. Skill Animations
================================ */
function initSkillAnimations() {
  const skillItems = document.querySelectorAll(".skills-category li");

  skillItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;

    item.addEventListener("mouseenter", () => {
      item.style.transform = "translateX(10px)";
      item.style.color = "var(--primary-color)";
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "translateX(0)";
      item.style.color = "";
    });
  });
}
