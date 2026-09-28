(function () {
    'use strict';

    function init() {
        var header = document.getElementById('mainHeader');
        if (header) {
            window.addEventListener('scroll', function () {
                header.classList.toggle('scrolled', window.scrollY > 20);
            }, { passive: true });
        }

        var toggle = document.getElementById('mobileMenuToggle');
        var menu = document.getElementById('mobileMenu');
        if (toggle && menu) {
            toggle.addEventListener('click', function () {
                menu.classList.toggle('active');
                toggle.classList.toggle('active');
            });
        }

        var links = Array.prototype.slice.call(document.querySelectorAll('.house-nav__link'));
        var sections = links.map(function (link) {
            return document.querySelector(link.getAttribute('href'));
        }).filter(Boolean);

        function markActive() {
            var current = sections[0];
            sections.forEach(function (section) {
                if (section.getBoundingClientRect().top < 140) current = section;
            });
            links.forEach(function (link) {
                link.classList.toggle('is-active', current && link.getAttribute('href') === '#' + current.id);
            });
        }

        window.addEventListener('scroll', markActive, { passive: true });
        markActive();

        var facadeSide = 'all';
        var facadeTone = 'dark';
        var facadeCards = document.querySelectorAll('.facade-card');
        var hasTone = facadeCards.length && facadeCards[0].hasAttribute('data-tone');

        function applyFacades() {
            facadeCards.forEach(function (card) {
                var sideOk = facadeSide === 'all' || card.getAttribute('data-side') === facadeSide;
                var toneOk = !hasTone || card.getAttribute('data-tone') === facadeTone;
                card.hidden = !(sideOk && toneOk);
            });
        }

        document.querySelectorAll('.facade-tabs button').forEach(function (btn) {
            btn.addEventListener('click', function () {
                facadeSide = btn.getAttribute('data-side');
                document.querySelectorAll('.facade-tabs button').forEach(function (b) {
                    b.classList.toggle('is-active', b === btn);
                });
                applyFacades();
            });
        });

        document.querySelectorAll('.facade-tone button').forEach(function (btn) {
            btn.addEventListener('click', function () {
                facadeTone = btn.getAttribute('data-tone');
                document.querySelectorAll('.facade-tone button').forEach(function (b) {
                    b.classList.toggle('is-active', b === btn);
                });
                applyFacades();
            });
        });

        var frame = document.getElementById('houseTour');
        var startBtn = document.getElementById('tourStart');
        if (frame && startBtn) {
            var tourNumber = '1';
            var loadedTour = '';

            function markTour(n) {
                tourNumber = String(n);
                document.querySelectorAll('.tour-switch button, .plan-card[data-tour]').forEach(function (el) {
                    var on = el.getAttribute('data-tour') === tourNumber;
                    if (el.tagName === 'BUTTON') el.classList.toggle('is-active', on);
                    else el.classList.toggle('is-selected', on);
                });
            }

            function openTour(n) {
                markTour(n);
                frame.hidden = false;
                startBtn.hidden = true;
                var next = 'tour/classic100-tour-plan' + tourNumber + '.html';
                if (loadedTour !== next) {
                    loadedTour = next;
                    frame.src = next;
                }
                var stage = document.getElementById('tour');
                if (stage) stage.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            document.querySelectorAll('.tour-switch button').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    if (loadedTour) openTour(btn.getAttribute('data-tour'));
                    else markTour(btn.getAttribute('data-tour'));
                });
            });

            document.querySelectorAll('.plan-card[data-tour]').forEach(function (card) {
                card.addEventListener('click', function (event) {
                    event.preventDefault();
                    openTour(card.getAttribute('data-tour'));
                });
            });

            startBtn.addEventListener('click', function () {
                openTour(tourNumber);
            });

            var moveCodes = { KeyW: 1, KeyA: 1, KeyS: 1, KeyD: 1, ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1 };
            function forwardMoveKey(event) {
                if (frame.hidden || !moveCodes[event.code]) return;
                var tag = event.target && event.target.tagName;
                if (tag === 'INPUT' || tag === 'TEXTAREA' || event.target.isContentEditable) return;
                if (document.activeElement === frame) return;
                if (!frame.contentWindow) return;
                frame.contentWindow.dispatchEvent(new KeyboardEvent(event.type, {
                    code: event.code,
                    key: event.key,
                    bubbles: true,
                    cancelable: true
                }));
                event.preventDefault();
            }
            window.addEventListener('keydown', forwardMoveKey);
            window.addEventListener('keyup', forwardMoveKey);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
