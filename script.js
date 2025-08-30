// Booking Form Multi-Step Handler
const lenis = new Lenis()

// Animation frame loop
function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// Enhanced 3D Card Tilt Animation - Moves Away From Mouse
class Card3DMouseTilt {
    constructor() {
        this.cards = document.querySelectorAll('.hero .card');
        this.THRESHOLD = 25; // Maximum tilt degrees
        this.scaleHover = 1.12;
        this.zTranslation = 80; // pixels to translateZ on hover
        this.shadowIntensity = {
            default: '0 10px 30px rgba(0, 0, 0, 0.08)',
            hover: '0 25px 60px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
        };
        this.init();
    }

    init() {
        if (this.cards.length === 0) {
            console.log('No cards found in .hero');
            return;
        }
        console.log(`Found ${this.cards.length} cards, initializing 3D tilt`);

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            console.log('Reduced motion preferred, skipping animations');
            return;
        }

        this.cards.forEach((card, index) => {
            console.log(`Setting up card ${index + 1}`);
            this.setupCard(card);
        });
    }

    setupCard(card) {
        // Wrap card content if not already wrapped
        if (!card.querySelector('.card-content')) {
            const content = card.innerHTML;
            card.innerHTML = `<div class="card-content">${content}</div>`;
        }

        const cardContent = card.querySelector('.card-content');
        
        // Add class to enable JS-controlled animations
        card.classList.add('js-3d-active');

        card.addEventListener('mouseenter', () => {
            card.style.boxShadow = this.shadowIntensity.hover;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = this.shadowIntensity.default;
        });

        card.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e, card, cardContent);
        });
    }

    handleMouseMove(e, card, cardContent) {
        const rect = card.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Calculate distance and direction from center
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        
        // Calculate angle and distance
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = Math.sqrt(rect.width * rect.width + rect.height * rect.height) / 2;
        
        // Normalize distance (0 to 1)
        const normalizedDistance = Math.min(distance / maxDistance, 1);
        
        // Calculate rotation angles (inverted to move away from mouse)
        const rotationX = -(deltaY / rect.height) * this.THRESHOLD;
        const rotationY = (deltaX / rect.width) * this.THRESHOLD;
        
        // Apply transform
        const scale = 1 + (normalizedDistance * (this.scaleHover - 1));
        const translateZ = normalizedDistance * this.zTranslation;
        
        card.style.transform = `
            perspective(1000px)
            rotateX(${rotationX}deg)
            rotateY(${rotationY}deg)
            scale3d(${scale}, ${scale}, ${scale})
            translateZ(${translateZ}px)
        `;
    }
}

// STATS COUNTER ANIMATION - FIXED VERSION
class StatsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.counter');
        this.isAnimated = false;
        this.init();
    }

    init() {
        if (this.counters.length === 0) {
            console.log('No counters found');
            return;
        }

        console.log(`Found ${this.counters.length} counters`);
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.3, // Trigger when 30% of element is visible
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isAnimated) {
                    this.isAnimated = true;
                    this.animateCounters();
                    observer.unobserve(entry.target); // Stop observing after animation starts
                }
            });
        }, options);

        // Observe the stats section
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        } else {
            // Fallback: animate immediately if no stats section found
            this.animateCounters();
        }
    }

    animateCounters() {
        this.counters.forEach((counter, index) => {
            // Add delay for staggered animation
            setTimeout(() => {
                this.animateCounter(counter);
            }, index * 200); // 200ms delay between each counter
        });
    }

    animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target')) || parseInt(counter.textContent);
        const duration = 2000; // 2 seconds
        const start = 0;
        const increment = target / (duration / 16); // 60fps approximation
        
        let current = start;
        
        // Add counting class for styling
        counter.classList.add('counting');
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
                counter.classList.remove('counting');
                console.log(`Counter finished: ${target}`);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 16); // ~60fps
    }
}

// ENHANCED STATS COUNTER WITH EASING
class EnhancedStatsCounter {
    constructor() {
        this.counters = document.querySelectorAll('.counter');
        this.isAnimated = false;
        this.init();
    }

    init() {
        if (this.counters.length === 0) {
            console.log('No counters found');
            return;
        }

        console.log(`Found ${this.counters.length} counters`);
        this.setupIntersectionObserver();
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.3,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isAnimated) {
                    this.isAnimated = true;
                    this.animateCounters();
                }
            });
        }, options);

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        } else {
            // Fallback: animate on page load
            setTimeout(() => this.animateCounters(), 1000);
        }
    }

    animateCounters() {
        this.counters.forEach((counter, index) => {
            setTimeout(() => {
                this.animateCounterWithEasing(counter);
            }, index * 150);
        });
    }

    animateCounterWithEasing(counter) {
        const target = parseInt(counter.getAttribute('data-target')) || parseInt(counter.textContent);
        const duration = 2500; // 2.5 seconds
        
        counter.classList.add('counting');
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out)
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            counter.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                counter.textContent = target;
                counter.classList.remove('counting');
                console.log(`Enhanced counter finished: ${target}`);
            }
        };
        
        requestAnimationFrame(animate);
    }
}

// AUTO-INITIALIZE ON DOM LOAD
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing scripts...');
    
    // Initialize 3D card tilt
    new Card3DMouseTilt();
    
    // Initialize stats counter (use enhanced version)
    new EnhancedStatsCounter();
    
    // Fallback for older browsers or if IntersectionObserver fails
    setTimeout(() => {
        const counters = document.querySelectorAll('.counter');
        if (counters.length > 0) {
            counters.forEach(counter => {
                if (!counter.classList.contains('counting') && counter.textContent === '0') {
                    console.log('Fallback: manually triggering counter animation');
                    const enhancedCounter = new EnhancedStatsCounter();
                    enhancedCounter.animateCounters();
                }
            });
        }
    }, 3000); // 3 second fallback delay
});

// Additional fallback for window load
window.addEventListener('load', function() {
    setTimeout(() => {
        const counters = document.querySelectorAll('.counter');
        if (counters.length > 0) {
            const hasAnimated = Array.from(counters).some(counter => 
                counter.textContent !== '0' && counter.textContent !== ''
            );
            
            if (!hasAnimated) {
                console.log('Window load fallback: triggering counter animation');
                const enhancedCounter = new EnhancedStatsCounter();
                enhancedCounter.animateCounters();
            }
        }
    }, 1000);
});

// DEBUGGING HELPERS
console.log('Stats counter script loaded');

// Debug function to manually trigger animation
window.debugStatsAnimation = function() {
    console.log('Manual debug trigger');
    const enhancedCounter = new EnhancedStatsCounter();
    enhancedCounter.animateCounters();
};
