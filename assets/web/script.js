/**************************************************
 FIREBASE CONFIG
**************************************************/
 const firebaseConfig = {
    apiKey: "AIzaSyBwguVAdW5cZAPQek2RdaiAqm-N0Zl6vJQ",
    authDomain: "hawk-mobile-app.firebaseapp.com",
    projectId: "hawk-mobile-app",
    storageBucket: "hawk-mobile-app.firebasestorage.app",
    messagingSenderId: "642975225461",
    appId: "1:642975225461:web:c607678f9ea5b78373ca3c",
    measurementId: "G-XJ2M0W3LQB"
  };

let auth = null;
let db = null;

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const authScreen = document.getElementById("auth-screen");
const appRoot = document.getElementById("app");
const profileEmail = document.getElementById("profile-email");
const profileRole = document.getElementById("profile-role");

document.addEventListener("DOMContentLoaded", () => {
  if (!window.firebase) {
    console.error("Firebase not loaded");
    return;
  }

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  auth = firebase.auth();
  db = firebase.firestore();
  window.auth = auth;
  window.db = db;

  auth.onAuthStateChanged(async user => {
    if (!user) {
      document.body.classList.remove("logged-in", "admin");
      if (authScreen) authScreen.style.display = "flex";
      if (appRoot) appRoot.style.display = "none";
      return;
    }

    document.body.classList.add("logged-in");

    const ref = db.collection("users").doc(user.uid);
    const snap = await ref.get();

    if (!snap.exists) {
      await ref.set({
        email: user.email,
        role: "user",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }

    const data = (await ref.get()).data();
    if (profileEmail) profileEmail.textContent = data.email || user.email || "";
    if (profileRole) profileRole.textContent = `Role: ${data.role || "user"}`;

    if (data.role === "admin") {
      document.body.classList.add("admin");
    } else {
      document.body.classList.remove("admin");
    }

    if (authScreen) authScreen.style.display = "none";
    if (appRoot) appRoot.style.display = "block";
  });
});

/**************************************************
 🔐 AUTH ACTIONS
**************************************************/
function signup() {
  if (!auth || !db) {
    alert("Firebase is still loading. Try again.");
    return;
  }

  if (!emailInput?.value || !passwordInput?.value) {
    alert("Enter email and password");
    return;
  }

  auth.createUserWithEmailAndPassword(emailInput.value, passwordInput.value)
    .then(res => {
      return db.collection("users").doc(res.user.uid).set({
        email: res.user.email,
        role: "user",
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .catch(err => alert(err.message));
}

function login() {
  if (!auth) {
    alert("Firebase is still loading. Try again.");
    return;
  }

  if (!emailInput?.value || !passwordInput?.value) {
    alert("Enter email and password");
    return;
  }

  auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value)
    .catch(err => alert(err.message));
}

function googleLogin() {
  alert("Google Sign-in works on real device / APK only");
}

function forgotPassword() {
  if (!auth) {
    alert("Firebase is still loading. Try again.");
    return;
  }

  if (!emailInput?.value) {
    alert("Enter your email first");
    return;
  }

  auth.sendPasswordResetEmail(emailInput.value)
    .then(() => alert("Password reset email sent"))
    .catch(err => alert(err.message));
}

function logout() {
  if (!auth) return;
  auth.signOut();
}

window.addEventListener("message", async event => {
  if (!db || !auth?.currentUser) return;
  try {
    const data = JSON.parse(event.data);
    if (data.type === "FCM_TOKEN") {
      await db.collection("users")
        .doc(auth.currentUser.uid)
        .update({ fcmToken: data.token });
    }
  } catch (_) {}
});
const burger = document.getElementById("burger");
const nav = document.getElementById("nav-links");
const navLinks = document.querySelectorAll("#nav-links a");
const revealBlocks = document.querySelectorAll(".reveal");
const navbar = document.querySelector(".navbar");
let isMenuOpen = false;

if (navbar) {
  let lastScrollY = window.scrollY;

  const updateNavbarState = () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;

    navbar.classList.toggle("scrolled", currentScrollY > 24);

    if (!isMenuOpen && currentScrollY > 110 && scrollingDown && currentScrollY - lastScrollY > 6) {
      navbar.classList.add("nav-hidden");
    } else if (!scrollingDown || currentScrollY < 90) {
      navbar.classList.remove("nav-hidden");
    }

    lastScrollY = currentScrollY;
  };

  updateNavbarState();
  window.addEventListener("scroll", updateNavbarState, { passive: true });
}

if (burger && nav) {
  const setMenuState = (open) => {
    isMenuOpen = open;
    nav.classList.toggle("active", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
    if (open && navbar) {
      navbar.classList.remove("nav-hidden");
    }
  };

  burger.addEventListener("click", () => {
    const isOpen = nav.classList.contains("active");
    setMenuState(!isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      setMenuState(false);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("active")) {
      setMenuState(false);
    }
  });
}

if (revealBlocks.length > 0) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealBlocks.forEach((block) => observer.observe(block));
}

const productOptions = document.querySelectorAll(".product-option");
const productSerial = document.getElementById("product-serial");
const productImage = document.getElementById("product-image");
const productName = document.getElementById("product-name");
const productKicker = document.getElementById("product-kicker");
const productDesc = document.getElementById("product-desc");
const productFit = document.getElementById("product-fit");
const productMaterial = document.getElementById("product-material");
const productCare = document.getElementById("product-care");
const productPrice = document.getElementById("product-price");
const filterButtons = document.querySelectorAll(".filter-btn");

if (productOptions.length > 0) {
  const updateProductFeature = (option) => {
    productOptions.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });

    option.classList.add("active");
    option.setAttribute("aria-selected", "true");

    productSerial.textContent = option.dataset.id || "";
    productImage.src = option.dataset.image || "";
    productImage.alt = option.dataset.name || "Product";
    productName.textContent = option.dataset.name || "";
    productKicker.textContent = option.dataset.kicker || "";
    productDesc.textContent = option.dataset.desc || "";
    productFit.textContent = option.dataset.fit || "";
    productMaterial.textContent = option.dataset.material || "";
    productCare.textContent = option.dataset.care || "";
    productPrice.textContent = option.dataset.price || "";
  };

  productOptions.forEach((option) => {
    option.addEventListener("click", () => updateProductFeature(option));
  });

  const filterProducts = (filter) => {
    productOptions.forEach((option) => {
      const group = option.dataset.group;
      const shouldShow = filter === "all" || group === filter;
      option.classList.toggle("is-hidden", !shouldShow);
    });

    const activeVisible = Array.from(productOptions).find(
      (option) => option.classList.contains("active") && !option.classList.contains("is-hidden")
    );
    const firstVisible = Array.from(productOptions).find((option) => !option.classList.contains("is-hidden"));

    if (!activeVisible && firstVisible) {
      updateProductFeature(firstVisible);
    }
  };

  if (filterButtons.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((item) => {
          item.classList.remove("active");
          item.setAttribute("aria-selected", "false");
        });

        button.classList.add("active");
        button.setAttribute("aria-selected", "true");
        filterProducts(button.dataset.filter || "all");
      });
    });
  }
}

const faqItems = document.querySelectorAll(".faq-item");
const faqQuestions = document.querySelectorAll(".faq-question");

if (faqQuestions.length > 0) {
  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const parent = question.closest(".faq-item");
      const isOpen = parent.classList.contains("active");

      faqItems.forEach((item) => {
        item.classList.remove("active");
        const button = item.querySelector(".faq-question");
        if (button) {
          button.setAttribute("aria-expanded", "false");
        }
      });

      if (!isOpen) {
        parent.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });
}

const fitItems = document.querySelectorAll(".fit-item");
const fitQuestions = document.querySelectorAll(".fit-question");

if (fitQuestions.length > 0) {
  fitQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const parent = question.closest(".fit-item");
      const isOpen = parent.classList.contains("active");

      fitItems.forEach((item) => {
        item.classList.remove("active");
        const button = item.querySelector(".fit-question");
        if (button) {
          button.setAttribute("aria-expanded", "false");
        }
      });

      if (!isOpen) {
        parent.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });
}

const countDays = document.getElementById("count-days");
const countHours = document.getElementById("count-hours");
const countMins = document.getElementById("count-mins");
const countSecs = document.getElementById("count-secs");

if (countDays && countHours && countMins && countSecs) {
  const targetDate = new Date("2026-03-20T18:00:00");

  const updateCountdown = () => {
    const now = new Date();
    const diff = targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      countDays.textContent = "00";
      countHours.textContent = "00";
      countMins.textContent = "00";
      countSecs.textContent = "00";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    countDays.textContent = String(days).padStart(2, "0");
    countHours.textContent = String(hours).padStart(2, "0");
    countMins.textContent = String(mins).padStart(2, "0");
    countSecs.textContent = String(secs).padStart(2, "0");
  };

  updateCountdown();
  window.setInterval(updateCountdown, 1000);
}

const newsletterForm = document.querySelector(".newsletter-form");

if (newsletterForm) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = newsletterForm.querySelector("button");
    if (!button) {
      return;
    }

    const originalLabel = button.textContent;
    button.textContent = "Subscribed";
    button.disabled = true;
    newsletterForm.reset();

    window.setTimeout(() => {
      button.textContent = originalLabel;
      button.disabled = false;
    }, 2200);
  });
}

const testimonialSlides = document.querySelectorAll(".testimonial-slide");
const testimonialDots = document.querySelectorAll(".testimonial-dot");

if (testimonialSlides.length > 0 && testimonialDots.length > 0) {
  let testimonialIndex = 0;
  let testimonialTimer = null;

  const setTestimonial = (index) => {
    testimonialSlides.forEach((slide) => slide.classList.remove("active"));
    testimonialDots.forEach((dot) => dot.classList.remove("active"));

    testimonialSlides[index].classList.add("active");
    testimonialDots[index].classList.add("active");
    testimonialIndex = index;
  };

  const startTestimonials = () => {
    testimonialTimer = window.setInterval(() => {
      const nextIndex = (testimonialIndex + 1) % testimonialSlides.length;
      setTestimonial(nextIndex);
    }, 4200);
  };

  testimonialDots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setTestimonial(index);
      if (testimonialTimer) {
        window.clearInterval(testimonialTimer);
      }
      startTestimonials();
    });
  });

  startTestimonials();
}
