// Simple Booking Form Handler
class SimpleBookingForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.querySelector('.submit-btn');
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        console.log('Simple booking form initialized');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
            
            input.addEventListener('focus', () => {
                this.clearError(input);
            });
        });
        
        // Phone number formatting
        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => {
                this.formatPhoneNumber(e);
            });
        }
    }
    
    validateInput(input) {
        const errorEl = input.closest('.form-group').querySelector('.error-message');
        let isValid = true;
        
        // Clear previous error
        this.clearError(input);
        
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
        
        return isValid;
    }
    
    validateForm() {
        let isValid = true;
        
        // Validate all required inputs
        const requiredInputs = this.form.querySelectorAll('[required]');
        requiredInputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        // Validate service selection
        const serviceSelected = this.form.querySelector('input[name="serviceType"]:checked');
        if (!serviceSelected) {
            const serviceError = this.form.querySelector('.service-options').parentElement.querySelector('.error-message');
            serviceError.textContent = 'Please select a service type';
            isValid = false;
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
    
    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 10) {
            if (value.length === 10) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length === 11 && value.startsWith('1')) {
                value = value.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
            }
        }
        
        e.target.value = value;
    }
    
    async handleSubmit() {
        if (!this.validateForm()) {
            return;
        }
        
        // Show loading state
        this.submitBtn.classList.add('loading');
        this.submitBtn.disabled = true;
        
        try {
            // Collect form data
            const formData = this.collectFormData();
            
            // Simulate API call
            await this.simulateSubmission(formData);
            
            // Show success modal
            this.showSuccessModal();
            
            // Reset form
            this.form.reset();
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error sending your message. Please try again.');
        } finally {
            // Reset button state
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    }
    
    collectFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }
    
    simulateSubmission(data) {
        return new Promise((resolve) => {
            console.log('Sending contact form data:', data);
            setTimeout(resolve, 2000);
        });
    }
    
    showSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Success modal functions
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize booking form
    new SimpleBookingForm();
    
    // Modal event listeners
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeSuccessModal();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
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
