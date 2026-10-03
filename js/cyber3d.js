// Three.js Interactive 3D Cyber Core & Starfield for Abhisar Kumar's Portfolio
(function() {
  'use strict';

  // Check WebGL availability
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!window.THREE || !isWebGLAvailable()) {
    console.log('Three.js or WebGL not available, running standard mode.');
    return;
  }

  /* ==========================================================================
     1. GLOBAL 3D BACKGROUND NEBULA STARFIELD (Full Page Ambient 3D Depth)
     ========================================================================== */
  function initBackgroundNebula() {
    const bgContainer = document.getElementById('webgl-bg-container');
    if (!bgContainer) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 800;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    bgContainer.appendChild(renderer.domElement);

    // Create 3D particles with BufferGeometry
    const particleCount = 750;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const goldColor = new THREE.Color('#facc15');
    const amberColor = new THREE.Color('#f59e0b');
    const warmColor = new THREE.Color('#fef08a');

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 1600;
      positions[i3 + 1] = (Math.random() - 0.5) * 1600;
      positions[i3 + 2] = (Math.random() - 0.5) * 1200;

      const mixedColor = Math.random() > 0.5 ? (Math.random() > 0.5 ? goldColor : amberColor) : warmColor;
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material with soft circular texture
    const canvasTexture = createCircleTexture();
    const material = new THREE.PointsMaterial({
      size: 6,
      map: canvasTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse parallax tracking
    let targetX = 0, targetY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    window.addEventListener('mousemove', (e) => {
      targetX = (e.clientX - windowHalfX) * 0.15;
      targetY = (e.clientY - windowHalfY) * 0.15;
    });

    window.addEventListener('resize', () => {
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Animation Loop
    let isPageVisible = true;
    document.addEventListener('visibilitychange', () => {
      isPageVisible = !document.hidden;
    });

    function animate() {
      if (isPageVisible) {
        particles.rotation.y += 0.0006;
        particles.rotation.x += 0.0003;

        camera.position.x += (targetX - camera.position.x) * 0.04;
        camera.position.y += (-targetY - camera.position.y) * 0.04;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  // Soft circular particle texture generator
  function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.4, 'rgba(250, 204, 21, 0.8)');
    grad.addColorStop(1, 'rgba(250, 204, 21, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  /* ==========================================================================
     2. INTERACTIVE 3D CYBER CORE (Hero Section Hologram)
     ========================================================================== */
  function initCyberCore() {
    const container = document.getElementById('cyber-core-canvas-container');
    if (!container) return;

    const width = container.offsetWidth || 300;
    const height = container.offsetHeight || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xfacc15, 2.2);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight2.position.set(-5, -5, 5);
    scene.add(dirLight2);

    // Central Core Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Faceted Golden Core (Icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(1.4, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      metalness: 0.85,
      roughness: 0.15,
      flatShading: true,
      emissive: 0xd97706,
      emissiveIntensity: 0.25
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // 2. Outer Wireframe Cage (Dodecahedron)
    const wireGeo = new THREE.DodecahedronGeometry(1.85, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x18181b,
      wireframe: true,
      wireframeLinewidth: 2.5
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(wireMesh);

    // 3. Dual Gyroscopic Orbit Rings
    const ringGeo1 = new THREE.TorusGeometry(2.35, 0.035, 16, 64);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.1
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.65, 0.025, 16, 64);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      metalness: 0.6,
      roughness: 0.3
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    // 4. Orbiting Tech Satellites
    const satGroup = new THREE.Group();
    coreGroup.add(satGroup);

    const satCount = 4;
    const satMeshes = [];
    const satLabels = ['TS', 'PY', 'AI', 'DSA'];
    const satColors = [0x3178c6, 0xfacc15, 0x10b981, 0xef4444];

    for (let i = 0; i < satCount; i++) {
      const angle = (i / satCount) * Math.PI * 2;
      const satGeo = new THREE.SphereGeometry(0.22, 16, 16);
      const satMat = new THREE.MeshStandardMaterial({
        color: satColors[i],
        metalness: 0.8,
        roughness: 0.2,
        emissive: satColors[i],
        emissiveIntensity: 0.4
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      sat.userData = { angle: angle, radius: 2.35, speed: 0.02 + i * 0.005 };
      satGroup.add(sat);
      satMeshes.push(sat);
    }

    // 5. Interactive Click Shockwave Particle System
    const shockwaveParticles = [];
    const shockCount = 40;
    const shockGeo = new THREE.BufferGeometry();
    const shockPositions = new Float32Array(shockCount * 3);
    const shockVelocities = [];

    for (let i = 0; i < shockCount; i++) {
      shockPositions[i * 3] = 0;
      shockPositions[i * 3 + 1] = 0;
      shockPositions[i * 3 + 2] = 0;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = Math.random() * 0.12 + 0.05;

      shockVelocities.push(new THREE.Vector3(
        speed * Math.sin(phi) * Math.cos(theta),
        speed * Math.sin(phi) * Math.sin(theta),
        speed * Math.cos(phi)
      ));
    }

    shockGeo.setAttribute('position', new THREE.BufferAttribute(shockPositions, 3));
    const shockMat = new THREE.PointsMaterial({
      color: 0xfacc15,
      size: 0.15,
      transparent: true,
      opacity: 0
    });
    const shockSystem = new THREE.Points(shockGeo, shockMat);
    coreGroup.add(shockSystem);

    let shockwaveActive = false;
    let shockLife = 0;

    function triggerShockwave() {
      shockwaveActive = true;
      shockLife = 1.0;
      shockMat.opacity = 1.0;
      const pos = shockGeo.attributes.position.array;
      for (let i = 0; i < shockCount; i++) {
        pos[i * 3] = 0;
        pos[i * 3 + 1] = 0;
        pos[i * 3 + 2] = 0;
      }
      shockGeo.attributes.position.needsUpdate = true;

      // Speed burst on core
      rotVelocityX += (Math.random() - 0.5) * 0.2;
      rotVelocityY += 0.25;
    }

    // Drag-to-Rotate Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotVelocityX = 0;
    let rotVelocityY = 0;

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      triggerShockwave();
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        rotVelocityY = deltaX * 0.008;
        rotVelocityX = deltaY * 0.008;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    });

    // Touch support for mobile devices
    container.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
        triggerShockwave();
      }
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMouseX;
        const deltaY = e.touches[0].clientY - prevMouseY;
        rotVelocityY = deltaX * 0.008;
        rotVelocityX = deltaY * 0.008;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    });

    // Animation Loop
    function animateCore() {
      // Rotation with damping
      coreGroup.rotation.y += 0.012 + rotVelocityY;
      coreGroup.rotation.x += 0.006 + rotVelocityX;

      rotVelocityX *= 0.94;
      rotVelocityY *= 0.94;

      ring1.rotation.z += 0.015;
      ring2.rotation.z -= 0.018;

      // Update orbiting satellites
      satMeshes.forEach(sat => {
        sat.userData.angle += sat.userData.speed;
        sat.position.x = Math.cos(sat.userData.angle) * sat.userData.radius;
        sat.position.z = Math.sin(sat.userData.angle) * sat.userData.radius;
        sat.position.y = Math.sin(sat.userData.angle * 2) * 0.5;
      });

      // Update shockwave
      if (shockwaveActive) {
        shockLife -= 0.025;
        shockMat.opacity = Math.max(0, shockLife);
        const pos = shockGeo.attributes.position.array;
        for (let i = 0; i < shockCount; i++) {
          const vel = shockVelocities[i];
          pos[i * 3] += vel.x;
          pos[i * 3 + 1] += vel.y;
          pos[i * 3 + 2] += vel.z;
        }
        shockGeo.attributes.position.needsUpdate = true;
        if (shockLife <= 0) {
          shockwaveActive = false;
        }
      }

      renderer.render(scene, camera);
      requestAnimationFrame(animateCore);
    }
    animateCore();

    // Resize handler
    window.addEventListener('resize', () => {
      if (!container) return;
      const newWidth = container.offsetWidth || 300;
      const newHeight = container.offsetHeight || 300;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
  }

  // Initialize both when DOM is ready
  window.addEventListener('DOMContentLoaded', () => {
    initBackgroundNebula();
    initCyberCore();
  });
})();
