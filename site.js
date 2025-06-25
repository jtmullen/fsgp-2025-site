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


// Map query parameter values to actual tab IDs
const validTabMapping = {
    'sov': 'fsgp-table-sov',
    'mov-laps': 'fsgp-laps-mov',
    'mov': 'fsgp-score-mov'
};

// Function to get the key from an object based on its value
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function showFsgpTab(tabId, urlUpdate=true) {
    // Hide all tab content panels
    const panels = document.querySelectorAll('.fsgp-table-content-panel');
    panels.forEach(panel => {
        panel.style.display = 'none';
    });

    // Deactivate all buttons
    const buttons = document.querySelectorAll('.fsgp-tab-button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });

    // Show the selected tab content
    const selectedPanel = document.getElementById(tabId);
    if (selectedPanel) {
        selectedPanel.style.display = 'block';
    }

    // Activate the corresponding button
    const targetButton = document.querySelector(`.fsgp-tab-button[onclick*="'${tabId}'"]`);
    if (targetButton) {
        targetButton.classList.add('active');
    }

    const newTabShortName = getKeyByValue(validTabMapping, tabId);
    
    // Ensure we found a valid short name before updating URL
    if (newTabShortName && urlUpdate) {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set('tab', newTabShortName); 
        history.replaceState(null, '', currentUrl.toString());
    }
}

// Determine active tab based on URL query parameter on page load
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestedTab = urlParams.get('tab'); // Get the value of the 'tab' query parameter

    let defaultTabId = 'fsgp-table-sov'; // This is the default if no valid query param is found

    let tabToActivate = defaultTabId;

    // Check if the requestedTab exists and is valid in our mapping
    if (requestedTab && validTabMapping[requestedTab]) {
        tabToActivate = validTabMapping[requestedTab];
    }

    showFsgpTab(tabToActivate, false);
});