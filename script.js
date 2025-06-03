// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Плавящееся меню на мобиле
(function() {
    var lastScroll = window.scrollY;
    var header = document.querySelector('.sidebar-header');
    var ticking = false;
    var isMobile = window.matchMedia('(max-width: 900px)').matches;
    if (!header) return;

    function onScroll() {
        if (!isMobile) return;
        var currentScroll = window.scrollY;
        
        // Hide header when scrolling down, show when scrolling up
        if (currentScroll > lastScroll && currentScroll > 30) {
            // Scrolling down
            header.style.transform = 'translateY(-120%)';
            header.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin-top 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        } else if (currentScroll < lastScroll) {
            // Scrolling up
            header.style.transform = 'translateY(0)';
            header.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), margin-top 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        
        lastScroll = currentScroll;
    }

    const debouncedScroll = debounce(() => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                onScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, 10);

    window.addEventListener('scroll', debouncedScroll, { passive: true });

    // Сброс при ресайзе
    const debouncedResize = debounce(() => {
        isMobile = window.matchMedia('(max-width: 900px)').matches;
        if (!isMobile && header) {
            header.style.transform = '';
            header.style.transition = '';
        }
    }, 250);

    window.addEventListener('resize', debouncedResize, { passive: true });
})();

// Плавящееся нижнее меню-кнопка на мобиле с учётом spacer и анимацией
(function() {
    var lastScroll = window.scrollY;
    var btn = document.querySelector('.sidebar-action');
    var spacer = document.querySelector('.sidebar-action-spacer');
    var ticking = false;
    var isMobile = window.matchMedia('(max-width: 900px)').matches;
    if (!btn || !spacer) return;
    function onScroll() {
        if (!isMobile) return;
        var currentScroll = window.scrollY;
        var btnHeight = btn.offsetHeight + 16; // 16px bottom
        var spacerRect = spacer.getBoundingClientRect();
        var windowHeight = window.innerHeight;
        // Если spacer виден внизу экрана — стопорим кнопку
        if (spacerRect.top < windowHeight - btnHeight) {
            btn.style.position = 'absolute';
            btn.style.bottom = (windowHeight - spacerRect.top + 16) + 'px';
            btn.style.transform = 'translateY(0)'; // всегда видна
            btn.style.transition = 'none'; // без анимации
        } else {
            btn.style.position = 'fixed';
            btn.style.bottom = '16px';
            btn.style.transition = 'transform 0.3s';
            // Плавящееся поведение
            if (currentScroll < lastScroll || currentScroll < 30) {
                // Скроллим вверх — прячем кнопку
                btn.style.transform = 'translateY(120%)';
            } else {
                // Скроллим вниз — показываем кнопку
                btn.style.transform = 'translateY(0)';
            }
        }
        lastScroll = currentScroll;
    }
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                onScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    window.addEventListener('resize', function() {
        isMobile = window.matchMedia('(max-width: 900px)').matches;
        if (!isMobile && btn) {
            btn.style.position = '';
            btn.style.bottom = '';
            btn.style.transform = '';
        }
    });
    onScroll();
})();

// Оптимизированная функция updateCornerPositions
const debouncedUpdateCornerPositions = debounce(() => {
    document.querySelectorAll('.gallery-item-wrap').forEach(wrap => {
        const info = wrap.querySelector('.gallery-info--mobile');
        const cornerRight = wrap.querySelector('.corner-right');
        const cornerTop = wrap.querySelector('.corner-top');
        
        if (info && cornerRight) {
            if (window.innerWidth <= 900) {
                const left = info.offsetLeft + info.offsetWidth;
                cornerRight.style.left = (left - 30) + 'px';
            } else {
                cornerRight.style.left = '';
            }
        }
        
        if (info && cornerTop) {
            if (window.innerWidth <= 900) {
                const top = info.offsetTop + info.offsetHeight;
                cornerTop.style.top = (top - 55.5) + 'px';
                cornerTop.style.bottom = '';
            } else {
                cornerTop.style.top = '';
                cornerTop.style.bottom = '';
            }
        }
    });
}, 100);

window.addEventListener('resize', debouncedUpdateCornerPositions, { passive: true });
window.addEventListener('DOMContentLoaded', debouncedUpdateCornerPositions);

// Управление выпадающим меню в sidebar-header
(function() {
    const header = document.querySelector('.sidebar-header');
    const burger = header.querySelector('.sidebar-burger');
    const menuLinks = header.querySelectorAll('.sidebar-menu-link');
    const socialLinks = header.querySelectorAll('.sidebar-social-menu');
    const body = document.body;
    let isOpen = false;
    let isMobile = window.matchMedia('(max-width: 900px)').matches;

    // Создаем оверлей
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    function openMenu() {
        header.classList.add('menu-open');
        burger.classList.add('open');
        if (isMobile) {
            body.classList.add('menu-open');
        }
        isOpen = true;
        
        // Add staggered animation for menu links
        menuLinks.forEach((link, index) => {
            link.style.transitionDelay = `${index * 0.1}s`;
        });

        // Add staggered animation for social links
        socialLinks.forEach((link, index) => {
            link.style.transitionDelay = `${(menuLinks.length + index) * 0.1}s`;
        });
    }

    function closeMenu() {
        header.classList.remove('menu-open');
        burger.classList.remove('open');
        body.classList.remove('menu-open');
        isOpen = false;
        
        // Reset transition delays
        menuLinks.forEach(link => {
            link.style.transitionDelay = '0s';
        });
        socialLinks.forEach(link => {
            link.style.transitionDelay = '0s';
        });
    }

    function toggleMenu() {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    burger.addEventListener('click', toggleMenu);

    // Закрытие по клику вне меню
    document.addEventListener('mousedown', (e) => {
        if (isOpen && !header.contains(e.target)) {
            closeMenu();
        }
    });

    // Закрытие по Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isOpen) {
            closeMenu();
        }
    });

    // Закрытие по клику на оверлей
    overlay.addEventListener('click', closeMenu);

    // Обновление isMobile при ресайзе
    window.addEventListener('resize', () => {
        isMobile = window.matchMedia('(max-width: 900px)').matches;
        if (!isMobile) {
            body.classList.remove('menu-open');
        }
    });
})();

// Handle Projects and About links click
(function() {
    const projectsLink = document.querySelector('.sidebar-menu-link');
    const aboutLink = document.querySelectorAll('.sidebar-menu-link')[1];
    const galleryItems = document.querySelectorAll('.gallery-item-wrap');
    const header = document.querySelector('.sidebar-header');
    const burger = header?.querySelector('.sidebar-burger');
    const body = document.body;

    function handleNavigation(targetId, e) {
        e.preventDefault();
        
        // Check if we're on the main page
        const isMainPage = window.location.pathname.endsWith('index.html') || 
                         window.location.pathname.endsWith('/') ||
                         window.location.pathname === '';

        if (isMainPage) {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const isMobile = window.matchMedia('(max-width: 900px)').matches;
                const offset = isMobile ? 16 : 32;
                
                // Calculate the scroll position with offset
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                // Smooth scroll to the target section with offset
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Add animation for gallery items if navigating to gallery
                if (targetId === 'gallery') {
                    galleryItems.forEach((item, index) => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }

                // Close menu on mobile
                if (isMobile && header && burger) {
                    header.classList.remove('menu-open');
                    burger.classList.remove('open');
                    body.classList.remove('menu-open');
                }
            }
        } else {
            // Redirect to main page with target section
            window.location.href = `index.html#${targetId}`;
        }
    }

    if (projectsLink) {
        projectsLink.addEventListener('click', (e) => handleNavigation('gallery', e));
    }
    
    if (aboutLink) {
        aboutLink.addEventListener('click', (e) => handleNavigation('about', e));
    }
})();

// Handle anchor navigation on page load
(function() {
    function handleAnchorNavigation() {
        const hash = window.location.hash;
        if (hash === '#gallery' || hash === '#about') {
            const targetId = hash.substring(1); // Remove # from hash
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const isMobile = window.matchMedia('(max-width: 900px)').matches;
                const offset = isMobile ? 16 : 32;
                
                // Calculate the scroll position with offset
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                // Smooth scroll to the target section with offset
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Add animation for gallery items if navigating to gallery
                if (targetId === 'gallery') {
                    const galleryItems = document.querySelectorAll('.gallery-item-wrap');
                    galleryItems.forEach((item, index) => {
                        item.style.opacity = '0';
                        item.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0)';
                        }, index * 100);
                    });
                }
            }
        }
    }

    // Handle both initial page load and hash changes
    window.addEventListener('load', handleAnchorNavigation);
    window.addEventListener('hashchange', handleAnchorNavigation);
})();

// Custom cursor for sidebar-action (реализация через отдельный div)
(function() {
    const button = document.querySelector('.sidebar-action');
    const nextProjectBlock = document.querySelector('.wm-next-project-block');
    if (!button && !nextProjectBlock) return;

    // Создаём div для курсора
    const cursor = document.createElement('div');
    cursor.style.position = 'fixed';
    cursor.style.width = '24px';
    cursor.style.height = '24px';
    cursor.style.borderRadius = '0 16px 16px 16px';
    cursor.style.background = '#fff';
    cursor.style.mixBlendMode = 'difference';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    cursor.style.transition = 'transform 0.15s cubic-bezier(.4,1.7,.7,1.01)';
    cursor.style.display = 'none';
    document.body.appendChild(cursor);

    function moveCursor(e) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
    function showCursor() {
        cursor.style.display = 'block';
        cursor.style.transform = 'translate(-50%, -50%) scale(1.2)';
    }
    function hideCursor() {
        cursor.style.display = 'none';
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    }

    if (button) {
        button.addEventListener('mouseenter', showCursor);
        button.addEventListener('mousemove', moveCursor);
        button.addEventListener('mouseleave', hideCursor);
    }

    // Добавляем обработчики для next-project-block только на десктопе
    if (nextProjectBlock && !window.matchMedia('(max-width: 900px)').matches) {
        nextProjectBlock.addEventListener('mouseenter', showCursor);
        nextProjectBlock.addEventListener('mousemove', moveCursor);
        nextProjectBlock.addEventListener('mouseleave', hideCursor);
    }
})();

// Connect button scroll behavior
let lastScrollTop = 0;
const connectButtonBlur = document.querySelector('.sidebar-action-mobile-blur');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
    );
    
    // Проверяем, достигли ли мы конца страницы
    const isAtBottom = windowHeight + scrollTop >= documentHeight - 20; // 20px погрешность
    
    if (isAtBottom) {
        // Если достигли конца страницы, показываем кнопку
        connectButtonBlur.classList.add('visible');
    } else if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down and past 100px
        connectButtonBlur.classList.add('visible');
    } else if (scrollTop < lastScrollTop) {
        // Scrolling up
        connectButtonBlur.classList.remove('visible');
    }
    lastScrollTop = scrollTop;
});

// Show button on page load if scrolled
window.addEventListener('load', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
    );
    
    // Проверяем, достигли ли мы конца страницы
    const isAtBottom = windowHeight + scrollTop >= documentHeight - 20;
    
    if (isAtBottom || scrollTop > 100) {
        connectButtonBlur.classList.add('visible');
    }
});
