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
// TELEGRAM CALLBACK SYSTEM
// ============================================
let currentCallbackSource = 'Страница "О нас"';

window.openCallbackModal = function(source = 'Страница "О нас"') {
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
    
    if (typeof TELEGRAM_CONFIG === 'undefined') {
        console.warn('TELEGRAM_CONFIG не загружен. Форма будет работать, но отправка может не работать.');
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

// Обработчик формы обратного звонка и модального окна
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
});

// ============================================
// CONTACT SIDEBAR FUNCTIONS
// ============================================
window.openContactSidebar = function() {
    const heroSidebar = document.getElementById('heroSidebar');
    if (heroSidebar) {
        heroSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

function openContactSidebar() {
    window.openContactSidebar();
}

window.closeContactSidebar = function() {
    const heroSidebar = document.getElementById('heroSidebar');
    if (heroSidebar) {
        heroSidebar.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
};

function closeContactSidebar() {
    window.closeContactSidebar();
}

// ============================================
// MOBILE MENU & SIDEBAR
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

    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
        });
    });
    
    if (contactToggleBtn && heroSidebar) {
        contactToggleBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
            
            heroSidebar.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
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
    
    if (heroSidebar) {
        heroSidebar.addEventListener('click', function(e) {
            if (e.target === heroSidebar) {
                closeContactSidebar();
            }
        });
    }
    
    // Обработчик для всех кнопок открытия сайдбара, включая кнопки сотрудников
    const openSidebarBtns = document.querySelectorAll('.open-sidebar-btn, .team-contact-btn');
    openSidebarBtns.forEach(btn => {
        // Проверяем, что кнопка не является ссылкой в навигации
        if (btn.tagName === 'A' && btn.closest('.nav-menu')) {
            return;
        }
        
        // Удаляем inline onclick если есть
        if (btn.hasAttribute('onclick')) {
            btn.removeAttribute('onclick');
        }
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openContactSidebar();
        });
    });
    
    // Обработчики для кнопок в сайдбаре
    document.querySelectorAll('.contact-btn').forEach(btn => {
        if (btn.tagName === 'A' && btn.closest('.nav-menu')) {
            return;
        }
        
        // Пропускаем кнопки экскурсий - у них свой обработчик
        if (btn.classList.contains('excursion-btn')) {
            return;
        }
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const source = this.getAttribute('data-source') || 'Страница "О нас"';
            if (typeof window.openCallbackModal === 'function') {
                window.openCallbackModal(source);
            }
        });
    });
    
    // Отдельная обработка кнопки экскурсии
    document.querySelectorAll('.excursion-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const source = this.getAttribute('data-source') || 'Экскурсия по объектам';
            if (typeof window.openCallbackModal === 'function') {
                window.openCallbackModal(source);
            }
        });
    });
    
    // Обработчик для кнопок footer-btn
    document.querySelectorAll('.footer-btn').forEach(btn => {
        // Пропускаем кнопки, которые уже обработаны как open-sidebar-btn
        if (btn.classList.contains('open-sidebar-btn')) {
            return;
        }
        
        // Удаляем inline onclick если есть
        if (btn.hasAttribute('onclick')) {
            btn.removeAttribute('onclick');
        }
        
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const source = this.getAttribute('data-source') || 'Футер (О нас)';
            if (typeof window.openCallbackModal === 'function') {
                window.openCallbackModal(source);
            } else {
                // Если модальное окно недоступно, открываем сайдбар
                openContactSidebar();
            }
        });
    });
    
    // Обработчик для вкладок команды (Руководство, Архитекторы, Дизайнеры, Строители)
    // Используем прямой обработчик для каждой кнопки
    const teamTabs = document.querySelectorAll('button.team-tab');
    if (teamTabs.length > 0) {
        teamTabs.forEach(tab => {
            // Проверяем, что это действительно кнопка вкладки
            if (!tab.hasAttribute('data-team')) {
                return;
            }
            
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Удаляем активный класс со всех вкладок
                const allTabs = document.querySelectorAll('button.team-tab');
                allTabs.forEach(t => t.classList.remove('active'));
                
                // Добавляем активный класс к текущей вкладке
                tab.classList.add('active');
                
                // Скрываем все блоки с карточками команды
                const allCards = document.querySelectorAll('.team-cards');
                allCards.forEach(cards => {
                    cards.classList.remove('active');
                });
                
                // Показываем нужный блок с карточками
                const teamId = tab.getAttribute('data-team');
                if (teamId) {
                    const targetCards = document.getElementById(teamId);
                    if (targetCards) {
                        targetCards.classList.add('active');
                    }
                }
            });
        });
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
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', resetScroll);
    } else {
        resetScroll();
    }
    
    window.addEventListener('load', resetScroll);
})();

document.addEventListener('DOMContentLoaded', function () {
    function forceResetScroll(element) {
        if (!element) return;
        element.style.scrollBehavior = 'auto';
        element.style.setProperty('scroll-behavior', 'auto', 'important');
        element.style.justifyContent = 'flex-start';
        element.scrollLeft = 0;
        element.scrollTo(0, 0);
        if (element.scrollLeft !== 0) {
            element.scrollLeft = 0;
        }
    }
    
    const allTeamCardsContainers = document.querySelectorAll('.team-cards');
    allTeamCardsContainers.forEach(function(cards) {
        forceResetScroll(cards);
        cards.style.justifyContent = 'flex-start';
    });
    
    // Обработчик для вкладок команды уже добавлен в первом блоке DOMContentLoaded
    // Здесь только обновляем скролл при переключении вкладок через делегирование событий
    // Используем MutationObserver для отслеживания изменений класса active
    
    function resetTeamCardsScroll() {
        const activeCards = document.querySelector('.team-cards.active');
        if (activeCards) {
            activeCards.style.scrollBehavior = 'auto';
            activeCards.scrollLeft = 0;
            activeCards.scrollTo(0, 0);
        }
    }
    
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
    
    const allTeamCards = document.querySelectorAll('.team-cards');
    allTeamCards.forEach(function(cards) {
        cards.style.scrollBehavior = 'auto';
        teamCardsObserver.observe(cards, {
            attributes: true,
            attributeFilter: ['class']
        });
    });
    
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
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
    
    let scrollResetInterval = setInterval(function() {
        const activeCards = document.querySelector('.team-cards.active');
        if (activeCards && activeCards.scrollLeft !== 0) {
            activeCards.style.scrollBehavior = 'auto';
            activeCards.style.justifyContent = 'flex-start';
            activeCards.scrollLeft = 0;
        }
    }, 100);
    
    setTimeout(function() {
        clearInterval(scrollResetInterval);
    }, 3000);
});

// ============================================
// TESTIMONIALS SLIDER
// ============================================
let currentSlide = 0;
let currentTestimonialIndex = 1;
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
    
    if (prevBtn) prevBtn.style.display = currentSlide === 0 ? 'none' : 'flex';
    if (nextBtn) nextBtn.style.display = currentSlide >= maxSlide ? 'none' : 'flex';
}

window.moveTestimonialSlider = function(direction) {
    const slidesPerView = getSlidesPerView();
    const newSlide = currentSlide + direction;
    const maxSlide = totalSlides - slidesPerView;
    
    if (newSlide >= 0 && newSlide <= maxSlide) {
        goToSlide(newSlide);
    }
};

function initTestimonialsSlider() {
    testimonialSlides = document.querySelectorAll('.testimonial-slide');
    totalSlides = testimonialSlides.length;
    
    if (totalSlides > 0) {
        initTestimonialsDots();
        updateSliderPosition();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initTestimonialsSlider();
});

window.addEventListener('resize', function() {
    if (totalSlides > 0) {
        initTestimonialsDots();
        updateSliderPosition();
    }
});

const testimonials = [
    { id: 1, image: '../main_img/testimonials/Asanalieva.webp', title: 'Благодарственное письмо', description: 'Строительство производственного здания • 2024 • г. Минск, ул. Асаналиева' },
    { id: 2, image: '../main_img/testimonials/Evrostore.webp', title: 'Отзыв от Evrostore', description: 'Строительство торгового объекта • 2024 • Беларусь' },
    { id: 3, image: '../main_img/testimonials/MetroProect.webp', title: 'Благодарность от MetroProect', description: 'Сотрудничество по проектированию • 2023 • г. Минск' },
    { id: 4, image: '../main_img/testimonials/Ynikom.webp', title: 'Отзыв от Ynikom', description: 'Строительство офисного здания • 2023 • Беларусь' },
    { id: 5, image: '../main_img/testimonials/4_solnca.webp', title: 'Отзыв от "4 Солнца"', description: 'Строительство объекта • Беларусь' },
    { id: 6, image: '../main_img/testimonials/Alexandrov.webp', title: 'Благодарственное письмо', description: 'Строительный проект • Беларусь' },
    { id: 7, image: '../main_img/testimonials/BMT.webp', title: 'Отзыв от БМТ', description: 'Строительство производственного объекта • Беларусь' },
    { id: 8, image: '../main_img/testimonials/Granyldrev.webp', title: 'Отзыв от Гранилдрев', description: 'Строительство и ремонт • Беларусь' },
    { id: 9, image: '../main_img/testimonials/Terushki.webp', title: 'Благодарственное письмо', description: 'Строительство загородного дома • Беларусь' },
    { id: 10, image: '../main_img/testimonials/Victory.webp', title: 'Отзыв от Victory', description: 'Строительный проект • Беларусь' },
    { id: 11, image: '../main_img/testimonials/Vodokanal.webp', title: 'Отзыв от Водоканал', description: 'Строительство инфраструктурных объектов • Беларусь' },
    { id: 12, image: '../main_img/testimonials/Zelenstroy.webp', title: 'Отзыв от Зеленстрой', description: 'Ландшафтные и строительные работы • Беларусь' }
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
// DOCUMENTS SLIDER
// ============================================
let currentDocumentSlide = 0;
let currentDocumentIndex = 1;
let documentSlides = [];
let totalDocumentSlides = 0;

function getDocumentSlidesPerView() {
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
}

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

function updateDocumentDots() {
    const dots = document.querySelectorAll('#documentsSliderDots .slider-dot');
    const slidesPerView = getDocumentSlidesPerView();
    const activeDot = Math.floor(currentDocumentSlide / slidesPerView);
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeDot);
    });
}

function goToDocumentSlide(slideIndex) {
    const slidesPerView = getDocumentSlidesPerView();
    const maxSlide = totalDocumentSlides - slidesPerView;
    
    currentDocumentSlide = Math.max(0, Math.min(slideIndex, maxSlide));
    updateDocumentSliderPosition();
}

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

function updateDocumentArrows() {
    const prevBtn = document.querySelector('#documents .testimonials-slider-prev');
    const nextBtn = document.querySelector('#documents .testimonials-slider-next');
    const slidesPerView = getDocumentSlidesPerView();
    const maxSlide = totalDocumentSlides - slidesPerView;
    
    if (prevBtn) prevBtn.style.display = currentDocumentSlide === 0 ? 'none' : 'flex';
    if (nextBtn) nextBtn.style.display = currentDocumentSlide >= maxSlide ? 'none' : 'flex';
}

window.moveDocumentSlider = function(direction) {
    const slidesPerView = getDocumentSlidesPerView();
    const newSlide = currentDocumentSlide + direction;
    const maxSlide = totalDocumentSlides - slidesPerView;
    
    if (newSlide >= 0 && newSlide <= maxSlide) {
        goToDocumentSlide(newSlide);
    }
};

function initDocumentsSlider() {
    documentSlides = document.querySelectorAll('#documentsSliderTrack .testimonial-slide');
    totalDocumentSlides = documentSlides.length;
    
    if (totalDocumentSlides > 0) {
        initDocumentsDots();
        updateDocumentSliderPosition();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initDocumentsSlider();
});

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
        image: 'about_img/Otestat.webp',
        title: 'Аттестат соответствия',
        description: 'ООО "ТОПАГРОБЕЛ" • Аттестат соответствия'
    },
    {
        id: 2,
        image: 'about_img/Otestat2.webp',
        title: 'Аттестат соответствия',
        description: 'ООО "ТОПАГРОБЕЛ" • Аттестат соответствия'
    },
    {
        id: 3,
        image: 'about_img/Otestat3.webp',
        title: 'Аттестат соответствия',
        description: 'ООО "ТОПАГРОБЕЛ" • Аттестат соответствия'
    },
    {
        id: 4,
        image: 'about_img/Otestat4.webp',
        title: 'Аттестат соответствия',
        description: 'ООО "ТОПБИЛДИНГ" • Аттестат соответствия'
    },
    {
        id: 5,
        image: 'about_img/Otestat5.webp',
        title: 'Аттестат соответствия',
        description: 'ООО "ТОПБИЛДИНГ" • Аттестат соответствия'
    },
    {
        id: 6,
        image: 'about_img/Otestat6.webp',
        title: 'Аттестат соответствия',
        description: 'ООО "ТОПБИЛДИНГ" • Аттестат соответствия'
    }
];

window.openDocumentModal = function(index) {
    currentDocumentIndex = index;
    const modal = document.getElementById('documentModal');
    const docItem = documents.find(d => d.id === index);
    
    if (modal && docItem) {
        const img = document.getElementById('documentModalImage');
        const title = document.getElementById('documentModalTitle');
        const desc = document.getElementById('documentModalDescription');
        
        if (img) img.src = docItem.image;
        if (title) title.textContent = docItem.title;
        if (desc) desc.textContent = docItem.description;
        
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
        const img = document.getElementById('documentModalImage');
        const title = document.getElementById('documentModalTitle');
        const desc = document.getElementById('documentModalDescription');
        
        if (img) img.src = docItem.image;
        if (title) title.textContent = docItem.title;
        if (desc) desc.textContent = docItem.description;
        
        updateDocumentNavigation();
    }
};

function updateDocumentNavigation() {
    const prevBtn = document.querySelector('#documentModal .document-modal-prev');
    const nextBtn = document.querySelector('#documentModal .document-modal-next');
    
    if (prevBtn) prevBtn.style.display = 'flex';
    if (nextBtn) nextBtn.style.display = 'flex';
}

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

// Делаем функции глобальными для совместимости
if (typeof window.openCallbackModal !== 'function') {
    window.openCallbackModal = function(source) {
        console.warn('openCallbackModal не определена');
    };
}

if (typeof window.closeCallbackModal !== 'function') {
    window.closeCallbackModal = function() {
        console.warn('closeCallbackModal не определена');
    };
}

if (typeof window.openContactSidebar !== 'function') {
    window.openContactSidebar = function() {
        console.warn('openContactSidebar не определена');
    };
}

if (typeof window.closeContactSidebar !== 'function') {
    window.closeContactSidebar = function() {
        console.warn('closeContactSidebar не определена');
    };
}

