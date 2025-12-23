// ============================================
// LAZY LOADING YANDEX MAPS
// ============================================
function loadYandexMaps() {
    if (document.querySelector('#yandex-map') && typeof ymaps === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://api-maps.yandex.ru/2.1/?apikey=12fcf8e0-ecaa-4a73-aefd-d28ec0384927&lang=ru_RU';
        script.async = true;
        document.body.appendChild(script);
    }
}

// Загружаем карты когда пользователь приближается к секции
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadYandexMaps();
                observer.disconnect();
            }
        });
    }, { rootMargin: '300px' });
    
    const mapSection = document.getElementById('yandex-map');
    if (mapSection) {
        observer.observe(mapSection);
    }
} else {
    // Fallback для старых браузеров
    loadYandexMaps();
}

// ============================================
// AOS INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }
});

// ============================================
// COUNTER ANIMATION
// ============================================
// Хранилище активных таймеров для каждого счетчика
const counterTimers = new Map();

function animateCounter(element, target, duration = 2000) {
    // Если для этого элемента уже есть активный таймер, останавливаем его
    if (counterTimers.has(element)) {
        clearInterval(counterTimers.get(element));
    }
    
    // Получаем текущее значение из элемента или начинаем с 0
    const currentText = element.textContent.trim();
    const start = parseInt(currentText) || 0;
    
    // Если уже достигли цели, не запускаем анимацию
    if (start >= target) {
        element.textContent = Math.floor(target);
        return;
    }
    
    const increment = (target - start) / (duration / 16); // 60 FPS
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.floor(target);
            clearInterval(timer);
            counterTimers.delete(element);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
    
    // Сохраняем таймер для этого элемента
    counterTimers.set(element, timer);
}

// Запуск анимации счетчиков при появлении секции в видимой области
let countersInitialized = false; // Флаг для предотвращения повторной инициализации

document.addEventListener('DOMContentLoaded', function () {
    const counters = document.querySelectorAll('.counter');
    const heroSection = document.querySelector('.hero');
    
    if (counters.length === 0 || countersInitialized) {
        return;
    }
    
    // Проверяем, запущена ли уже анимация для каждого счетчика
    const animatedCounters = new Set();
    
    // Функция для запуска анимации счетчика
    function startCounterAnimation(counter) {
        // Проверяем, не запущена ли уже анимация
        if (animatedCounters.has(counter)) {
            return; // Анимация уже запущена
        }
        
        // Проверяем, не достиг ли счетчик уже целевого значения
        const target = parseInt(counter.getAttribute('data-target'));
        const currentValue = parseInt(counter.textContent.trim()) || 0;
        
        if (!isNaN(target) && currentValue < target) {
            animatedCounters.add(counter);
            animateCounter(counter, target);
        } else if (!isNaN(target) && currentValue >= target) {
            // Если уже достигли цели, просто устанавливаем финальное значение
            counter.textContent = Math.floor(target);
            animatedCounters.add(counter);
        }
    }
    
    // Функция для проверки видимости элемента
    function isElementVisible(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top < windowHeight && rect.bottom > 0;
    }
    
    // Функция для запуска анимации всех счетчиков (вызывается только один раз)
    function startAllCounters() {
        if (countersInitialized) {
            return; // Уже инициализировано
        }
        
        countersInitialized = true;
        
        setTimeout(() => {
            counters.forEach(counter => {
                startCounterAnimation(counter);
            });
        }, 300);
    }
    
    // Проверяем, видна ли секция при загрузке
    if (heroSection && isElementVisible(heroSection)) {
        // Секция уже видна, запускаем анимацию сразу
        startAllCounters();
    } else if ('IntersectionObserver' in window && heroSection) {
        // Используем IntersectionObserver для запуска анимации при появлении секции
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersInitialized) {
                    startAllCounters();
                    observer.disconnect(); // Отключаем observer после первого запуска
                }
            });
        }, {
            threshold: 0.1 // Запускаем когда 10% секции видно
        });
        
        observer.observe(heroSection);
    } else {
        // Fallback: запускаем анимацию при загрузке страницы
        startAllCounters();
    }
});

// ============================================
// TEAM CARDS SCROLL RESET
// ============================================
(function() {
    function resetScroll() {
        const cards = document.querySelectorAll('.team-cards');
        cards.forEach(function(card) {
            if (card) {
                card.style.scrollBehavior = 'auto';
                card.scrollLeft = 0;
            }
        });
    }
    
    // Вызываем сразу, если элементы уже есть
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resetScroll);
    } else {
        resetScroll();
    }
    
    // Также вызываем при полной загрузке
    window.addEventListener('load', resetScroll);
})();

document.addEventListener('DOMContentLoaded', function () {
    // Функция для принудительного сброса скролла
    function forceResetScroll(element) {
        if (!element) return;
        element.style.scrollBehavior = 'auto';
        element.style.setProperty('scroll-behavior', 'auto', 'important');
        element.style.justifyContent = 'flex-start';
        element.scrollLeft = 0;
        element.scrollTo(0, 0);
        // Принудительно проверяем и устанавливаем
        if (element.scrollLeft !== 0) {
            element.scrollLeft = 0;
        }
    }
    
    // Сразу устанавливаем scrollLeft = 0 для всех карточек команды при загрузке
    const allTeamCardsContainers = document.querySelectorAll('.team-cards');
    allTeamCardsContainers.forEach(function(cards) {
        forceResetScroll(cards);
        cards.style.justifyContent = 'flex-start';
    });
    
    // Переключение табов команды
    const teamTabs = document.querySelectorAll('.team-tab');
    
    teamTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Убираем active у всех табов
            teamTabs.forEach(t => t.classList.remove('active'));
            
            // Добавляем active текущему табу
            tab.classList.add('active');
            
            // Скрываем все карточки и сбрасываем их скролл
            const allCards = document.querySelectorAll('.team-cards');
            allCards.forEach(cards => {
                cards.classList.remove('active');
                forceResetScroll(cards);
            });
            
            // Показываем нужные карточки
            const teamId = tab.getAttribute('data-team');
            const targetCards = document.getElementById(teamId);
            
            if (targetCards) {
                // Сначала устанавливаем scrollLeft = 0 ДО добавления класса active
                forceResetScroll(targetCards);
                
                // Добавляем класс active
                targetCards.classList.add('active');
                
                // Множественные проверки для надежности
                forceResetScroll(targetCards);
                
                setTimeout(() => {
                    forceResetScroll(targetCards);
                }, 0);
                
                setTimeout(() => {
                    forceResetScroll(targetCards);
                }, 10);
                
                requestAnimationFrame(() => {
                    forceResetScroll(targetCards);
                    requestAnimationFrame(() => {
                        forceResetScroll(targetCards);
                    });
                });
            }
        });
    });
    
    // Функция для сброса скролла карточек команды
    function resetTeamCardsScroll() {
        const activeCards = document.querySelector('.team-cards.active');
        if (activeCards) {
            activeCards.style.scrollBehavior = 'auto';
            activeCards.scrollLeft = 0;
            activeCards.scrollTo(0, 0);
        }
    }
    
    // Используем MutationObserver для отслеживания изменений класса active
    const teamCardsObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('active') && target.classList.contains('team-cards')) {
                    target.style.scrollBehavior = 'auto';
                    target.style.setProperty('scroll-behavior', 'auto', 'important');
                    target.scrollLeft = 0;
                    target.scrollTo(0, 0);
                    target.setAttribute('data-scroll-reset', 'true');
                }
            }
        });
    });
    
    // Наблюдаем за всеми контейнерами карточек команды
    const allTeamCards = document.querySelectorAll('.team-cards');
    allTeamCards.forEach(function(cards) {
        cards.style.scrollBehavior = 'auto';
        teamCardsObserver.observe(cards, {
            attributes: true,
            attributeFilter: ['class']
        });
    });
    
    // Предотвращаем восстановление позиции скролла браузером
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    // Инициализация: прокручиваем активные карточки к началу при загрузке страницы
    resetTeamCardsScroll();
    setTimeout(resetTeamCardsScroll, 50);
    requestAnimationFrame(() => {
        resetTeamCardsScroll();
        requestAnimationFrame(() => {
            resetTeamCardsScroll();
        });
    });
    setTimeout(resetTeamCardsScroll, 200);
    setTimeout(resetTeamCardsScroll, 500);
    setTimeout(resetTeamCardsScroll, 1000);
    
    window.addEventListener('load', function() {
        resetTeamCardsScroll();
        setTimeout(resetTeamCardsScroll, 100);
    });
    
    window.addEventListener('resize', function() {
        resetTeamCardsScroll();
    });
    
    // Постоянный мониторинг и сброс scrollLeft для активных карточек
    let scrollResetInterval = setInterval(function() {
        const activeCards = document.querySelector('.team-cards.active');
        if (activeCards && activeCards.scrollLeft !== 0) {
            activeCards.style.scrollBehavior = 'auto';
            activeCards.style.justifyContent = 'flex-start';
            activeCards.scrollLeft = 0;
        }
    }, 100);
    
    // Останавливаем интервал через 3 секунды после загрузки
    setTimeout(function() {
        clearInterval(scrollResetInterval);
    }, 3000);

    // ============================================
    // WORKFLOW STEPS
    // ============================================
    const workflowTabs = document.querySelectorAll('.workflow-tab');
    const workflowSlides = document.querySelectorAll('.workflow-slide');
    let currentStep = 1;
    const totalSteps = 10;

    function updateWorkflowStep(step) {
        currentStep = step;
        
        // Убираем active у всех кнопок и слайдов
        workflowTabs.forEach(t => t.classList.remove('active'));
        workflowSlides.forEach(s => s.classList.remove('active'));
        
        // Добавляем active к нужным элементам
        const tab = document.querySelector(`.workflow-tab[data-step="${step}"]`);
        const slide = document.querySelector(`.workflow-slide[data-step="${step}"]`);
        if (tab) tab.classList.add('active');
        if (slide) slide.classList.add('active');
        
        // Управляем видимостью стрелок
        const prevArrow = document.querySelector('.workflow-arrow-prev');
        const nextArrow = document.querySelector('.workflow-arrow-next');
        
        if (prevArrow) {
            if (currentStep === 1) {
                prevArrow.classList.add('hidden');
            } else {
                prevArrow.classList.remove('hidden');
            }
        }
        
        if (nextArrow) {
            if (currentStep === totalSteps) {
                nextArrow.classList.add('hidden');
            } else {
                nextArrow.classList.remove('hidden');
            }
        }
    }

    workflowTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const step = parseInt(this.getAttribute('data-step'));
            updateWorkflowStep(step);
        });
    });

    // Функция для переключения стрелками
    window.changeWorkflowStep = function(direction) {
        let newStep = currentStep + direction;
        if (newStep >= 1 && newStep <= totalSteps) {
            updateWorkflowStep(newStep);
        }
    };
    
    // Инициализация
    updateWorkflowStep(1);

    // ============================================
    // YANDEX MAPS INITIALIZATION
    // ============================================
    var globalMap;
    var mapInitialized = false;
    
    function initYandexMap() {
        if (mapInitialized || typeof ymaps === 'undefined') return;
        mapInitialized = true;
        ymaps.ready(init);
    }
    
    // Intersection Observer для lazy loading карты
    if ('IntersectionObserver' in window) {
        const mapObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && typeof ymaps !== 'undefined') {
                    initYandexMap();
                    mapObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '200px' });
        
        const mapSection = document.getElementById('yandex-map');
        if (mapSection) {
            mapObserver.observe(mapSection);
        }
        
        // Также проверяем когда загрузится скрипт карт
        const checkYmaps = setInterval(() => {
            if (typeof ymaps !== 'undefined' && !mapInitialized) {
                const mapSection = document.getElementById('yandex-map');
                if (mapSection && mapSection.getBoundingClientRect().top < window.innerHeight + 200) {
                    initYandexMap();
                    clearInterval(checkYmaps);
                }
            }
        }, 100);
    } else {
        // Fallback для старых браузеров
        if (typeof ymaps !== 'undefined') {
            ymaps.ready(init);
        }
    }
    
    // Глобальная функция для закрытия балуна карты
    window.closeMapBalloon = function() {
        if (globalMap) {
            globalMap.balloon.close();
        }
    };
    
    function init() {
        // Создаем карту с центром на Беларуси
        globalMap = new ymaps.Map("map", {
            center: [53.7098, 27.9534],
            zoom: 7,
            controls: ['zoomControl']
        });
        
        var myMap = globalMap;
        
        // Закрываем балун при клике по карте
        globalMap.events.add('click', function (e) {
            if (globalMap.balloon.isOpen()) {
                globalMap.balloon.close();
            }
        });

        // Удаляем ненужные элементы управления
        myMap.controls.remove('geolocationControl');
        myMap.controls.remove('searchControl');
        myMap.controls.remove('trafficControl');
        myMap.controls.remove('typeSelector');
        myMap.controls.remove('fullscreenControl');
        myMap.controls.remove('rulerControl');

        // Массив объектов для отображения на карте
        var objects = [
            {
                coords: [53.864331, 27.535735],
                title: "Ресторан Ettal",
                description: "Ремонт ресторана",
                address: "г. Минск, ул. Белградская, 14",
                photos: ['main_img/mapFoto/ettal.webp']
            },
            {
                coords: [53.470762, 25.417660],
                title: "Производственное здание",
                description: "Строительство административного здания",
                address: "г. Дятлово, ул. Новогрудская, 6",
                photos: ['main_img/mapFoto/novogrydskaya.webp']
            },
            {
                coords: [53.476572, 25.416394],
                title: "Производственное здание",
                description: "Строительство производственного здания",
                address: "г. Дятлово, ул. Советская, 106б",
                photos: ['main_img/mapFoto/sovetskaya.webp']
            },
            {
                coords: [53.898496, 27.584738],
                title: "Модернизация крыши",
                description: "Модернизация крыши",
                address: "г. Минск, ул. Соломенная, 13",
                photos: ['main_img/mapFoto/solomennaya.webp']
            },
            {
                coords: [54.719328, 25.745758],
                title: "Реконструкция ГИС",
                description: "Реконструкция ГИС",
                address: "д. Котловка",
                photos: ['main_img/mapFoto/kotlovka.webp']
            },
            {
                coords: [53.814017, 27.686167],
                title: "Модернизация производственного сооружения",
                description: "Модернизация производственного сооружения",
                address: "г. Минск, ул. Селицкого, 17а",
                photos: ['main_img/mapFoto/selickogo.webp']
            },
            {
                coords: [53.799863, 27.289570],
                title: "Загородный дом",
                description: "Строительство загородного дома",
                address: "д. Чики",
                photos: [
                    'main_img/projects/Classic_2/project1.webp',
                    'main_img/projects/Classic_2/project2.webp',
                    'main_img/projects/Classic_2/project3.webp',
                    'main_img/projects/Classic_2/project4.webp',
                    'main_img/projects/Classic_2/project5.webp'
                ]
            },
            {
                coords: [53.839702, 27.542311],
                title: "Производственное здание",
                description: "Строительство производственного здания",
                address: "г. Минск, ул. Асаналиева, 84к2",
                photos: ['main_img/mapFoto/asanalieva.webp']
            },
            {
                coords: [53.887979, 27.608202],
                title: "Ремонт квартиры",
                description: "Ремонт квартиры",
                address: "г. Минск, Стахановская ул., 17"
            }
        ];

        // Создаем метки для каждого объекта
        objects.forEach(function (obj) {
            var photosHTML = '';
            if (obj.photos && obj.photos.length > 0) {
                photosHTML = '<div style="display: flex; gap: 8px; overflow-x: auto; padding: 10px 0; margin-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.1);">';
                obj.photos.forEach(function(photo) {
                    photosHTML += `
                        <div style="flex-shrink: 0; width: 180px; height: 140px; border-radius: 8px; overflow: hidden; border: 2px solid rgba(212, 175, 55, 0.3);">
                            <img src="${photo}" alt="${obj.title}" style="width: 100%; height: 100%; object-fit: cover;">
                        </div>
                    `;
                });
                photosHTML += '</div>';
            }
            
            var balloonContent = `
                <div style="background: linear-gradient(135deg, #1a1d25 0%, #2c2f38 100%); border-radius: 15px; overflow: hidden; min-width: 280px; max-width: 350px; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);">
                    <div style="background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.05) 100%); padding: 15px 50px 15px 20px; border-bottom: 1px solid rgba(212, 175, 55, 0.2); position: relative;">
                        <h3 style="margin: 0; font-size: 1.1rem; font-weight: 700; color: #D4AF37; text-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);">${obj.title}</h3>
                        <button onclick="closeMapBalloon()" style="position: absolute; top: 50%; right: 15px; transform: translateY(-50%); background: transparent; border: none; color: #D4AF37; font-size: 1.3rem; cursor: pointer; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; border-radius: 50%;">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div style="padding: 15px 20px;">
                        <div style="color: rgba(255, 255, 255, 0.9); font-size: 0.95rem; font-weight: 500; margin-bottom: 8px;">${obj.description}</div>
                        <div style="color: rgba(255, 255, 255, 0.6); font-size: 0.85rem; display: flex; align-items: center; gap: 6px; margin-bottom: 12px;">
                            <i class="fas fa-map-marker-alt" style="color: #D4AF37; font-size: 0.9rem;"></i>
                            <span>${obj.address}</span>
                        </div>
                        ${photosHTML}
                    </div>
                </div>
            `;
            
            var placemark = new ymaps.Placemark(obj.coords, {
                balloonContent: balloonContent,
                hintContent: obj.title
            }, {
                iconLayout: 'default#image',
                iconImageHref: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjYiIHZpZXdCb3g9IjAgMCAyMCAyNiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTAsMSBDNS41LDEgMiw0LjUgMiw5IEMyLDE0IDEwLDI1IDEwLDI1IFMxOCwxNCAxOCw5IEMxOCw0LjUgMTQuNSwxIDEwLDEgWiIgZmlsbD0iI0Q0QUYzNyIgc3Ryb2tlPSIjMWExZDI5IiBzdHJva2Utd2lkdGg9IjEiLz48Y2lyY2xlIGN4PSIxMCIgY3k9IjgiIHI9IjMiIGZpbGw9IiMxYTFkMjkiLz48L3N2Zz4=',
                iconImageSize: [20, 26],
                iconImageOffset: [-10, -26]
            });

            myMap.geoObjects.add(placemark);
        });
    }

    // Изменение стиля хедера при скролле
    let ticking = false;
    
    function updateHeader() {
        const header = document.getElementById('mainHeader');
        const scrollY = window.scrollY || window.pageYOffset;
        
        if (!header) return;
        
        const scrollThreshold = window.innerHeight * 0.5;
        
        if (scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        ticking = false;
    }
    
    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });
    
    updateHeader();
});

// ============================================
// PROJECT MODAL FUNCTIONS
// ============================================
function openProjectModal(type) {
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    const projectData = {
        'classic': {
            title: 'Классический коттедж',
            images: [
                'main_img/projects/Classic/classic1.webp',
                'main_img/projects/Classic/classic2.webp',
                'main_img/projects/Classic/classic3.webp',
                'main_img/projects/Classic/classic_plan.webp'
            ]
        },
        'chalet': {
            title: 'Альпийское шале',
            images: [
                'main_img/projects/Shale_black/shale_black.webp',
                'main_img/projects/Shale_black/shale_black_1.webp',
                'main_img/projects/Shale_black/shale_black_plan1.webp',
                'main_img/projects/Shale_black/shale_black_plan2.webp'
            ]
        },
        'barnhouse': {
            title: 'Современный барнхаус',
            images: [
                'main_img/projects/Barn/barn.webp',
                'main_img/projects/Barn/barn1.webp',
                'main_img/projects/Barn/barn2.webp',
                'main_img/projects/Barn/barn3.webp',
                'main_img/projects/Barn/barn_plan1.webp',
                'main_img/projects/Barn/barn_plan2.webp'
            ]
        },
        'minimalism': {
            title: 'Классический со вторым светом',
            images: [
                'main_img/projects/Classic_2/project1.webp',
                'main_img/projects/Classic_2/project2.webp',
                'main_img/projects/Classic_2/project3.webp',
                'main_img/projects/Classic_2/project4.webp',
                'main_img/projects/Classic_2/project5.webp'
            ]
        },
        'shale_white': {
            title: 'Шале White',
            images: [
                'main_img/projects/Shale_white/shale_white.webp',
                'main_img/projects/Shale_white/shale_white1.webp',
                'main_img/projects/Shale_white/shale_white_plan.webp',
                'main_img/projects/Shale_white/shale_white_plan2.webp'
            ]
        }
    };
    
    if (projectData[type]) {
        const header = document.querySelector('.modal-header h3');
        if (header) header.textContent = projectData[type].title;
        
        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) {
            sliderContainer.innerHTML = '';
            
            projectData[type].images.forEach((imageSrc, index) => {
                const img = document.createElement('img');
                img.src = imageSrc;
                img.alt = `Фото ${index + 1}`;
                img.onclick = function() { openImageFullscreen(this); };
                img.style.cursor = 'zoom-in';
                sliderContainer.appendChild(img);
            });
            
            sliderContainer.scrollLeft = 0;
            
            setTimeout(function() {
                initSliderNavigation();
            }, 50);
        }
    }
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Переключение между табами
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.modal-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.modal-slider').forEach(slider => {
                slider.classList.remove('active');
            });
            
            const tabName = tab.getAttribute('data-tab');
            const targetSlider = document.querySelector(`.modal-slider[data-tab-content="${tabName}"]`);
            if (targetSlider) targetSlider.classList.add('active');
        });
    });
});

// Функция для инициализации навигации слайдера
function initSliderNavigation() {
    document.querySelectorAll('.slider-prev').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const slider = this.closest('.modal-slider');
            if (!slider) return;
            
            const container = slider.querySelector('.slider-container');
            if (container) {
                const scrollAmount = container.offsetWidth;
                container.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            }
        });
    });

    document.querySelectorAll('.slider-next').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const slider = this.closest('.modal-slider');
            if (!slider) return;
            
            const container = slider.querySelector('.slider-container');
            if (container) {
                const scrollAmount = container.offsetWidth;
                container.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Инициализируем навигацию при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initSliderNavigation();
    
    const originalOpenProjectModal = window.openProjectModal;
    if (originalOpenProjectModal) {
        window.openProjectModal = function(type) {
            originalOpenProjectModal(type);
            setTimeout(function() {
                initSliderNavigation();
            }, 100);
        };
    }
});

// Закрытие по ESC
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeProjectModal();
    }
});

// ============================================
// CONTACT SIDEBAR FUNCTIONS
// ============================================
function openContactSidebar() {
    const heroSidebar = document.getElementById('heroSidebar');
    if (heroSidebar) {
        heroSidebar.classList.add('active');
    }
}

function closeContactSidebar() {
    const heroSidebar = document.getElementById('heroSidebar');
    if (heroSidebar) {
        heroSidebar.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Делаем функции глобальными
window.openContactSidebar = openContactSidebar;
window.closeContactSidebar = closeContactSidebar;

// ============================================
// MOBILE MENU & SIDEBAR
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpening = !mobileMenu.classList.contains('active');
            
            const heroSidebar = document.getElementById('heroSidebar');
            if (heroSidebar && heroSidebar.classList.contains('active')) {
                heroSidebar.classList.remove('active');
            }
            
            mobileMenuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = isOpening ? 'hidden' : 'auto';
        });
        
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        document.addEventListener('click', function(e) {
            if (e.target.closest('.nav-menu a') || e.target.closest('.nav a')) {
                return;
            }
            
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                e.target !== mobileMenuToggle && 
                !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    const contactToggleBtn = document.getElementById('contactToggleBtn');
    const heroSidebar = document.getElementById('heroSidebar');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const sidebarBackBtn = document.getElementById('sidebarBackBtn');

    document.querySelectorAll('.open-sidebar-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (heroSidebar) {
                heroSidebar.classList.add('active');
            }
        });
    });

    if (contactToggleBtn && heroSidebar) {
        contactToggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
            
            heroSidebar.classList.add('active');
        });

        if (sidebarCloseBtn) {
            sidebarCloseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (heroSidebar) {
                    heroSidebar.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }
        
        if (sidebarBackBtn) {
            sidebarBackBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if (heroSidebar) {
                    heroSidebar.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }

        document.addEventListener('click', function(e) {
            if (heroSidebar.classList.contains('active') && 
                !heroSidebar.contains(e.target) && 
                e.target !== contactToggleBtn && 
                !contactToggleBtn.contains(e.target)) {
                heroSidebar.classList.remove('active');
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && heroSidebar.classList.contains('active')) {
                heroSidebar.classList.remove('active');
            }
        });
    }
});

// ============================================
// IMAGE FULLSCREEN FUNCTIONS
// ============================================
function openImageFullscreen(img) {
    const fullscreen = document.getElementById('imageFullscreen');
    const fullscreenImage = document.getElementById('fullscreenImage');
    if (fullscreen && fullscreenImage) {
        fullscreenImage.src = img.src;
        fullscreenImage.alt = img.alt;
        fullscreen.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeImageFullscreen() {
    const fullscreen = document.getElementById('imageFullscreen');
    if (fullscreen) {
        fullscreen.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

window.openImageFullscreen = openImageFullscreen;
window.closeImageFullscreen = closeImageFullscreen;

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeImageFullscreen();
    }
});

// ============================================
// TESTIMONIALS SLIDER
// ============================================
let currentSlide = 0;
let testimonialSlides = [];
let totalSlides = 0;

function getSlidesPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
}

function initTestimonialsDots() {
    const dotsContainer = document.getElementById('testimonialsSliderDots');
    if (!dotsContainer) return;
    
    const slidesPerView = getSlidesPerView();
    const dotsCount = Math.ceil(totalSlides / slidesPerView);
    
    dotsContainer.innerHTML = '';
    for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i * slidesPerView));
        dotsContainer.appendChild(dot);
    }
}

function updateDots() {
    const dots = document.querySelectorAll('.slider-dot');
    const slidesPerView = getSlidesPerView();
    const activeDot = Math.floor(currentSlide / slidesPerView);
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeDot);
    });
}

function goToSlide(slideIndex) {
    const slidesPerView = getSlidesPerView();
    const maxSlide = totalSlides - slidesPerView;
    
    currentSlide = Math.max(0, Math.min(slideIndex, maxSlide));
    updateSliderPosition();
}

function updateSliderPosition() {
    const track = document.getElementById('testimonialsSliderTrack');
    if (!track) return;
    
    const slidesPerView = getSlidesPerView();
    const slideWidth = 100 / slidesPerView;
    const offset = -currentSlide * slideWidth;
    
    track.style.transform = `translateX(${offset}%)`;
    updateDots();
    updateArrows();
}

function updateArrows() {
    const prevBtn = document.querySelector('.testimonials-slider-prev');
    const nextBtn = document.querySelector('.testimonials-slider-next');
    const slidesPerView = getSlidesPerView();
    const maxSlide = totalSlides - slidesPerView;
    
    if (prevBtn) {
        prevBtn.style.display = currentSlide === 0 ? 'none' : 'flex';
    }
    
    if (nextBtn) {
        nextBtn.style.display = currentSlide >= maxSlide ? 'none' : 'flex';
    }
}

window.moveTestimonialSlider = function(direction) {
    const slidesPerView = getSlidesPerView();
    const newSlide = currentSlide + direction;
    const maxSlide = totalSlides - slidesPerView;
    
    if (newSlide >= 0 && newSlide <= maxSlide) {
        goToSlide(newSlide);
    }
};

document.addEventListener('DOMContentLoaded', function() {
    testimonialSlides = document.querySelectorAll('.testimonial-slide');
    totalSlides = testimonialSlides.length;
    
    if (totalSlides > 0) {
        initTestimonialsDots();
        updateSliderPosition();
    }
});

let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        initTestimonialsDots();
        goToSlide(0);
    }, 250);
});

let touchStartX = 0;
let touchEndX = 0;

const slider = document.querySelector('.testimonials-slider');
if (slider) {
    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            window.moveTestimonialSlider(1);
        } else {
            window.moveTestimonialSlider(-1);
        }
    }
}

// ============================================
// TESTIMONIAL DOCUMENTS MODAL
// ============================================
let currentTestimonialIndex = 1;
const testimonials = [
    { id: 1, image: 'main_img/testimonials/Asanalieva.webp', title: 'Благодарственное письмо', description: 'Строительство производственного здания • 2024 • г. Минск, ул. Асаналиева' },
    { id: 2, image: 'main_img/testimonials/Evrostore.webp', title: 'Отзыв от Evrostore', description: 'Строительство торгового объекта • 2024 • Беларусь' },
    { id: 3, image: 'main_img/testimonials/MetroProect.webp', title: 'Благодарность от MetroProect', description: 'Сотрудничество по проектированию • 2023 • г. Минск' },
    { id: 4, image: 'main_img/testimonials/Ynikom.webp', title: 'Отзыв от Ynikom', description: 'Строительство офисного здания • 2023 • Беларусь' },
    { id: 5, image: 'main_img/testimonials/4_solnca.webp', title: 'Отзыв от "4 Солнца"', description: 'Строительство объекта • Беларусь' },
    { id: 6, image: 'main_img/testimonials/Alexandrov.webp', title: 'Благодарственное письмо', description: 'Строительный проект • Беларусь' },
    { id: 7, image: 'main_img/testimonials/BMT.webp', title: 'Отзыв от БМТ', description: 'Строительство производственного объекта • Беларусь' },
    { id: 8, image: 'main_img/testimonials/Granyldrev.webp', title: 'Отзыв от Гранилдрев', description: 'Строительство и ремонт • Беларусь' },
    { id: 9, image: 'main_img/testimonials/Terushki.webp', title: 'Благодарственное письмо', description: 'Строительство загородного дома • Беларусь' },
    { id: 10, image: 'main_img/testimonials/Victory.webp', title: 'Отзыв от Victory', description: 'Строительный проект • Беларусь' },
    { id: 11, image: 'main_img/testimonials/Vodokanal.webp', title: 'Отзыв от Водоканал', description: 'Строительство инфраструктурных объектов • Беларусь' },
    { id: 12, image: 'main_img/testimonials/Zelenstroy.webp', title: 'Отзыв от Зеленстрой', description: 'Ландшафтные и строительные работы • Беларусь' }
];

window.openTestimonialDocument = function(index) {
    currentTestimonialIndex = index;
    const modal = document.getElementById('testimonialDocumentModal');
    const testimonial = testimonials.find(t => t.id === index);
    
    if (modal && testimonial) {
        const img = document.getElementById('testimonialDocumentImage');
        const title = document.getElementById('testimonialDocumentTitle');
        const desc = document.getElementById('testimonialDocumentDescription');
        
        if (img) img.src = testimonial.image;
        if (title) title.textContent = testimonial.title;
        if (desc) desc.textContent = testimonial.description;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        updateTestimonialNavigation();
    }
};

window.closeTestimonialDocument = function() {
    const modal = document.getElementById('testimonialDocumentModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

window.navigateTestimonial = function(direction) {
    currentTestimonialIndex += direction;
    
    if (currentTestimonialIndex > testimonials.length) {
        currentTestimonialIndex = 1;
    } else if (currentTestimonialIndex < 1) {
        currentTestimonialIndex = testimonials.length;
    }
    
    const testimonial = testimonials.find(t => t.id === currentTestimonialIndex);
    
    if (testimonial) {
        const img = document.getElementById('testimonialDocumentImage');
        const title = document.getElementById('testimonialDocumentTitle');
        const desc = document.getElementById('testimonialDocumentDescription');
        
        if (img) img.src = testimonial.image;
        if (title) title.textContent = testimonial.title;
        if (desc) desc.textContent = testimonial.description;
        
        updateTestimonialNavigation();
    }
};

function updateTestimonialNavigation() {
    const prevBtn = document.querySelector('.document-modal-prev');
    const nextBtn = document.querySelector('.document-modal-next');
    
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
}

document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('testimonialDocumentModal');
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
        window.closeTestimonialDocument();
    }
    if (modal && modal.style.display === 'flex') {
        if (e.key === 'ArrowLeft') {
            window.navigateTestimonial(-1);
        } else if (e.key === 'ArrowRight') {
            window.navigateTestimonial(1);
        }
    }
});

// ============================================
// TELEGRAM CALLBACK SYSTEM
// ============================================
let currentCallbackSource = '';

function openCallbackModal(source = 'Не указано') {
    currentCallbackSource = source;
    const modal = document.getElementById('callbackModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        const form = document.getElementById('callbackForm');
        const messageDiv = document.getElementById('callback-message');
        if (form) form.reset();
        if (messageDiv) {
            messageDiv.innerHTML = '';
            messageDiv.className = 'callback-message';
        }
    }
}

window.closeCallbackModal = function() {
    const modal = document.getElementById('callbackModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

function closeCallbackModal() {
    window.closeCallbackModal();
}

async function sendToTelegram(name, phone, source) {
    if (typeof TELEGRAM_CONFIG === 'undefined') {
        throw new Error('TELEGRAM_CONFIG не загружен');
    }
    
    const message = `🔔 <b>Новая заявка с сайта!</b>\n\n` +
                  `👤 <b>Имя:</b> ${name}\n` +
                  `📱 <b>Телефон:</b> ${phone}\n` +
                  `📍 <b>Источник:</b> ${source}\n` +
                  `🕐 <b>Время:</b> ${new Date().toLocaleString('ru-RU')}`;
    
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CONFIG.CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        })
    });
    
    return response.json();
}

document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.querySelector('.callback-modal-overlay');
    const modalContent = document.querySelector('.callback-modal-content');
    
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                window.closeCallbackModal();
            }
        });
    }
    
    if (modalContent) {
        modalContent.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCallbackModal();
        }
    });
    
    document.querySelectorAll('.contact-btn, .footer-btn, .open-sidebar-btn, [onclick*="openContactSidebar"]').forEach(btn => {
        if (btn.tagName === 'A' && btn.closest('.nav-menu')) {
            return;
        }
        
        btn.addEventListener('click', function(e) {
            if (this.classList.contains('excursion-btn') || this.getAttribute('data-source')) {
                return;
            }
            
            if (this.tagName === 'A' && this.closest('.nav-menu')) {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            let source = 'Главная страница';
            if (this.closest('.tour-section')) {
                source = 'Секция экскурсий';
            }
            
            openCallbackModal(source);
        });
    });
    
    document.querySelectorAll('.excursion-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const source = this.getAttribute('data-source') || 'Экскурсия по объектам';
            openCallbackModal(source);
        });
    });
    
    const callbackForm = document.getElementById('callbackForm');
    if (callbackForm) {
        callbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('callback-name').value.trim();
            const phone = document.getElementById('callback-phone').value.trim();
            const messageDiv = document.getElementById('callback-message');
            const submitBtn = this.querySelector('.callback-submit-btn');
            
            if (!name || !phone) {
                if (messageDiv) {
                    messageDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Пожалуйста, заполните все поля';
                    messageDiv.className = 'callback-message error';
                }
                return;
            }
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Отправка...</span>';
            }
            
            try {
                const result = await sendToTelegram(name, phone, currentCallbackSource);
                
                if (result.ok) {
                    if (messageDiv) {
                        messageDiv.innerHTML = '<i class="fas fa-check-circle"></i> Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.';
                        messageDiv.className = 'callback-message success';
                    }
                    
                    callbackForm.reset();
                    
                    setTimeout(() => {
                        closeCallbackModal();
                    }, 3000);
                } else {
                    throw new Error(result.description || 'Ошибка отправки');
                }
            } catch (error) {
                console.error('Ошибка отправки в Telegram:', error);
                if (messageDiv) {
                    messageDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Произошла ошибка. Пожалуйста, позвоните нам напрямую: +375 (29) 128-62-17';
                    messageDiv.className = 'callback-message error';
                }
            }
            
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Отправить заявку</span>';
            }
        });
    }
    
    const callbackPhone = document.getElementById('callback-phone');
    if (callbackPhone) {
        callbackPhone.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (!value.startsWith('375')) {
                    value = '375' + value;
                }
                
                let formatted = '+375';
                if (value.length > 3) {
                    formatted += ' (' + value.substring(3, 5);
                }
                if (value.length > 5) {
                    formatted += ') ' + value.substring(5, 8);
                }
                if (value.length > 8) {
                    formatted += '-' + value.substring(8, 10);
                }
                if (value.length > 10) {
                    formatted += '-' + value.substring(10, 12);
                }
                
                e.target.value = formatted.substring(0, 19);
            }
        });
    }

    const videoThumbnail = document.getElementById('videoThumbnail');
    const videoIframe = document.getElementById('videoIframe');
    
    if (videoThumbnail && videoIframe) {
        videoThumbnail.addEventListener('click', function() {
            videoIframe.src = 'https://drive.google.com/file/d/1oh-3kc4DQtbvzfkc3jKAHqxvPGp-rnHj/preview';
            videoThumbnail.style.display = 'none';
            videoIframe.style.display = 'block';
        });
    }
});

// ============================================
// NAVIGATION LINKS PROTECTION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-menu a[href], .nav a[href]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                if (!this.classList.contains('contact-btn') && 
                    !this.classList.contains('footer-btn') && 
                    !this.classList.contains('open-sidebar-btn')) {
                    return true;
                }
            }
        }, true);
    });
});

// ============================================
// SNOW EFFECT
// ============================================
(function() {
    const snowContainer = document.getElementById('snowContainer');
    if (!snowContainer) return;
    
    const snowflakes = ['❄', '❅', '❆', '✻', '✼', '✽', '✾', '✿', '❀'];
    const totalSnowflakes = 100;
    
    function createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = snowflakes[Math.floor(Math.random() * snowflakes.length)];
        
        const size = Math.random() * 0.8 + 0.4;
        snowflake.style.fontSize = size + 'em';
        snowflake.style.left = Math.random() * 100 + '%';
        
        const duration = Math.random() * 10 + 10;
        snowflake.style.animationDuration = duration + 's';
        snowflake.style.animationDelay = Math.random() * 5 + 's';
        
        const swayAmount = Math.random() * 50 + 25;
        snowflake.style.setProperty('--sway', swayAmount + 'px');
        
        snowContainer.appendChild(snowflake);
        
        setTimeout(() => {
            if (snowflake.parentNode) {
                snowflake.parentNode.removeChild(snowflake);
            }
        }, duration * 1000);
    }
    
    for (let i = 0; i < totalSnowflakes; i++) {
        setTimeout(() => createSnowflake(), i * 200);
    }
    
    setInterval(() => {
        if (snowContainer.children.length < totalSnowflakes) {
            createSnowflake();
        }
    }, 500);
})();

// Делаем функции глобальными
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.openCallbackModal = openCallbackModal;

