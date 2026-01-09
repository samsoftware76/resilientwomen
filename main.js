// ============================================
// RESILIENT WOMEN CBO - MAIN JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function () {

  // === MOBILE NAVIGATION TOGGLE ===
  const navbarToggle = document.querySelector('.navbar-toggle');
  const navbarNav = document.querySelector('.navbar-nav');

  if (navbarToggle && navbarNav) {
    navbarToggle.addEventListener('click', function () {
      navbarToggle.classList.toggle('active');
      navbarNav.classList.toggle('active');
      document.body.style.overflow = navbarNav.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function () {
        navbarToggle.classList.remove('active');
        navbarNav.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function (event) {
      if (!event.target.closest('.navbar-container')) {
        navbarToggle.classList.remove('active');
        navbarNav.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // === SMOOTH SCROLL FOR ANCHOR LINKS ===
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#!') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offsetTop = target.offsetTop - 80; // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // === SCROLL ANIMATIONS ===
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => observer.observe(el));

  // === HERO CAROUSEL LOGIC ===
  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');

  if (slides.length > 0) {
    let currentSlide = 0;
    const intervalTime = 6000; // 6 seconds
    let slideInterval;

    // Function to show specific slide
    window.showSlide = function (index) {
      if (index >= slides.length) index = 0;
      if (index < 0) index = slides.length - 1;

      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      slides[index].classList.add('active');
      dots[index].classList.add('active');

      currentSlide = index;

      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, intervalTime);
    };

    function nextSlide() {
      let nextIndex = currentSlide + 1;
      if (nextIndex >= slides.length) nextIndex = 0;

      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));

      slides[nextIndex].classList.add('active');
      dots[nextIndex].classList.add('active');

      currentSlide = nextIndex;
    }

    slideInterval = setInterval(nextSlide, intervalTime);
  }

  // === ACTIVE NAVIGATION LINK ===
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinksAll = document.querySelectorAll('.nav-link');
  navLinksAll.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });

  // === FORM VALIDATION & SUBMISSION ===
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerText : 'Send';

      if (submitBtn) {
        submitBtn.innerText = 'Sending...';
        submitBtn.style.opacity = '0.7';
      }

      // 1. Gather Data
      const formData = new FormData(form);
      let subject = "Website Inquiry";
      let bodyLines = [];

      // Smart subject line
      const subjectInput = form.querySelector('select[name="subject"]') || form.querySelector('select');
      if (subjectInput && subjectInput.value) {
        subject = "Website: " + (subjectInput.options[subjectInput.selectedIndex].text);
      }

      // Smart body content
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        if (!input.value) return;

        // Get label text
        let label = input.name;
        if (input.previousElementSibling && input.previousElementSibling.tagName === 'LABEL') {
          label = input.previousElementSibling.innerText.replace('*', '').trim();
        } else if (input.closest('.form-group') && input.closest('.form-group').querySelector('label')) {
          label = input.closest('.form-group').querySelector('label').innerText.replace('*', '').trim();
        }

        bodyLines.push(`${label}: ${input.value}`);
      });

      const body = bodyLines.join('\n');

      // 2. Open Mail Client (Wrapped in timeout to allow UI update)
      setTimeout(() => {
        window.location.href = `mailto:info@resilientwomencbo.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        // 3. Reset UI
        if (submitBtn) {
          submitBtn.innerText = 'Email Client Opened';
          submitBtn.style.backgroundColor = 'var(--color-success)';
          setTimeout(() => {
            submitBtn.innerText = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.style.opacity = '1';
            form.reset();
          }, 3000);
        }
      }, 500);
    });
  });

  // === IMAGE LIGHTBOX ===
  const galleryImages = document.querySelectorAll('.gallery-item img');

  if (galleryImages.length > 0) {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.style.cssText = `
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 9999;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    `;

    const lightboxImg = document.createElement('img');
    lightboxImg.style.cssText = `
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      border-radius: var(--radius-md);
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = `
      position: absolute;
      top: 20px;
      right: 40px;
      font-size: 48px;
      color: white;
      background: none;
      border: none;
      cursor: pointer;
      z-index: 10000;
    `;

    lightbox.appendChild(lightboxImg);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);

    // Add click handlers to gallery images
    galleryImages.forEach(img => {
      img.style.cursor = 'pointer';
      img.addEventListener('click', function () {
        lightboxImg.src = this.src;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    // Close lightbox
    const closeLightbox = () => {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.style.display === 'flex') {
        closeLightbox();
      }
    });
  }

  // === COUNTER ANIMATION FOR STATISTICS ===
  const counters = document.querySelectorAll('.counter');

  if (counters.length > 0) {
    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      updateCounter();
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // === NEWSLETTER SIGNUP ===
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');

      if (emailInput && emailInput.value) {
        // Show success message
        alert('Thank you for subscribing to our newsletter!');
        emailInput.value = '';
      }
    });
  }

  // === BACK TO TOP BUTTON ===
  const backToTop = document.createElement('button');
  backToTop.innerHTML = '↑';
  backToTop.className = 'back-to-top';
  backToTop.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--color-primary);
    color: var(--color-accent);
    border: none;
    border-radius: var(--radius-full);
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    display: none;
    z-index: 999;
    box-shadow: var(--shadow-lg);
    transition: all var(--transition-base);
  `;

  document.body.appendChild(backToTop);

  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
      backToTop.style.display = 'block';
    } else {
      backToTop.style.display = 'none';
    }
  });

  backToTop.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  backToTop.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-5px)';
    this.style.boxShadow = 'var(--shadow-xl)';
  });

  backToTop.addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = 'var(--shadow-lg)';
  });

});

// === UTILITY FUNCTIONS ===

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Format numbers with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
