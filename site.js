
$.extend($.easing,
{
    def: 'easeOutQuad',
    easeInOutExpo: function (x, t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
});

(function( $ ) {

    var settings;
    var disableScrollFn = false;
    var navItems;
    var navs = {}, sections = {};

    $.fn.navScroller = function(options) {
        settings = $.extend({
            scrollToOffset: 170,
            scrollSpeed: 800,
            activateParentNode: true,
        }, options );
        navItems = this;

        //attatch click listeners
    	navItems.on('click', function(event){
    		event.preventDefault();
            var navID = $(this).attr("href").substring(1);
            disableScrollFn = true;
            activateNav(navID);
            populateDestinations(); //recalculate these!
        	$('html,body').animate({scrollTop: sections[navID] - settings.scrollToOffset},
                settings.scrollSpeed, "easeInOutExpo", function(){
                    disableScrollFn = false;
                }
            );
    	});

        //populate lookup of clicable elements and destination sections
        populateDestinations(); //should also be run on browser resize, btw

        // setup scroll listener
        $(document).scroll(function(){
            if (disableScrollFn) { return; }
            var page_height = $(window).height();
            var pos = $(this).scrollTop();
            for (i in sections) {
                if ((pos + settings.scrollToOffset >= sections[i]) && sections[i] < pos + page_height){
                    activateNav(i);
                }
            }
        });
    };

    function populateDestinations() {
        navItems.each(function(){
            var scrollID = $(this).attr('href').substring(1);
            navs[scrollID] = (settings.activateParentNode)? this.parentNode : this;
            sections[scrollID] = $(document.getElementById(scrollID)).offset().top;
        });
    }

    function activateNav(navID) {
        for (nav in navs) { $(navs[nav]).removeClass('active'); }
        $(navs[navID]).addClass('active');
    }
})( jQuery );


$(document).ready(function (){

    $('nav li a').navScroller();

    //section divider icon click gently scrolls to reveal the section
	$(".sectiondivider").on('click', function(event) {
    	$('html,body').animate({scrollTop: $(event.target.parentNode).offset().top - 50}, 400, "linear");
	});

    //links going to other sections nicely scroll
	$(".container a").each(function(){
        if ($(this).attr("href").charAt(0) == '#'){
            $(this).on('click', function(event) {
        		event.preventDefault();
                var target = $(event.target).closest("a");
                var targetHight =  $(target.attr("href")).offset().top
            	$('html,body').animate({scrollTop: targetHight - 170}, 800, "easeInOutExpo");
            });
        }
	});

});


!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.jekyllTabs=t():e.jekyllTabs=t()}(self,(()=>(()=>{"use strict";var e={973:(e,t,o)=>{o.r(t),o.d(t,{addClass:()=>r,createElementFromHTML:()=>s,findElementsWithTextContent:()=>n,getChildPosition:()=>a});const a=e=>{const t=e.parentNode;for(let o=0;o<t.children.length;o++)if(t.children[o]===e)return o},n=(e,t)=>{const o=document.querySelectorAll(e),a=[];for(let e=0;e<o.length;e++){const n=o[e];n.textContent.trim()===t.trim()&&a.push(n)}return a},s=e=>{const t=document.createElement("template");return t.innerHTML=e.trim(),t.content.firstChild},r=(e,t,o)=>{e.className=e.className?`${e.className} ${t}`:t,setTimeout((()=>{e.className=e.className.replace(t,"").trim()}),o)}},39:(e,t,o)=>{o.r(t),o.d(t,{activateTabFromUrl:()=>d,addCopyToClipboardButtons:()=>u,appendToastMessageHTML:()=>b,copyToClipboard:()=>c,handleTabClicked:()=>i,removeActiveClasses:()=>l,syncTabsWithSameLabels:()=>y,updateUrlWithActiveTab:()=>p});const{getChildPosition:a,createElementFromHTML:n,findElementsWithTextContent:s,addClass:r}=o(973),l=e=>{const t=e.querySelectorAll("ul > li");Array.prototype.forEach.call(t,(e=>{e.classList.remove("active")}))},i=e=>{const t=e.parentNode,o=t.parentNode,n=a(t);if(t.className.includes("active"))return;const s=o.getAttribute("data-tab");if(!s)return;const r=document.getElementById(s);l(o),l(r),r.querySelectorAll("ul.tab-content > li")[n].classList.add("active"),t.classList.add("active")},c=(e,t)=>{if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(e);else{const t=document.createElement("textarea");t.value=e,t.style.position="absolute",t.style.left="-999999px",document.body.prepend(t),t.select();try{document.execCommand("copy")}catch(e){console.error(e)}finally{t.remove()}}"function"==typeof t&&t()},d=()=>{var e;const t=null===(e=window.location.hash)||void 0===e?void 0:e.substring(1);if(!t)return;const o=document.getElementById(t);if(!o)return;const a=new URLSearchParams(window.location.search).get("active_tab");if(!a)return;const n=o.querySelector("li#"+a+" > a");n&&i(n)},p=e=>{const t=e.parentNode,o=t.parentNode,a=new URLSearchParams(window.location.search);a.set("active_tab",t.id);const n=window.location.pathname+"?"+a.toString()+"#"+o.id;history.replaceState(null,"",n)},u=({buttonHTML:e,showToastMessageOnCopy:t,toastDuration:o})=>{const a=document.querySelectorAll("ul.tab-content > li pre");for(let s=0;s<a.length;s++){const r=a[s],l=r.parentNode,i=n(e);let d;l.style.position="relative",i.style.position="absolute",i.style.top="0px",i.style.right="0px",l.appendChild(i),t&&(d=()=>{m(o)}),i.addEventListener("click",(()=>{c(r.innerText,d)}))}},b=e=>{const t=document.createElement("div");t.id="jekyll-tabs-copy-to-clipboard-message",t.textContent=e,document.getElementsByTagName("body")[0].appendChild(t)},m=e=>{r(document.getElementById("jekyll-tabs-copy-to-clipboard-message"),"show",e)},y=e=>{const t=s("a",e.textContent);for(let o=0;o<t.length;o++)t[o]!==e&&i(t[o])}}},t={};function o(a){var n=t[a];if(void 0!==n)return n.exports;var s=t[a]={exports:{}};return e[a](s,s.exports,o),s.exports}o.d=(e,t)=>{for(var a in t)o.o(t,a)&&!o.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),o.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var a={};return(()=>{o.r(a),o.d(a,{init:()=>i});const{activateTabFromUrl:e,updateUrlWithActiveTab:t,handleTabClicked:n,addCopyToClipboardButtons:s,syncTabsWithSameLabels:r,appendToastMessageHTML:l}=o(39),i=(o={})=>{const a={syncTabsWithSameLabels:!1,activateTabFromUrl:!1,addCopyToClipboardButtons:!1,copyToClipboardSettings:{buttonHTML:"<button>Copy</button>",showToastMessageOnCopy:!1,toastMessage:"Code copied to clipboard",toastDuration:3e3}},i=Object.assign(Object.assign(Object.assign({},a),o),{copyToClipboardSettings:Object.assign(Object.assign({},a.copyToClipboardSettings),o.copyToClipboardSettings)}),c=document.querySelectorAll("ul.tab > li > a");if(Array.prototype.forEach.call(c,(e=>{e.addEventListener("click",(o=>{o.preventDefault(),n(e),i.activateTabFromUrl&&t(e),i.syncTabsWithSameLabels&&r(e)}),!1)})),i.addCopyToClipboardButtons){const e=i.copyToClipboardSettings;s(e),e.showToastMessageOnCopy&&l(e.toastMessage)}i.activateTabFromUrl&&e()}})(),a})()));

window.addEventListener('load', function () {
    jekyllTabs.init();
});
