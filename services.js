const lenis = new Lenis()

// Animation frame loop
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// Services Page Interactive JavaScript

// Smooth Scrolling for Navigation Links
document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
});

// Stats Counter Animation
class StatsCounter {
  constructor() {
    this.counters = document.querySelectorAll('.stat-number');
    this.hasAnimated = false;
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      this.setupScrollListener();
    }
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.startAnimation();
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -10% 0px'
    });

    const heroSection = document.querySelector('.services-hero');
    if (heroSection) {
      observer.observe(heroSection);
    }
  }

  setupScrollListener() {
    const checkScroll = () => {
      if (this.hasAnimated) return;

      const heroSection = document.querySelector('.services-hero');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.8;

        if (isVisible) {
          this.startAnimation();
          window.removeEventListener('scroll', checkScroll);
        }
      }
    };

    window.addEventListener('scroll', checkScroll);
    checkScroll();
  }

  startAnimation() {
    if (this.hasAnimated) return;
    this.hasAnimated = true;

    this.counters.forEach((counter, index) => {
      setTimeout(() => {
        this.animateCounter(counter);
      }, index * 200);
    });
  }

  animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easedProgress = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const current = Math.round(easedProgress * target);
      element.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.textContent = target;
      }
    };

    requestAnimationFrame(animate);
  }
}

// Service Cards Interaction
class ServiceCards {
  constructor() {
    this.cards = document.querySelectorAll('.service-card');
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      card.addEventListener('mouseenter', () => this.onCardHover(card));
      card.addEventListener('mouseleave', () => this.onCardLeave(card));
      card.addEventListener('click', () => this.onCardClick(card));
    });
  }

  onCardHover(card) {
    const icon = card.querySelector('.service-icon');
    const arrow = card.querySelector('.service-arrow');

    if (icon) {
      icon.style.transform = 'scale(1.1) rotate(5deg)';
    }

    if (arrow) {
      arrow.style.transform = 'scale(1.1) translateX(4px)';
    }
  }

  onCardLeave(card) {
    const icon = card.querySelector('.service-icon');
    const arrow = card.querySelector('.service-arrow');

    if (icon) {
      icon.style.transform = '';
    }

    if (arrow) {
      arrow.style.transform = '';
    }
  }

  onCardClick(card) {
    // Add ripple effect on click
    this.createRipple(card, event);
  }

  createRipple(card, event) {
    const ripple = document.createElement('div');
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(10, 112, 117, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            animation: rippleEffect 0.6s ease-out forwards;
            z-index: 1;
        `;

    // Add ripple animation if not exists
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
                @keyframes rippleEffect {
                    0% {
                        transform: scale(0);
                        opacity: 0.6;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 0;
                    }
                }
            `;
      document.head.appendChild(style);
    }

    card.style.position = 'relative';
    card.appendChild(ripple);

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }
}

// Floating Cards Animation
class FloatingCards {
  constructor() {
    this.cards = document.querySelectorAll('.floating-card');
    this.init();
  }

  init() {
    this.cards.forEach((card, index) => {
      this.setupCardAnimation(card, index);
    });
  }

  setupCardAnimation(card, index) {
    // Add mouse interaction
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-30px) scale(1.05) rotate(5deg)';
      card.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.zIndex = '';
    });

    // Add parallax effect on scroll
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      const rate = scrollY * -0.5;
      card.style.transform = `translateY(${rate * (index + 1) * 0.1}px)`;
    });
  }
}

// Pricing Toggle
class PricingToggle {
  constructor() {
    this.toggle = document.getElementById('pricing-toggle');
    this.monthlyPrices = document.querySelectorAll('.monthly-price');
    this.annualPrices = document.querySelectorAll('.annual-price');
    this.init();
  }

  init() {
    if (this.toggle) {
      this.toggle.addEventListener('change', () => this.togglePricing());
    }
  }

  togglePricing() {
    const isAnnual = this.toggle.checked;

    this.monthlyPrices.forEach(price => {
      price.style.display = isAnnual ? 'none' : 'inline';
    });

    this.annualPrices.forEach(price => {
      price.style.display = isAnnual ? 'inline' : 'none';
    });

    // Add animation effect
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach((card, index) => {
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        card.style.transform = '';
      }, 150 + index * 50);
    });
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.animatedElements = document.querySelectorAll('.service-card, .process-step, .pricing-card');
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      this.showAllElements();
    }
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    this.animatedElements.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(element);
    });
  }

  showAllElements() {
    this.animatedElements.forEach(element => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
  }
}

// Process Steps Animation
class ProcessSteps {
  constructor() {
    this.steps = document.querySelectorAll('.process-step');
    this.init();
  }

  init() {
    this.steps.forEach((step, index) => {
      step.style.animationDelay = `${index * 0.2}s`;

      step.addEventListener('mouseenter', () => {
        const visual = step.querySelector('.step-visual');
        const number = step.querySelector('.step-number');

        if (visual) {
          visual.style.transform = 'scale(1.1) rotate(5deg)';
        }

        if (number) {
          number.style.transform = 'scale(1.1)';
        }
      });

      step.addEventListener('mouseleave', () => {
        const visual = step.querySelector('.step-visual');
        const number = step.querySelector('.step-number');

        if (visual) {
          visual.style.transform = '';
        }

        if (number) {
          number.style.transform = '';
        }
      });
    });
  }
}

// Newsletter Form
class NewsletterForm {
  constructor() {
    this.form = document.getElementById('newsletterForm');
    this.emailInput = document.getElementById('newsletter-email');
    this.submitBtn = this.form?.querySelector('.newsletter-btn');

    if (this.form) {
      this.init();
    }
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.setupInputValidation();
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = this.emailInput.value.trim();

    if (!this.isValidEmail(email)) {
      this.showError('Please enter a valid email address');
      return;
    }

    this.showLoading();

    // Simulate API call
    setTimeout(() => {
      console.log('Newsletter subscription:', email);
      this.showSuccess();
      this.form.reset();
    }, 1500);
  }

  showLoading() {
    this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    this.submitBtn.disabled = true;
  }

  showSuccess() {
    this.submitBtn.innerHTML = '<i class="fas fa-check"></i>';
    this.submitBtn.style.background = '#28a745';

    setTimeout(() => {
      this.resetButton();
    }, 2000);
  }

  showError(message) {
    this.emailInput.style.borderColor = '#dc3545';

    // Create error tooltip
    const tooltip = document.createElement('div');
    tooltip.textContent = message;
    tooltip.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: #dc3545;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
        `;

    this.form.style.position = 'relative';
    this.form.appendChild(tooltip);

    setTimeout(() => {
      tooltip.remove();
      this.emailInput.style.borderColor = '';
    }, 3000);
  }

  resetButton() {
    this.submitBtn.innerHTML = '<i class="fas fa-arrow-right"></i>';
    this.submitBtn.disabled = false;
    this.submitBtn.style.background = '';
  }

  setupInputValidation() {
    this.emailInput.addEventListener('input', () => {
      if (this.isValidEmail(this.emailInput.value)) {
        this.emailInput.style.borderColor = '#28a745';
      } else {
        this.emailInput.style.borderColor = '';
      }
    });
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Button Interactions
class ButtonInteractions {
  constructor() {
    this.buttons = document.querySelectorAll('.btn, .pricing-button');
    this.init();
  }

  init() {
    this.buttons.forEach(button => {
      button.addEventListener('mouseenter', () => this.onButtonHover(button));
      button.addEventListener('mouseleave', () => this.onButtonLeave(button));
    });
  }

  onButtonHover(button) {
    const arrow = button.querySelector('i');
    if (arrow) {
      arrow.style.transform = 'translateX(4px)';
    }
  }

  onButtonLeave(button) {
    const arrow = button.querySelector('i');
    if (arrow) {
      arrow.style.transform = '';
    }
  }
}

// Navbar Scroll Effect
class NavbarScroll {
  constructor() {
    this.navbar = document.querySelector('.site-header');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll());
  }

  handleScroll() {
    if (window.scrollY > 100) {
      this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      this.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      this.navbar.style.boxShadow = 'none';
    }
  }
}

// CTA Graphics Animation
class CTAGraphics {
  constructor() {
    this.elements = document.querySelectorAll('.graphic-element');
    this.init();
  }

  init() {
    this.elements.forEach((element, index) => {
      this.setupMouseParallax(element, index);
    });
  }

  setupMouseParallax(element, index) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 20 - 10;
      const y = (e.clientY / window.innerHeight) * 20 - 10;

      element.style.transform = `
                translateX(${x * (index + 1) * 0.5}px) 
                translateY(${y * (index + 1) * 0.5}px) 
                rotate(${x * 0.5}deg)
            `;
    });
  }
}

// Initialize all components
document.addEventListener('DOMContentLoaded', function () {
  // Initialize components with small delays to ensure DOM is ready
  setTimeout(() => {
    new StatsCounter();
    new ServiceCards();
    new FloatingCards();
    new PricingToggle();
    new ScrollAnimations();
    new ProcessSteps();
    new NewsletterForm();
    new ButtonInteractions();
    new NavbarScroll();
    new CTAGraphics();

    console.log('Services page fully initialized');
  }, 100);
});

// Performance optimizations
window.addEventListener('load', () => {
  // Remove loading classes if any exist
  document.body.classList.remove('loading');

  // Optimize animations for performance
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
  }
});

// Error handling
window.addEventListener('error', (e) => {
  console.error('Services page error:', e.error);
});

// Intersection Observer polyfill fallback
if (!('IntersectionObserver' in window)) {
  console.log('IntersectionObserver not supported, using scroll fallback');
}
