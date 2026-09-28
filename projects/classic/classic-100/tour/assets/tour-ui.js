(function () {
    'use strict';

    var style = document.createElement('style');
    style.textContent = [
        '.controls{z-index:6}',
        '@media (pointer:fine) and (min-width:700px){.controls,.desktopGuide,.quickActions{display:flex!important}}',
        '.keys button.key{padding:0;width:28px;height:28px;min-width:0;min-height:0;border-radius:5px;background:#24302f;border:1px solid rgba(255,255,255,.38);border-bottom-width:3px;line-height:1;touch-action:none;cursor:pointer;font-weight:800;font-size:16px;color:#fff}',
        '.keys button.key:active{transform:translateY(1px);background:#c6b894;color:#151b24}',
        '#screenToggle{white-space:nowrap}'
    ].join('');
    document.head.appendChild(style);

    document.addEventListener('pointerdown', function () {
        window.focus();
    }, true);

    function press(code, down) {
        window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', {
            code: code,
            key: code,
            bubbles: true,
            cancelable: true
        }));
    }

    function bindMoveButtons() {
        document.querySelectorAll('[data-key]').forEach(function (button) {
            if (button.dataset.moveBound === '1') return;
            button.dataset.moveBound = '1';
            button.onpointerdown = function (event) {
                event.preventDefault();
                event.stopPropagation();
                try { button.setPointerCapture(event.pointerId); } catch (err) { /* pointer already gone */ }
                press(button.dataset.key, true);
            };
            var release = function () { press(button.dataset.key, false); };
            button.onpointerup = button.onpointercancel = button.onlostpointercapture = release;
        });
    }

    function whenTourReady(attempt) {
        if (document.querySelector('#view canvas')) bindMoveButtons();
        else if (attempt < 120) requestAnimationFrame(function () { whenTourReady(attempt + 1); });
    }
    whenTourReady(0);

    var toggle = document.getElementById('screenToggle');
    if (!toggle) return;

    function label() {
        toggle.textContent = document.fullscreenElement ? '✕ Свернуть' : '⛶ На весь экран';
    }

    toggle.addEventListener('click', function () {
        var root = document.documentElement;
        if (!document.fullscreenElement) {
            var request = root.requestFullscreen || root.webkitRequestFullscreen;
            if (request) request.call(root).catch(function () {});
        } else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    });
    document.addEventListener('fullscreenchange', label);
    label();
})();
