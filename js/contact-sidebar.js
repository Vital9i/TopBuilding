/**
 * Контактный сайдбар — единая логика на всех страницах.
 */
(function (global) {
    'use strict';

    function getHeroSidebar() {
        return document.getElementById('heroSidebar');
    }

    function openContactSidebar() {
        var heroSidebar = getHeroSidebar();
        if (!heroSidebar) return;

        var mobileMenu = document.getElementById('mobileMenu');
        var mobileMenuToggle = document.getElementById('mobileMenuToggle');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
        }

        heroSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeContactSidebar() {
        var heroSidebar = getHeroSidebar();
        if (!heroSidebar) return;
        heroSidebar.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    global.openContactSidebar = openContactSidebar;
    global.closeContactSidebar = closeContactSidebar;

    function bindOpenButton(btn) {
        if (!btn || btn.dataset.sidebarOpenBound === '1') return;
        btn.dataset.sidebarOpenBound = '1';
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            openContactSidebar();
        });
    }

    function initContactSidebar() {
        var heroSidebar = getHeroSidebar();
        if (!heroSidebar || heroSidebar.dataset.sidebarInit === '1') return;
        heroSidebar.dataset.sidebarInit = '1';

        var contactToggleBtn = document.getElementById('contactToggleBtn');
        var sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
        var mobileMenuToggle = document.getElementById('mobileMenuToggle');

        document
            .querySelectorAll('.open-sidebar-btn, .team-contact-btn')
            .forEach(bindOpenButton);

        if (contactToggleBtn) {
            contactToggleBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                openContactSidebar();
            });
        }

        if (sidebarCloseBtn) {
            sidebarCloseBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                closeContactSidebar();
            });
        }

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', function () {
                if (heroSidebar.classList.contains('active')) {
                    closeContactSidebar();
                }
            });
        }

        document.addEventListener('click', function (e) {
            if (!heroSidebar.classList.contains('active')) return;
            if (e.target.closest('.hero-contact-card')) return;
            if (contactToggleBtn && (e.target === contactToggleBtn || contactToggleBtn.contains(e.target))) {
                return;
            }
            closeContactSidebar();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && heroSidebar.classList.contains('active')) {
                closeContactSidebar();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactSidebar);
    } else {
        initContactSidebar();
    }
})(window);
