(function($) {
    $.extend($.easing, {
        def: 'easeOutQuad',
        easeInOutExpo: function (x, t, b, c, d) {
            if (t == 0) return b;
            if (t == d) return b + c;
            if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
            return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
        }
    });
})(jQuery);

// Define the navScroller plugin (no change needed here as it defines the plugin behavior)
(function ($) {
    var settings;
    var disableScrollFn = false;
    var navItems;
    var navs = {}, sections = {};

    $.fn.navScroller = function (options) {
        settings = $.extend({
            scrollToOffset: 170,
            scrollSpeed: 800,
            activateParentNode: true,
        }, options);
        navItems = this;

        // Attach click listeners
        navItems.on('click', function (event) {
            event.preventDefault();
            var navID = $(this).attr("href").substring(1);
            disableScrollFn = true;
            activateNav(navID);
            populateDestinations(); // recalculate these
            $('html,body').animate({
                scrollTop: sections[navID] - settings.scrollToOffset
            }, settings.scrollSpeed, "easeInOutExpo", function () {
                disableScrollFn = false;
            });
            history.pushState(null, null, '#' + navID);
        });

        // Populate lookup of clickable elements and destination sections
        populateDestinations(); // should also be run on resize

        // Setup scroll listener
        $(document).scroll(function () {
            if (disableScrollFn) return;

            var page_height = $(window).height();
            var pos = $(this).scrollTop();
            for (let i in sections) {
                if ((pos + settings.scrollToOffset >= sections[i]) && sections[i] < pos + page_height) {
                    activateNav(i);
                }
            }
        });
    };

    function populateDestinations() {
        navItems.each(function () {
            var scrollID = $(this).attr('href').substring(1);
            // This finds elements by ID globally, which is correct if your Jekyll sections have unique IDs
            var target = document.getElementById(scrollID);
            if (target) {
                navs[scrollID] = (settings.activateParentNode) ? this.parentNode : this;
                sections[scrollID] = $(target).offset().top;
            }
        });
    }

    function activateNav(navID) {
        for (let nav in navs) {
            $(navs[nav]).removeClass('active');
        }
        $(navs[navID]).addClass('active');
    }
})(jQuery);

// Main site logic wrapped in jQuery-safe ready block
jQuery(document).ready(function ($) {

    // Activate nav scroller plugin - ADAPTED to only target #fsgp-nav-bar within #jekyll-site-wrapper
    // This will ensure it only applies to your specific navigation.
    $('#jekyll-site-wrapper #fsgp-nav-bar li a').navScroller(); // <-- MODIFIED

    // Section divider click scroll - Already adapted to only affect elements within #jekyll-site-wrapper
    $('#jekyll-site-wrapper .sectiondivider').on('click', function (event) {
        $('html,body').animate({
            scrollTop: $(event.target.parentNode).offset().top - 50
        }, 400, "linear");
    });

    // Smooth scroll for in-page container links - Already adapted to only affect elements within #jekyll-site-wrapper
    $('#jekyll-site-wrapper .container a').each(function () {
        if ($(this).attr("href").charAt(0) === '#') {
            $(this).on('click', function (event) {
                event.preventDefault();
                var target = $(event.target).closest("a");
                var targetOffset = $(target.attr("href")).offset().top;
                $('html,body').animate({
                    scrollTop: targetOffset - 170
                }, 800, "easeInOutExpo");
            });
        }
    });


});

// Sticky navbar (already correctly targets #fsgp-nav-bar, no change needed)
function handleStickyNav() {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
}

var navbar = document.getElementById("fsgp-nav-bar");
if (!navbar) {
;
}else{
    var sticky = navbar.offsetTop;
    window.addEventListener('scroll', handleStickyNav);
    handleStickyNav();
}


jQuery(document).ready(function($) {
    // Function to handle tab switching logic
    function openTab(tabName) {
        // 1. Hide all tab content panels
        $('.fsgp-table-content-panel').hide();

        // 2. Deactivate all tab buttons (remove 'active' class)
        $('.fsgp-tab-button').removeClass('active');

        // 3. Show the specific tab content panel based on its ID
        $('#' + tabName).show();

        // 4. Set the clicked button as active (add 'active' class)
        // Find the button with the matching data-tab attribute
        $('.fsgp-tab-button[data-tab="' + tabName + '"]').addClass('active');
    }

    // Set up event delegation for tab buttons
    // We listen for clicks on the parent container (fsgp-tab-buttons)
    // and then check if the clicked element (or a parent of it) is a fsgp-tab-button
    var tabButtonsContainer = $('.fsgp-tab-buttons');
    if (tabButtonsContainer.length) { // Ensure the container exists on the page
        tabButtonsContainer.on('click', '.fsgp-tab-button', function() {
            var tabName = $(this).data('tab'); // Get the value from the data-tab attribute
            if (tabName) { // Make sure a data-tab attribute exists
                openTab(tabName);
            }
        });

        // --- Initialize: Show the default active tab on page load ---
        // This ensures one tab is visible when the page first loads.
        var initialActiveTabButton = $('.fsgp-tab-button.active');
        if (initialActiveTabButton.length) {
            // If an 'active' class is explicitly set on a button, open that tab
            var initialTabName = initialActiveTabButton.data('tab');
            if (initialTabName) {
                openTab(initialTabName);
            }
        } else {
            // If no active tab is explicitly set, default to opening the very first tab
            var firstTabButton = $('.fsgp-tab-button').first();
            if (firstTabButton.length) {
                openTab(firstTabButton.data('tab'));
            }
        }
    }
});