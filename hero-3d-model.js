/**
 * 3D Character Model Interactive Stage
 * Loads and renders '3d character model.glb' cleanly without circular clipping
 * Inspired by the 3D character portfolio reference design.
 */

(function () {
  // Global 3D Model lifecycle state for preloader coordination
  window.__hero3DState = window.__hero3DState || {
    status: 'loading',
    progress: 0,
    error: null
  };

  let threeCheckRetries = 0;
  function initHero3D() {
    const container = document.getElementById('hero-3d-model-stage');
    const canvas = document.getElementById('hero-3d-canvas');
    if (!container || !canvas) {
      setTimeout(initHero3D, 100);
      return;
    }

    if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
      threeCheckRetries++;
      if (threeCheckRetries > 40) {
        window.__hero3DState = {
          status: 'error',
          progress: 0,
          error: new Error('Three.js or GLTFLoader library unavailable')
        };
        window.dispatchEvent(new CustomEvent('hero-3d:error', { detail: { error: window.__hero3DState.error } }));
        return;
      }
      setTimeout(initHero3D, 150);
      return;
    }

    // Set up Scene
    const scene = new THREE.Scene();

    // Camera: portrait focal length (~38 deg FOV) to avoid perspective distortion
    const aspect = (container.clientWidth > 0 && container.clientHeight > 0)
      ? (container.clientWidth / container.clientHeight)
      : (window.innerWidth < 768 ? 1 : 720 / 820);
    const camera = new THREE.PerspectiveCamera(
      38,
      aspect,
      0.1,
      1000
    );

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
    const initW = container.clientWidth || (window.innerWidth < 768 ? 290 : 720);
    const initH = container.clientHeight || (window.innerWidth < 768 ? 290 : 820);
    renderer.setSize(initW, initH);
    if (renderer.outputEncoding !== undefined) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    } else if (renderer.outputColorSpace !== undefined) {
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    }
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92; // Prevent highlight blowouts, preserve skin and butter yellow hoodie tones
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting (Warm, calibrated studio lighting for natural skin tones & rich textures)
    // Soft sky and warm floor bounce to fill shadows with warmth
    const hemiLight = new THREE.HemisphereLight(0xffeed4, 0x3d3025, 0.7);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xfff6ea, 0.35);
    scene.add(ambientLight);

    // Key Light (Soft warm studio light, gentle angle)
    const keyLight = new THREE.DirectionalLight(0xfff5e4, 0.95);
    keyLight.position.set(3, 4, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 512;
    keyLight.shadow.mapSize.height = 512;
    scene.add(keyLight);

    // Fill Light (Soft warm butter bounce)
    const fillLight = new THREE.DirectionalLight(0xffe6c2, 0.45);
    fillLight.position.set(-3.5, 1.5, 2.5);
    scene.add(fillLight);

    // Rim / Hair Light (Warm golden edge accent)
    const rimLight = new THREE.DirectionalLight(0xffc857, 0.65);
    rimLight.position.set(2, 4, -3.5);
    scene.add(rimLight);

    // Ground Contact Shadow Disk
    const shadowGeo = new THREE.PlaneGeometry(3.5, 3.5);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    const grad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
    grad.addColorStop(0, 'rgba(24, 24, 27, 0.28)');
    grad.addColorStop(0.5, 'rgba(24, 24, 27, 0.1)');
    grad.addColorStop(1, 'rgba(24, 24, 27, 0)');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -1.2;
    scene.add(shadowMesh);

    // Character Group for rotation & idle animation
    const characterGroup = new THREE.Group();
    scene.add(characterGroup);

    // Load Model
    const loader = new THREE.GLTFLoader();
    const modelUrls = ['character_model.glb', '3d%20character%20model.glb', '3d character model.glb'];
    let currentUrlIndex = 0;

    const loaderStatus = document.getElementById('hero-3d-loading-indicator');

    function loadModel(url) {
      if (loaderStatus) loaderStatus.style.display = 'flex';

      loader.load(
        url,
        (gltf) => {
          if (loaderStatus) loaderStatus.style.display = 'none';
          const model = gltf.scene;

          // Compute exact bounding box and center
          const box = new THREE.Box3().setFromObject(model);
          const size = new THREE.Vector3();
          box.getSize(size);
          const center = new THREE.Vector3();
          box.getCenter(center);

          // Center the model in local group
          model.position.x = -center.x;
          model.position.y = -box.min.y; // Sit flat on floor
          model.position.z = -center.z;

          // Scale model so upper torso and head are comfortably framed with ample headroom
          const maxDim = Math.max(size.x, size.y, size.z);
          const targetHeight = 2.05;
          const scale = targetHeight / maxDim;
          characterGroup.scale.set(scale, scale, scale);

          // Position character group so head and hair are comfortably below top edge
          characterGroup.position.set(0, -1.22, 0);

          // Enable shadows and enhance materials for rich skin & texture fidelity
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;

              const materials = Array.isArray(child.material) ? child.material : [child.material];
              materials.forEach((mat) => {
                if (!mat) return;

                // Ensure all color maps use sRGB encoding to prevent washed-out white appearance
                if (mat.map) {
                  if (mat.map.encoding !== undefined) mat.map.encoding = THREE.sRGBEncoding;
                  if (mat.map.colorSpace !== undefined) mat.map.colorSpace = THREE.SRGBColorSpace;
                  mat.map.needsUpdate = true;
                }

                if (mat.emissiveMap) {
                  if (mat.emissiveMap.encoding !== undefined) mat.emissiveMap.encoding = THREE.sRGBEncoding;
                  if (mat.emissiveMap.colorSpace !== undefined) mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
                }

                // Give skin and clothing natural matte diffusion without harsh plastic specular glare
                mat.roughness = Math.max(mat.roughness !== undefined ? mat.roughness : 0.8, 0.72);
                mat.metalness = Math.min(mat.metalness !== undefined ? mat.metalness : 0.05, 0.1);

                mat.needsUpdate = true;
              });
            }
          });

          characterGroup.add(model);

          // Initial position camera with wider vertical clearance for hair and head
          camera.position.set(0, 0.28, 3.8);
          camera.lookAt(0, -0.05, 0);

          // Force resize to current layout dimensions
          handleResize();

          // Render one frame immediately to compile shaders & upload geometry to GPU
          try {
            renderer.render(scene, camera);
          } catch (renderErr) {
            console.warn('Initial 3D render warning:', renderErr);
          }

          // Fade in canvas
          canvas.classList.add('loaded');

          // Signal successful 3D model initialization
          window.__hero3DState = {
            status: 'success',
            progress: 100,
            error: null
          };
          window.dispatchEvent(new CustomEvent('hero-3d:loaded', { detail: { model } }));
        },
        (xhr) => {
          if (xhr.lengthComputable) {
            const percent = Math.min(99, Math.round((xhr.loaded / xhr.total) * 100));
            window.__hero3DState.progress = percent;
            window.dispatchEvent(new CustomEvent('hero-3d:progress', { detail: { progress: percent } }));
            if (loaderStatus) {
              const text = loaderStatus.querySelector('.indicator-text');
              if (text) text.textContent = `Loading 3D Model ${percent}%`;
            }
          }
        },
        (error) => {
          console.warn(`Failed to load ${url}:`, error);
          currentUrlIndex++;
          if (currentUrlIndex < modelUrls.length) {
            loadModel(modelUrls[currentUrlIndex]);
          } else {
            window.__hero3DState = {
              status: 'error',
              progress: 0,
              error: error || new Error('Failed to load 3D character model')
            };
            window.dispatchEvent(new CustomEvent('hero-3d:error', { detail: { error: window.__hero3DState.error } }));
            if (loaderStatus) {
              const text = loaderStatus.querySelector('.indicator-text');
              if (text) text.textContent = 'Error loading 3D Model';
            }
          }
        }
      );
    }

    // Expose retry function if needed by error fallback
    window.__hero3DRetry = function () {
      currentUrlIndex = 0;
      window.__hero3DState = {
        status: 'loading',
        progress: 0,
        error: null
      };
      loadModel(modelUrls[0]);
    };

    loadModel(modelUrls[currentUrlIndex]);

    // Mouse Tracking & Drag Interaction with Strict Rotation Angle Limits
    // Allowed to turn left or right only (~48 deg max), never completely around/backwards
    const MAX_ROTATION_Y = 0.85;  // ~48 degrees max right turn
    const MIN_ROTATION_Y = -0.85; // ~48 degrees max left turn
    const MAX_ROTATION_X = 0.22;  // ~12 degrees max down tilt
    const MIN_ROTATION_X = -0.22; // ~12 degrees max up tilt

    let targetRotationY = 0;
    let targetRotationX = 0;
    let currentRotationY = 0;
    let currentRotationX = 0;
    let isDragging = false;
    let prevMouseX = 0;
    let isHeroVisible = true;
    let containerRect = container.getBoundingClientRect();
    let containerRectDirty = false;
    const roomGrid = document.getElementById('hero-room-perspective-grid');

    function updateContainerRect() {
      containerRect = container.getBoundingClientRect();
      containerRectDirty = false;
    }

    // Track visibility so off-screen WebGL rendering & mousemove work pause cleanly
    if ('IntersectionObserver' in window) {
      const heroStageTarget = document.getElementById('hero') || container;
      const heroVisObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          isHeroVisible = entry.isIntersecting;
          if (isHeroVisible) {
            containerRectDirty = true;
            wakeAnimate();
          }
        },
        { rootMargin: '250px 0px', threshold: 0 }
      );
      heroVisObserver.observe(heroStageTarget);
    }

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const nextY = targetRotationY + deltaX * 0.008;
        // Strictly lock to front left/right arc only
        targetRotationY = Math.max(MIN_ROTATION_Y, Math.min(MAX_ROTATION_Y, nextY));
        prevMouseX = e.clientX;
        return;
      }

      if (!isHeroVisible || document.hidden) return;
      if (containerRectDirty) updateContainerRect();

      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      const mouseX = e.clientX - (containerRect.left + containerRect.width / 2);
      const mouseY = e.clientY - (containerRect.top + containerRect.height / 2);

      // Gentle interactive head/torso turn towards cursor within clamped range
      const calculatedY = (mouseX / vw) * 0.45;
      const calculatedX = (mouseY / vh) * 0.25;

      targetRotationY = Math.max(MIN_ROTATION_Y, Math.min(MAX_ROTATION_Y, calculatedY));
      targetRotationX = Math.max(MIN_ROTATION_X, Math.min(MAX_ROTATION_X, calculatedX));

      // Subtle 3D room optical parallax illusion
      if (roomGrid) {
        const roomShiftX = (mouseX / vw) * -7;
        const roomShiftY = (mouseY / vh) * -5;
        roomGrid.style.transform = `translate3d(${roomShiftX}px, ${roomShiftY}px, 0)`;
      }
    }, { passive: true });

    // Touch / Drag to rotate manually with strict clamp (cannot turn around completely)
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
    });
    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Mobile Touch Drag Support
    container.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
      }
    }, { passive: true });
    window.addEventListener('touchend', () => {
      isDragging = false;
    });
    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches && e.touches[0]) {
        const deltaX = e.touches[0].clientX - prevMouseX;
        const nextY = targetRotationY + deltaX * 0.008;
        targetRotationY = Math.max(MIN_ROTATION_Y, Math.min(MAX_ROTATION_Y, nextY));
        prevMouseX = e.touches[0].clientX;
      }
    }, { passive: true });

    // Resize Handler
    function handleResize() {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth || (window.innerWidth < 768 ? 290 : 720);
      const height = container.clientHeight || (window.innerWidth < 768 ? 290 : 820);
      if (width <= 0 || height <= 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      updateContainerRect();
    }
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handleResize);
    window.addEventListener('scroll', () => {
      if (isHeroVisible) containerRectDirty = true;
    }, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(handleResize, 150));
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        handleResize();
        wakeAnimate();
      }
    });

    // Animation Loop (sleeps automatically when hero is off-screen or tab is hidden)
    let rafId = null;
    let lastFrameTime = performance.now();
    let elapsedTime = 0;

    function animate(now) {
      rafId = null;
      if (!isHeroVisible || document.hidden) return;

      const dt = Math.min(0.05, Math.max(0, (now - lastFrameTime) / 1000));
      lastFrameTime = now;
      elapsedTime += dt;

      // Smooth lerp to mouse look
      currentRotationY += (targetRotationY - currentRotationY) * 0.06;
      currentRotationX += (targetRotationX - currentRotationX) * 0.06;

      // Subtle breathing idle float
      const idleFloat = Math.sin(elapsedTime * 1.6) * 0.025;
      const idleTilt = Math.cos(elapsedTime * 1.2) * 0.015;

      characterGroup.rotation.y = currentRotationY + idleTilt;
      characterGroup.rotation.x = currentRotationX;
      characterGroup.position.y = -1.22 + idleFloat;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    }

    function wakeAnimate() {
      if (!rafId && isHeroVisible && !document.hidden) {
        lastFrameTime = performance.now();
        rafId = requestAnimationFrame(animate);
      }
    }

    wakeAnimate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero3D);
  } else {
    initHero3D();
  }
})();
