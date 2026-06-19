(function () {
    'use strict';

    var PROJECT_MODAL_DATA = {
        classic: {
            title: 'Классический коттедж',
            images: [
                'projects/Classic/classic1.webp',
                'projects/Classic/classic2.webp',
                'projects/Classic/classic3.webp',
                'projects/Classic/classic_plan.webp'
            ]
        },
        chalet: {
            title: 'Альпийское шале',
            images: [
                'projects/Shale_black/shale_black.webp',
                'projects/Shale_black/shale_black_1.webp',
                'projects/Shale_black/shale_black_plan1.webp',
                'projects/Shale_black/shale_black_plan2.webp'
            ]
        },
        barnhouse: {
            title: 'Современный барнхаус',
            images: [
                'projects/Barn/barn.webp',
                'projects/Barn/barn1.webp',
                'projects/Barn/barn2.webp',
                'projects/Barn/barn3.webp',
                'projects/Barn/barn_plan1.webp',
                'projects/Barn/barn_plan2.webp'
            ]
        },
        minimalism: {
            title: 'Классический со вторым светом',
            images: [
                'projects/Classic_2/project1.webp',
                'projects/Classic_2/project2.webp',
                'projects/Classic_2/project3.webp',
                'projects/Classic_2/project4.webp',
                'projects/Classic_2/project5.webp'
            ]
        },
        shale_white: {
            title: 'Шале White',
            images: [
                'projects/Shale_white/shale_white.webp',
                'projects/Shale_white/shale_white1.webp',
                'projects/Shale_white/shale_white_plan.webp',
                'projects/Shale_white/shale_white_plan2.webp'
            ]
        },
        barn_terrace: {
            title: 'Барнхаус 140',
            images: [
                'projects/Barn Terrase/Front.webp',
                'projects/Barn Terrase/Left.webp',
                'projects/Barn Terrase/Right.webp',
                'projects/Barn Terrase/Back.webp',
                'projects/Barn Terrase/1Level.webp',
                'projects/Barn Terrase/2Level.webp'
            ],
            description: '<p>Современный двухэтажный дом в премиальном стиле барнхаус: пятно застройки 70 м², общая площадь 140 м². Вытянутый объём, двускатная крыша из кликфальца, фасад из деревянного планкена и панорамное остекление.</p><p>На первом этаже — кухня-гостиная 31,5 м², спальня, прихожая, холл, санузел и котельная. На втором — мастер-спальня, две спальни, кабинет, санузел и холл. Подходит для семьи из 4–6 человек.</p><p><strong>Цена под ключ:</strong> ≈ 1 130 $/м² (≈ 3 127 BYN/м²) · ≈ 438 000 BYN за дом.</p>'
        },
        classic_74: {
            title: 'Классик 74',
            images: [
                'projects/Классик 74/front.webp',
                'projects/Классик 74/Left.webp',
                'projects/Классик 74/Right.webp',
                'projects/Классик 74/Back.webp',
                'projects/Классик 74/Plan.webp'
            ],
            description: '<p>Компактный одноэтажный дом 74 м² в стиле современной классики — младшая версия «Классик 148». Удобен для пары или семьи из 2–3 человек: без лестниц, с продуманной планировкой.</p><p>Кухня-гостиная с выходом на крытую террасу, две спальни, санузел, котельная-постирочная. Светлый фасад, графитовая кликфальцевая кровля, тёмные окна и деревянные акценты.</p><p><strong>Цена под ключ:</strong> ≈ 1 155 $/м² (≈ 3 196 BYN/м²) · ≈ 237 000 BYN за дом.</p>'
        },
        classic_148: {
            title: 'Классик 148',
            images: [
                'projects/Классик 148/Front.webp',
                'projects/Классик 148/Left.webp',
                'projects/Классик 148/back.webp',
                'projects/Классик 148/Rigth.webp',
                'projects/Классик 148/project.webp'
            ],
            description: '<p>Двухэтажный коттедж 148 м² для комфортной жизни семьи за городом. На первом этаже — кухня-гостиная 36 м² с выходом на террасу 24 м², кабинет, санузел, гардероб и котельная. На втором — три спальни, ванная, гардеробная.</p><p>Современная классика: светлый фасад, графитовая кликфальцевая кровля, каменный цоколь и деревянные акценты.</p><p><strong>Цена под ключ:</strong> ≈ 1 180 $/м² (≈ 3 265 BYN/м²) · ≈ 483 000 BYN за дом.</p>'
        }
    };

    function getAssetBase() {
        var script = document.currentScript;
        if (!script) {
            script = document.querySelector('script[src*="project-modal.js"]');
        }
        return (script && script.getAttribute('data-asset-base')) || 'main_img/';
    }

    var assetBase = getAssetBase();

    function resolveImagePath(relativePath) {
        return assetBase + relativePath;
    }

    function encodeProjectImagePath(path) {
        return path.split('/').map(function (segment) {
            if (!segment || segment === '.' || segment === '..') {
                return segment;
            }
            return encodeURIComponent(segment);
        }).join('/');
    }

    function resetProjectSliderContainer(container) {
        if (!container) return;
        delete container.dataset.infiniteBound;
        container.querySelectorAll('img').forEach(function (img) {
            delete img.dataset.sliderTapBound;
            delete img.dataset.skipClick;
        });
    }

    function openProjectModal(type) {
        var modal = document.getElementById('projectModal');
        if (!modal) return;

        var project = PROJECT_MODAL_DATA[type];
        if (!project) {
            console.warn('Unknown project modal type:', type);
            return;
        }

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';

        var header = modal.querySelector('.modal-header h3');
        if (header) header.textContent = project.title;

        var modalBody = modal.querySelector('.modal-body');
        var descEl = modal.querySelector('#modalProjectDesc');
        var hasDescription = Boolean(project.description);

        if (descEl) {
            descEl.innerHTML = '';
        }
        if (modalBody) {
            modalBody.classList.toggle('has-desc', hasDescription);
        }

        var sliderContainer = modal.querySelector('.slider-container');
        if (!sliderContainer) return;

        resetProjectSliderContainer(sliderContainer);
        sliderContainer.innerHTML = '';

        project.images.forEach(function (relativePath, index) {
            var img = document.createElement('img');
            img.src = encodeProjectImagePath(resolveImagePath(relativePath));
            img.alt = 'Фото ' + (index + 1);
            img.className = 'slider-image-slide';
            img.loading = index === 0 ? 'eager' : 'lazy';
            img.onclick = function () { window.openImageFullscreen(this); };
            img.style.cursor = 'zoom-in';
            sliderContainer.appendChild(img);
        });

        if (hasDescription) {
            var descSlide = document.createElement('div');
            descSlide.className = 'slider-desc-slide';
            descSlide.setAttribute('role', 'group');
            descSlide.setAttribute('aria-label', 'Описание проекта');
            descSlide.innerHTML = project.description;
            sliderContainer.appendChild(descSlide);
        }

        sliderContainer.scrollLeft = 0;

        requestAnimationFrame(function () {
            if (typeof initAllProjectModalSliders === 'function') {
                initAllProjectModalSliders();
            }
            if (typeof goToProjectSliderIndex === 'function') {
                goToProjectSliderIndex(sliderContainer, 0, 'auto');
            }
        });
    }

    function closeProjectModal() {
        var modal = document.getElementById('projectModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    function openImageFullscreen(img) {
        var fullscreen = document.getElementById('imageFullscreen');
        var fullscreenImage = document.getElementById('fullscreenImage');
        if (!fullscreen || !fullscreenImage) return;

        fullscreenImage.src = img.src;
        fullscreenImage.alt = img.alt;
        fullscreenImage.onclick = function (e) { e.stopPropagation(); };
        fullscreen.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeImageFullscreen() {
        var fullscreen = document.getElementById('imageFullscreen');
        if (!fullscreen) return;

        fullscreen.style.display = 'none';
        var modal = document.getElementById('projectModal');
        document.body.style.overflow = modal && modal.style.display === 'block' ? 'hidden' : 'auto';
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeProjectModal();
            closeImageFullscreen();
        }
    });

    window.openProjectModal = openProjectModal;
    window.closeProjectModal = closeProjectModal;
    window.openImageFullscreen = openImageFullscreen;
    window.closeImageFullscreen = closeImageFullscreen;
})();
