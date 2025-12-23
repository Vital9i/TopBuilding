// ============================================
// AOS INITIALIZATION
// ============================================
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
}

// ============================================
// CONTACT SIDEBAR FUNCTIONS
// ============================================
function openContactSidebar() {
    const heroSidebar = document.getElementById('heroSidebar');
    if (heroSidebar) {
        heroSidebar.classList.add('active');
    }
}

window.openContactSidebar = openContactSidebar;

// ============================================
// TELEGRAM CALLBACK SYSTEM
// ============================================
let currentCallbackSource = 'Страница строительства';

function openCallbackModal(source = 'Страница строительства') {
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
}

window.openCallbackModal = openCallbackModal;

function closeCallbackModal() {
    const modal = document.getElementById('callbackModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

window.closeCallbackModal = closeCallbackModal;

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
    
    return await response.json();
}

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
            sidebarCloseBtn.addEventListener('click', function() {
                heroSidebar.classList.remove('active');
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
    
    // Фиксация хедера при скролле
    window.addEventListener('scroll', function () {
        const header = document.getElementById('mainHeader');
        if (header) {
            if (window.pageYOffset > 100) {
                header.classList.add('fixed');
            } else {
                header.classList.remove('fixed');
            }
        }
    });

    // Переключение технологий строительства
    const techTabs = document.querySelectorAll('.tech-tab-modern');
    techTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            techTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            document.querySelectorAll('.tech-content-modern').forEach(content => {
                content.classList.remove('active');
            });
            
            const techId = tab.getAttribute('data-tech');
            const selectedContent = document.getElementById(techId);
            if (selectedContent) {
                selectedContent.classList.add('active');
            }
        });
    });
    
    // Слайдер инженерных сетей
    const engineeringTabs = document.querySelectorAll('.engineering-tab');
    const engineeringContents = document.querySelectorAll('.engineering-content');
    const engineeringPrevBtn = document.querySelector('.engineering-nav-prev');
    const engineeringNextBtn = document.querySelector('.engineering-nav-next');
    let currentEngineeringSlide = 0;
    
    const engineeringSlides = ['electricity', 'water', 'heating', 'ventilation', 'smart-home'];
    
    function showEngineeringSlide(index) {
        engineeringTabs.forEach((tab, i) => {
            if (i === index) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
        
        engineeringContents.forEach((content, i) => {
            if (i === index) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
        
        currentEngineeringSlide = index;
    }
    
    if (engineeringTabs.length > 0) {
        engineeringTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => {
                showEngineeringSlide(index);
            });
        });
    }
    
    if (engineeringPrevBtn) {
        engineeringPrevBtn.addEventListener('click', () => {
            const prevIndex = currentEngineeringSlide === 0 ? engineeringSlides.length - 1 : currentEngineeringSlide - 1;
            showEngineeringSlide(prevIndex);
        });
    }
    
    if (engineeringNextBtn) {
        engineeringNextBtn.addEventListener('click', () => {
            const nextIndex = currentEngineeringSlide === engineeringSlides.length - 1 ? 0 : currentEngineeringSlide + 1;
            showEngineeringSlide(nextIndex);
        });
    }
    
    // Обработка всех кнопок "Заказать звонок"
    document.querySelectorAll('.contact-btn, .footer-btn, .open-sidebar-btn, .hero-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.classList.contains('excursion-btn') || this.getAttribute('data-source')) {
                return;
            }
            
            if (this.onclick && this.onclick.toString().includes('openContactSidebar')) {
                return;
            }
            
            if (this.onclick && this.onclick.toString().includes('openCallbackModal')) {
                return;
            }
            
            e.preventDefault();
            e.stopPropagation();
            openCallbackModal('Страница строительства');
        });
    });
    
    // Обработка кнопок экскурсии
    document.querySelectorAll('.excursion-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const source = this.getAttribute('data-source') || 'Экскурсия по объектам';
            openCallbackModal(source);
        });
    });
    
    // Обработка формы обратного звонка
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
    
    // Закрытие модального окна по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeCallbackModal();
        }
    });
});

// ============================================
// ROOF TYPES SLIDER
// ============================================
(function() {
    const sliderWrapper = document.querySelector('.roof-types-slider-wrapper');
    if (!sliderWrapper) return;
    
    const track = sliderWrapper.querySelector('.roof-slider-track');
    const slides = sliderWrapper.querySelectorAll('.roof-slide');
    const prevBtn = sliderWrapper.querySelector('.roof-slider-btn-prev');
    const nextBtn = sliderWrapper.querySelector('.roof-slider-btn-next');
    const dotsContainer = sliderWrapper.parentElement.querySelector('.roof-slider-dots');
    
    let currentSlide = 0;
    
    if (dotsContainer) {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'roof-slider-dot' + (index === 0 ? ' active' : '');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }
    
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.roof-slider-dot') : [];
    
    function updateSlider() {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentSlide);
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        if (prevBtn) prevBtn.disabled = currentSlide === 0;
        if (nextBtn) nextBtn.disabled = currentSlide === slides.length - 1;
    }
    
    function goToSlide(index) {
        currentSlide = index;
        updateSlider();
    }
    
    function nextSlide() {
        if (currentSlide < slides.length - 1) {
            currentSlide++;
            updateSlider();
        }
    }
    
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlider();
        }
    }
    
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    
    updateSlider();
})();

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



