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
                // Add touch event support for mobile
                lockScreen.addEventListener('touchstart', function (e) {
                    // Don't prevent default - let the click also fire
                    // Simulate the original click behavior using jQuery
                    $('.td-welcome').slideUp('slow');
                    $('.td-lock-screen').animate({ opacity: 0 }, 'slow').css('pointer-events', 'none');
                }, { passive: true });

                console.log('Mobile touch event handler added to lock screen');
            }
        }, 500);
    }
})();
