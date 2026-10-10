// ==========================================================================
// SMART KRISHI - MOTION GRAPHICS & INTERACTION ENGINE
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initScrollAnimations();
    initNavbar();
    initCardTilt();
    initGauges();
    initSensorSimulation();
    initFertilizerCalculator();
    initCropSearch();
    initCursorToggle();
});

// 1. PAGE LOADER
function initLoader() {
    const loader = document.getElementById('loader');
    if (!loader) {
        triggerHeroReveal();
        return;
    }

    window.addEventListener('load', () => {
        if (typeof gsap !== 'undefined') {
            gsap.to(loader, {
                opacity: 0,
                duration: 0.6,
                delay: 0.2,
                ease: 'power2.inOut',
                onComplete: () => {
                    loader.style.display = 'none';
                    triggerHeroReveal();
                }
            });
        } else {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                    triggerHeroReveal();
                }, 500);
            }, 300);
        }
    });
}

// 2. HERO & SCROLL ENTRANCE ANIMATIONS
function triggerHeroReveal() {
    if (typeof gsap === 'undefined') {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
        return;
    }

    const tl = gsap.timeline();

    if (document.querySelector('.hero-badge')) {
        tl.from('.hero-badge', { y: -20, opacity: 0, duration: 0.6, ease: 'back.out(1.7)' });
    }

    if (document.querySelector('.hero-title')) {
        tl.from('.hero-title', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3');
    }

    if (document.querySelector('.subhead')) {
        tl.from('.subhead', { y: 20, opacity: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5');
    }

    if (document.querySelector('.hero-btns')) {
        tl.from('.hero-btns', { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4');
    }

    if (document.querySelector('.hero-telemetry-card')) {
        tl.from('.hero-telemetry-card', { 
            scale: 0.95, 
            y: 30, 
            opacity: 0, 
            duration: 0.9, 
            ease: 'power3.out' 
        }, '-=0.6');
    }

    initCounters();
}

function initScrollAnimations() {
    // Intersection Observer for .reveal elements
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Animate any gauges or counters inside this element
                    animateContainedGauges(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        reveals.forEach(el => observer.observe(el));
    } else {
        reveals.forEach(el => el.classList.add('is-visible'));
    }
}

function initCounters() {
    document.querySelectorAll('.count-up').forEach(el => {
        const target = parseFloat(el.getAttribute('data-val') || el.innerText);
        if (isNaN(target)) return;

        let start = 0;
        const duration = 1600;
        const startTime = performance.now();

        function updateCounter(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeProgress);
            el.innerText = current;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                el.innerText = target;
            }
        }
        requestAnimationFrame(updateCounter);
    });
}

// 3. NAVBAR SCROLL EFFECT
function initNavbar() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });
}

// 4. 3D CARD TILT & SPECULAR LIGHTING
function initCardTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;

    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // Subtle 3D tilt
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// 5. CIRCULAR SVG GAUGES
function initGauges() {
    document.querySelectorAll('.circle-gauge').forEach(gauge => {
        const percent = parseFloat(gauge.getAttribute('data-percent') || 0);
        const bar = gauge.querySelector('.circle-bar');
        if (bar) {
            const radius = 45;
            const circumference = 2 * Math.PI * radius; // ~282.7
            const offset = circumference - (percent / 100) * circumference;
            bar.style.strokeDasharray = `${circumference}`;
            bar.style.strokeDashoffset = `${circumference}`;
            
            // Animate after short delay
            setTimeout(() => {
                bar.style.strokeDashoffset = `${offset}`;
            }, 300);
        }
    });
}

function animateContainedGauges(parent) {
    parent.querySelectorAll('.circle-gauge').forEach(gauge => {
        const percent = parseFloat(gauge.getAttribute('data-percent') || 0);
        const bar = gauge.querySelector('.circle-bar');
        if (bar) {
            const circumference = 2 * Math.PI * 45;
            const offset = circumference - (percent / 100) * circumference;
            bar.style.strokeDashoffset = `${offset}`;
        }
    });
}

// 6. HOMEPAGE LIVE SENSOR SIMULATOR
function initSensorSimulation() {
    const simBtn = document.getElementById('run-sim-btn');
    if (!simBtn) return;

    const moistureVal = document.getElementById('sim-moisture');
    const phVal = document.getElementById('sim-ph');
    const nVal = document.getElementById('sim-n');
    const pVal = document.getElementById('sim-p');
    const kVal = document.getElementById('sim-k');
    const simCrop = document.getElementById('sim-crop');
    const card = document.querySelector('.hero-telemetry-card');

    simBtn.addEventListener('click', () => {
        simBtn.innerText = 'Scanning Soil Matrix...';
        simBtn.classList.add('btn-shimmer');
        if (card) card.classList.add('scanning');

        // Audio or visual cue
        showCustomToast('📡 Probing IoT Sensor & Ingesting Soil Telemetry...');

        setTimeout(() => {
            // Random simulated data reflecting realistic high quality Indian farm soil
            const mockData = [
                { m: 58, ph: 6.6, n: 140, p: 48, k: 55, crop: 'Wheat (Rabi)', badge: 'Optimal 96%' },
                { m: 72, ph: 6.2, n: 130, p: 38, k: 45, crop: 'Rice (Kharif)', badge: 'Optimal 94%' },
                { m: 48, ph: 6.8, n: 135, p: 60, k: 50, crop: 'Maize (Kharif)', badge: 'High 92%' },
                { m: 52, ph: 7.1, n: 110, p: 52, k: 58, crop: 'Cotton (Kharif)', badge: 'Optimal 95%' }
            ];
            const selected = mockData[Math.floor(Math.random() * mockData.length)];

            if (moistureVal) moistureVal.innerText = selected.m;
            if (phVal) phVal.innerText = selected.ph;
            if (nVal) nVal.innerText = selected.n;
            if (pVal) pVal.innerText = selected.p;
            if (kVal) kVal.innerText = selected.k;
            if (simCrop) simCrop.innerText = selected.crop;

            // Trigger particle gauge update
            const simGauge = document.getElementById('sim-moisture-gauge');
            if (simGauge) {
                simGauge.style.height = `${selected.m}%`;
            }

            if (card) card.classList.remove('scanning');
            simBtn.innerText = '✓ Probed Successfully - Click to Re-test';
            simBtn.classList.remove('btn-shimmer');
            showCustomToast(`🌿 Top Neural Match: ${selected.crop} (${selected.badge})`);
        }, 1200);
    });
}

// 7. REAL-TIME FERTILIZER ACREAGE CALCULATOR (Result Page)
function initFertilizerCalculator() {
    const acreSlider = document.getElementById('acre-slider');
    if (!acreSlider) return;

    const acreDisplay = document.getElementById('acre-display');
    const ureaBase = parseFloat(document.getElementById('base-urea')?.value || 0);
    const dapBase = parseFloat(document.getElementById('base-dap')?.value || 0);
    const mopBase = parseFloat(document.getElementById('base-mop')?.value || 0);

    const ureaOut = document.getElementById('out-urea');
    const dapOut = document.getElementById('out-dap');
    const mopOut = document.getElementById('out-mop');

    function updateCalculations() {
        const acres = parseFloat(acreSlider.value);
        if (acreDisplay) acreDisplay.innerText = acres.toFixed(1);

        if (ureaOut) ureaOut.innerText = Math.round(ureaBase * acres);
        if (dapOut) dapOut.innerText = Math.round(dapBase * acres);
        if (mopOut) mopOut.innerText = Math.round(mopBase * acres);
    }

    acreSlider.addEventListener('input', updateCalculations);
    updateCalculations();
}

// 8. CROP SEARCH & FILTER (Crop Guide Page)
function initCropSearch() {
    const searchInput = document.getElementById('crop-search');
    const seasonFilters = document.querySelectorAll('.season-filter-btn');
    const cropCards = document.querySelectorAll('.crop-guide-card');

    if (!cropCards.length) return;

    let activeSeason = 'all';

    function filterCrops() {
        const query = (searchInput?.value || '').toLowerCase().trim();

        cropCards.forEach(card => {
            const name = card.getAttribute('data-name')?.toLowerCase() || '';
            const season = card.getAttribute('data-season')?.toLowerCase() || '';
            const matchesSearch = name.includes(query);
            const matchesSeason = (activeSeason === 'all') || season.includes(activeSeason);

            if (matchesSearch && matchesSeason) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(15px)';
                setTimeout(() => {
                    if (card.style.opacity === '0') card.style.display = 'none';
                }, 200);
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterCrops);
    }

    seasonFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            seasonFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeSeason = btn.getAttribute('data-season') || 'all';
            filterCrops();
        });
    });
}

// 9. LUXURY TOAST NOTIFICATIONS
function showCustomToast(msg) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: '999999',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            pointerEvents: 'none'
        });
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    Object.assign(toast.style, {
        background: 'rgba(11, 25, 15, 0.92)',
        color: '#F1F5F0',
        padding: '0.9rem 1.4rem',
        borderRadius: '16px',
        border: '1px solid var(--glass-border-bright)',
        boxShadow: '0 15px 35px rgba(0,0,0,0.5), 0 0 15px var(--primary-glow)',
        backdropFilter: 'blur(16px)',
        fontSize: '0.92rem',
        fontWeight: '600',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        display: 'flex',
        alignItems: 'center',
        gap: '0.65rem',
        transform: 'translateY(20px)',
        opacity: '0',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: 'auto'
    });

    toast.innerHTML = `<span>${msg}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
    });

    setTimeout(() => {
        toast.style.transform = 'translateY(-15px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 400);
    }, 3800);
}

// Global hook for templates
window.showToast = showCustomToast;

// 10. CURSOR TOGGLE (Switch between Custom and System Cursor)
function initCursorToggle() {
    const toggleBtn = document.getElementById('cursor-toggle');
    if (!toggleBtn) return;

    const isDisabled = localStorage.getItem('smart_krishi_cursor_disabled') === 'true';
    updateCursorIcon(isDisabled);

    toggleBtn.addEventListener('click', () => {
        const currentlyDisabled = localStorage.getItem('smart_krishi_cursor_disabled') === 'true';
        const newState = !currentlyDisabled;
        localStorage.setItem('smart_krishi_cursor_disabled', newState.toString());

        updateCursorIcon(newState);
        showCustomToast(newState ? 'System cursor enabled' : 'Classy motion cursor enabled');

        // Reload quickly to apply cursor script cleanly
        setTimeout(() => location.reload(), 300);
    });

    function updateCursorIcon(disabled) {
        toggleBtn.innerHTML = disabled ? '🖱️' : '✨';
        toggleBtn.title = disabled ? 'Enable Motion Cursor' : 'Switch to Standard Cursor';
    }
}
