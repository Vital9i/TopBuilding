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



