// Enhanced UI Interactions and Animations

document.addEventListener('DOMContentLoaded', function () {

    // Add floating animation to certain elements
    const floatingElements = document.querySelectorAll('.float');
    floatingElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });

    // Enhanced scroll reveal with stagger effect
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in-up');
                    entry.target.style.opacity = '1';
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections and cards - DON'T hide them initially
    document.querySelectorAll('.fade-in-up-on-scroll').forEach(el => {
        el.style.opacity = '0';
        revealObserver.observe(el);
    });

    // Smooth hover effect for cards
    const cards = document.querySelectorAll('.modern-card, .project-card, .blog-card, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function (e) {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function (e) {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Parallax effect on scroll
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(function () {
                const scrolled = window.pageYOffset;
                const parallaxElements = document.querySelectorAll('.parallax');

                parallaxElements.forEach(el => {
                    const speed = el.dataset.speed || 0.5;
                    el.style.transform = `translateY(${scrolled * speed}px)`;
                });

                ticking = false;
            });
            ticking = true;
        }
    });

    // Add glow effect on hover for buttons
    const glowButtons = document.querySelectorAll('.btn-primary, .glow');
    glowButtons.forEach(btn => {
        btn.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            this.style.setProperty('--mouse-x', `${x}px`);
            this.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Enhanced skill bar animation
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.dataset.progress || 0;
                setTimeout(() => {
                    entry.target.style.width = `${progress}%`;
                }, 200);
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    const buttons = document.querySelectorAll('button, .btn-primary');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // Smooth scroll with offset for fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 100;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Add typing effect to hero text
    const heroText = document.querySelector('.hero h1');
    if (heroText && !heroText.dataset.typed) {
        const text = heroText.textContent;
        heroText.textContent = '';
        heroText.dataset.typed = 'true';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                heroText.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }

        setTimeout(typeWriter, 500);
    }

    // Add counter animation for numbers
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                const duration = 2000;
                const increment = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        entry.target.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        entry.target.textContent = target;
                    }
                };

                updateCounter();
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Add gradient animation to headers
    const headers = document.querySelectorAll('.section-header');
    headers.forEach(header => {
        header.style.backgroundImage = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        header.style.backgroundClip = 'text';
        header.style.webkitBackgroundClip = 'text';
        header.style.color = 'transparent';
    });

    // Magnetic effect for social icons
    const socialIcons = document.querySelectorAll('.social-link');
    socialIcons.forEach(icon => {
        icon.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            this.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.1)`;
        });

        icon.addEventListener('mouseleave', function () {
            this.style.transform = 'translate(0, 0) scale(1)';
        });
    });

    // Add loading animation
    window.addEventListener('load', function () {
        document.body.classList.add('loaded');

        // Trigger initial animations only for elements with specific class
        setTimeout(() => {
            document.querySelectorAll('.fade-in-up-on-scroll').forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.classList.add('fade-in-up');
                }, index * 100);
            });
        }, 300);
    });

    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        button, .btn-primary {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
});

// Add smooth page transitions
window.addEventListener('beforeunload', function () {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
});
