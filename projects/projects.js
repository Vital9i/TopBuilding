/**
 * Каталог проектов /projects/
 */
(function () {
    'use strict';

    var IMG = '../main_img/projects/';

    /** Каталог: существующие дома сайта, классифицированные по архитектуре */
    var CATALOG = [
        {
            id: 'classic-100',
            name: 'Classic 100',
            architecture: 'classic',
            architectureLabel: 'CLASSIC',
            url: 'classic/classic-100/',
            image: IMG + 'classic100/facades/classic100-dark-front.webp',
            area: 100,
            bedrooms: 3,
            bathrooms: 2,
            floors: 1,
            price: 312000,
            popularity: 99,
            features: ['terrace'],
            plans3d: true
        },
        {
            id: 'classic-74',
            name: 'Classic 74',
            architecture: 'classic',
            architectureLabel: 'CLASSIC',
            url: 'classic/classic-74/',
            image: IMG + 'Классик 74/front.webp',
            area: 74,
            bedrooms: 2,
            bathrooms: 1,
            floors: 1,
            price: 237000,
            popularity: 100,
            features: ['terrace']
        },
        {
            id: 'classic-148',
            name: 'Classic 148',
            architecture: 'classic',
            architectureLabel: 'CLASSIC',
            url: 'classic/classic-148/',
            image: IMG + 'Классик 148/Front.webp',
            area: 148,
            bedrooms: 3,
            bathrooms: 2,
            floors: 2,
            price: 483000,
            popularity: 95,
            features: ['terrace', 'office']
        },
        {
            id: 'classic-cottage',
            name: 'Классический коттедж',
            architecture: 'classic',
            architectureLabel: 'CLASSIC',
            url: 'classic/classic-cottage/',
            image: IMG + 'Classic/classic.webp',
            area: 120,
            bedrooms: 3,
            bathrooms: 2,
            floors: 2,
            price: 189000,
            popularity: 70,
            features: ['terrace']
        },
        {
            id: 'barn-140',
            name: 'Barn 140',
            architecture: 'barn',
            architectureLabel: 'BARN',
            url: 'barn/barn-140/',
            image: IMG + 'Barn Terrase/Front.webp',
            area: 140,
            bedrooms: 4,
            bathrooms: 2,
            floors: 2,
            price: 438000,
            popularity: 98,
            features: ['terrace', 'office', 'master']
        },
        {
            id: 'barnhouse',
            name: 'Современный барнхаус',
            architecture: 'barn',
            architectureLabel: 'BARN',
            url: 'barn/barnhouse/',
            image: IMG + 'Barn/barn.webp',
            area: 100,
            bedrooms: 3,
            bathrooms: 2,
            floors: 2,
            price: 243000,
            popularity: 75,
            features: ['terrace']
        },
        {
            id: 'second-light',
            name: 'Classic со вторым светом',
            architecture: 'minimalism',
            architectureLabel: 'MINIMALISM',
            url: 'minimalism/classic-second-light/',
            image: IMG + 'Classic_2/project1.webp',
            area: 160,
            bedrooms: 3,
            bathrooms: 2,
            floors: 2,
            price: 200000,
            popularity: 80,
            features: ['second-light', 'terrace']
        },
        {
            id: 'alpine-chalet',
            name: 'Альпийское шале',
            architecture: 'chalet',
            architectureLabel: 'CHALET',
            url: 'chalet/alpine-chalet/',
            image: IMG + 'Shale_black/shale_black.webp',
            area: 220,
            bedrooms: 4,
            bathrooms: 3,
            floors: 2,
            price: 613000,
            popularity: 72,
            features: ['terrace', 'master']
        },
        {
            id: 'chalet-white',
            name: 'Шале White',
            architecture: 'chalet',
            architectureLabel: 'CHALET',
            url: 'chalet/chalet-white/',
            image: IMG + 'Shale_white/shale_white.webp',
            area: 180,
            bedrooms: 4,
            bathrooms: 2,
            floors: 2,
            price: 503000,
            popularity: 68,
            features: ['terrace', 'master']
        }
    ];

    var state = {
        architecture: '',
        area: '',
        floors: '',
        bedrooms: '',
        bathrooms: '',
        feature: '',
        sort: 'popularity-desc'
    };

    var FAVORITES_KEY = 'tb_project_favorites';

    function getFavorites() {
        try {
            var raw = localStorage.getItem(FAVORITES_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveFavorites(list) {
        try {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
        } catch (e) { /* ignore */ }
    }

    function toggleFavorite(id, btn) {
        var list = getFavorites();
        var idx = list.indexOf(id);
        if (idx >= 0) {
            list.splice(idx, 1);
            if (btn) {
                btn.classList.remove('is-active');
                btn.setAttribute('aria-pressed', 'false');
            }
        } else {
            list.push(id);
            if (btn) {
                btn.classList.add('is-active');
                btn.setAttribute('aria-pressed', 'true');
            }
        }
        saveFavorites(list);
    }

    function matchArea(area, filter) {
        if (!filter) return true;
        if (filter === '0-80') return area < 80;
        if (filter === '80-100') return area >= 80 && area <= 100;
        if (filter === '100-120') return area > 100 && area <= 120;
        if (filter === '120-150') return area > 120 && area <= 150;
        if (filter === '150+') return area > 150;
        return true;
    }

    function matchBedrooms(n, filter) {
        if (!filter) return true;
        if (filter === '4+') return n >= 4;
        return n === Number(filter);
    }

    function matchBathrooms(n, filter) {
        if (!filter) return true;
        if (filter === '3+') return n >= 3;
        return n === Number(filter);
    }

    function filterCatalog() {
        return CATALOG.filter(function (p) {
            if (state.architecture && p.architecture !== state.architecture) return false;
            if (!matchArea(p.area, state.area)) return false;
            if (state.floors && String(p.floors) !== String(state.floors)) return false;
            if (!matchBedrooms(p.bedrooms, state.bedrooms)) return false;
            if (!matchBathrooms(p.bathrooms, state.bathrooms)) return false;
            if (state.feature && p.features.indexOf(state.feature) === -1) return false;
            return true;
        });
    }

    function sortCatalog(list) {
        var sorted = list.slice();
        switch (state.sort) {
            case 'area-asc':
                sorted.sort(function (a, b) { return a.area - b.area; });
                break;
            case 'area-desc':
                sorted.sort(function (a, b) { return b.area - a.area; });
                break;
            case 'price-asc':
                sorted.sort(function (a, b) { return a.price - b.price; });
                break;
            case 'price-desc':
                sorted.sort(function (a, b) { return b.price - a.price; });
                break;
            default:
                sorted.sort(function (a, b) { return b.popularity - a.popularity; });
        }
        return sorted;
    }

    function bedroomsLabel(n) {
        if (n === 1) return '1 спальня';
        if (n >= 2 && n <= 4) return n + ' спальни';
        return n + ' спален';
    }

    function bathroomsLabel(n) {
        if (n === 1) return '1 санузел';
        if (n >= 2 && n <= 4) return n + ' санузла';
        return n + ' санузлов';
    }

    function floorsLabel(n) {
        return n === 1 ? '1 этаж' : n + ' этажа';
    }

    function encodeImgSrc(path) {
        return path.split('/').map(function (seg) {
            if (!seg || seg === '..' || seg === '.') return seg;
            return encodeURIComponent(seg);
        }).join('/');
    }

    function renderCard(p, favorites) {
        var fav = favorites.indexOf(p.id) >= 0;
        return (
            '<article class="pcard' + (p.plans3d ? ' pcard--plans' : '') + '" data-id="' + p.id + '" data-architecture="' + p.architecture + '">' +
                '<a class="pcard__link" href="' + p.url + '" aria-label="' + p.name + '">' +
                    '<div class="pcard__media">' +
                        '<img src="' + encodeImgSrc(p.image) + '" alt="' + p.name + ' — проект дома TOP BUILDING" loading="lazy" width="640" height="420">' +
                        (p.plans3d ? '<span class="pcard__plans">3д планировки</span>' : '') +
                        '<span class="pcard__badge">' + p.architectureLabel + '</span>' +
                    '</div>' +
                    '<div class="pcard__body">' +
                        '<h3 class="pcard__title">' + p.name + '</h3>' +
                        '<ul class="pcard__specs">' +
                            '<li><i class="fas fa-vector-square" aria-hidden="true"></i><span>' + p.area + ' м²</span></li>' +
                            '<li><i class="fas fa-bed" aria-hidden="true"></i><span>' + bedroomsLabel(p.bedrooms) + '</span></li>' +
                            '<li><i class="fas fa-bath" aria-hidden="true"></i><span>' + bathroomsLabel(p.bathrooms) + '</span></li>' +
                            '<li><i class="fas fa-layer-group" aria-hidden="true"></i><span>' + floorsLabel(p.floors) + '</span></li>' +
                        '</ul>' +
                        '<span class="pcard__btn">Подробнее <i class="fas fa-arrow-right" aria-hidden="true"></i></span>' +
                    '</div>' +
                '</a>' +
                '<button type="button" class="pcard__fav' + (fav ? ' is-active' : '') + '" data-fav="' + p.id + '" aria-label="В избранное" aria-pressed="' + (fav ? 'true' : 'false') + '">' +
                    '<i class="fas fa-heart" aria-hidden="true"></i>' +
                '</button>' +
            '</article>'
        );
    }

    function updateCount(n) {
        var el = document.getElementById('projectsFoundCount');
        if (el) el.textContent = String(n);
    }

    function render() {
        var grid = document.getElementById('projectsGrid');
        var empty = document.getElementById('projectsEmpty');
        if (!grid) return;

        var list = sortCatalog(filterCatalog());
        var favorites = getFavorites();
        updateCount(list.length);

        if (!list.length) {
            grid.innerHTML = '';
            if (empty) empty.hidden = false;
            return;
        }

        if (empty) empty.hidden = true;
        grid.innerHTML = list.map(function (p) {
            return renderCard(p, favorites);
        }).join('');
    }

    function setFilterChipActive(group, value) {
        document.querySelectorAll('[data-filter-group="' + group + '"]').forEach(function (btn) {
            var active = (btn.getAttribute('data-filter-value') || '') === value && value !== '';
            btn.classList.toggle('is-active', active);
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
    }

    function syncUrl() {
        if (!window.history || !window.history.replaceState) return;
        var params = new URLSearchParams();
        if (state.architecture) params.set('architecture', state.architecture);
        if (state.area) params.set('area', state.area);
        if (state.floors) params.set('floors', state.floors);
        if (state.bedrooms) params.set('bedrooms', state.bedrooms);
        if (state.bathrooms) params.set('bathrooms', state.bathrooms);
        if (state.feature) params.set('feature', state.feature);
        if (state.sort && state.sort !== 'popularity-desc') params.set('sort', state.sort);
        var qs = params.toString();
        var url = window.location.pathname + (qs ? '?' + qs : '') + window.location.hash;
        window.history.replaceState(null, '', url);
    }

    function readUrlState() {
        var params = new URLSearchParams(window.location.search);
        state.architecture = params.get('architecture') || '';
        state.area = params.get('area') || '';
        state.floors = params.get('floors') || '';
        state.bedrooms = params.get('bedrooms') || '';
        state.bathrooms = params.get('bathrooms') || '';
        state.feature = params.get('feature') || '';
        state.sort = params.get('sort') || 'popularity-desc';
    }

    function bindFilters() {
        document.querySelectorAll('.pfilter__btn').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var wrap = btn.closest('.pfilter');
                document.querySelectorAll('.pfilter').forEach(function (p) {
                    if (p !== wrap) p.classList.remove('is-open');
                });
                if (wrap) wrap.classList.toggle('is-open');
            });
        });

        document.addEventListener('click', function () {
            document.querySelectorAll('.pfilter').forEach(function (p) {
                p.classList.remove('is-open');
            });
        });

        document.querySelectorAll('[data-filter-group]').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var group = btn.getAttribute('data-filter-group');
                var value = btn.getAttribute('data-filter-value') || '';
                if (group === 'architecture') {
                    if (btn.classList.contains('style-switch__btn')) {
                        state.architecture = value;
                    } else {
                        state.architecture = state.architecture === value ? '' : value;
                    }
                    syncStyleButtons();
                } else if (group === 'area') {
                    state.area = state.area === value ? '' : value;
                    setFilterChipActive('area', state.area);
                } else if (group === 'floors') {
                    state.floors = state.floors === value ? '' : value;
                    setFilterChipActive('floors', state.floors);
                } else if (group === 'bedrooms') {
                    state.bedrooms = state.bedrooms === value ? '' : value;
                    setFilterChipActive('bedrooms', state.bedrooms);
                } else if (group === 'bathrooms') {
                    state.bathrooms = state.bathrooms === value ? '' : value;
                    setFilterChipActive('bathrooms', state.bathrooms);
                } else if (group === 'feature') {
                    state.feature = state.feature === value ? '' : value;
                    setFilterChipActive('feature', state.feature);
                }

                var parentFilter = btn.closest('.pfilter');
                if (parentFilter) parentFilter.classList.remove('is-open');

                syncUrl();
                render();
            });
        });

        var sortSelect = document.getElementById('projectsSort');
        if (sortSelect) {
            sortSelect.value = state.sort;
            sortSelect.addEventListener('change', function () {
                state.sort = sortSelect.value;
                syncUrl();
                render();
            });
        }

        var resetBtn = document.getElementById('projectsFiltersReset');
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                state.architecture = '';
                state.area = '';
                state.floors = '';
                state.bedrooms = '';
                state.bathrooms = '';
                state.feature = '';
                ['area', 'floors', 'bedrooms', 'bathrooms', 'feature'].forEach(function (g) {
                    setFilterChipActive(g, '');
                });
                syncStyleButtons();
                if (sortSelect) {
                    sortSelect.value = 'popularity-desc';
                    state.sort = 'popularity-desc';
                }
                syncUrl();
                render();
            });
        }

        var toggleBtn = document.getElementById('projectsFiltersToggle');
        var panel = document.getElementById('projectsFiltersPanel');
        if (toggleBtn && panel) {
            toggleBtn.addEventListener('click', function () {
                var open = panel.classList.toggle('is-open');
                toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
        }
    }

    function bindGridActions() {
        var grid = document.getElementById('projectsGrid');
        if (!grid) return;
        grid.addEventListener('click', function (e) {
            var favBtn = e.target.closest('[data-fav]');
            if (favBtn) {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(favBtn.getAttribute('data-fav'), favBtn);
            }
        });
    }

    function bindArchitectureCards() {
        document.querySelectorAll('[data-arch-filter]').forEach(function (card) {
            card.addEventListener('click', function (e) {
                // Allow real navigation; also set filter if staying on page via query
                var arch = card.getAttribute('data-arch-filter');
                if (!arch) return;
                // If href is architecture folder, leave default navigation
            });
        });
    }

    function syncStyleButtons() {
        document.querySelectorAll('.style-switch__btn').forEach(function (btn) {
            var value = btn.getAttribute('data-filter-value') || '';
            var active = value === (state.architecture || '');
            btn.classList.toggle('is-active', active);
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
    }

    function applyInitialFilterUi() {
        syncStyleButtons();
        setFilterChipActive('architecture', state.architecture);
        setFilterChipActive('area', state.area);
        setFilterChipActive('floors', state.floors);
        setFilterChipActive('bedrooms', state.bedrooms);
        setFilterChipActive('bathrooms', state.bathrooms);
        setFilterChipActive('feature', state.feature);

        var sortSelect = document.getElementById('projectsSort');
        if (sortSelect) sortSelect.value = state.sort;
    }

    function init() {
        readUrlState();
        applyInitialFilterUi();
        bindFilters();
        bindGridActions();
        bindArchitectureCards();
        render();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.TB_PROJECTS_CATALOG = CATALOG;
})();
