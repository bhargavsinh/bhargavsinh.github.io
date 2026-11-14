/* V20.0 Immersive engine — Three.js scroll world on homepage only.
   Content remains in HTML. Canvas is decorative; pointer-events none.
   Fallback when WebGL / reduced motion / missing THREE. */
(function () {
  'use strict';
  if (!document.body || !document.body.classList.contains('v20-immersive')) return;

  var reduced = false;
  try {
    reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (e) {}

  function fallback(reason) {
    document.body.classList.add('v20-fallback');
    if (window.console && reason) console.info('[V20] 2D fallback:', reason);
  }

  if (reduced) {
    fallback('reduced-motion');
    return;
  }
  if (typeof THREE === 'undefined') {
    fallback('three-missing');
    return;
  }

  var canvasHost = document.getElementById('v20-canvas-host');
  if (!canvasHost) {
    canvasHost = document.createElement('div');
    canvasHost.id = 'v20-canvas-host';
    canvasHost.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(canvasHost, document.body.firstChild);
  }

  var label = document.getElementById('v20-scene-label');
  if (!label) {
    label = document.createElement('div');
    label.id = 'v20-scene-label';
    label.setAttribute('aria-hidden', 'true');
    document.body.appendChild(label);
  }

  var sceneNames = [
    'Arrival',
    'Identity Hall',
    'Heritage Gallery',
    'Sanctuary',
    'Technology',
    'Library',
    'Vision',
    'Gateway'
  ];

  var renderer, scene, camera, goldLight, particles, arches, frame = 0, raf = 0;
  var targetZ = 30;
  var currentZ = 30;
  var sceneIndex = 0;
  var dprCap = 1.5;
  var mobile = false;

  try {
    mobile = window.matchMedia && window.matchMedia('(max-width: 699px)').matches;
    if (mobile) dprCap = 1.15;
  } catch (e2) {}

  try {
    renderer = new THREE.WebGLRenderer({
      antialias: !mobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
  } catch (err) {
    fallback('webgl-init');
    return;
  }

  if (!renderer || !renderer.getContext()) {
    fallback('no-webgl');
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x080808, 1);
  canvasHost.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080808, mobile ? 0.028 : 0.018);

  camera = new THREE.PerspectiveCamera(48, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 2.2, 30);

  var ambient = new THREE.AmbientLight(0x3a3428, 0.55);
  scene.add(ambient);
  var key = new THREE.DirectionalLight(0xf5f0e6, 0.65);
  key.position.set(5, 12, 8);
  scene.add(key);
  goldLight = new THREE.PointLight(0xc6a15b, 1.1, 40);
  goldLight.position.set(0, 3, 20);
  scene.add(goldLight);

  // Floor plane
  var floor = new THREE.Mesh(
    new THREE.PlaneGeometry(80, 200),
    new THREE.MeshStandardMaterial({ color: 0x12100e, metalness: 0.2, roughness: 0.9 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.02;
  scene.add(floor);

  // Procedural halls along -Z
  arches = new THREE.Group();
  scene.add(arches);
  var matStone = new THREE.MeshStandardMaterial({
    color: 0x2a261f,
    metalness: 0.15,
    roughness: 0.85
  });
  var matGold = new THREE.MeshStandardMaterial({
    color: 0xc6a15b,
    metalness: 0.7,
    roughness: 0.35,
    emissive: 0x3a2e14,
    emissiveIntensity: 0.25
  });

  function addArch(z, scale) {
    var g = new THREE.Group();
    var pillarGeo = new THREE.BoxGeometry(0.55 * scale, 4.2 * scale, 0.55 * scale);
    var left = new THREE.Mesh(pillarGeo, matStone);
    left.position.set(-3.2 * scale, 2.1 * scale, 0);
    var right = left.clone();
    right.position.x = 3.2 * scale;
    var beam = new THREE.Mesh(new THREE.BoxGeometry(7.2 * scale, 0.35 * scale, 0.55 * scale), matGold);
    beam.position.set(0, 4.3 * scale, 0);
    var gate = new THREE.Mesh(
      new THREE.TorusGeometry(1.35 * scale, 0.12 * scale, 8, mobile ? 16 : 24, Math.PI),
      matGold
    );
    gate.rotation.z = Math.PI;
    gate.position.set(0, 2.4 * scale, 0.2);
    g.add(left, right, beam, gate);
    g.position.z = z;
    arches.add(g);
  }

  for (var i = 0; i < 8; i++) {
    addArch(-i * 12, 1 + (i % 3) * 0.08);
  }

  // Side colonnades
  for (var s = 0; s < (mobile ? 12 : 20); s++) {
    var col = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 3.5, mobile ? 6 : 10),
      matStone
    );
    col.position.set(s % 2 === 0 ? -6.5 : 6.5, 1.75, -s * 5.5);
    scene.add(col);
  }

  // Gold particles
  var pCount = mobile ? 120 : 280;
  var pGeo = new THREE.BufferGeometry();
  var positions = new Float32Array(pCount * 3);
  for (var p = 0; p < pCount; p++) {
    positions[p * 3] = (Math.random() - 0.5) * 28;
    positions[p * 3 + 1] = Math.random() * 10 + 0.5;
    positions[p * 3 + 2] = -Math.random() * 100 + 20;
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({
      color: 0xd4af70,
      size: mobile ? 0.045 : 0.06,
      transparent: true,
      opacity: 0.65,
      depthWrite: false
    })
  );
  scene.add(particles);

  function mapScroll() {
    var doc = document.documentElement;
    var max = Math.max(1, (doc.scrollHeight || document.body.scrollHeight) - window.innerHeight);
    var t = Math.min(1, Math.max(0, (window.scrollY || window.pageYOffset || 0) / max));
    targetZ = 30 - t * 95;
    var idx = Math.min(sceneNames.length - 1, Math.floor(t * sceneNames.length));
    if (idx !== sceneIndex) {
      sceneIndex = idx;
      label.textContent = sceneNames[sceneIndex];
    }
    goldLight.position.z = targetZ - 8;
    goldLight.intensity = 0.85 + Math.sin(t * Math.PI) * 0.45;
  }

  function onResize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  var visible = true;
  function onVisibility() {
    visible = document.visibilityState !== 'hidden';
    if (visible && !raf) raf = requestAnimationFrame(tick);
  }

  function tick() {
    raf = 0;
    if (!visible) return;
    frame++;
    currentZ += (targetZ - currentZ) * 0.06;
    camera.position.z = currentZ;
    camera.position.y = 2.2 + Math.sin(frame * 0.008) * 0.08;
    camera.lookAt(0, 1.8, currentZ - 12);
    if (particles) {
      particles.rotation.y = frame * 0.00035;
    }
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }

  mapScroll();
  label.textContent = sceneNames[0];
  window.addEventListener('scroll', mapScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  raf = requestAnimationFrame(tick);

  // Optional GSAP ScrollTrigger polish if present
  try {
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      gsap.utils.toArray('main.page > section').forEach(function (sec) {
        gsap.fromTo(
          sec,
          { autoAlpha: 0.72, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 85%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }
  } catch (gErr) {
    /* content still works */
  }
})();
