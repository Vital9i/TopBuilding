(function () {
    'use strict';

    function initHouseCalculator() {
        var root = document.getElementById('calculator');
        if (!root) return;

        function fitCalculatorViewport() {}
        function scheduleFitCalculatorViewport() {}

        const areaEl = document.getElementById('area');
        const projectTypeEl = document.getElementById('projectType');
        const floorsEl = document.getElementById('floors');
        const foundationEl = document.getElementById('foundation');
        const wallsEl = document.getElementById('walls');
        const roofEl = document.getElementById('roof');
        const roofShapeEl = document.getElementById('roofShape');
        const mansardEl = document.getElementById('mansard');
        const basementEl = document.getElementById('basement');
        const terraceEl = document.getElementById('terrace');
        const exteriorFinishEl = document.getElementById('exteriorFinish');
        const packageEl = document.getElementById('package');
        const resultEl = document.getElementById('result');
        const calcBtn = document.getElementById('calcBtn');
        const resetBtn = document.getElementById('resetBtn');
        const housePreviewEl = document.getElementById('housePreview');
        const calcProgressFill = document.getElementById('calcProgressFill');
        const calcProgressPct = document.getElementById('calcProgressPct');
        const calcProgressHint = document.getElementById('calcProgressHint');
        const previewImageWrap = root.querySelector('.preview-image-wrap');

        const FIELD_KEYS = [
            'projectType',
            'area',
            'foundation',
            'walls',
            'floors',
            'roofShape',
            'roof',
            'mansard',
            'basement',
            'exteriorFinish',
            'terrace',
            'package'
        ];
        var calculatePassCount = 0;
        var priceCalculated = false;
        var lastCalculatedSnapshot = null;
        var roofValueBeforeFlat = '';
        var mansardValueBeforeGable = '';

        function captureFieldSnapshot() {
            var snap = {};
            FIELD_KEYS.forEach(function (key) {
                var el = document.getElementById(key);
                if (!el) return;
                snap[key] = key === 'area' ? parseAreaValue() : String(el.value);
            });
            return snap;
        }

        function snapshotsEqual(a, b) {
            if (!a || !b) return false;
            return FIELD_KEYS.every(function (key) {
                if (key === 'area') {
                    return Number(a.area) === Number(b.area);
                }
                return a[key] === b[key];
            });
        }

        function invalidateCalculatedPrice() {
            if (!priceCalculated) return;
            priceCalculated = false;
            lastCalculatedSnapshot = null;
            if (resultEl) {
                resultEl.classList.remove('result-pop');
            }
            setResultPlaceholder();
            syncCalcBtnPrompt();
        }

        function markPriceCalculated() {
            lastCalculatedSnapshot = captureFieldSnapshot();
            priceCalculated = true;
            syncCalcBtnPrompt(false);
        }

        function isRoofMaterialLocked() {
            return roofShapeEl && roofShapeEl.value === 'flat';
        }

        function isMansardAvailable() {
            return roofShapeEl && roofShapeEl.value === 'gable';
        }

        function isFieldValid(key) {
            var el = document.getElementById(key);
            if (!el) return true;
            if (key === 'area') return parseAreaValue() > 0;
            if (key === 'roof' && isRoofMaterialLocked()) return true;
            if (key === 'mansard' && !isMansardAvailable()) return true;
            return String(el.value).trim() !== '';
        }

        function areAllFieldsValid() {
            return FIELD_KEYS.every(isFieldValid);
        }

        function getFieldContainer(el) {
            return el && el.closest('.field');
        }

        function clearFieldErrors() {
            root.querySelectorAll('.field.field--error').forEach(function (field) {
                field.classList.remove('field--error');
            });
        }

        function clearFieldError(key) {
            var el = document.getElementById(key);
            var container = getFieldContainer(el);
            if (container) container.classList.remove('field--error');
        }

        function highlightInvalidFields() {
            clearFieldErrors();
            FIELD_KEYS.forEach(function (key) {
                if (!isFieldValid(key)) {
                    var el = document.getElementById(key);
                    var container = getFieldContainer(el);
                    if (container) container.classList.add('field--error');
                }
            });
        }

        function isFieldActiveForProgress(key) {
            if (key === 'roof' && isRoofMaterialLocked()) return false;
            if (key === 'mansard' && !isMansardAvailable()) return false;
            return true;
        }

        function isFieldFilledForProgress(key) {
            var el = document.getElementById(key);
            if (!el) return false;
            if (key === 'area') return parseAreaValue() > 0;
            return String(el.value).trim() !== '';
        }

        function updateProgressBar() {
            if (!calcProgressFill || !calcProgressPct) return;
            var activeKeys = FIELD_KEYS.filter(isFieldActiveForProgress);
            var total = activeKeys.length;
            var filled = 0;
            activeKeys.forEach(function (key) {
                if (isFieldFilledForProgress(key)) filled += 1;
            });
            var pct = total === 0 ? 0 : Math.min(100, Math.round((filled / total) * 100));
            calcProgressFill.style.width = pct + '%';
            calcProgressPct.textContent = String(pct);
            if (calcProgressHint) {
                if (filled >= total) {
                    calcProgressHint.textContent = 'все параметры выбраны — нажмите «Рассчитать»';
                } else if (pct >= 66) {
                    calcProgressHint.textContent =
                        'осталось немного — проверьте блок с превью и итогом';
                } else if (pct >= 33) {
                    calcProgressHint.textContent = 'картинка дома обновляется при каждом изменении';
                } else {
                    calcProgressHint.textContent = 'пройдитесь по полям — полоска покажет прогресс';
                }
            }
            syncCalcBtnPrompt(filled >= total);
        }

        function syncCalcBtnPrompt(allFieldsFilled) {
            if (!calcBtn) return;
            var shouldNudge =
                allFieldsFilled !== undefined
                    ? allFieldsFilled && !priceCalculated
                    : FIELD_KEYS.filter(isFieldActiveForProgress).every(isFieldFilledForProgress) &&
                      !priceCalculated;
            calcBtn.classList.toggle('calc-btn--nudge', shouldNudge);
        }

        /** Число из поля площади: любое допустимое число; пусто/мусор → 0 */
        function parseAreaValue() {
            if (!areaEl) return 0;
            var s = String(areaEl.value).trim().replace(',', '.');
            if (s === '') return 0;
            var n = parseFloat(s);
            return isNaN(n) ? 0 : n;
        }

        /** Прогресс: площадь считается заполненной только если значение > 0 */
        function syncAreaProgressField() {
            updateProgressBar();
        }

        function syncCalcSelectEmptyState() {
            root.querySelectorAll('.calc-fields-grid select').forEach(function (sel) {
                if (sel.value === '') {
                    sel.setAttribute('data-empty', '');
                } else {
                    sel.removeAttribute('data-empty');
                }
            });
        }

        function syncRoofMaterialState() {
            if (!roofEl) return;
            var locked = isRoofMaterialLocked();
            var container = getFieldContainer(roofEl);
            if (locked) {
                if (roofEl.value && roofEl.value !== 'flat_membrane') {
                    roofValueBeforeFlat = roofEl.value;
                }
                roofEl.value = 'flat_membrane';
                roofEl.disabled = true;
                if (container) container.classList.add('field--disabled');
                clearFieldError('roof');
            } else {
                roofEl.disabled = false;
                if (roofEl.value === 'flat_membrane') {
                    roofEl.value = roofValueBeforeFlat || '';
                    roofValueBeforeFlat = '';
                }
                if (container) container.classList.remove('field--disabled');
            }
        }

        function syncMansardState() {
            if (!mansardEl) return;
            var available = isMansardAvailable();
            var container = getFieldContainer(mansardEl);
            if (!available) {
                if (mansardEl.value && mansardEl.value !== 'no') {
                    mansardValueBeforeGable = mansardEl.value;
                }
                mansardEl.value = 'no';
                mansardEl.disabled = true;
                if (container) container.classList.add('field--disabled');
                clearFieldError('mansard');
            } else {
                mansardEl.disabled = false;
                if (mansardEl.value === 'no' && mansardValueBeforeGable) {
                    mansardEl.value = mansardValueBeforeGable;
                    mansardValueBeforeGable = '';
                }
                if (container) container.classList.remove('field--disabled');
            }
        }

        function syncAreaInputEmptyState() {
            if (!areaEl) return;
            if (parseAreaValue() > 0) {
                areaEl.removeAttribute('data-empty');
            } else {
                areaEl.setAttribute('data-empty', '');
            }
        }

        function playPreviewAnimations() {
            if (previewImageWrap) {
                previewImageWrap.classList.remove('preview-flash');
                void previewImageWrap.offsetWidth;
                previewImageWrap.classList.add('preview-flash');
            }
        }

        function playUpdateAnimations() {
            playPreviewAnimations();
            resultEl.classList.remove('result-pop');
            void resultEl.offsetWidth;
            resultEl.classList.add('result-pop');
        }

        function renderResultHtml(priceText, perSqmHtml) {
            return (
                '<span class="result-label">Ориентировочная стоимость дома:</span> ' +
                '<strong>' + priceText + '</strong>' +
                (perSqmHtml || '')
            );
        }

        function setResultPlaceholder() {
            resultEl.innerHTML = renderResultHtml(
                '—',
                '<span class="result-per-m2"> · — BYN/м²</span>'
            );
        }

        FIELD_KEYS.forEach(function (key) {
            var el = document.getElementById(key);
            if (!el) return;
            var ev = el.tagName === 'INPUT' && el.type === 'number' ? 'input' : 'change';
            el.addEventListener(ev, function () {
                clearFieldError(key);
            });
        });

        function getPrice(selectEl) {
            if (!selectEl || selectEl.value === '') return 0;
            var v = Number(selectEl.options[selectEl.selectedIndex].dataset.price);
            return isNaN(v) ? 0 : v;
        }

        /** Надбавка за м² (проектирование и т.п.), BYN/м² */
        function getPerSqm(selectEl) {
            if (!selectEl || selectEl.value === '') return 0;
            var v = Number(selectEl.options[selectEl.selectedIndex].dataset.persqm);
            return isNaN(v) ? 0 : v;
        }

        function formatBYN(value) {
            return new Intl.NumberFormat('ru-BY').format(Math.round(value)) + ' BYN';
        }

        function formatBYNPerSqm(value) {
            return new Intl.NumberFormat('ru-BY').format(Math.round(value)) + ' BYN/м²';
        }

        /** Пути к растровым превью (папка img_calculator в корне проекта) */
        var IMG_CALC_DIR = 'img_calculator/';
        var IMG_CALC_VER = '12';
        var IMG_CALC_EMPTY = IMG_CALC_DIR + 'Ychastok1.webp';
        var IMG_CALC_FOUNDATION_STRIP = IMG_CALC_DIR + 'Fundament_lenta1.webp';
        var IMG_CALC_FOUNDATION_SLAB = IMG_CALC_DIR + 'Fundament_plita.webp';

        function calcImgUrl(path) {
            return path + (path.indexOf('?') >= 0 ? '&' : '?') + 'v=' + IMG_CALC_VER;
        }

        function setHousePreviewSrc(src) {
            if (!housePreviewEl || !src) return;
            delete housePreviewEl.dataset.fallbackApplied;
            housePreviewEl.src = calcImgUrl(src);
        }

        if (housePreviewEl && !housePreviewEl.dataset.previewErrorBound) {
            housePreviewEl.dataset.previewErrorBound = '1';
            housePreviewEl.addEventListener('error', function () {
                if (housePreviewEl.dataset.fallbackApplied) return;
                housePreviewEl.dataset.fallbackApplied = '1';
                housePreviewEl.src = calcImgUrl(IMG_CALC_EMPTY);
            });
        }

        /**
         * Имена файлов в img_calculator/ (для проверки кандидатов).
         * Схема имён:
         *   {этаж}_{стены}.webp — коробка без крыши
         *   {этаж}_ploskaya_{стены}.webp — плоская крыша
         *   {этаж}_{стены}_odnoskat.webp — односкатная
         *   {этаж}_{стены}_2skat_{cherepica|gibkaya|falc*} — двускатная
         *   {этаж}_{стены}_4_chirepica.webp / _4skat_{gibkaya|clickfalc} — четырёхскатная
         *   {этаж}_naryzhnya_{2skat|4skat}_{cherepica|gibkaya|clickfalc}[+terrasa].webp
         *   {этаж}_naryzhnya_odnoskatnaya|ploskaya[+terrasa].webp — с отделкой
         */
        var IMG_CALC_KNOWN = {
            '1_gazobeton.webp': 1,
            '1_gazobeton_2skat_cherepica.webp': 1,
            '1_gazobeton_2skat_falc_1.webp': 1,
            '1_gazoblok_4skat_clickfalc.webp': 1,
            '1_gazoblok_4skat_gibkaya.webp': 1,
            '1_gazosilikat_2skat_gibkaya.webp': 1,
            '1_gazosilikat_4_chirepica.webp': 1,
            '1_gazosilikat_4skat_gibkaya.webp': 1,
            '1_gazosilikat_odnoskat.webp': 1,
            '1_keramzit_2skat_cherepica.webp': 1,
            '1_keramzit_2skat_falc_1.webp': 1,
            '1_keramzit_2skat_gibkaya.webp': 1,
            '1_keramzit_4_chirepica.webp': 1,
            '1_keramzit_4skat_clickfalc.webp': 1,
            '1_keramzit_4skat_gibkaya.webp': 1,
            '1_keramzit_gibkaya.webp': 1,
            '1_keramzit_odnoskat.webp': 1,
            '1_kiramzit.webp': 1,
            '1_kirpich.webp': 1,
            '1_kirpich_2skat_cherepica.png_1.webp': 1,
            '1_kirpich_2skat_falc.webp': 1,
            '1_kirpich_4_chirepica.webp': 1,
            '1_kirpich_4skat_clickfalc.webp': 1,
            '1_kirpich_4skat_gibkaya.webp': 1,
            '1_kirpich_gibkaya.webp': 1,
            '1_kirpich_odnoskat.webp': 1,
            '1_monolit.webp': 1,
            '1_monolit_2skat_cherepica.webp': 1,
            '1_monolit_2skat_falc_1.webp': 1,
            '1_monolit_4_chirepica.webp': 1,
            '1_monolit_4skat_clickfalc.webp': 1,
            '1_monolit_4skat_gibkaya.webp': 1,
            '1_monolit_odnoskat.webp': 1,
            '1_naryzhnya_2skat_cherepica+terrasa.webp': 1,
            '1_naryzhnya_2skat_chirepica.webp': 1,
            '1_naryzhnya_2skat_clickfalc.webp': 1,
            '1_naryzhnya_2skat_clickfalc+terrasa.webp': 1,
            '1_naryzhnya_2skat_gibkaya.webp': 1,
            '1_naryzhnya_2skat_gibkaya+terrasa.webp': 1,
            '1_naryzhnya_4skat_cherepica.webp': 1,
            '1_naryzhnya_4skat_cherepica+terrasa.webp': 1,
            '1_naryzhnya_4skat_clickfalc.webp': 1,
            '1_naryzhnya_4skat_clickfalc+terrasa.webp': 1,
            '1_naryzhnya_4skat_gibkaya.webp': 1,
            '1_naryzhnya_4skat_gibkaya+terrasa.webp': 1,
            '1_naryzhnya_odnoskatnaya.webp': 1,
            '1_naryzhnya_odnoskatnaya+terrasa.webp': 1,
            '1_naryzhnya_ploskaya.webp': 1,
            '1_naryzhnya_ploskaya+terrasa.webp': 1,
            '1_ploskaya_gazoblock.webp': 1,
            '1_ploskaya_keramzit.webp': 1,
            '1_ploskaya_kirpich.webp': 1,
            '1_ploskaya_monolit.webp': 1,
            '2_gazobeton.webp': 1,
            '2_gazoblok_2skat_cherepica.webp': 1,
            '2_gazoblok_2skat_falc.webp': 1,
            '2_gazoblok_2skat_gibkaya.webp': 1,
            '2_gazoblok_4skat_clickfalc.webp': 1,
            '2_gazoblok_4skat_gibkaya.webp': 1,
            '2_gazoblok_odnoskat.webp': 1,
            '2_gazosilikat_4_chirepica.webp': 1,
            '2_keramzit_2skat_cherepica.webp': 1,
            '2_keramzit_2skat_falc.webp': 1,
            '2_keramzit_2skat_gibkaya.webp': 1,
            '2_keramzit_4_chirepica.webp': 1,
            '2_keramzit_4skat_clickfalc.webp': 1,
            '2_keramzit_4skat_gibkaya.webp': 1,
            '2_keramzitobeton_odnoskat.webp': 1,
            '2_kiramzit.webp': 1,
            '2_kirpich.webp': 1,
            '2_kirpich_2skat_cherepica.webp': 1,
            '2_kirpich_2skat_falc.webp': 1,
            '2_kirpich_2skat_gibkaya.webp': 1,
            '2_kirpich_4_chirepica.webp': 1,
            '2_kirpich_4skat_clickfalc.webp': 1,
            '2_kirpich_4skat_gibkaya.webp': 1,
            '2_kirpich_odnoskat.webp': 1,
            '2_monolit.webp': 1,
            '2_monolit_2skat_cherepica.webp': 1,
            '2_monolit_2skat_falc.webp': 1,
            '2_monolit_2skat_gibkaya.webp': 1,
            '2_monolit_4_chirepica.webp': 1,
            '2_monolit_4skat_clickfalc.webp': 1,
            '2_monolit_4skat_gibkaya.webp': 1,
            '2_monolit_odnoskat.webp': 1,
            '2_naryzhnya_2skat_cherepica.webp': 1,
            '2_naryzhnya_2skat_cherepica+terrasa.webp': 1,
            '2_naryzhnya_2skat_clickfalc.webp': 1,
            '2_naryzhnya_2skat_clickfalc+terrasa.webp': 1,
            '2_naryzhnya_2skat_gibkaya.webp': 1,
            '2_naryzhnya_2skat_gibkaya+terrasa.webp': 1,
            '2_naryzhnya_4skat_cherepica.webp': 1,
            '2_naryzhnya_4skat_cherepica+terrasa.webp': 1,
            '2_naryzhnya_4skat_clickfalc.webp': 1,
            '2_naryzhnya_4skat_clickfalc+terrasa.webp': 1,
            '2_naryzhnya_4skat_gibkaya.webp': 1,
            '2_naryzhnya_4skat_gibkaya+terrasa.webp': 1,
            '2_naryzhnya_odnoskatnaya.webp': 1,
            '2_naryzhnya_odnoskatnaya+terrasa.webp': 1,
            '2_naryzhnya_ploskaya.webp': 1,
            '2_naryzhnya_ploskaya+terrasa.webp': 1,
            '2_ploskaya_gazoblok.webp': 1,
            '2_ploskaya_keramzit.webp': 1,
            '2_ploskaya_kirpich.webp': 1,
            '2_ploskaya_monolit.webp': 1,
            'Fundament_lenta1.webp': 1,
            'Fundament_plita.webp': 1,
            'Ychastok1.webp': 1
        };

        var ROOF_MATERIALS = ['tile', 'soft', 'clickfalz'];

        /** Материал стен → имя в файле (базовое превью) */
        var WALL_PREVIEW_FILES = {
            keramzit: 'kiramzit',
            gas: 'gazobeton',
            brick: 'kirpich',
            monolith: 'monolit'
        };

        /** Плоская крыша: {этаж}_ploskaya_{имя в файле}.webp */
        var FLAT_ROOF_WALL_FILES = {
            keramzit: 'keramzit',
            gas: { 1: 'gazoblock', 2: 'gazoblok' },
            brick: 'kirpich',
            monolith: 'monolit'
        };

        /**
         * Стены в составном превью: этаж|стены|[форма|материал крыши] → stem в имени файла.
         * У газосиликата и керамзита имена в файлах неоднородны.
         */
        var COMPOSITE_WALL_STEM = {
            '1|keramzit': 'keramzit',
            '2|keramzit': 'keramzit',
            '2|keramzit|shed': 'keramzitobeton',
            '1|gas|gable|tile': 'gazobeton',
            '1|gas|gable|soft': 'gazosilikat',
            '1|gas|gable|clickfalz': 'gazobeton',
            '1|gas|hip|tile': 'gazosilikat',
            '1|gas|hip|soft': 'gazosilikat',
            '1|gas|hip|clickfalz': 'gazoblok',
            '1|gas|shed': 'gazosilikat',
            '2|gas|hip|tile': 'gazosilikat',
            '1|brick': 'kirpich',
            '2|brick': 'kirpich',
            '1|monolith': 'monolit',
            '2|monolith': 'monolit'
        };

        var GABLE_ROOF_SUFFIX = {
            tile: ['2skat_cherepica'],
            soft: ['2skat_gibkaya', 'gibkaya'],
            clickfalz: ['2skat_falc_1', '2skat_falc']
        };

        var HIP_ROOF_SUFFIX = {
            tile: ['4_chirepica'],
            soft: ['4skat_gibkaya'],
            clickfalz: ['4skat_clickfalc']
        };

        var COMPOSITE_EXTRA_CANDIDATES = {
            '1|brick|gable|tile': ['1_kirpich_2skat_cherepica.png_1.webp'],
            '1|monolith|gable|soft': ['1_monolit_4skat_gibkaya.webp']
        };

        /**
         * Явная матрица: этаж|стены|форма|[материал крыши] → файл.
         * Дублирует авто-подбор для нестандартных имён.
         */
        var CALC_PREVIEW_FILES = {
            '1|keramzit|gable|tile': '1_keramzit_2skat_cherepica.webp',
            '1|keramzit|gable|soft': '1_keramzit_2skat_gibkaya.webp',
            '1|keramzit|gable|clickfalz': '1_keramzit_2skat_falc_1.webp',
            '1|keramzit|hip|tile': '1_keramzit_4_chirepica.webp',
            '1|keramzit|hip|soft': '1_keramzit_4skat_gibkaya.webp',
            '1|keramzit|hip|clickfalz': '1_keramzit_4skat_clickfalc.webp',
            '1|keramzit|shed': '1_keramzit_odnoskat.webp',
            '1|gas|gable|tile': '1_gazobeton_2skat_cherepica.webp',
            '1|gas|gable|soft': '1_gazosilikat_2skat_gibkaya.webp',
            '1|gas|gable|clickfalz': '1_gazobeton_2skat_falc_1.webp',
            '1|gas|hip|tile': '1_gazosilikat_4_chirepica.webp',
            '1|gas|hip|soft': '1_gazosilikat_4skat_gibkaya.webp',
            '1|gas|hip|clickfalz': '1_gazoblok_4skat_clickfalc.webp',
            '1|gas|shed': '1_gazosilikat_odnoskat.webp',
            '1|brick|gable|tile': '1_kirpich_2skat_cherepica.png_1.webp',
            '1|brick|gable|soft': '1_kirpich_gibkaya.webp',
            '1|brick|gable|clickfalz': '1_kirpich_2skat_falc.webp',
            '1|brick|hip|tile': '1_kirpich_4_chirepica.webp',
            '1|brick|hip|soft': '1_kirpich_4skat_gibkaya.webp',
            '1|brick|hip|clickfalz': '1_kirpich_4skat_clickfalc.webp',
            '1|brick|shed': '1_kirpich_odnoskat.webp',
            '1|monolith|gable|tile': '1_monolit_2skat_cherepica.webp',
            '1|monolith|gable|soft': '1_monolit_4skat_gibkaya.webp',
            '1|monolith|gable|clickfalz': '1_monolit_2skat_falc_1.webp',
            '1|monolith|hip|tile': '1_monolit_4_chirepica.webp',
            '1|monolith|hip|soft': '1_monolit_4skat_gibkaya.webp',
            '1|monolith|hip|clickfalz': '1_monolit_4skat_clickfalc.webp',
            '1|monolith|shed': '1_monolit_odnoskat.webp',
            '2|keramzit|gable|tile': '2_keramzit_2skat_cherepica.webp',
            '2|keramzit|gable|soft': '2_keramzit_2skat_gibkaya.webp',
            '2|keramzit|gable|clickfalz': '2_keramzit_2skat_falc.webp',
            '2|keramzit|hip|tile': '2_keramzit_4_chirepica.webp',
            '2|keramzit|hip|soft': '2_keramzit_4skat_gibkaya.webp',
            '2|keramzit|hip|clickfalz': '2_keramzit_4skat_clickfalc.webp',
            '2|keramzit|shed': '2_keramzitobeton_odnoskat.webp',
            '2|gas|gable|tile': '2_gazoblok_2skat_cherepica.webp',
            '2|gas|gable|soft': '2_gazoblok_2skat_gibkaya.webp',
            '2|gas|gable|clickfalz': '2_gazoblok_2skat_falc.webp',
            '2|gas|hip|tile': '2_gazosilikat_4_chirepica.webp',
            '2|gas|hip|soft': '2_gazoblok_4skat_gibkaya.webp',
            '2|gas|hip|clickfalz': '2_gazoblok_4skat_clickfalc.webp',
            '2|gas|shed': '2_gazoblok_odnoskat.webp',
            '2|brick|gable|tile': '2_kirpich_2skat_cherepica.webp',
            '2|brick|gable|soft': '2_kirpich_2skat_gibkaya.webp',
            '2|brick|gable|clickfalz': '2_kirpich_2skat_falc.webp',
            '2|brick|hip|tile': '2_kirpich_4_chirepica.webp',
            '2|brick|hip|soft': '2_kirpich_4skat_gibkaya.webp',
            '2|brick|hip|clickfalz': '2_kirpich_4skat_clickfalc.webp',
            '2|brick|shed': '2_kirpich_odnoskat.webp',
            '2|monolith|gable|tile': '2_monolit_2skat_cherepica.webp',
            '2|monolith|gable|soft': '2_monolit_2skat_gibkaya.webp',
            '2|monolith|gable|clickfalz': '2_monolit_2skat_falc.webp',
            '2|monolith|hip|tile': '2_monolit_4_chirepica.webp',
            '2|monolith|hip|soft': '2_monolit_4skat_gibkaya.webp',
            '2|monolith|hip|clickfalz': '2_monolit_4skat_clickfalc.webp',
            '2|monolith|shed': '2_monolit_odnoskat.webp'
        };

        /** Наружная отделка: этаж|форма|[материал крыши] → naryzhnya_* */
        var FINISH_PREVIEW_FILES = {
            '1|gable|tile': '1_naryzhnya_2skat_chirepica.webp',
            '1|gable|soft': '1_naryzhnya_2skat_gibkaya.webp',
            '1|gable|clickfalz': '1_naryzhnya_2skat_clickfalc.webp',
            '1|hip|tile': '1_naryzhnya_4skat_cherepica.webp',
            '1|hip|soft': '1_naryzhnya_4skat_gibkaya.webp',
            '1|hip|clickfalz': '1_naryzhnya_4skat_clickfalc.webp',
            '1|shed': '1_naryzhnya_odnoskatnaya.webp',
            '1|flat': '1_naryzhnya_ploskaya.webp',
            '2|gable|tile': '2_naryzhnya_2skat_cherepica.webp',
            '2|gable|soft': '2_naryzhnya_2skat_gibkaya.webp',
            '2|gable|clickfalz': '2_naryzhnya_2skat_clickfalc.webp',
            '2|hip|tile': '2_naryzhnya_4skat_cherepica.webp',
            '2|hip|soft': '2_naryzhnya_4skat_gibkaya.webp',
            '2|hip|clickfalz': '2_naryzhnya_4skat_clickfalc.webp',
            '2|shed': '2_naryzhnya_odnoskatnaya.webp',
            '2|flat': '2_naryzhnya_ploskaya.webp'
        };

        var FINISH_DEFAULT_BY_FLOOR = {
            1: '1_naryzhnya_4skat_cherepica.webp',
            2: '2_naryzhnya_4skat_cherepica.webp'
        };

        function pickKnownFile(candidates) {
            var i;
            var name;
            for (i = 0; i < candidates.length; i += 1) {
                name = candidates[i];
                if (IMG_CALC_KNOWN[name]) return name;
            }
            return '';
        }

        var FINISH_TERRACE_FILE_OVERRIDES = {
            '1_naryzhnya_2skat_chirepica.webp':
                '1_naryzhnya_2skat_cherepica+terrasa.webp'
        };

        /** Вариант с террасой: *_+terrasa.webp (с учётом chirepica/cherepica) */
        function applyTerraceToFinishFile(fileName, hasTerrace) {
            var terraced;
            var i;
            var candidates;
            if (!fileName || !hasTerrace) return fileName;
            if (FINISH_TERRACE_FILE_OVERRIDES[fileName]) {
                candidates = [FINISH_TERRACE_FILE_OVERRIDES[fileName]];
            } else {
                candidates = [fileName.replace(/\.webp$/, '+terrasa.webp')];
            }
            candidates.push(
                fileName.replace(/chirepica\.webp$/, 'cherepica+terrasa.webp')
            );
            for (i = 0; i < candidates.length; i += 1) {
                terraced = candidates[i];
                if (IMG_CALC_KNOWN[terraced]) return terraced;
            }
            return fileName;
        }

        function finishPreviewPath(fileName, hasTerrace) {
            var resolved = applyTerraceToFinishFile(fileName, hasTerrace);
            return resolved ? IMG_CALC_DIR + resolved : '';
        }

        function getCompositeWallStem(floorNum, wallKey, shape, roofKey) {
            var stemKey = String(floorNum) + '|' + wallKey;
            if (shape === 'shed') {
                stemKey += '|shed';
            } else if (shape === 'gable' || shape === 'hip') {
                stemKey += '|' + shape + '|' + roofKey;
            }
            if (COMPOSITE_WALL_STEM[stemKey]) return COMPOSITE_WALL_STEM[stemKey];
            if (COMPOSITE_WALL_STEM[floorNum + '|' + wallKey]) {
                return COMPOSITE_WALL_STEM[floorNum + '|' + wallKey];
            }
            if (wallKey === 'gas') return floorNum === 1 ? 'gazobeton' : 'gazoblok';
            if (wallKey === 'keramzit') return 'keramzit';
            if (wallKey === 'brick') return 'kirpich';
            if (wallKey === 'monolith') return 'monolit';
            return '';
        }

        function buildCompositeCandidates(floorNum, wallKey, shape, roofKey) {
            var stem = getCompositeWallStem(floorNum, wallKey, shape, roofKey);
            var prefix = floorNum + '_' + stem + '_';
            var suffixes;
            var candidates = [];
            var mapKey;
            var extra;
            var i;

            mapKey =
                floorNum +
                '|' +
                wallKey +
                '|' +
                shape +
                (roofKey ? '|' + roofKey : '');
            if (shape === 'shed') {
                mapKey = floorNum + '|' + wallKey + '|shed';
            }
            if (CALC_PREVIEW_FILES[mapKey]) {
                candidates.push(CALC_PREVIEW_FILES[mapKey]);
            }
            extra = COMPOSITE_EXTRA_CANDIDATES[mapKey];
            if (extra) {
                for (i = 0; i < extra.length; i += 1) {
                    candidates.push(extra[i]);
                }
            }
            if (!stem) return candidates;

            if (shape === 'shed') {
                candidates.push(prefix + 'odnoskat.webp');
                if (wallKey === 'keramzit' && floorNum === 2) {
                    candidates.push('2_keramzitobeton_odnoskat.webp');
                }
            } else if (shape === 'gable') {
                suffixes = GABLE_ROOF_SUFFIX[roofKey] || [];
                for (i = 0; i < suffixes.length; i += 1) {
                    candidates.push(prefix + suffixes[i] + '.webp');
                }
            } else if (shape === 'hip') {
                suffixes = HIP_ROOF_SUFFIX[roofKey] || [];
                for (i = 0; i < suffixes.length; i += 1) {
                    candidates.push(prefix + suffixes[i] + '.webp');
                }
            }

            return candidates;
        }

        /** Наружная отделка или комплектация черновая / под ключ — превью с отделкой. */
        function shouldUseFinishPreview() {
            var finish = exteriorFinishEl ? exteriorFinishEl.value : '';
            var pkg = packageEl ? packageEl.value : '';
            if (finish) return true;
            if (pkg === 'rough' || pkg === 'turnkey') return true;
            return false;
        }

        function getFinishPreviewPath(floors, roofShape, roofMaterial, hasTerrace) {
            var floorNum = Number(floors) === 2 ? 2 : 1;
            var shape = String(roofShape || '').trim();
            var roofKey = String(roofMaterial || '').trim();
            var materials = roofKey ? [roofKey] : ROOF_MATERIALS;
            var file;
            var i;

            if (shape === 'shed' || shape === 'flat') {
                file = FINISH_PREVIEW_FILES[floorNum + '|' + shape];
                if (file) return finishPreviewPath(file, hasTerrace);
            } else if (shape === 'gable' || shape === 'hip') {
                for (i = 0; i < materials.length; i += 1) {
                    file = FINISH_PREVIEW_FILES[
                        floorNum + '|' + shape + '|' + materials[i]
                    ];
                    if (file) return finishPreviewPath(file, hasTerrace);
                }
            }

            file = FINISH_DEFAULT_BY_FLOOR[floorNum];
            return finishPreviewPath(file, hasTerrace);
        }

        function getCompositePreviewPath(floors, walls, roofShape, roofMaterial) {
            var wallKey = String(walls || '').trim();
            var shape = String(roofShape || '').trim();
            var roofKey = String(roofMaterial || '').trim();
            var floorNum = Number(floors) === 2 ? 2 : 1;
            var materials;
            var candidates;
            var file;
            var i;

            if (!wallKey || !shape || shape === 'flat') return '';

            if (shape === 'shed') {
                candidates = buildCompositeCandidates(
                    floorNum,
                    wallKey,
                    'shed',
                    ''
                );
                file = pickKnownFile(candidates);
                return file ? IMG_CALC_DIR + file : '';
            }

            if (shape === 'gable' || shape === 'hip') {
                materials = roofKey ? [roofKey] : ROOF_MATERIALS;
                for (i = 0; i < materials.length; i += 1) {
                    candidates = buildCompositeCandidates(
                        floorNum,
                        wallKey,
                        shape,
                        materials[i]
                    );
                    file = pickKnownFile(candidates);
                    if (file) return IMG_CALC_DIR + file;
                }
            }
            return '';
        }

        function getWallPreviewPath(floors, walls) {
            var fileStem = WALL_PREVIEW_FILES[String(walls || '').trim()];
            if (!fileStem) return '';
            var floorNum = Number(floors) === 2 ? 2 : 1;
            return IMG_CALC_DIR + floorNum + '_' + fileStem + '.webp';
        }

        function getFlatRoofWallPreviewPath(floors, walls) {
            var wallKey = String(walls || '').trim();
            if (!wallKey) return '';
            var floorNum = Number(floors) === 2 ? 2 : 1;
            var stem = FLAT_ROOF_WALL_FILES[wallKey];
            if (!stem) return '';
            if (typeof stem === 'object') {
                stem = stem[floorNum] || stem[1];
            }
            return IMG_CALC_DIR + floorNum + '_ploskaya_' + stem + '.webp';
        }

        function resolvePreviewSrc(floors, walls, roofShape, roofMaterial) {
            var wallKey = String(walls || '').trim();
            var shape = String(roofShape || '').trim();
            var roofKey = String(roofMaterial || '').trim();
            var hasTerrace = terraceEl && terraceEl.value === 'yes';

            if (shouldUseFinishPreview()) {
                var finishPreview = getFinishPreviewPath(
                    floors,
                    shape,
                    roofKey,
                    hasTerrace
                );
                if (finishPreview) return finishPreview;
            }

            if (wallKey && shape === 'flat') {
                var flatPreview = getFlatRoofWallPreviewPath(floors, wallKey);
                if (flatPreview) return flatPreview;
            }

            if (wallKey && shape) {
                var compositePreview = getCompositePreviewPath(
                    floors,
                    wallKey,
                    shape,
                    roofKey
                );
                if (compositePreview) return compositePreview;
            }

            if (wallKey) {
                var wallPreview = getWallPreviewPath(floors, wallKey);
                if (wallPreview) return wallPreview;
            }

            var foundation = foundationEl && foundationEl.value;
            if (foundation === 'strip' || foundation === 'pile') {
                return IMG_CALC_FOUNDATION_STRIP;
            }
            if (foundation === 'slab') return IMG_CALC_FOUNDATION_SLAB;

            return IMG_CALC_EMPTY;
        }

        function renderPrice() {
            const area = parseAreaValue();
            const isTwoFloors = floorsEl.value === '2';
            const bodyArea = isTwoFloors ? (area / 2) * 1.7 : area;
            const projectAdd = bodyArea * getPerSqm(projectTypeEl);
            const foundationAdd = bodyArea * getPerSqm(foundationEl);
            const wallsAdd = bodyArea * getPrice(wallsEl);
            const roofAdd = isRoofMaterialLocked() ? 0 : area * getPerSqm(roofEl);
            const roofShapeAdd = area * getPerSqm(roofShapeEl);
            const roofBase = roofAdd + roofShapeAdd;
            const roofTotal =
                terraceEl && terraceEl.value === 'yes' ? roofBase * 1.2 : roofBase;
            const exteriorFinishAdd = bodyArea * getPerSqm(exteriorFinishEl);
            const packageAdd = bodyArea * getPerSqm(packageEl);
            const basementAdd =
                basementEl && basementEl.value === 'yes'
                    ? bodyArea * getPerSqm(basementEl)
                    : 0;

            var total =
                projectAdd +
                foundationAdd +
                wallsAdd +
                roofTotal +
                exteriorFinishAdd +
                packageAdd +
                basementAdd;
            if (mansardEl && mansardEl.value === 'yes' && isMansardAvailable()) {
                total *= 1.3;
            }
            var perSqmHtml =
                area > 0 && isFinite(total)
                    ? '<span class="result-per-m2"> · ' + formatBYNPerSqm(total / area) + '</span>'
                    : '<span class="result-per-m2"> · — BYN/м²</span>';
            resultEl.innerHTML = renderResultHtml(formatBYN(total), perSqmHtml);
            markPriceCalculated();
            playUpdateAnimations();
        }

        function updateCalculator() {
            syncRoofMaterialState();
            syncMansardState();
            if (
                priceCalculated &&
                lastCalculatedSnapshot &&
                !snapshotsEqual(captureFieldSnapshot(), lastCalculatedSnapshot)
            ) {
                invalidateCalculatedPrice();
            }
            syncAreaProgressField();
            syncCalcSelectEmptyState();
            syncAreaInputEmptyState();
            const area = parseAreaValue();
            const floorsCount =
                floorsEl.value === ''
                    ? 1
                    : Math.min(2, Math.max(1, Number(floorsEl.value) || 1));
            updatePreview(
                floorsCount,
                wallsEl.value,
                roofShapeEl.value,
                roofEl.value
            );
            if (!priceCalculated) {
                setResultPlaceholder();
            }
            calculatePassCount += 1;
            if (calculatePassCount > 1) {
                playPreviewAnimations();
            }
            scheduleFitCalculatorViewport();
        }

        function onCalculateClick() {
            if (!areAllFieldsValid()) {
                priceCalculated = false;
                lastCalculatedSnapshot = null;
                setResultPlaceholder();
                syncCalcBtnPrompt();
                highlightInvalidFields();
                var firstError = root.querySelector('.field.field--error');
                if (firstError && typeof firstError.scrollIntoView === 'function') {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
                scheduleFitCalculatorViewport();
                return;
            }
            clearFieldErrors();
            renderPrice();
            scheduleFitCalculatorViewport();
        }

        function colorByWalls(walls) {
            const w = String(walls ?? '').trim();
            if (w === 'keramzit') return { wall: '#cec4b3', stroke: '#8f8778' };
            if (w === 'gas') return { wall: '#d2d8e2', stroke: '#8f98a8' };
            if (w === 'brick') return { wall: '#bf8571', stroke: '#8f5e4f' };
            if (w === 'monolith') return { wall: '#b8bec5', stroke: '#69707d' };
            return { wall: '#c7ccd2', stroke: '#808a96' };
        }

        function colorByRoof(roof) {
            if (roof === 'tile') return '#7c4b44';
            if (roof === 'soft') return '#4f5666';
            return '#6d7178';
        }

        function buildHouseSvg(area, floors, walls, roofMaterial, roofShape, mansard) {
            const wall = colorByWalls(walls);
            const roofColor = colorByRoof(roofMaterial);
            const bodyHeight = floors === 1 ? 165 : floors === 2 ? 210 : 240;
            const bodyY = 290 - bodyHeight;
            const windows = floors === 1 ? 3 : floors === 2 ? 6 : 9;
            const sizeCoef = Math.max(0.82, Math.min(1.18, area / 120));
            const houseWidth = Math.round(250 * sizeCoef);
            const houseX = Math.round((500 - houseWidth) / 2);
            const hx = houseX + houseWidth;

            let windowsSvg = '';
            const rows = floors;
            const cols = Math.ceil(windows / rows);
            let count = 0;

            for (let row = 0; row < rows; row += 1) {
                for (let col = 0; col < cols; col += 1) {
                    if (count >= windows) break;
                    const w = Math.max(18, Math.floor(houseWidth / 9));
                    const x =
                        houseX +
                        24 +
                        col * Math.floor((houseWidth - 54) / Math.max(1, cols - 1));
                    const y =
                        bodyY +
                        24 +
                        row * Math.floor((bodyHeight - 60) / Math.max(1, rows - 1));
                    windowsSvg +=
                        '<rect x="' +
                        x +
                        '" y="' +
                        y +
                        '" width="' +
                        w +
                        '" height="20" rx="3" fill="#89b4ff" opacity="0.9" />';
                    count += 1;
                }
            }

            let roofSvg = '';
            if (roofShape === 'flat') {
                roofSvg =
                    '<rect x="' +
                    houseX +
                    '" y="' +
                    (bodyY - 15) +
                    '" width="' +
                    houseWidth +
                    '" height="15" rx="2" fill="' +
                    roofColor +
                    '"/>';
            } else if (roofShape === 'shed') {
                roofSvg =
                    '<polygon points="' +
                    houseX +
                    ',' +
                    bodyY +
                    ' ' +
                    hx +
                    ',' +
                    bodyY +
                    ' ' +
                    hx +
                    ',' +
                    (bodyY - 58) +
                    ' ' +
                    (houseX - 8) +
                    ',' +
                    (bodyY - 20) +
                    '" fill="' +
                    roofColor +
                    '"/>';
            } else if (roofShape === 'hip') {
                const peakY = bodyY - 66;
                const inset = houseWidth * 0.14;
                roofSvg =
                    '<polygon points="' +
                    (houseX - 12) +
                    ',' +
                    bodyY +
                    ' ' +
                    (houseX + inset) +
                    ',' +
                    (bodyY - 26) +
                    ' 250,' +
                    peakY +
                    ' ' +
                    (hx - inset) +
                    ',' +
                    (bodyY - 26) +
                    ' ' +
                    (hx + 12) +
                    ',' +
                    bodyY +
                    '" fill="' +
                    roofColor +
                    '"/>';
            } else {
                roofSvg =
                    '<polygon points="' +
                    (houseX - 16) +
                    ',' +
                    bodyY +
                    ' 250,' +
                    (bodyY - 76) +
                    ' ' +
                    (hx + 16) +
                    ',' +
                    bodyY +
                    '" fill="' +
                    roofColor +
                    '"/>';
            }

            if (mansard === 'yes' && roofShape === 'gable') {
                roofSvg +=
                    '<polygon points="' +
                    (houseX + 8) +
                    ',' +
                    bodyY +
                    ' ' +
                    (hx - 8) +
                    ',' +
                    bodyY +
                    ' ' +
                    (hx - 22) +
                    ',' +
                    (bodyY - 34) +
                    ' ' +
                    (houseX + 22) +
                    ',' +
                    (bodyY - 34) +
                    '" fill="' +
                    roofColor +
                    '" opacity="0.88"/>' +
                    '<line x1="' +
                    (houseX + 6) +
                    '" y1="' +
                    (bodyY - 3) +
                    '" x2="' +
                    (hx - 6) +
                    '" y2="' +
                    (bodyY - 3) +
                    '" stroke="rgba(0,0,0,0.18)" stroke-width="1.5"/>';
            }

            let dormerSvg = '';
            if (mansard === 'yes' && roofShape === 'gable' && floors >= 2) {
                const upperRow = Math.max(0, rows - 1);
                const rowY =
                    bodyY +
                    24 +
                    upperRow *
                        Math.floor((bodyHeight - 60) / Math.max(1, rows - 1));
                const cx = houseX + Math.floor(houseWidth / 2);
                dormerSvg =
                    '<rect x="' +
                    (cx - 30) +
                    '" y="' +
                    (rowY - 6) +
                    '" width="60" height="34" rx="3" fill="' +
                    wall.wall +
                    '" stroke="' +
                    wall.stroke +
                    '" stroke-width="2"/>' +
                    '<polygon points="' +
                    (cx - 34) +
                    ',' +
                    (rowY - 6) +
                    ' ' +
                    cx +
                    ',' +
                    (rowY - 22) +
                    ' ' +
                    (cx + 34) +
                    ',' +
                    (rowY - 6) +
                    '" fill="' +
                    roofColor +
                    '"/>' +
                    '<rect x="' +
                    (cx - 16) +
                    '" y="' +
                    (rowY + 2) +
                    '" width="14" height="18" rx="2" fill="#89b4ff" opacity="0.95"/>' +
                    '<rect x="' +
                    (cx + 2) +
                    '" y="' +
                    (rowY + 2) +
                    '" width="14" height="18" rx="2" fill="#89b4ff" opacity="0.95"/>';
            }

            const svg =
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 320">' +
                '<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">' +
                '<stop offset="0%" stop-color="#9ec5ff"/>' +
                '<stop offset="100%" stop-color="#dfeeff"/></linearGradient></defs>' +
                '<rect x="0" y="0" width="500" height="320" fill="url(#sky)"/>' +
                '<rect x="0" y="290" width="500" height="30" fill="#709a67"/>' +
                '<rect x="' +
                houseX +
                '" y="' +
                bodyY +
                '" width="' +
                houseWidth +
                '" height="' +
                bodyHeight +
                '" rx="6" fill="' +
                wall.wall +
                '" stroke="' +
                wall.stroke +
                '" stroke-width="3"/>' +
                windowsSvg +
                roofSvg +
                dormerSvg +
                '<rect x="228" y="' +
                (bodyY + bodyHeight - 56) +
                '" width="44" height="56" rx="4" fill="#6b4f3f"/>' +
                '<circle cx="263" cy="' +
                (bodyY + bodyHeight - 28) +
                '" r="3" fill="#f2dfb0"/>' +
                '</svg>';
            return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
        }

        function updatePreview(floors, walls, roofShape, roofMaterial) {
            setHousePreviewSrc(
                resolvePreviewSrc(floors, walls, roofShape, roofMaterial)
            );
        }

        function resetForm() {
            clearFieldErrors();
            priceCalculated = false;
            lastCalculatedSnapshot = null;
            updateProgressBar();
            projectTypeEl.value = '';
            areaEl.value = '0';
            calculatePassCount = 0;
            roofValueBeforeFlat = '';
            mansardValueBeforeGable = '';
            floorsEl.value = '';
            foundationEl.value = '';
            wallsEl.value = '';
            roofEl.value = '';
            roofShapeEl.value = '';
            mansardEl.value = '';
            basementEl.value = '';
            terraceEl.value = '';
            exteriorFinishEl.value = '';
            packageEl.value = '';
            setResultPlaceholder();
            updateCalculator();
        }

        calcBtn.addEventListener('click', onCalculateClick);
        resetBtn.addEventListener('click', resetForm);
        areaEl.addEventListener('focus', function () {
            var t = String(areaEl.value).trim().replace(',', '.');
            if (t === '') return;
            var n = parseFloat(t);
            if (!isNaN(n) && n === 0) {
                areaEl.value = '';
                invalidateCalculatedPrice();
                updateCalculator();
            }
        });
        areaEl.addEventListener('blur', function () {
            if (String(areaEl.value).trim() === '') {
                areaEl.value = '0';
                invalidateCalculatedPrice();
                updateCalculator();
            }
        });
        function onFieldChange() {
            invalidateCalculatedPrice();
            updateCalculator();
        }
        areaEl.addEventListener('input', onFieldChange);
        areaEl.addEventListener('change', onFieldChange);
        projectTypeEl.addEventListener('change', onFieldChange);
        floorsEl.addEventListener('change', onFieldChange);
        foundationEl.addEventListener('change', onFieldChange);
        wallsEl.addEventListener('change', onFieldChange);
        roofEl.addEventListener('change', onFieldChange);
        roofShapeEl.addEventListener('change', onFieldChange);
        mansardEl.addEventListener('change', onFieldChange);
        basementEl.addEventListener('change', onFieldChange);
        terraceEl.addEventListener('change', onFieldChange);
        exteriorFinishEl.addEventListener('change', onFieldChange);
        packageEl.addEventListener('change', onFieldChange);
        setResultPlaceholder();
        updateCalculator();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHouseCalculator);
    } else {
        initHouseCalculator();
    }
})();