// ============================================
// AOS INITIALIZATION
// ============================================
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });
}

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
});

// ============================================
// TELEGRAM CALLBACK SYSTEM
// ============================================
let currentCallbackSource = 'Страница партнеров';

window.openCallbackModal = function(source = 'Страница партнеров') {
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
            
            const source = this.getAttribute('data-source') || 'Страница партнеров';
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





