// subtle hover nudge for all .btn arrows
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => btn.querySelector('.icon-arrow')?.style.setProperty('transform', 'translateX(6px)'));
    btn.addEventListener('mouseleave', () => btn.querySelector('.icon-arrow')?.style.setProperty('transform', 'translateX(0)'));
});

// light card tilt to mimic motion in modern hero designs
const tilt = (el, max = 6) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const onMove = (e) => {
        const dx = (e.clientX - cx) / (rect.width / 2);
        const dy = (e.clientY - cy) / (rect.height / 2);
        el.style.transform = `rotateX(${(-dy * max).toFixed(2)}deg) rotateY(${(dx * max).toFixed(2)}deg) translateZ(0)`;
    };
    const reset = () => el.style.transform = 'translateZ(0)';
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', reset);
};
document.querySelectorAll('.card').forEach(c => tilt(c));


// STATS COUNTER - FIXED VERSION WITH VISIBLE BOXES
class StatsCounter {
  constructor() {
    this.counters = document.querySelectorAll('.counter');
    this.statsSection = document.querySelector('.stats-section');
    this.statBoxes = document.querySelectorAll('.stat-box');
    this.hasAnimated = false;
    this.isAnimating = false;
    
    if (!this.counters.length || !this.statsSection) return;
    
    this.initializeElements();
    this.init();
  }
  
  initializeElements() {
    // Ensure all elements are fully visible from the start
    this.counters.forEach(counter => {
      counter.textContent = '0';
      counter.style.opacity = '1';
      counter.style.visibility = 'visible';
    });
    
    this.statBoxes.forEach(box => {
      box.style.opacity = '1';
      box.style.visibility = 'visible';
      box.style.display = 'block';
    });
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
      threshold: 0.3,
      rootMargin: '0px 0px -20% 0px'
    });
    
    observer.observe(this.statsSection);
  }
  
  setupScrollListener() {
    const checkScroll = () => {
      if (this.hasAnimated) return;
      
      const rect = this.statsSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight * 0.8;
      
      if (isVisible) {
        this.startAnimation();
        window.removeEventListener('scroll', checkScroll);
      }
    };
    
    window.addEventListener('scroll', checkScroll);
    checkScroll();
  }
  
  startAnimation() {
    if (this.hasAnimated || this.isAnimating) return;
    
    this.hasAnimated = true;
    this.isAnimating = true;
    
    // Ensure all boxes are visible before starting
    this.statBoxes.forEach(box => {
      box.style.opacity = '1';
      box.style.visibility = 'visible';
      box.style.transform = 'translateY(0)';
    });
    
    // Reset all counters to 0 and make them visible
    this.counters.forEach(counter => {
      counter.textContent = '0';
      counter.style.opacity = '1';
      counter.style.visibility = 'visible';
    });
    
    // Start animations with staggered timing
    this.counters.forEach((counter, index) => {
      setTimeout(() => {
        this.animateCounter(counter, index);
      }, index * 200);
    });
  }
  
  animateCounter(element, index) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2500;
    const startTime = performance.now();
    const statBox = element.closest('.stat-box');
    
    // Ensure visibility throughout animation
    element.style.opacity = '1';
    element.style.visibility = 'visible';
    if (statBox) {
      statBox.style.opacity = '1';
      statBox.style.visibility = 'visible';
    }
    
    // Add animation classes
    element.classList.add('counting');
    if (statBox) {
      statBox.classList.add('animating');
    }
    
    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function
      const easedProgress = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const current = Math.round(easedProgress * target);
      
      // Update number and ensure visibility
      element.textContent = current;
      element.style.opacity = '1';
      element.style.visibility = 'visible';
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation complete
        element.textContent = target;
        element.classList.remove('counting');
        if (statBox) {
          statBox.classList.remove('animating');
        }
        
        // Final visibility check
        element.style.opacity = '1';
        element.style.visibility = 'visible';
        
        this.checkAnimationComplete();
      }
    };
    
    requestAnimationFrame(animate);
  }
  
  checkAnimationComplete() {
    const allCompleted = Array.from(this.counters).every(counter => 
      !counter.classList.contains('counting')
    );
    
    if (allCompleted) {
      this.isAnimating = false;
      this.onAnimationComplete();
    }
  }
  
  onAnimationComplete() {
    console.log('Stats animation completed');
    
    // Ensure all elements remain visible
    this.counters.forEach(counter => {
      counter.style.opacity = '1';
      counter.style.visibility = 'visible';
    });
    
    this.statBoxes.forEach(box => {
      box.style.opacity = '1';
      box.style.visibility = 'visible';
    });
  }
  
  reset() {
    this.hasAnimated = false;
    this.isAnimating = false;
    
    this.counters.forEach(counter => {
      counter.textContent = '0';
      counter.style.opacity = '1';
      counter.style.visibility = 'visible';
      counter.classList.remove('counting');
    });
    
    this.statBoxes.forEach(box => {
      box.style.opacity = '1';
      box.style.visibility = 'visible';
      box.classList.remove('animating');
    });
  }
}

// BUTTON EFFECTS
function initButtonEffects() {
  document.querySelectorAll('.btn').forEach(btn => {
    const arrow = btn.querySelector('.icon-arrow');
    if (arrow) {
      btn.addEventListener('mouseenter', () => {
        arrow.style.transform = 'translateX(6px)';
      });
      btn.addEventListener('mouseleave', () => {
        arrow.style.transform = 'translateX(0)';
      });
    }
  });
  
  const consultBtn = document.querySelector('.btn-consult');
  if (consultBtn) {
    consultBtn.addEventListener('mouseenter', () => {
      consultBtn.style.transform = 'translateY(-3px)';
    });
    consultBtn.addEventListener('mouseleave', () => {
      consultBtn.style.transform = '';
    });
  }
}

// CARD EFFECTS
function initCardEffects() {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 8;
      const rotateY = (centerX - x) / 8;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const statsCounter = new StatsCounter();
    initButtonEffects();
    initCardEffects();
    
    window.resetStats = () => {
      if (statsCounter) {
        statsCounter.reset();
      }
    };
    
    console.log('Stats section fully initialized');
  }, 100);
});

// Additional safety check on window load
window.addEventListener('load', () => {
  const counters = document.querySelectorAll('.counter');
  const boxes = document.querySelectorAll('.stat-box');
  
  counters.forEach(counter => {
    if (!counter.textContent || counter.textContent === '') {
      counter.textContent = '0';
    }
    counter.style.opacity = '1';
    counter.style.visibility = 'visible';
  });
  
  boxes.forEach(box => {
    box.style.opacity = '1';
    box.style.visibility = 'visible';
    box.style.display = 'block';
  });
});

// ENHANCED INTERACTIVE GRADIENT CARD
class EnhancedInteractiveCard {
  constructor() {
    this.card = document.getElementById('gradientCard');
    this.floatingCircle = document.getElementById('floatingCircle');
    this.rotatingText = document.querySelector('.rotating-text-container');
    this.avatarCircle = document.querySelector('.avatar-circle');
    
    this.isHovered = false;
    this.mouseX = 0;
    this.mouseY = 0;
    
    if (!this.card) return;
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.startAmbientAnimation();
  }
  
  setupEventListeners() {
    this.card.addEventListener('mouseenter', (e) => this.onMouseEnter(e));
    this.card.addEventListener('mouseleave', (e) => this.onMouseLeave(e));
    this.card.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.card.addEventListener('click', (e) => this.onCardClick(e));
  }
  
  onMouseEnter(e) {
    this.isHovered = true;
    this.card.style.cursor = 'pointer';
    this.triggerHoverEffects();
  }
  
  onMouseLeave(e) {
    this.isHovered = false;
    this.card.style.cursor = 'default';
    this.resetHoverEffects();
  }
  
  onMouseMove(e) {
    if (!this.isHovered) return;
    
    const rect = this.card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    this.mouseX = (e.clientX - centerX) / (rect.width / 2);
    this.mouseY = (e.clientY - centerY) / (rect.height / 2);
    
    this.updateCirclePosition();
  }
  
  updateCirclePosition() {
    if (!this.floatingCircle) return;
    
    const moveX = this.mouseX * 8;
    const moveY = this.mouseY * 8;
    
    this.floatingCircle.style.transform = `
      translateX(calc(-50% + ${moveX}px)) 
      translateY(calc(-10px + ${moveY}px)) 
      scale(1.1)
    `;
  }
  
  triggerHoverEffects() {
    if (this.rotatingText) {
      this.rotatingText.style.animationDuration = '6s';
    }
    
    this.createSparkles();
    
    const gradientBg = this.card.querySelector('.gradient-bg');
    if (gradientBg) {
      gradientBg.style.animationDuration = '2s';
    }
  }
  
  resetHoverEffects() {
    if (this.rotatingText) {
      this.rotatingText.style.animationDuration = '15s';
    }
    
    if (this.floatingCircle) {
      this.floatingCircle.style.transform = 'translateX(-50%)';
    }
    
    const gradientBg = this.card.querySelector('.gradient-bg');
    if (gradientBg) {
      gradientBg.style.animationDuration = '8s';
    }
    
    this.removeSparkles();
  }
  
  createSparkles() {
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        this.createSingleSparkle();
      }, i * 200);
    }
  }
  
  createSingleSparkle() {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = Math.random() * 2 + 1;
    
    sparkle.style.cssText = `
      position: absolute;
      left: ${x}%;
      top: ${y}%;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, #DCF986 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      animation: sparkleFloat ${duration}s ease-out forwards;
      z-index: 15;
    `;
    
    // Add sparkle animation styles if not present
    if (!document.querySelector('#sparkle-styles')) {
      const style = document.createElement('style');
      style.id = 'sparkle-styles';
      style.textContent = `
        @keyframes sparkleFloat {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0);
          }
          50% {
            opacity: 1;
            transform: translateY(-20px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-40px) scale(0);
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    this.card.appendChild(sparkle);
    
    setTimeout(() => {
      if (sparkle.parentNode) {
        sparkle.parentNode.removeChild(sparkle);
      }
    }, duration * 1000);
  }
  
  removeSparkles() {
    const sparkles = this.card.querySelectorAll('.sparkle');
    sparkles.forEach(sparkle => {
      sparkle.style.opacity = '0';
      setTimeout(() => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      }, 300);
    });
  }
  
  onCardClick(e) {
    const ripple = document.createElement('div');
    const rect = this.card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, rgba(220, 249, 134, 0.3) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      animation: rippleEffect 0.8s ease-out forwards;
      z-index: 5;
    `;
    
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
    
    this.card.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 800);
  }
  
  startAmbientAnimation() {
    setInterval(() => {
      if (!this.isHovered && this.avatarCircle) {
        this.avatarCircle.style.boxShadow = `
          0 4px 20px rgba(0, 0, 0, 0.4),
          0 0 0 1px rgba(255, 255, 255, 0.1) inset,
          0 0 ${Math.random() * 20 + 10}px rgba(94, 169, 119, ${Math.random() * 0.2 + 0.1})
        `;
      }
    }, 3000);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new EnhancedInteractiveCard();
});

// MEETING BOOKING FORM FUNCTIONALITY
class MeetingBookingForm {
  constructor() {
    this.form = document.getElementById('projectForm');
    this.submitBtn = this.form?.querySelector('.submit-enquiry-btn');
    
    if (this.form) {
      this.init();
    }
  }
  
  init() {
    this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    this.setupFormAnimations();
    this.setupInputValidation();
  }
  
  handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.form);
    const submissionData = Object.fromEntries(formData.entries());
    
    this.showLoadingState();
    
    // Simulate form submission (replace with your actual API call)
    setTimeout(() => {
      console.log('Form submitted:', submissionData);
      this.showSuccessState();
      this.form.reset();
    }, 2000);
  }
  
  showLoadingState() {
    const btnText = this.submitBtn.querySelector('span');
    const loader = this.submitBtn.querySelector('.submit-loader');
    
    this.submitBtn.disabled = true;
    btnText.textContent = 'Submitting...';
    loader.style.display = 'block';
    this.submitBtn.style.opacity = '0.7';
  }
  
  showSuccessState() {
    const btnText = this.submitBtn.querySelector('span');
    const loader = this.submitBtn.querySelector('.submit-loader');
    
    btnText.textContent = 'Message sent!';
    loader.style.display = 'none';
    this.submitBtn.style.background = '#5EA977';
    
    setTimeout(() => {
      this.resetSubmitButton();
    }, 3000);
  }
  
  resetSubmitButton() {
    const btnText = this.submitBtn.querySelector('span');
    
    this.submitBtn.disabled = false;
    btnText.textContent = 'Submit enquiry';
    this.submitBtn.style.opacity = '1';
  }
  
  setupFormAnimations() {
    // Animate form elements on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    });
    
    const inputGroups = this.form.querySelectorAll('.input-group');
    inputGroups.forEach((group, index) => {
      group.style.opacity = '0';
      group.style.transform = 'translateY(20px)';
      group.style.transition = `all 0.6s ease ${index * 0.1}s`;
      observer.observe(group);
    });
  }
  
  setupInputValidation() {
    const inputs = this.form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateInput(input);
      });
      
      input.addEventListener('focus', () => {
        input.style.borderColor = '#5EA977';
      });
    });
  }
  
  validateInput(input) {
    if (input.hasAttribute('required') && !input.value.trim()) {
      input.style.borderColor = '#ff6b6b';
      input.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.1)';
    } else if (input.type === 'email' && input.value && !this.isValidEmail(input.value)) {
      input.style.borderColor = '#ff6b6b';
      input.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.1)';
    } else {
      input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      input.style.boxShadow = 'none';
    }
  }
  
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Initialize when DOM loads (add this to your existing DOMContentLoaded event)
document.addEventListener('DOMContentLoaded', () => {
  // Your existing initialization code...
  
  // Add the meeting booking form
  new MeetingBookingForm();
});

// NEWSLETTER SUBSCRIPTION FUNCTIONALITY
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
    
    // Simulate API call - replace with your actual newsletter service
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
    this.submitBtn.style.background = '#5EA977';
    
    setTimeout(() => {
      this.resetButton();
    }, 2000);
  }
  
  showError(message) {
    this.emailInput.style.borderColor = '#ff6b6b';
    
    // Create error tooltip
    const tooltip = document.createElement('div');
    tooltip.textContent = message;
    tooltip.style.cssText = `
      position: absolute;
      top: -40px;
      left: 0;
      background: #ff6b6b;
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
        this.emailInput.style.borderColor = '#5EA977';
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

// Initialize newsletter form
document.addEventListener('DOMContentLoaded', () => {
  new NewsletterForm();
  
  // Add smooth scroll for footer links
  document.querySelectorAll('.footer-links a, .footer-bottom-links a').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});
