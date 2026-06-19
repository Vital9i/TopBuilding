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

    function getProjectSliderIndex(container) {
        var step = getProjectSliderStep(container);
        if (!step) return 0;
        return Math.round(container.scrollLeft / step);
    }

    function goToProjectSliderIndex(container, index, behavior) {
        if (!container) return;
        var count = container.children.length;
        if (!count) return;
        var normalized = ((index % count) + count) % count;
        var step = getProjectSliderStep(container);
        container.scrollTo({
            left: normalized * step,
            behavior: behavior || 'smooth'
        });
    }

    function scrollProjectModalSlider(container, direction) {
        if (!container) return;
        var count = container.children.length;
        if (!count) return;
        var current = getProjectSliderIndex(container);
        var next = ((current + direction) % count + count) % count;
        goToProjectSliderIndex(container, next, 'smooth');
    }

    function bindProjectSliderInfiniteScroll(container) {
        if (!container || container.dataset.infiniteBound === '1') return;
        container.dataset.infiniteBound = '1';

        var onScrollEnd = function () {
            var count = container.children.length;
            if (count < 2) return;
            var step = getProjectSliderStep(container);
            if (!step) return;
            var index = Math.round(container.scrollLeft / step);
            if (index >= count) {
                goToProjectSliderIndex(container, 0, 'auto');
            } else if (index < 0) {
                goToProjectSliderIndex(container, count - 1, 'auto');
            }
        };

        container.addEventListener('scrollend', onScrollEnd, { passive: true });

        if (!('onscrollend' in global)) {
            var scrollTimer;
            container.addEventListener(
                'scroll',
                function () {
                    clearTimeout(scrollTimer);
                    scrollTimer = global.setTimeout(onScrollEnd, 120);
                },
                { passive: true }
            );
        }
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
        bindProjectSliderInfiniteScroll(container);
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
    global.goToProjectSliderIndex = goToProjectSliderIndex;
    global.initAllProjectModalSliders = initAllProjectModalSliders;
    global.bindProjectSliderButtons = bindProjectSliderButtons;

    function initYoutubeFacades() {
        document
            .querySelectorAll(
                '.youtube-wrapper iframe, .video-wrapper iframe, .news-video-wrapper iframe'
            )
            .forEach(function (iframe) {
                var src = iframe.getAttribute('src') || '';
                if (src.indexOf('youtube.com/embed/') === -1) return;

                var match = src.match(/embed\/([^?&/]+)/);
                if (!match || match[1] === 'VIDEO_ID') return;

                var videoId = match[1];
                var title = iframe.getAttribute('title') || 'Видео YouTube';
                var wrapper = iframe.parentElement;
                if (!wrapper) return;

                var autoplaySrc =
                    src.indexOf('autoplay=') >= 0
                        ? src
                        : src + (src.indexOf('?') >= 0 ? '&' : '?') + 'autoplay=1';

                var btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'yt-facade-play';
                btn.setAttribute('aria-label', 'Воспроизвести: ' + title);

                var img = document.createElement('img');
                img.className = 'yt-facade-thumb';
                img.src =
                    'https://img.youtube.com/vi/' + videoId + '/maxresdefault.jpg';
                img.alt = title;
                img.loading = 'lazy';
                img.addEventListener('error', function onThumbError() {
                    if (img.src.indexOf('hqdefault') === -1) {
                        img.src =
                            'https://img.youtube.com/vi/' +
                            videoId +
                            '/hqdefault.jpg';
                    }
                });

                var icon = document.createElement('span');
                icon.className = 'yt-facade-icon';
                icon.setAttribute('aria-hidden', 'true');
                icon.innerHTML =
                    '<svg class="yt-facade-svg" viewBox="0 0 68 48" focusable="false">' +
                    '<path class="yt-facade-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"/>' +
                    '<path class="yt-facade-triangle" d="M 45,24 27,14 27,34"/>' +
                    '</svg>';

                btn.appendChild(img);
                btn.appendChild(icon);
                wrapper.classList.add('yt-facade');
                wrapper.dataset.ytSrc = autoplaySrc;
                wrapper.dataset.ytTitle = title;
                wrapper.replaceChild(btn, iframe);

                btn.addEventListener('click', function () {
                    var newIframe = document.createElement('iframe');
                    newIframe.src = wrapper.dataset.ytSrc;
                    newIframe.title = wrapper.dataset.ytTitle;
                    newIframe.setAttribute(
                        'allow',
                        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    );
                    newIframe.setAttribute('allowfullscreen', '');
                    newIframe.setAttribute('frameborder', '0');
                    wrapper.replaceChild(newIframe, btn);
                    wrapper.classList.remove('yt-facade');
                    delete wrapper.dataset.ytSrc;
                    delete wrapper.dataset.ytTitle;
                });
            });
    }

    function initSiteCommon() {
        initDesktopPhoneLinks();
        bindProjectSliderButtons();
        initAllProjectModalSliders();
        initYoutubeFacades();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSiteCommon);
    } else {
        initSiteCommon();
    }
})(window);
