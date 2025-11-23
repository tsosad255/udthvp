// Fix for mobile touch events on lock screen
(function () {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        // Wait a bit for lock screen to be created by index.js
        setTimeout(function () {
            const lockScreen = document.querySelector('.td-lock-screen');
            if (lockScreen && typeof $ !== 'undefined') {
                let touchHandled = false;

                // Add touchend event support for mobile (more reliable than touchstart)
                lockScreen.addEventListener('touchend', function (e) {
                    // Prevent the default click event from firing
                    e.preventDefault();
                    e.stopPropagation();

                    if (!touchHandled) {
                        touchHandled = true;
                        // Simulate the original click behavior using jQuery
                        $('.td-welcome').slideUp('slow');
                        $('.td-lock-screen').animate({ opacity: 0 }, 'slow').css('pointer-events', 'none');

                        // Reset after animation completes
                        setTimeout(function () {
                            touchHandled = false;
                        }, 1000);
                    }
                }, { passive: false });

                // Also keep click event for desktop and as fallback
                lockScreen.addEventListener('click', function (e) {
                    if (!touchHandled) {
                        $('.td-welcome').slideUp('slow');
                        $('.td-lock-screen').animate({ opacity: 0 }, 'slow').css('pointer-events', 'none');
                    }
                }, { passive: false });

                console.log('Mobile touch and click event handlers added to lock screen');
            }
        }, 500);
    }
})();
