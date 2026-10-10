// ==========================================================================
// SMART KRISHI - LUXURY MAGNETIC MOTION CURSOR
// ==========================================================================

(function initLuxuryCursor() {
    // Check desktop & reduced motion
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check localStorage toggle
    const cursorDisabled = localStorage.getItem('smart_krishi_cursor_disabled') === 'true';

    if (!isDesktop || prefersReducedMotion || cursorDisabled) {
        document.body.style.cursor = 'auto';
        return;
    }

    // Hide default system cursor on body
    document.body.style.cursor = 'none';

    // Create Cursor Elements
    const dot = document.createElement('div');
    dot.id = 'cursor-dot';

    const ring = document.createElement('div');
    ring.id = 'cursor-ring';

    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let isHovering = false;
    let isClicking = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    });

    // Lerp Ring towards Mouse Position
    function renderCursor() {
        const dx = mouseX - ringX;
        const dy = mouseY - ringY;

        ringX += dx * 0.18;
        ringY += dy * 0.18;

        // Velocity-based squash & stretch calculation
        const speed = Math.sqrt(dx * dx + dy * dy);
        const maxStretch = Math.min(speed * 0.008, 0.4);
        const scaleX = 1 + maxStretch;
        const scaleY = 1 - maxStretch * 0.6;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        if (!isHovering) {
            ring.style.transform = `translate(${ringX}px, ${ringY}px) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;
        } else {
            ring.style.transform = `translate(${ringX}px, ${ringY}px) scale(1)`;
        }

        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Magnetic and interactive elements binding
    function bindInteractiveElements() {
        const targets = document.querySelectorAll('a, button, input, select, textarea, .glass-card, [data-cursor-hover]');

        targets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                isHovering = true;
                if (el.tagName === 'INPUT' || el.tagName === 'SELECT' || el.tagName === 'TEXTAREA') {
                    ring.style.width = '6px';
                    ring.style.height = '32px';
                    ring.style.borderRadius = '3px';
                    ring.style.borderColor = 'var(--primary-light)';
                    ring.style.backgroundColor = 'var(--primary-light)';
                    ring.style.opacity = '0.9';
                } else if (el.classList.contains('btn') || el.classList.contains('logo')) {
                    ring.style.width = '55px';
                    ring.style.height = '55px';
                    ring.style.borderRadius = '50%';
                    ring.style.borderColor = 'var(--primary-light)';
                    ring.style.backgroundColor = 'rgba(16, 185, 129, 0.18)';
                    ring.style.boxShadow = '0 0 20px var(--primary-glow)';
                } else {
                    ring.style.width = '45px';
                    ring.style.height = '45px';
                    ring.style.borderRadius = '50%';
                    ring.style.borderColor = 'rgba(52, 211, 153, 0.8)';
                    ring.style.backgroundColor = 'rgba(52, 211, 153, 0.08)';
                }
            });

            el.addEventListener('mouseleave', () => {
                isHovering = false;
                ring.style.width = '36px';
                ring.style.height = '36px';
                ring.style.borderRadius = '50%';
                ring.style.borderColor = 'rgba(52, 211, 153, 0.65)';
                ring.style.backgroundColor = 'transparent';
                ring.style.boxShadow = 'none';
                ring.style.opacity = '1';
            });
        });
    }

    bindInteractiveElements();

    // Re-bind when DOM changes
    const observer = new MutationObserver(() => bindInteractiveElements());
    observer.observe(document.body, { childList: true, subtree: true });

    // Click Shockwave Burst
    window.addEventListener('mousedown', () => {
        isClicking = true;
        ring.style.transform += ' scale(0.85)';
    });

    window.addEventListener('mouseup', () => {
        isClicking = false;
    });

    window.addEventListener('click', (e) => {
        const ripple = document.createElement('div');
        Object.assign(ripple.style, {
            position: 'fixed',
            top: `${e.clientY}px`,
            left: `${e.clientX}px`,
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            border: '2px solid var(--primary-light)',
            boxShadow: '0 0 15px var(--primary)',
            pointerEvents: 'none',
            zIndex: '99997',
            transform: 'translate(-50%, -50%)',
            transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
        });

        document.body.appendChild(ripple);

        requestAnimationFrame(() => {
            ripple.style.width = '75px';
            ripple.style.height = '75px';
            ripple.style.opacity = '0';
        });

        setTimeout(() => ripple.remove(), 550);
    });

    // Window leave detection
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });
})();
