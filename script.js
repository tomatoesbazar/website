// =============================================
//   TOMATOES BAZAR — Redesigned Scripts
// =============================================

// ── Smooth Scroll ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── Header shadow on scroll ──
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile Nav Toggle ──
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('mobileToggle');
    const links  = document.getElementById('navLinks');

    if (toggle && links) {
        toggle.addEventListener('click', () => {
            const open = links.classList.toggle('open');
            toggle.classList.toggle('open', open);
        });

        links.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => {
                links.classList.remove('open');
                toggle.classList.remove('open');
            });
        });

        document.addEventListener('click', e => {
            if (!links.contains(e.target) && !toggle.contains(e.target)) {
                links.classList.remove('open');
                toggle.classList.remove('open');
            }
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                links.classList.remove('open');
                toggle.classList.remove('open');
            }
        });
    }
});

// ── Generic Carousel Class ──
class Carousel {
    constructor(container, autoDelay = 5000) {
        this.container  = container;
        this.slides     = [...container.querySelectorAll('.carousel-slide, .hero-slide')];
        this.dots       = [...container.querySelectorAll('.c-dot, .dot')];
        this.prevBtn    = container.querySelector('.c-nav.prev, .hero-nav.prev');
        this.nextBtn    = container.querySelector('.c-nav.next, .hero-nav.next');
        this.current    = 0;
        this.timer      = null;
        this.delay      = autoDelay;

        if (this.slides.length < 2) return;
        this.go(0);
        this.bind();
        this.play();
    }

    go(idx) {
        this.slides[this.current].classList.remove('active');
        this.dots[this.current]?.classList.remove('active');
        this.current = (idx + this.slides.length) % this.slides.length;
        this.slides[this.current].classList.add('active');
        this.dots[this.current]?.classList.add('active');
    }

    next() { this.go(this.current + 1); this.reset(); }
    prev() { this.go(this.current - 1); this.reset(); }

    play()  { this.timer = setInterval(() => this.next(), this.delay); }
    stop()  { clearInterval(this.timer); }
    reset() { this.stop(); this.play(); }

    bind() {
        this.nextBtn?.addEventListener('click', () => this.next());
        this.prevBtn?.addEventListener('click', () => this.prev());
        this.dots.forEach((d, i) => d.addEventListener('click', () => { this.go(i); this.reset(); }));

        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.stop());
        this.container.addEventListener('mouseleave', () => this.play());

        // Touch swipe
        let touchX = 0;
        this.container.addEventListener('touchstart', e => { touchX = e.changedTouches[0].screenX; }, { passive: true });
        this.container.addEventListener('touchend', e => {
            const diff = touchX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) diff > 0 ? this.next() : this.prev();
        }, { passive: true });
    }
}

// ── Init Carousels ──
document.addEventListener('DOMContentLoaded', () => {
    const heroEl = document.getElementById('heroCarousel');
    if (heroEl) new Carousel(heroEl, 5000);
});

// ── Today's Bakery Special ──
document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().getDay(); // 0=Sun, 1=Mon … 6=Sat
    document.querySelectorAll('.special-row[data-day]').forEach(row => {
        if (parseInt(row.dataset.day) === today) {
            row.classList.add('today');
        }
    });
});

// ── Menu Lightbox ──
document.addEventListener('DOMContentLoaded', () => {
    const lightbox  = document.getElementById('menuLightbox');
    const imgEl     = document.getElementById('lightboxImg');
    const bg        = document.getElementById('lightboxBg');
    const closeBtn  = document.getElementById('lightboxClose');
    if (!lightbox) return;

    const open = (src, label) => {
        imgEl.src = src;
        imgEl.alt = label || 'Menu';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    };
    const close = () => {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => { imgEl.src = ''; }, 300);
    };

    document.querySelectorAll('.menu-trigger').forEach(btn => {
        btn.addEventListener('click', () => open(btn.dataset.menu, btn.dataset.label));
    });
    bg?.addEventListener('click', close);
    closeBtn?.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('open')) close(); });
});

// ── Fade-up on scroll ──
document.addEventListener('DOMContentLoaded', () => {
    const targets = document.querySelectorAll(
        '.dept-card, .why-card, .mv-card, .pillar, .about-mascot, .gallery-row, .contact-item, .stat, .blog-card, .article-inner'
    );

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    targets.forEach((el, i) => {
        el.classList.add('fade-up');
        el.style.transitionDelay = `${(i % 6) * 60}ms`;
        io.observe(el);
    });
});