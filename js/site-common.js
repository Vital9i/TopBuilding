/**
 * Общие утилиты сайта: телефон на десктопе/мобиле, формат для Telegram.
 * @see .cursor/rules/telegram-clickable-phone.mdc (ArendaTehniki)
 */
(function (global) {
    'use strict';

    var MOBILE_MAX = 768;

    /** Компактный +375… — Telegram сам делает номер кликабельным. */
    function formatTelegramPhone(phone) {
        var digits = String(phone || '').replace(/\D/g, '');
        return digits ? '+' + digits : String(phone || '').trim();
    }

    function escapeTelegramHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function isLocalHost(hostname) {
        var host = String(hostname || '').toLowerCase();
        return (
            !host ||
            host === 'localhost' ||
            host === '127.0.0.1' ||
            host === '[::1]' ||
            host === '::1' ||
            host.endsWith('.local')
        );
    }

    var TELEGRAM_SITE_ORIGIN = 'https://topbuilding.by';
    var TELEGRAM_LEAD_TITLE = 'Новая заявка с сайта ТОП БИЛДИНГ!';

    function getTelegramSiteLink() {
        var host = (location.hostname || '').replace(/^www\./, '');
        var url;
        var label;

        if (!host || isLocalHost(host)) {
            url = TELEGRAM_SITE_ORIGIN + '/';
            label = 'topbuilding.by';
        } else {
            url = location.origin + location.pathname + location.search;
            label = host + location.pathname.replace(/\/index\.html$/i, '/');
        }

        return (
            '<a href="' +
            escapeTelegramHtml(url) +
            '">' +
            escapeTelegramHtml(label) +
            '</a>'
        );
    }

    /** Источник заявки + кликабельная ссылка на сайт. */
    function buildTelegramLeadSource(pageSource) {
        var source = String(pageSource || 'Сайт').trim();
        source = source.replace(/\s*Источник:\s*.+$/i, '').trim();
        var siteLink = getTelegramSiteLink();
        if (!source) return siteLink;
        return escapeTelegramHtml(source) + ' · ' + siteLink;
    }

    function formatTelegramLeadName(name) {
        return name && String(name).trim()
            ? escapeTelegramHtml(String(name).trim())
            : 'не указано';
    }

    function isMobilePhoneUi() {
        return global.matchMedia('(max-width: ' + MOBILE_MAX + 'px)').matches;
    }

    function isPhoneLinkExcluded(link) {
        return Boolean(link.closest('[data-phone-always]'));
    }

    function syncDesktopPhoneLinks() {
        var callable = isMobilePhoneUi();
        var links = document.querySelectorAll('a[href^="tel:"], a[data-tel-href]');

        links.forEach(function (link) {
            if (isPhoneLinkExcluded(link)) return;

            if (!link.dataset.telHref) {
                var href = link.getAttribute('href');
                if (href && href.indexOf('tel:') === 0) {
                    link.dataset.telHref = href;
                }
            }

            if (!link.dataset.telHref) return;

            if (callable) {
                link.setAttribute('href', link.dataset.telHref);
                link.removeAttribute('aria-disabled');
                link.classList.remove('phone-static');
            } else {
                link.removeAttribute('href');
                link.setAttribute('aria-disabled', 'true');
                link.classList.add('phone-static');
            }
        });
    }

    function initDesktopPhoneLinks() {
        syncDesktopPhoneLinks();
        global.matchMedia('(max-width: ' + MOBILE_MAX + 'px)').addEventListener(
            'change',
            syncDesktopPhoneLinks
        );
        global.addEventListener('resize', syncDesktopPhoneLinks);
    }

    function getProjectSliderStep(container) {
        return container ? container.offsetWidth || 1 : 1;
    }

    function scrollProjectModalSlider(container, direction) {
        if (!container) return;
        var step = getProjectSliderStep(container);
        if (isMobilePhoneUi()) {
            var index = Math.round(container.scrollLeft / step);
            var maxIndex = Math.max(0, container.children.length - 1);
            index = Math.min(maxIndex, Math.max(0, index + direction));
            container.scrollTo({ left: index * step, behavior: 'smooth' });
            return;
        }
        container.scrollBy({ left: direction * step, behavior: 'smooth' });
    }

    function bindProjectSliderImageTap(container) {
        container.querySelectorAll('img').forEach(function (img) {
            if (img.dataset.sliderTapBound === '1') return;
            img.dataset.sliderTapBound = '1';

            var touchStartX = 0;
            var touchStartY = 0;
            var moved = false;

            img.addEventListener(
                'touchstart',
                function (e) {
                    if (!isMobilePhoneUi()) return;
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                    moved = false;
                },
                { passive: true }
            );

            img.addEventListener(
                'touchmove',
                function (e) {
                    if (!isMobilePhoneUi()) return;
                    var dx = Math.abs(e.touches[0].clientX - touchStartX);
                    var dy = Math.abs(e.touches[0].clientY - touchStartY);
                    if (dx > 8 && dx > dy) moved = true;
                },
                { passive: true }
            );

            img.addEventListener(
                'touchend',
                function () {
                    if (!isMobilePhoneUi() || !moved) return;
                    img.dataset.skipClick = '1';
                    global.setTimeout(function () {
                        delete img.dataset.skipClick;
                    }, 400);
                },
                { passive: true }
            );

            img.addEventListener(
                'click',
                function (e) {
                    if (img.dataset.skipClick === '1') {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                    }
                },
                true
            );
        });
    }

    function initProjectModalSlider(container) {
        if (!container) return;
        bindProjectSliderImageTap(container);
    }

    function initAllProjectModalSliders() {
        document
            .querySelectorAll('.modal-slider .slider-container')
            .forEach(initProjectModalSlider);
    }

    function bindProjectSliderButtons() {
        document.querySelectorAll('.slider-prev').forEach(function (btn) {
            if (btn.dataset.sliderNavBound === '1') return;
            btn.dataset.sliderNavBound = '1';
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var slider = btn.closest('.modal-slider');
                if (!slider) return;
                scrollProjectModalSlider(
                    slider.querySelector('.slider-container'),
                    -1
                );
            });
        });

        document.querySelectorAll('.slider-next').forEach(function (btn) {
            if (btn.dataset.sliderNavBound === '1') return;
            btn.dataset.sliderNavBound = '1';
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var slider = btn.closest('.modal-slider');
                if (!slider) return;
                scrollProjectModalSlider(
                    slider.querySelector('.slider-container'),
                    1
                );
            });
        });
    }

    global.formatTelegramPhone = formatTelegramPhone;
    global.escapeTelegramHtml = escapeTelegramHtml;
    global.buildTelegramLeadSource = buildTelegramLeadSource;
    global.formatTelegramLeadName = formatTelegramLeadName;
    global.TELEGRAM_LEAD_TITLE = TELEGRAM_LEAD_TITLE;
    global.initDesktopPhoneLinks = initDesktopPhoneLinks;
    global.scrollProjectModalSlider = scrollProjectModalSlider;
    global.initAllProjectModalSliders = initAllProjectModalSliders;
    global.bindProjectSliderButtons = bindProjectSliderButtons;

    function initSiteCommon() {
        initDesktopPhoneLinks();
        bindProjectSliderButtons();
        initAllProjectModalSliders();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSiteCommon);
    } else {
        initSiteCommon();
    }
})(window);
