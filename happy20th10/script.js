// Interactive elements and animations
document.addEventListener('DOMContentLoaded', function() {
    
    // Detect mobile device
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    
    // Click to create floating hearts
    document.addEventListener('click', function(e) {
        createClickHeart(e.clientX, e.clientY);
    });
    
    function createClickHeart(x, y) {
        const heart = document.createElement('div');
        heart.innerHTML = '💕';
        heart.style.position = 'fixed';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.fontSize = '24px';
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '1000';
        heart.style.animation = 'clickHeartFloat 2s ease-out forwards';
        
        document.body.appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 2000);
    }
    
    // Add CSS animation for click hearts
    const style = document.createElement('style');
    style.textContent = `
        @keyframes clickHeartFloat {
            0% {
                transform: translateY(0) scale(0);
                opacity: 1;
            }
            50% {
                transform: translateY(-50px) scale(1.2);
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) scale(0.8);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Parallax effect for scrolling (throttled for better performance)
    let ticking = false;
    
    function updateParallax() {
        if (!isMobile) {
            const scrolled = window.pageYOffset;
            const hearts = document.querySelectorAll('.heart');
            const flowers = document.querySelectorAll('.flower');
            
            hearts.forEach((heart, index) => {
                const speed = 0.5 + (index * 0.1);
                heart.style.transform = `translateY(${scrolled * speed}px)`;
            });
            
            flowers.forEach((flower, index) => {
                const speed = 0.3 + (index * 0.1);
                flower.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
    
    // Animate feature cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .message-card');
    animatedElements.forEach(el => observer.observe(el));
    
    // Add random sparkle effects
    function createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';
        sparkle.style.fontSize = '16px';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '5';
        sparkle.style.animation = 'sparkleAnimation 3s ease-out forwards';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            sparkle.remove();
        }, 3000);
    }
    
    // Add sparkle animation CSS
    const sparkleStyle = document.createElement('style');
    sparkleStyle.textContent = `
        @keyframes sparkleAnimation {
            0% {
                transform: scale(0) rotate(0deg);
                opacity: 0;
            }
            50% {
                transform: scale(1) rotate(180deg);
                opacity: 1;
            }
            100% {
                transform: scale(0) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(sparkleStyle);
    
    // Create sparkles periodically (less frequent on mobile)
    const sparkleInterval = isMobile ? 4000 : 2000;
    setInterval(createSparkle, sparkleInterval);
    
    // Add hover effect to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.05)';
            
            // Create small hearts around the card
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const rect = this.getBoundingClientRect();
                    const x = rect.left + Math.random() * rect.width;
                    const y = rect.top + Math.random() * rect.height;
                    createClickHeart(x, y);
                }, i * 200);
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add typing animation to wishes text
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Intersection observer for typing animation
    const typingObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const paragraphs = entry.target.querySelectorAll('p');
                paragraphs.forEach((p, index) => {
                    const originalText = p.textContent;
                    setTimeout(() => {
                        typeWriter(p, originalText, 30);
                    }, index * 1000);
                });
                typingObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const wishesText = document.querySelector('.wishes-text');
    if (wishesText) {
        typingObserver.observe(wishesText);
    }
    
    // Add rainbow text effect to title
    function rainbowText() {
        const highlight = document.querySelector('.highlight');
        if (highlight) {
            const colors = ['#ff69b4', '#ff1493', '#ffc0cb', '#ffb6c1', '#ff69b4'];
            let colorIndex = 0;
            
            setInterval(() => {
                highlight.style.color = colors[colorIndex];
                colorIndex = (colorIndex + 1) % colors.length;
            }, 1000);
        }
    }
    
    rainbowText();
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Create floating message bubbles
    function createMessageBubble() {
        const messages = [
            "💖 Chúc mừng 20/10!",
            "🌹 Hạnh phúc mãi mãi",
            "✨ Tỏa sáng rực rỡ",
            "💕 Yêu thương vô bờ",
            "🌸 Xinh đẹp như hoa"
        ];
        
        const bubble = document.createElement('div');
        bubble.textContent = messages[Math.floor(Math.random() * messages.length)];
        bubble.style.position = 'fixed';
        bubble.style.left = Math.random() * (window.innerWidth - 200) + 'px';
        bubble.style.bottom = '-50px';
        bubble.style.background = 'rgba(255, 255, 255, 0.9)';
        bubble.style.padding = '10px 15px';
        bubble.style.borderRadius = '20px';
        bubble.style.fontSize = '14px';
        bubble.style.color = '#e91e63';
        bubble.style.boxShadow = '0 5px 15px rgba(255, 105, 180, 0.3)';
        bubble.style.pointerEvents = 'none';
        bubble.style.zIndex = '100';
        bubble.style.animation = 'bubbleFloat 8s linear forwards';
        
        document.body.appendChild(bubble);
        
        setTimeout(() => {
            bubble.remove();
        }, 8000);
    }
    
    // Add bubble animation CSS
    const bubbleStyle = document.createElement('style');
    bubbleStyle.textContent = `
        @keyframes bubbleFloat {
            0% {
                bottom: -50px;
                opacity: 0;
                transform: translateX(0) rotate(0deg);
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                bottom: 100vh;
                opacity: 0;
                transform: translateX(20px) rotate(10deg);
            }
        }
    `;
    document.head.appendChild(bubbleStyle);
    
    // Create message bubbles periodically (less frequent on mobile)
    const bubbleInterval = isMobile ? 8000 : 5000;
    if (!isSmallMobile) {
        setInterval(createMessageBubble, bubbleInterval);
    }
});