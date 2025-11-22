// Toast Prompt Control
(function () {
    const toastPrompt = document.getElementById('toast-prompt');
    let toastShown = false;

    // Function to show toast prompt
    function showToastPrompt() {
        if (toastShown) return;

        // Check if user already dismissed it (cookie check)
        const cookies = document.cookie.split('; ').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
        }, {});

        if (cookies.toast === 'close') {
            return; // Don't show if user already dismissed
        }

        toastPrompt.classList.add('show');
        toastShown = true;
    }

    // Function to hide toast prompt
    function hideToastPrompt() {
        toastPrompt.classList.add('closing');
        toastPrompt.classList.remove('show');

        setTimeout(() => {
            toastPrompt.style.display = 'none';
            toastPrompt.classList.remove('closing');
        }, 400); // Match animation duration
    }

    // Show toast when lock screen is closed
    function initToastPrompt() {
        // Wait for lock screen to be closed
        const lockScreen = document.querySelector('.td-lock-screen');

        if (lockScreen) {
            // Monitor when lock screen is clicked/closed
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                        const pointerEvents = lockScreen.style.pointerEvents;
                        if (pointerEvents === 'none') {
                            // Lock screen is closed, show toast after a short delay
                            setTimeout(() => {
                                showToastPrompt();
                            }, 1000); // 1 second delay after closing lock screen
                            observer.disconnect(); // Stop observing
                        }
                    }
                });
            });

            observer.observe(lockScreen, {
                attributes: true,
                attributeFilter: ['style']
            });

            // Also listen for click on lock screen
            lockScreen.addEventListener('click', () => {
                setTimeout(() => {
                    showToastPrompt();
                }, 1500); // Show after lock screen animation
            }, { once: true });
        } else {
            // If no lock screen, show immediately
            setTimeout(() => {
                showToastPrompt();
            }, 500);
        }
    }

    // Event handlers for buttons
    document.addEventListener('click', function (e) {
        // Close button
        if (e.target.classList.contains('close-btn')) {
            hideToastPrompt();
            // Set cookie to not show again for 10 minutes
            const expires = new Date(Date.now() + 10 * 60 * 1000).toUTCString();
            document.cookie = `toast=close; expires=${expires}; path=/`;
        }

        // Confirm button
        if (e.target.classList.contains('confirm-btn')) {
            hideToastPrompt();
            // The original music playing logic will still work
            // Don't need to duplicate it here
        }
    });

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initToastPrompt);
    } else {
        initToastPrompt();
    }
    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';
            btn.disabled = true;

            // Formspree Integration
            // IMPORTANT: Replace 'YOUR_FORM_ID' with your actual Formspree Form ID
            const formId = 'xrbdbayy';
            const formData = new FormData(contactForm);

            fetch(`https://formspree.io/f/${formId}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    FuiToast.success("Tin nhắn đã được gửi thành công!");
                    contactForm.reset();
                } else {
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            FuiToast.error(data["errors"].map(error => error["message"]).join(", "));
                        } else {
                            FuiToast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
                        }
                    });
                }
            }).catch(error => {
                FuiToast.error("Không thể kết nối đến máy chủ.");
            }).finally(() => {
                btn.innerText = originalText;
                btn.disabled = false;
            });
        });
    }
})();
