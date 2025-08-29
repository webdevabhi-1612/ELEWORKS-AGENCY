// Booking Form Multi-Step Handler

const lenis = new Lenis()

// Animation frame loop
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

class BookingFormHandler {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.formData = {};

    // Get DOM elements
    this.form = document.getElementById('bookingForm');
    this.steps = document.querySelectorAll('.form-step');
    this.progressSteps = document.querySelectorAll('.progress-step');
    this.nextButtons = document.querySelectorAll('.next-step');
    this.prevButtons = document.querySelectorAll('.prev-step');
    this.submitButton = document.querySelector('.submit-booking');

    if (this.form) {
      this.init();
    }
  }

  init() {
    console.log('Booking form initialized');
    this.setupEventListeners();
    this.setDateRestrictions();
    this.showStep(this.currentStep);
  }

  setupEventListeners() {
    // Next step buttons
    this.nextButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handleNext();
      });
    });

    // Previous step buttons
    this.prevButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.handlePrevious();
      });
    });

    // Form submission
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Real-time validation and summary update
    this.form.addEventListener('input', () => {
      this.updateSummary();
    });

    this.form.addEventListener('change', () => {
      this.updateSummary();
    });

    // Focus event handlers
    const inputs = this.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        this.clearError(input);
      });
    });
  }

  setDateRestrictions() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth() + 3);

    const minDateStr = tomorrow.toISOString().split('T')[0];
    const maxDateStr = maxDate.toISOString().split('T')[0];

    dateInputs.forEach(input => {
      input.min = minDateStr;
      input.max = maxDateStr;
    });
  }

  handleNext() {
    console.log(`Attempting to go to step ${this.currentStep + 1}`);

    if (this.validateCurrentStep()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.showStep(this.currentStep);
        this.updateProgressIndicator();
        this.scrollToTop();
        this.updateSummary();
        console.log(`Moved to step ${this.currentStep}`);
      }
    } else {
      console.log('Validation failed for current step');
    }
  }

  handlePrevious() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.showStep(this.currentStep);
      this.updateProgressIndicator();
      this.scrollToTop();
      console.log(`Moved back to step ${this.currentStep}`);
    }
  }

  showStep(stepNumber) {
    // Hide all steps
    this.steps.forEach(step => {
      step.classList.remove('active');
    });

    // Show current step
    const currentStep = document.querySelector(`[data-step="${stepNumber}"]`);
    if (currentStep) {
      currentStep.classList.add('active');
    }
  }

  updateProgressIndicator() {
    this.progressSteps.forEach((step, index) => {
      const stepNumber = index + 1;

      // Remove all classes first
      step.classList.remove('active', 'completed');

      if (stepNumber < this.currentStep) {
        step.classList.add('completed');
      } else if (stepNumber === this.currentStep) {
        step.classList.add('active');
      }
    });
  }

  validateCurrentStep() {
    const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
    let isValid = true;

    // Clear previous errors
    currentStepElement.querySelectorAll('.error-message').forEach(el => {
      el.textContent = '';
    });

    // Validate required inputs
    const requiredInputs = currentStepElement.querySelectorAll('[required]');
    requiredInputs.forEach(input => {
      if (!this.validateInput(input)) {
        isValid = false;
      }
    });

    // Step-specific validations
    if (this.currentStep === 2) {
      // Validate project types
      const selectedTypes = currentStepElement.querySelectorAll('input[name="projectType"]:checked');
      if (selectedTypes.length === 0) {
        const errorEl = currentStepElement.querySelector('.checkbox-group + .error-message');
        if (errorEl) {
          errorEl.textContent = 'Please select at least one project type';
        }
        isValid = false;
      }
    }

    if (this.currentStep === 3) {
      // Validate meeting type
      const selectedMeetingType = currentStepElement.querySelector('input[name="meetingType"]:checked');
      if (!selectedMeetingType) {
        const errorEl = currentStepElement.querySelector('.radio-group + .error-message');
        if (errorEl) {
          errorEl.textContent = 'Please select a meeting format';
        }
        isValid = false;
      }
    }

    if (this.currentStep === 4) {
      // Validate terms acceptance
      const termsCheckbox = currentStepElement.querySelector('input[name="terms"]');
      if (!termsCheckbox.checked) {
        const errorEl = termsCheckbox.closest('.form-group').querySelector('.error-message');
        if (errorEl) {
          errorEl.textContent = 'You must agree to the terms and conditions';
        }
        isValid = false;
      }
    }

    return isValid;
  }

  validateInput(input) {
    const errorEl = input.closest('.form-group').querySelector('.error-message');
    let isValid = true;

    // Clear previous error
    if (errorEl) {
      errorEl.textContent = '';
    }
    input.classList.remove('error');

    // Required field validation
    if (input.hasAttribute('required') && !input.value.trim()) {
      this.showError(input, 'This field is required');
      isValid = false;
    }

    // Email validation
    if (input.type === 'email' && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        this.showError(input, 'Please enter a valid email address');
        isValid = false;
      }
    }

    // Phone validation
    if (input.type === 'tel' && input.value) {
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(input.value.replace(/\s/g, ''))) {
        this.showError(input, 'Please enter a valid phone number');
        isValid = false;
      }
    }

    // Date validation
    if (input.type === 'date' && input.value) {
      const selectedDate = new Date(input.value);
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      if (selectedDate < tomorrow) {
        this.showError(input, 'Please select a future date');
        isValid = false;
      }
    }

    return isValid;
  }

  showError(input, message) {
    const errorEl = input.closest('.form-group').querySelector('.error-message');
    if (errorEl) {
      errorEl.textContent = message;
    }
    input.classList.add('error');
  }

  clearError(input) {
    const errorEl = input.closest('.form-group').querySelector('.error-message');
    if (errorEl) {
      errorEl.textContent = '';
    }
    input.classList.remove('error');
  }

  updateSummary() {
    if (this.currentStep === 4) {
      // Update booking summary
      const firstName = document.getElementById('firstName').value;
      const lastName = document.getElementById('lastName').value;
      const email = document.getElementById('email').value;
      const company = document.getElementById('company').value;
      const preferredDate = document.getElementById('preferredDate').value;
      const preferredTime = document.getElementById('preferredTime').value;

      // Get selected project types
      const selectedTypes = Array.from(document.querySelectorAll('input[name="projectType"]:checked'))
        .map(input => input.nextElementSibling.nextElementSibling.querySelector('span').textContent);

      // Get selected meeting type
      const selectedMeetingType = document.querySelector('input[name="meetingType"]:checked');
      const meetingTypeText = selectedMeetingType ?
        selectedMeetingType.nextElementSibling.nextElementSibling.querySelector('strong').textContent : '';

      // Update summary display
      document.getElementById('summaryName').textContent =
        firstName && lastName ? `${firstName} ${lastName}` : '-';
      document.getElementById('summaryEmail').textContent = email || '-';
      document.getElementById('summaryCompany').textContent = company || 'Individual';
      document.getElementById('summaryProject').textContent =
        selectedTypes.length > 0 ? selectedTypes.join(', ') : '-';
      document.getElementById('summaryDateTime').textContent =
        preferredDate && preferredTime ? `${preferredDate} at ${this.formatTime(preferredTime)}` : '-';
      document.getElementById('summaryMeetingType').textContent = meetingTypeText || '-';
    }
  }

  formatTime(time) {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  }

  async handleSubmit() {
    if (!this.validateCurrentStep()) {
      return;
    }

    // Show loading state
    this.submitButton.classList.add('loading');
    this.submitButton.disabled = true;

    try {
      // Collect form data
      const formData = this.collectFormData();

      // Simulate API call
      await this.simulateSubmission(formData);

      // Show success modal
      this.showSuccessModal();

    } catch (error) {
      console.error('Form submission error:', error);
      alert('There was an error submitting your booking. Please try again.');
    } finally {
      // Reset button state
      this.submitButton.classList.remove('loading');
      this.submitButton.disabled = false;
    }
  }

  collectFormData() {
    const formData = new FormData(this.form);
    const data = {};

    // Collect regular form fields
    for (let [key, value] of formData.entries()) {
      if (data[key]) {
        // Handle multiple values (checkboxes)
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    }

    // Collect project types
    const projectTypes = Array.from(document.querySelectorAll('input[name="projectType"]:checked'))
      .map(input => input.value);
    data.projectTypes = projectTypes;

    return data;
  }

  simulateSubmission(data) {
    return new Promise((resolve) => {
      console.log('Submitting booking data:', data);
      setTimeout(resolve, 2000);
    });
  }

  showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// Success modal functions
function closeSuccessModal() {
  const modal = document.getElementById('successModal');
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  console.log('DOM loaded, initializing booking form...');

  // Initialize booking form
  new BookingFormHandler();

  // Modal event listeners
  const modal = document.getElementById('successModal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === this) {
        closeSuccessModal();
      }
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const modal = document.getElementById('successModal');
      if (modal && modal.classList.contains('show')) {
        closeSuccessModal();
      }
    }
  });

  // Button hover effects
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      const arrow = btn.querySelector('.icon-arrow');
      if (arrow) {
        arrow.style.transform = 'translateX(6px)';
      }
    });

    btn.addEventListener('mouseleave', () => {
      const arrow = btn.querySelector('.icon-arrow');
      if (arrow) {
        arrow.style.transform = 'translateX(0)';
      }
    });
  });
});
