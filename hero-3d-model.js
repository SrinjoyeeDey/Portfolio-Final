/**
 * 3D Character Model Interactive Stage
 * Loads and renders '3d character model.glb' cleanly without circular clipping
 * Inspired by the 3D character portfolio reference design.
 */

(function () {
  function initHero3D() {
    const container = document.getElementById('hero-3d-model-stage');
    const canvas = document.getElementById('hero-3d-canvas');
    if (!container || !canvas) return;

    if (typeof THREE === 'undefined' || typeof THREE.GLTFLoader === 'undefined') {
      console.warn('Three.js or GLTFLoader not loaded yet, retrying...');
      setTimeout(initHero3D, 150);
      return;
    }

    // Set up Scene
    const scene = new THREE.Scene();

    // Camera: portrait focal length (~38 deg FOV) to avoid perspective distortion
    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
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
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
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
    const modelUrls = ['3d character model.glb', 'character_model.glb'];
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

          // Fade in canvas
          canvas.classList.add('loaded');
        },
        (xhr) => {
          if (xhr.lengthComputable && loaderStatus) {
            const percent = Math.round((xhr.loaded / xhr.total) * 100);
            const text = loaderStatus.querySelector('.indicator-text');
            if (text) text.textContent = `Loading 3D Model ${percent}%`;
          }
        },
        (error) => {
          console.warn(`Failed to load ${url}:`, error);
          currentUrlIndex++;
          if (currentUrlIndex < modelUrls.length) {
            loadModel(modelUrls[currentUrlIndex]);
          } else {
            if (loaderStatus) {
              const text = loaderStatus.querySelector('.indicator-text');
              if (text) text.textContent = 'Ready';
            }
          }
        }
      );
    }

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

    window.addEventListener('mousemove', (e) => {
      if (isDragging) return;
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - (rect.left + rect.width / 2);
      const mouseY = e.clientY - (rect.top + rect.height / 2);

      // Gentle interactive head/torso turn towards cursor within clamped range
      const calculatedY = (mouseX / window.innerWidth) * 0.45;
      const calculatedX = (mouseY / window.innerHeight) * 0.25;

      targetRotationY = Math.max(MIN_ROTATION_Y, Math.min(MAX_ROTATION_Y, calculatedY));
      targetRotationX = Math.max(MIN_ROTATION_X, Math.min(MAX_ROTATION_X, calculatedX));

      // Subtle 3D room optical parallax illusion
      const roomGrid = document.getElementById('hero-room-perspective-grid');
      if (roomGrid) {
        const roomShiftX = (mouseX / window.innerWidth) * -7;
        const roomShiftY = (mouseY / window.innerHeight) * -5;
        roomGrid.style.transform = `translate3d(${roomShiftX}px, ${roomShiftY}px, 0)`;
      }
    });

    // Touch / Drag to rotate manually with strict clamp (cannot turn around completely)
    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
    });
    window.addEventListener('mouseup', () => {
      isDragging = false;
    });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const nextY = targetRotationY + deltaX * 0.008;
        // Strictly lock to front left/right arc only
        targetRotationY = Math.max(MIN_ROTATION_Y, Math.min(MAX_ROTATION_Y, nextY));
        prevMouseX = e.clientX;
      }
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
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();
    function animate() {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

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
    }

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHero3D);
  } else {
    initHero3D();
  }
})();
