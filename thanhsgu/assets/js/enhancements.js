// Enhanced Features for tsosad255.com/thanhsgu

// Skill Progress Bar Animation
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.getAttribute('data-progress');
                const percentageSpan = bar.closest('.skill-item').querySelector('.skill-percentage');

                setTimeout(() => {
                    bar.style.width = progress + '%';
                    animateNumber(percentageSpan, 0, parseInt(progress), 1000);
                }, 100);

                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => observer.observe(bar));
}

// Animate number counting
function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end + '%';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '%';
        }
    }, 16);
}

// Typing Animation Effect
class TypingEffect {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];

        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === currentText.length) {
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Scroll Reveal Animation
function initScrollReveal() {
    const reveals = document.querySelectorAll('.animate');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => revealObserver.observe(reveal));
}

// Particle Background Effect
class ParticleBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;

        this.resize();
        this.init();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(103, 58, 183, 0.5)';
            this.ctx.fill();
        });

        // Draw connections
        this.particles.forEach((p1, i) => {
            this.particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(103, 58, 183, ${1 - distance / 100})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize all enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Animate skill bars
    animateSkillBars();

    // Initialize scroll reveal
    initScrollReveal();

    // Initialize typing effect if element exists
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        new TypingEffect(typingElement, [
            'Web Developer',
            'UI/UX Designer',
            'Full Stack Engineer',
            'Creative Coder'
        ]);
    }

    // Initialize particle background if canvas exists
    new ParticleBackground('particle-canvas');

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add parallax effect to hero section
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');

        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // Add loading animation complete handler
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        animateSkillBars,
        TypingEffect,
        ParticleBackground,
        initScrollReveal
    };
}

// Newsletter Form Handler
document.addEventListener('DOMContentLoaded', function () {
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            const email = emailInput.value;

            if (email && email.includes('@')) {
                // Show success message using FuiToast if available
                if (typeof FuiToast !== 'undefined') {
                    FuiToast.success('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi email xác nhận sớm.');
                } else {
                    alert('Cảm ơn bạn đã đăng ký!');
                }
                emailInput.value = '';
            } else {
                if (typeof FuiToast !== 'undefined') {
                    FuiToast.error('Vui lòng nhập địa chỉ email hợp lệ.');
                } else {
                    alert('Vui lòng nhập địa chỉ email hợp lệ.');
                }
            }
        });
    }
});

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
    initLazyLoading();
}

// Add fade-in animation for lazy loaded images
const style = document.createElement('style');
style.textContent = `
    img[data-src] {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    img.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Smooth scroll for navigation links
document.querySelectorAll('.navbar a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Add animation to elements when they come into view
function initViewportAnimations() {
    const elements = document.querySelectorAll('.testimonial-card, .blog-card, .timeline-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {
        threshold: 0.1
    });

    elements.forEach(el => observer.observe(el));
}

// Initialize viewport animations
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initViewportAnimations);
} else {
    initViewportAnimations();
}
