// ============================================
// AOS INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
});

// ============================================
// HEADER SCROLL EFFECT
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    // Фиксация хедера при скролле
    window.addEventListener('scroll', function () {
        const header = document.getElementById('mainHeader');
        const heroSection = document.querySelector('.hero');
        const heroHeight = heroSection.offsetHeight;

        if (window.pageYOffset > heroHeight) {
            header.classList.add('fixed');
        } else {
            header.classList.remove('fixed');
        }
    });

    // Аккордеон FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = question.nextElementSibling;
            const icon = question.querySelector('i');
            
            // Закрываем все открытые вопросы
            document.querySelectorAll('.faq-item').forEach(el => {
                if (el !== item) {
                    el.classList.remove('active');
                    el.querySelector('.faq-answer').style.maxHeight = null;
                    el.querySelector('.faq-question i').classList.remove('fa-chevron-up');
                    el.querySelector('.faq-question i').classList.add('fa-chevron-down');
                }
            });
            
            // Открываем/закрываем текущий вопрос
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                answer.style.maxHeight = null;
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });

    // Фильтрация портфолио
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Удаляем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс текущей кнопке
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});

// Табы для секции "Процесс проектирования"
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.process-tab-btn');
    const tabPanels = document.querySelectorAll('.process-tab-panel');
    
    // Переключение вкладок
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Убираем активный класс у всех кнопок и панелей
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Добавляем активный класс к выбранной кнопке и панели
            this.classList.add('active');
            const targetPanel = document.querySelector(`.process-tab-panel[data-panel="${targetTab}"]`);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
});

// ============================================
// САЙДБАР И МОДАЛЬНОЕ ОКНО
// ============================================

// Глобальная функция открытия сайдбара
window.openContactSidebar = function() {
    const heroSidebar = document.getElementById('heroSidebar');
    if (heroSidebar) {
        heroSidebar.classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Управление мобильным меню (бургер)
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    
    if (mobileMenuToggle && mobileMenu) {
        // Открытие/закрытие мобильного меню
        mobileMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpening = !mobileMenu.classList.contains('active');
            
            // Закрываем сайдбар контактов если открыт
            const heroSidebar = document.getElementById('heroSidebar');
            if (heroSidebar && heroSidebar.classList.contains('active')) {
                heroSidebar.classList.remove('active');
            }
            
            mobileMenuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = isOpening ? 'hidden' : 'auto';
        });
        
        // Закрытие меню при клике на ссылку
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(e) {
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                e.target !== mobileMenuToggle && 
                !mobileMenuToggle.contains(e.target)) {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Закрытие по ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Управление сайдбаром контактов
    const contactToggleBtn = document.getElementById('contactToggleBtn');
    const heroSidebar = document.getElementById('heroSidebar');
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

    // Открытие сайдбара из кнопок в карточках
    document.querySelectorAll('.open-sidebar-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            if (heroSidebar) {
                heroSidebar.classList.add('active');
            }
        });
    });
    
    if (contactToggleBtn && heroSidebar) {
        // Открытие сайдбара
        contactToggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Закрываем мобильное меню если открыто
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
            
            heroSidebar.classList.add('active');
        });

        // Закрытие сайдбара
        if (sidebarCloseBtn) {
            sidebarCloseBtn.addEventListener('click', function() {
                heroSidebar.classList.remove('active');
            });
        }

        // Закрытие по клику вне сайдбара
        document.addEventListener('click', function(e) {
            if (heroSidebar.classList.contains('active') && 
                !heroSidebar.contains(e.target) && 
                e.target !== contactToggleBtn && 
                !contactToggleBtn.contains(e.target)) {
                heroSidebar.classList.remove('active');
            }
        });

        // Закрытие по ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && heroSidebar.classList.contains('active')) {
                heroSidebar.classList.remove('active');
            }
        });
    }
});

// ============================================
// TELEGRAM УВЕДОМЛЕНИЯ
// ============================================

const TELEGRAM_BOT_TOKEN = TELEGRAM_CONFIG.BOT_TOKEN;
const TELEGRAM_CHAT_ID = TELEGRAM_CONFIG.CHAT_ID;

let currentCallbackSource = 'Страница проектирования';

// Открытие модального окна
window.openCallbackModal = function(source = 'Страница проектирования') {
    currentCallbackSource = source;
    const modal = document.getElementById('callbackModal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Очистка формы
    document.getElementById('callbackForm').reset();
    const messageTextarea = document.getElementById('callback-message-text');
    if (messageTextarea) {
        messageTextarea.value = '';
    }
    document.getElementById('callback-message').innerHTML = '';
    document.getElementById('callback-message').className = 'callback-message';
}

// Закрытие модального окна
window.closeCallbackModal = function() {
    const modal = document.getElementById('callbackModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Отправка сообщения в Telegram
async function sendToTelegram(name, phone, source, userMessage = '') {
    let message = `🔔 <b>Новая заявка с сайта!</b>\n\n` +
                  `👤 <b>Имя:</b> ${name}\n` +
                  `📱 <b>Телефон:</b> ${phone}\n` +
                  `📍 <b>Источник:</b> ${source}\n`;
    
    if (userMessage) {
        message += `💬 <b>Сообщение:</b> ${userMessage}\n`;
    }
    
    message += `🕐 <b>Время:</b> ${new Date().toLocaleString('ru-RU')}`;
    
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML'
        })
    });
    
    return response.json();
}

// Обработка кнопок
document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.querySelector('.callback-modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', window.closeCallbackModal);
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.closeCallbackModal();
        }
    });
    
    // Обработка всех кнопок "Заказать звонок"
    document.querySelectorAll('.contact-btn, .footer-btn, .open-sidebar-btn, [onclick*="openContactSidebar"], .hero-btn, .design-hero-btn').forEach(btn => {
        // Пропускаем кнопки экскурсий - у них свой обработчик
        if (btn.classList.contains('excursion-btn')) {
            return;
        }
        
        // Пропускаем кнопки, которые должны открывать сайдбар
        if (btn.onclick && btn.onclick.toString().includes('openContactSidebar')) {
            return;
        }
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Используем data-source если есть, иначе используем значение по умолчанию
            const source = this.getAttribute('data-source') || 'Страница проектирования';
            window.openCallbackModal(source);
        });
    });
    
    // Отдельная обработка кнопки экскурсии
    document.querySelectorAll('.excursion-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const source = this.getAttribute('data-source') || 'Экскурсия по объектам';
            window.openCallbackModal(source);
        });
    });
});

// Отправка формы
document.getElementById('callbackForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('callback-name').value.trim();
    const phone = document.getElementById('callback-phone').value.trim();
    const userMessage = document.getElementById('callback-message-text') ? document.getElementById('callback-message-text').value.trim() : '';
    const messageDiv = document.getElementById('callback-message');
    const submitBtn = this.querySelector('.callback-submit-btn');
    
    if (!name || !phone) {
        messageDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Пожалуйста, заполните все поля';
        messageDiv.className = 'callback-message error';
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Отправка...</span>';
    
    try {
        const result = await sendToTelegram(name, phone, currentCallbackSource, userMessage);
        
        if (result.ok) {
            messageDiv.innerHTML = '<i class="fas fa-check-circle"></i> Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.';
            messageDiv.className = 'callback-message success';
            
            document.getElementById('callbackForm').reset();
            
            setTimeout(() => {
                window.closeCallbackModal();
            }, 3000);
    } else {
            throw new Error(result.description || 'Ошибка отправки');
        }
    } catch (error) {
        console.error('Ошибка отправки в Telegram:', error);
        messageDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Произошла ошибка. Пожалуйста, позвоните нам напрямую: +375 (29) 128-62-17';
        messageDiv.className = 'callback-message error';
    }
    
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Отправить заявку</span>';
});

// Маска для телефона
document.getElementById('callback-phone').addEventListener('input', function(e) {
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

// ============================================
// МОДАЛЬНЫЕ ОКНА ПРОЕКТОВ
// ============================================

// Функции для работы с модальными окнами проектов
window.openProjectModal = function(type) {
    const modal = document.getElementById('projectModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Данные для каждого типа проекта
    const projectData = {
        'classic': {
            title: 'Классический коттедж',
            images: [
                '../main_img/projects/Classic/classic1.webp',
                '../main_img/projects/Classic/classic2.webp',
                '../main_img/projects/Classic/classic3.webp',
                '../main_img/projects/Classic/classic_plan.webp'
            ]
        },
        'chalet': {
            title: 'Альпийское шале',
            images: [
                '../main_img/projects/Shale_black/shale_black.webp',
                '../main_img/projects/Shale_black/shale_black_1.webp',
                '../main_img/projects/Shale_black/shale_black_plan1.webp',
                '../main_img/projects/Shale_black/shale_black_plan2.webp'
            ]
        },
        'barnhouse': {
            title: 'Современный барнхаус',
            images: [
                '../main_img/projects/Barn/barn.webp',
                '../main_img/projects/Barn/barn1.webp',
                '../main_img/projects/Barn/barn2.webp',
                '../main_img/projects/Barn/barn3.webp',
                '../main_img/projects/Barn/barn_plan1.webp',
                '../main_img/projects/Barn/barn_plan2.webp'
            ]
        },
        'minimalism': {
            title: 'Классический со вторым светом',
            images: [
                '../main_img/projects/Classic_2/project1.webp',
                '../main_img/projects/Classic_2/project2.webp',
                '../main_img/projects/Classic_2/project3.webp',
                '../main_img/projects/Classic_2/project4.webp',
                '../main_img/projects/Classic_2/project5.webp'
            ]
        },
        'shale_white': {
            title: 'Шале White',
            images: [
                '../main_img/projects/Shale_white/shale_white.webp',
                '../main_img/projects/Shale_white/shale_white1.webp',
                '../main_img/projects/Shale_white/shale_white_plan.webp',
                '../main_img/projects/Shale_white/shale_white_plan2.webp'
            ]
        }
    };
    
    if (projectData[type]) {
        // Обновляем заголовок
        document.querySelector('.modal-header h3').textContent = projectData[type].title;
        
        // Обновляем изображения в слайдере
        const sliderContainer = document.querySelector('.slider-container');
        sliderContainer.innerHTML = '';
        
        projectData[type].images.forEach((imageSrc, index) => {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `Фото ${index + 1}`;
            img.onclick = function() { window.openImageFullscreen(this); };
            img.style.cursor = 'zoom-in';
            sliderContainer.appendChild(img);
        });
    }
}

window.closeProjectModal = function() {
    const modal = document.getElementById('projectModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

window.openImageFullscreen = function(img) {
    const fullscreen = document.getElementById('imageFullscreen');
    const fullscreenImage = document.getElementById('fullscreenImage');
    fullscreenImage.src = img.src;
    fullscreenImage.alt = img.alt;
    fullscreen.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

window.closeImageFullscreen = function() {
    const fullscreen = document.getElementById('imageFullscreen');
    fullscreen.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Навигация слайдера
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.slider-prev').forEach(btn => {
        btn.addEventListener('click', function () {
            const container = this.parentElement.querySelector('.slider-container');
            container.scrollBy({
                left: -container.offsetWidth,
                behavior: 'smooth'
            });
    });
});

    document.querySelectorAll('.slider-next').forEach(btn => {
        btn.addEventListener('click', function () {
            const container = this.parentElement.querySelector('.slider-container');
            container.scrollBy({
                left: container.offsetWidth,
                behavior: 'smooth'
            });
        });
    });

    // Закрытие по ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            window.closeProjectModal();
            window.closeImageFullscreen();
        }
    });

    // Переключение этапов design process
    const designProcessTabs = document.querySelectorAll('.workflow-tab');
    const designProcessSlides = document.querySelectorAll('.workflow-slide');
    let currentDesignStep = 1;
    const totalDesignSteps = 6;

    function updateDesignProcessStep(step) {
        currentDesignStep = step;
        
        // Убираем active у всех кнопок и слайдов
        designProcessTabs.forEach(t => t.classList.remove('active'));
        designProcessSlides.forEach(s => s.classList.remove('active'));
        
        // Добавляем active к нужным элементам
        const tab = document.querySelector(`.workflow-tab[data-step="${step}"]`);
        const slide = document.querySelector(`.workflow-slide[data-step="${step}"]`);
        if (tab) tab.classList.add('active');
        if (slide) slide.classList.add('active');
        
        // Управляем видимостью стрелок
        const prevArrow = document.querySelector('.workflow-arrow-prev');
        const nextArrow = document.querySelector('.workflow-arrow-next');
        
        if (prevArrow) {
            if (currentDesignStep === 1) {
                prevArrow.classList.add('hidden');
            } else {
                prevArrow.classList.remove('hidden');
            }
        }
        
        if (nextArrow) {
            if (currentDesignStep === totalDesignSteps) {
                nextArrow.classList.add('hidden');
            } else {
                nextArrow.classList.remove('hidden');
            }
        }
    }

    designProcessTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const step = parseInt(this.getAttribute('data-step'));
            updateDesignProcessStep(step);
        });
    });

    // Функция для переключения стрелками
    window.changeDesignProcessStep = function(direction) {
        let newStep = currentDesignStep + direction;
        if (newStep >= 1 && newStep <= totalDesignSteps) {
            updateDesignProcessStep(newStep);
        }
    };
    
    // Инициализация
    updateDesignProcessStep(1);
});

// Функция для выбора пакета
window.selectPricingPackageComplete = function(button) {
    const card = button.closest('.pricing-card');
    const packageName = button.getAttribute('data-package') || card.querySelector('h3').textContent;
    const priceText = card.querySelector('.price').textContent.trim();
    
    // 1. Подсветка карточки
    document.querySelectorAll('.pricing-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    
    // 2. Открытие модального окна
    window.openCallbackModal('Страница проектирования');
    
    // 3. Предзаполнение формы
    setTimeout(() => {
        const messageField = document.getElementById('callback-message-text');
        if (messageField) {
            messageField.value = `Интересует пакет "${packageName}" (${priceText})`;
        }
    }, 200);
}

// Определение полностью видимой карточки для мобильных
document.addEventListener('DOMContentLoaded', function() {
    function initPricingCardsVisibility() {
        const pricingTables = document.querySelector('.pricing-tables');
        const pricingCards = document.querySelectorAll('.pricing-card');
        
        if (!pricingTables || pricingCards.length === 0) {
            return;
        }
        
        // Проверяем, мобильная ли версия
        const isMobile = window.innerWidth <= 768;
        
        if (!isMobile) {
            // Для десктопа убираем класс fully-visible
            pricingCards.forEach(card => card.classList.remove('fully-visible'));
            return;
        }
        
        function updateFullyVisibleCard() {
            const containerRect = pricingTables.getBoundingClientRect();
            const containerLeft = containerRect.left;
            const containerRight = containerRect.right;
            const containerWidth = containerRect.width;
            
            let bestCard = null;
            let bestVisibility = 0;
            
            pricingCards.forEach(card => {
                card.classList.remove('fully-visible');
                const cardRect = card.getBoundingClientRect();
                const cardLeft = cardRect.left;
                const cardRight = cardRect.right;
                const cardWidth = cardRect.width;
                
                // Вычисляем процент видимости карточки
                const visibleLeft = Math.max(cardLeft, containerLeft);
                const visibleRight = Math.min(cardRight, containerRight);
                const visibleWidth = Math.max(0, visibleRight - visibleLeft);
                const visibilityPercent = (visibleWidth / cardWidth) * 100;
                
                // Если карточка полностью видна (95% и более)
                if (visibilityPercent >= 95 && cardLeft >= containerLeft && cardRight <= containerRight) {
                    if (visibilityPercent > bestVisibility) {
                        bestCard = card;
                        bestVisibility = visibilityPercent;
                    }
                }
            });
            
            // Добавляем класс к наиболее видимой карточке
            if (bestCard) {
                bestCard.classList.add('fully-visible');
            }
        }
        
        // Обновляем при скролле
        pricingTables.addEventListener('scroll', updateFullyVisibleCard, { passive: true });
        
        // Обновляем при изменении размера окна
        window.addEventListener('resize', function() {
            initPricingCardsVisibility();
        });
        
        // Инициализация
        setTimeout(updateFullyVisibleCard, 100);
        updateFullyVisibleCard();
    }
    
    // Инициализация
    initPricingCardsVisibility();
});


