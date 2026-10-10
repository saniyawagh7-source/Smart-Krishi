// ==========================================================================
// SMART KRISHI - 3D LIVING AGRICULTURAL BIOSPHERE & TERRAIN WAVES
// Built with Three.js (r128)
// ==========================================================================

(function init3DBiosphere() {
    // Respect user motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const canvas = document.getElementById('webgl-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // Scene & Fog
    const scene = new THREE.Scene();
    const bgDark = 0x071009;
    scene.fog = new THREE.FogExp2(bgDark, 0.028);

    // Camera
    const camera = new THREE.PerspectiveCamera(
        60, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    camera.position.set(0, 12, 38);
    camera.lookAt(0, -2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true, 
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Helper: Create soft circular glow particle texture in memory
    function createGlowSprite() {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 64;
        pCanvas.height = 64;
        const ctx = pCanvas.getContext('2d');
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(110, 231, 183, 0.85)');
        gradient.addColorStop(0.7, 'rgba(16, 185, 129, 0.3)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);

        const texture = new THREE.CanvasTexture(pCanvas);
        return texture;
    }

    function createSporeSprite() {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 64;
        pCanvas.height = 64;
        const ctx = pCanvas.getContext('2d');
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.4, 'rgba(251, 191, 36, 0.9)');
        gradient.addColorStop(0.8, 'rgba(245, 158, 11, 0.25)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);

        const texture = new THREE.CanvasTexture(pCanvas);
        return texture;
    }

    const glowTexture = createGlowSprite();
    const sporeTexture = createSporeSprite();

    // 1. TERRAIN WAVE PARTICLES (Undulating Agricultural Field Topology)
    const SEPARATION_X = 1.4;
    const SEPARATION_Z = 1.4;
    const AMOUNT_X = 55;
    const AMOUNT_Z = 45;
    const totalWaveParticles = AMOUNT_X * AMOUNT_Z;

    const wavePositions = new Float32Array(totalWaveParticles * 3);
    const waveScales = new Float32Array(totalWaveParticles);

    let idx = 0;
    for (let ix = 0; ix < AMOUNT_X; ix++) {
        for (let iz = 0; iz < AMOUNT_Z; iz++) {
            const x = (ix - AMOUNT_X / 2) * SEPARATION_X;
            const z = (iz - AMOUNT_Z / 2) * SEPARATION_Z;
            const y = -10;

            wavePositions[idx * 3] = x;
            wavePositions[idx * 3 + 1] = y;
            wavePositions[idx * 3 + 2] = z;

            waveScales[idx] = 1.0;
            idx++;
        }
    }

    const waveGeometry = new THREE.BufferGeometry();
    waveGeometry.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
    waveGeometry.setAttribute('scale', new THREE.BufferAttribute(waveScales, 1));

    const waveMaterial = new THREE.PointsMaterial({
        size: 0.9,
        map: glowTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: 0x34D399,
        opacity: 0.65
    });

    const waveParticles = new THREE.Points(waveGeometry, waveMaterial);
    scene.add(waveParticles);

    // 2. ATMOSPHERIC BIO-SPORES (Floating Pollen & Nutrient Spores)
    const sporeCount = 150;
    const sporePositions = new Float32Array(sporeCount * 3);
    const sporeVelocities = [];

    for (let i = 0; i < sporeCount; i++) {
        sporePositions[i * 3] = (Math.random() - 0.5) * 80;
        sporePositions[i * 3 + 1] = (Math.random() - 0.5) * 45;
        sporePositions[i * 3 + 2] = (Math.random() - 0.5) * 50;

        sporeVelocities.push({
            x: (Math.random() - 0.5) * 0.015,
            y: 0.01 + Math.random() * 0.02,
            z: (Math.random() - 0.5) * 0.015,
            wiggle: Math.random() * Math.PI * 2
        });
    }

    const sporeGeometry = new THREE.BufferGeometry();
    sporeGeometry.setAttribute('position', new THREE.BufferAttribute(sporePositions, 3));

    const sporeMaterial = new THREE.PointsMaterial({
        size: 1.2,
        map: sporeTexture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: 0xFBBF24,
        opacity: 0.75
    });

    const spores = new THREE.Points(sporeGeometry, sporeMaterial);
    scene.add(spores);

    // Interactive mouse tracking & parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 12;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

        targetCameraX = mouseX * 8;
        targetCameraY = 12 + mouseY * 4;
    });

    // Touch support for mobile parallax
    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;
            targetCameraX = mouseX * 4;
            targetCameraY = 12 + mouseY * 2;
        }
    }, { passive: true });

    // Animation Loop
    let count = 0;
    function animate() {
        requestAnimationFrame(animate);

        count += 0.022;

        // 1. Animate Wave Coordinates
        const positions = waveGeometry.attributes.position.array;
        let pIndex = 0;
        for (let ix = 0; ix < AMOUNT_X; ix++) {
            for (let iz = 0; iz < AMOUNT_Z; iz++) {
                // Wave harmonic equations
                const waveY = (Math.sin((ix + count) * 0.3) * 2.5) +
                              (Math.sin((iz + count) * 0.5) * 2.5) +
                              (Math.cos((ix + iz + count) * 0.2) * 1.5) - 6;

                positions[pIndex * 3 + 1] = waveY;
                pIndex++;
            }
        }
        waveGeometry.attributes.position.needsUpdate = true;

        // 2. Animate Atmospheric Spores (Upward organic drift)
        const sPositions = sporeGeometry.attributes.position.array;
        for (let i = 0; i < sporeCount; i++) {
            const v = sporeVelocities[i];
            v.wiggle += 0.03;

            sPositions[i * 3] += v.x + Math.sin(v.wiggle) * 0.02;
            sPositions[i * 3 + 1] += v.y;
            sPositions[i * 3 + 2] += v.z + Math.cos(v.wiggle) * 0.02;

            // Reset loop if particle floats beyond ceiling
            if (sPositions[i * 3 + 1] > 25) {
                sPositions[i * 3 + 1] = -20;
                sPositions[i * 3] = (Math.random() - 0.5) * 80;
                sPositions[i * 3 + 2] = (Math.random() - 0.5) * 50;
            }
        }
        sporeGeometry.attributes.position.needsUpdate = true;

        // 3. Smooth Camera Parallax Damping
        camera.position.x += (targetCameraX - camera.position.x) * 0.035;
        camera.position.y += (targetCameraY - camera.position.y) * 0.035;
        camera.lookAt(0, -3, 0);

        renderer.render(scene, camera);
    }

    animate();

    // Responsive Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();
