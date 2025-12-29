// ============================================
// GLOBAL FUNCTIONS FOR SIDEBAR
// ============================================
window.openContactSidebar = function() {
    const heroSidebar = document.getElementById('heroSidebar');
    if (heroSidebar) {
        heroSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeContactSidebar = function() {
    const heroSidebar = document.getElementById('heroSidebar');
    if (heroSidebar) {
        heroSidebar.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

// Для обратной совместимости
function openContactSidebar() {
    window.openContactSidebar();
}

function closeContactSidebar() {
    window.closeContactSidebar();
}

// ============================================
// AOS INITIALIZATION
// ============================================
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// ============================================
// TELEGRAM CALLBACK SYSTEM
// ============================================
let currentCallbackSource = 'Административные сооружения';

window.openCallbackModal = function(source = 'Административные сооружения') {
    if (typeof TELEGRAM_CONFIG === 'undefined') {
        console.error('TELEGRAM_CONFIG не загружен');
        return;
    }
    
    currentCallbackSource = source;
    const modal = document.getElementById('callbackModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        const form = document.getElementById('callbackForm');
        if (form) {
            form.reset();
            const messageDiv = document.getElementById('callback-message');
            if (messageDiv) {
                messageDiv.innerHTML = '';
                messageDiv.className = 'callback-message';
            }
        }
    }
};

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
        console.error('TELEGRAM_CONFIG не загружен');
        return { ok: false };
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
    
    return await response.json();
}

document.addEventListener('DOMContentLoaded', function() {
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
                        window.closeCallbackModal();
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
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.closeCallbackModal();
        }
    });
    
    const overlay = document.querySelector('.callback-modal-overlay');
    if (overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                window.closeCallbackModal();
            }
        });
    }
    
    // Обработчики для кнопок в сайдбаре
    document.querySelectorAll('.contact-btn').forEach(btn => {
        if (btn.tagName === 'A' && btn.closest('.nav-menu')) {
            return;
        }
        
        btn.addEventListener('click', function(e) {
            if (this.classList.contains('excursion-btn')) {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            
            const source = this.getAttribute('data-source') || 'Административные сооружения';
            window.openCallbackModal(source);
        });
    });
    
    document.querySelectorAll('.excursion-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const source = this.getAttribute('data-source') || 'Экскурсия по объектам';
            window.openCallbackModal(source);
        });
    });
});

// ============================================
// MOBILE MENU AND SIDEBAR
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const contactToggleBtn = document.getElementById('contactToggleBtn');
    const heroSidebar = document.getElementById('heroSidebar');

    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function () {
            mobileMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }

    // Закрытие мобильного меню при клике на ссылку
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
        });
    });
    
    // Открытие сайдбара по кнопке контактов
    if (contactToggleBtn && heroSidebar) {
        contactToggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Закрываем мобильное меню если открыто
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
            
            heroSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Закрытие сайдбара по кнопке закрытия
    const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');
    const sidebarBackBtn = document.getElementById('sidebarBackBtn');
    
    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeContactSidebar();
        });
    }
    
    if (sidebarBackBtn) {
        sidebarBackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeContactSidebar();
        });
    }
    
    // Закрытие сайдбара по клику вне его
    if (heroSidebar) {
        heroSidebar.addEventListener('click', function(e) {
            if (e.target === heroSidebar) {
                closeContactSidebar();
            }
        });
    }
    
    // Обработчики для кнопок открытия сайдбара (включая кнопки в футере)
    const openSidebarBtns = document.querySelectorAll('.open-sidebar-btn');
    openSidebarBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openContactSidebar();
        });
    });
});

// ============================================
// TESTIMONIALS SLIDER
// ============================================
let currentSlide = 0;
let currentTestimonialIndex = 1;
let testimonialSlides = document.querySelectorAll('.testimonial-slide');
let totalSlides = testimonialSlides.length;

// Определяем количество видимых слайдов в зависимости от ширины экрана
function getSlidesPerView() {
    if (window.innerWidth >= 1024) return 3; // Desktop
    if (window.innerWidth >= 768) return 2;  // Tablet
    return 1; // Mobile
}

// Инициализация точечной навигации
function initTestimonialsDots() {
    const dotsContainer = document.getElementById('testimonialsSliderDots');
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

// Обновление активной точки
function updateDots() {
    const dots = document.querySelectorAll('.slider-dot');
    const slidesPerView = getSlidesPerView();
    const activeDot = Math.floor(currentSlide / slidesPerView);
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeDot);
    });
}

// Переход к определенному слайду
function goToSlide(slideIndex) {
    const slidesPerView = getSlidesPerView();
    const maxSlide = totalSlides - slidesPerView;
    
    currentSlide = Math.max(0, Math.min(slideIndex, maxSlide));
    updateSliderPosition();
}

// Обновление позиции слайдера
function updateSliderPosition() {
    const track = document.getElementById('testimonialsSliderTrack');
    const slidesPerView = getSlidesPerView();
    const slideWidth = 100 / slidesPerView;
    const offset = -currentSlide * slideWidth;
    
    track.style.transform = `translateX(${offset}%)`;
    updateDots();
    updateArrows();
}

// Обновление состояния стрелок
function updateArrows() {
    const prevBtn = document.querySelector('.testimonials-slider-prev');
    const nextBtn = document.querySelector('.testimonials-slider-next');
    const slidesPerView = getSlidesPerView();
    const maxSlide = totalSlides - slidesPerView;
    
    // Скрываем стрелку назад, если на первом слайде
    if (prevBtn) prevBtn.style.display = currentSlide === 0 ? 'none' : 'flex';
    
    // Скрываем стрелку вперед, если на последнем слайде
    if (nextBtn) nextBtn.style.display = currentSlide >= maxSlide ? 'none' : 'flex';
}

// Перемещение слайдера
window.moveTestimonialSlider = function(direction) {
    const slidesPerView = getSlidesPerView();
    const newSlide = currentSlide + direction;
    const maxSlide = totalSlides - slidesPerView;
    
    if (newSlide >= 0 && newSlide <= maxSlide) {
        goToSlide(newSlide);
    }
};

// Инициализация слайдера
function initTestimonialsSlider() {
    testimonialSlides = document.querySelectorAll('.testimonial-slide');
    totalSlides = testimonialSlides.length;
    
    if (totalSlides > 0) {
        initTestimonialsDots();
        updateSliderPosition();
    }
}

// Инициализация слайдера при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initTestimonialsSlider();
});

// Обновление при изменении размера окна
window.addEventListener('resize', function() {
    if (totalSlides > 0) {
        initTestimonialsDots();
        updateSliderPosition();
    }
});

// ============================================
// TESTIMONIALS MODAL
// ============================================
const testimonials = [
    {
        id: 1,
        image: '../main_img/testimonials/Asanalieva.webp',
        title: 'Благодарственное письмо',
        description: 'Строительство производственного здания • 2024 • г. Минск, ул. Асаналиева'
    },
    {
        id: 2,
        image: '../main_img/testimonials/Evrostore.webp',
        title: 'Отзыв от Evrostore',
        description: 'Строительство торгового объекта • 2024 • Беларусь'
    },
    {
        id: 3,
        image: '../main_img/testimonials/MetroProect.webp',
        title: 'Благодарность от MetroProect',
        description: 'Сотрудничество по проектированию • 2023 • г. Минск'
    },
    {
        id: 4,
        image: '../main_img/testimonials/Ynikom.webp',
        title: 'Отзыв от Ynikom',
        description: 'Строительство офисного здания • 2023 • Беларусь'
    },
    {
        id: 5,
        image: '../main_img/testimonials/4_solnca.webp',
        title: 'Отзыв от "4 Солнца"',
        description: 'Строительство объекта • Беларусь'
    },
    {
        id: 6,
        image: '../main_img/testimonials/Alexandrov.webp',
        title: 'Благодарственное письмо',
        description: 'Строительный проект • Беларусь'
    },
    {
        id: 7,
        image: '../main_img/testimonials/BMT.webp',
        title: 'Отзыв от БМТ',
        description: 'Строительство производственного объекта • Беларусь'
    },
    {
        id: 8,
        image: '../main_img/testimonials/Granyldrev.webp',
        title: 'Отзыв от Гранилдрев',
        description: 'Строительство и ремонт • Беларусь'
    },
    {
        id: 9,
        image: '../main_img/testimonials/Terushki.webp',
        title: 'Благодарственное письмо',
        description: 'Строительство загородного дома • Беларусь'
    },
    {
        id: 10,
        image: '../main_img/testimonials/Victory.webp',
        title: 'Отзыв от Victory',
        description: 'Строительный проект • Беларусь'
    },
    {
        id: 11,
        image: '../main_img/testimonials/Vodokanal.webp',
        title: 'Отзыв от Водоканал',
        description: 'Строительство инфраструктурных объектов • Беларусь'
    },
    {
        id: 12,
        image: '../main_img/testimonials/Zelenstroy.webp',
        title: 'Отзыв от Зеленстрой',
        description: 'Ландшафтные и строительные работы • Беларусь'
    }
];

window.openTestimonialDocument = function(index) {
    currentTestimonialIndex = index;
    const modal = document.getElementById('testimonialDocumentModal');
    const testimonial = testimonials.find(t => t.id === index);
    
    if (modal && testimonial) {
        document.getElementById('testimonialDocumentImage').src = testimonial.image;
        document.getElementById('testimonialDocumentTitle').textContent = testimonial.title;
        document.getElementById('testimonialDocumentDescription').textContent = testimonial.description;
        
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
        document.getElementById('testimonialDocumentImage').src = testimonial.image;
        document.getElementById('testimonialDocumentTitle').textContent = testimonial.title;
        document.getElementById('testimonialDocumentDescription').textContent = testimonial.description;
        
        updateTestimonialNavigation();
    }
};

function updateTestimonialNavigation() {
    const prevBtn = document.querySelector('.document-modal-prev');
    const nextBtn = document.querySelector('.document-modal-next');
    
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
}

// Закрытие модального окна по ESC
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
// DOCUMENTS SLIDER
// ============================================
let currentDocumentSlide = 0;
let currentDocumentIndex = 1;
let documentSlides = document.querySelectorAll('#documentsSliderTrack .testimonial-slide');
let totalDocumentSlides = documentSlides.length;

// Определяем количество видимых слайдов в зависимости от ширины экрана
function getDocumentSlidesPerView() {
    if (window.innerWidth >= 1024) return 3; // Desktop
    if (window.innerWidth >= 768) return 2;  // Tablet
    return 1; // Mobile
}

// Инициализация точечной навигации для документов
function initDocumentsDots() {
    const dotsContainer = document.getElementById('documentsSliderDots');
    if (!dotsContainer) return;
    const slidesPerView = getDocumentSlidesPerView();
    const dotsCount = Math.ceil(totalDocumentSlides / slidesPerView);
    
    dotsContainer.innerHTML = '';
    for (let i = 0; i < dotsCount; i++) {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToDocumentSlide(i * slidesPerView));
        dotsContainer.appendChild(dot);
    }
}

// Обновление активной точки для документов
function updateDocumentDots() {
    const dots = document.querySelectorAll('#documentsSliderDots .slider-dot');
    const slidesPerView = getDocumentSlidesPerView();
    const activeDot = Math.floor(currentDocumentSlide / slidesPerView);
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeDot);
    });
}

// Переход к определенному слайду документов
function goToDocumentSlide(slideIndex) {
    const slidesPerView = getDocumentSlidesPerView();
    const maxSlide = totalDocumentSlides - slidesPerView;
    
    currentDocumentSlide = Math.max(0, Math.min(slideIndex, maxSlide));
    updateDocumentSliderPosition();
}

// Обновление позиции слайдера документов
function updateDocumentSliderPosition() {
    const track = document.getElementById('documentsSliderTrack');
    if (!track) return;
    const slidesPerView = getDocumentSlidesPerView();
    const slideWidth = 100 / slidesPerView;
    const offset = -currentDocumentSlide * slideWidth;
    
    track.style.transform = `translateX(${offset}%)`;
    updateDocumentDots();
    updateDocumentArrows();
}

// Обновление состояния стрелок для документов
function updateDocumentArrows() {
    const prevBtn = document.querySelector('#documents .testimonials-slider-prev');
    const nextBtn = document.querySelector('#documents .testimonials-slider-next');
    const slidesPerView = getDocumentSlidesPerView();
    const maxSlide = totalDocumentSlides - slidesPerView;
    
    // Скрываем стрелку назад, если на первом слайде
    if (prevBtn) prevBtn.style.display = currentDocumentSlide === 0 ? 'none' : 'flex';
    
    // Скрываем стрелку вперед, если на последнем слайде
    if (nextBtn) nextBtn.style.display = currentDocumentSlide >= maxSlide ? 'none' : 'flex';
}

// Перемещение слайдера документов
window.moveDocumentSlider = function(direction) {
    const slidesPerView = getDocumentSlidesPerView();
    const newSlide = currentDocumentSlide + direction;
    const maxSlide = totalDocumentSlides - slidesPerView;
    
    if (newSlide >= 0 && newSlide <= maxSlide) {
        goToDocumentSlide(newSlide);
    }
};

// Инициализация слайдера документов
function initDocumentsSlider() {
    documentSlides = document.querySelectorAll('#documentsSliderTrack .testimonial-slide');
    totalDocumentSlides = documentSlides.length;
    
    if (totalDocumentSlides > 0) {
        initDocumentsDots();
        updateDocumentSliderPosition();
    }
}

// Инициализация слайдера документов при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initDocumentsSlider();
});

// Обновление при изменении размера окна для документов
window.addEventListener('resize', function() {
    if (totalDocumentSlides > 0) {
        initDocumentsDots();
        updateDocumentSliderPosition();
    }
});

// ============================================
// DOCUMENTS MODAL
// ============================================
const documents = [
    {
        id: 1,
        image: '../about/about_img/Otestat.webp',
        title: 'Аттестат соответствия',
        description: 'ООО "ТОПАГРОБЕЛ" • Аттестат соответствия'
    },
    {
        id: 2,
        image: '../about/about_img/Otestat2.webp',
        title: 'Аттестат соответствия',
        description: 'ООО "ТОПАГРОБЕЛ" • Аттестат соответствия'
    },
    {
        id: 3,
        image: '../about/about_img/Otestat3.webp',
        title: 'Аттестат соответствия',
        description: 'ООО "ТОПАГРОБЕЛ" • Аттестат соответствия'
    },
    {
        id: 4,
        image: '../about/about_img/Otestat4.webp',
        title: 'Аттестат соответствия',
        description: 'ООО "ТОПБИЛДИНГ" • Аттестат соответствия'
    },
    {
        id: 5,
        image: '../about/about_img/Otestat5.webp',
        title: 'Аттестат соответствия',
        description: 'ООО "ТОПБИЛДИНГ" • Аттестат соответствия'
    },
    {
        id: 6,
        image: '../about/about_img/Otestat6.webp',
        title: 'Аттестат соответствия',
        description: 'ООО "ТОПБИЛДИНГ" • Аттестат соответствия'
    }
];

window.openDocumentModal = function(index) {
    currentDocumentIndex = index;
    const modal = document.getElementById('documentModal');
    const docItem = documents.find(d => d.id === index);
    
    if (modal && docItem) {
        document.getElementById('documentModalImage').src = docItem.image;
        document.getElementById('documentModalTitle').textContent = docItem.title;
        document.getElementById('documentModalDescription').textContent = docItem.description;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        updateDocumentNavigation();
    }
};

window.closeDocumentModal = function() {
    const modal = document.getElementById('documentModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

window.navigateDocument = function(direction) {
    currentDocumentIndex += direction;
    
    if (currentDocumentIndex > documents.length) {
        currentDocumentIndex = 1;
    } else if (currentDocumentIndex < 1) {
        currentDocumentIndex = documents.length;
    }
    
    const docItem = documents.find(d => d.id === currentDocumentIndex);
    
    if (docItem) {
        document.getElementById('documentModalImage').src = docItem.image;
        document.getElementById('documentModalTitle').textContent = docItem.title;
        document.getElementById('documentModalDescription').textContent = docItem.description;
        
        updateDocumentNavigation();
    }
};

function updateDocumentNavigation() {
    const prevBtn = document.querySelector('#documentModal .document-modal-prev');
    const nextBtn = document.querySelector('#documentModal .document-modal-next');
    
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
}

// Закрытие модального окна документов по ESC
document.addEventListener('keydown', function(e) {
    const documentModal = document.getElementById('documentModal');
    if (e.key === 'Escape' && documentModal && documentModal.style.display === 'flex') {
        window.closeDocumentModal();
    }
    if (documentModal && documentModal.style.display === 'flex') {
        if (e.key === 'ArrowLeft') {
            window.navigateDocument(-1);
        } else if (e.key === 'ArrowRight') {
            window.navigateDocument(1);
        }
    }
});

// ============================================
// YANDEX MAPS
// ============================================
var globalMap; // Глобальная переменная для карты

// Глобальная функция для закрытия балуна карты
window.closeMapBalloon = function() {
    if (globalMap) {
        globalMap.balloon.close();
    }
};

function initMap() {
    // Проверяем, что элемент карты существует
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Элемент карты не найден');
        return;
    }

    // Создаем карту с центром на Беларуси
    globalMap = new ymaps.Map("map", {
        center: [53.7098, 27.9534],
        zoom: 7,
        controls: ['zoomControl']
    });
    
    var myMap = globalMap; // Сохраняем для совместимости с существующим кодом
    
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
            coords: [53.864331, 27.535735], // Минск, Белградская 14
            title: "Ресторан Ettal",
            description: "Ремонт ресторана",
            address: "г. Минск, ул. Белградская, 14",
            photos: [
                '../main_img/mapFoto/ettal.webp'
            ]
        },
        {
            coords: [53.470762, 25.417660], // Дятлово, Новогрудская 6
            title: "Производственное здание",
            description: "Строительство административного здания",
            address: "г. Дятлово, ул. Новогрудская, 6",
            photos: [
                '../main_img/mapFoto/novogrydskaya.webp'
            ]
        },
        {
            coords: [53.476572, 25.416394], // Дятлово, Советская 106б
            title: "Производственное здание",
            description: "Строительство производственного здания",
            address: "г. Дятлово, ул. Советская, 106б",
            photos: [
                '../main_img/mapFoto/sovetskaya.webp'
            ]
        },
        {
            coords: [53.898496, 27.584738], // Минск, Соломенная 13
            title: "Модернизация крыши",
            description: "Модернизация крыши",
            address: "г. Минск, ул. Соломенная, 13",
            photos: [
                '../main_img/mapFoto/solomennaya.webp'
            ]
        },
        {
            coords: [54.719328, 25.745758], // Котловка
            title: "Реконструкция ГИС",
            description: "Реконструкция ГИС",
            address: "д. Котловка",
            photos: [
                '../main_img/mapFoto/kotlovka.webp'
            ]
        },
        {
            coords: [53.814017, 27.686167], // Минск, Селицкого 17а
            title: "Модернизация производственного сооружения",
            description: "Модернизация производственного сооружения",
            address: "г. Минск, ул. Селицкого, 17а",
            photos: [
                '../main_img/mapFoto/selickogo.webp'
            ]
        },
        {
            coords: [53.799863, 27.289570], // д. Чики
            title: "Загородный дом",
            description: "Строительство загородного дома",
            address: "д. Чики",
            photos: [
                '../main_img/projects/Classic_2/project1.webp',
                '../main_img/projects/Classic_2/project2.webp',
                '../main_img/projects/Classic_2/project3.webp',
                '../main_img/projects/Classic_2/project4.webp',
                '../main_img/projects/Classic_2/project5.webp'
            ]
        },
        {
            coords: [53.839702, 27.542311], // Минск, Асаналиева 84к2
            title: "Производственное здание",
            description: "Строительство производственного здания",
            address: "г. Минск, ул. Асаналиева, 84к2",
            photos: [
                '../main_img/mapFoto/asanalieva.webp'
            ]
        },
        {
            coords: [53.887979, 27.608202], // Минск, Стахановская 17
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

    // Карта остается на центре Беларуси - автоцентрирование отключено
}

// Инициализация карты после загрузки DOM и Яндекс.Карт
function initYandexMap() {
    if (typeof ymaps !== 'undefined') {
        ymaps.ready(initMap);
    } else {
        // Если ymaps еще не загружен, ждем его загрузки
        setTimeout(function() {
            if (typeof ymaps !== 'undefined') {
                ymaps.ready(initMap);
            } else {
                console.error('Яндекс.Карты не загружены');
            }
        }, 100);
    }
}

// Запускаем инициализацию после загрузки DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initYandexMap);
} else {
    initYandexMap();
}

// ============================================
// SNOW EFFECT
// ============================================
(function() {
    const snowContainer = document.getElementById('snowContainer');
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





