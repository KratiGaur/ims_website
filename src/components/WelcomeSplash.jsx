import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './WelcomeSplash.css';

const SPLASH_DURATION = 5800;

function buildHelixScene(canvas) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080713, 0.036);

  const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0.35, 13.5);

  const cinematicGroup = new THREE.Group();
  cinematicGroup.rotation.set(-0.24, 0.18, -0.4);
  scene.add(cinematicGroup);

  const strandMaterial = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    transparent: true,
    opacity: 0.82,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const strandGlowMaterial = new THREE.MeshBasicMaterial({
    color: 0xf0abfc,
    transparent: true,
    opacity: 0.16,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const rungMaterial = new THREE.MeshBasicMaterial({
    color: 0xf5d0fe,
    transparent: true,
    opacity: 0.34,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const auraMaterial = new THREE.MeshBasicMaterial({
    color: 0xf472b6,
    transparent: true,
    opacity: 0.07,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  });

  const makeHelixPoints = (phase, radius = 2.15, length = 15, turns = 2.85) => {
    const points = [];
    const segments = 260;

    for (let i = 0; i <= segments; i += 1) {
      const t = i / segments;
      const angle = t * Math.PI * 2 * turns + phase;
      const taper = 0.72 + Math.sin(t * Math.PI) * 0.58;
      const x = Math.cos(angle) * radius * taper;
      const y = (t - 0.5) * length;
      const z = Math.sin(angle) * radius * 0.62 * taper;
      points.push(new THREE.Vector3(x, y, z));
    }

    return points;
  };

  const leftPoints = makeHelixPoints(0);
  const rightPoints = makeHelixPoints(Math.PI);
  const leftCurve = new THREE.CatmullRomCurve3(leftPoints);
  const rightCurve = new THREE.CatmullRomCurve3(rightPoints);

  [leftCurve, rightCurve].forEach((curve) => {
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 220, 0.025, 8, false), strandMaterial);
    const glow = new THREE.Mesh(new THREE.TubeGeometry(curve, 220, 0.12, 10, false), strandGlowMaterial);
    cinematicGroup.add(glow, tube);
  });

  const rungGeometry = new THREE.CylinderGeometry(0.018, 0.018, 1, 8);
  for (let i = 8; i <= 92; i += 4) {
    const t = i / 100;
    const start = leftCurve.getPointAt(t);
    const end = rightCurve.getPointAt(t);
    const center = start.clone().lerp(end, 0.5);
    const direction = end.clone().sub(start);
    const rung = new THREE.Mesh(rungGeometry, rungMaterial);

    rung.scale.set(1, direction.length(), 1);
    rung.position.copy(center);
    rung.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    cinematicGroup.add(rung);
  }

  const auraGeometry = new THREE.TorusGeometry(2.95, 0.52, 24, 160);
  for (let i = 0; i < 9; i += 1) {
    const aura = new THREE.Mesh(auraGeometry, auraMaterial);
    aura.position.y = -6.4 + i * 1.6;
    aura.rotation.x = Math.PI / 2;
    aura.scale.setScalar(0.55 + Math.sin(i * 0.75) * 0.1);
    cinematicGroup.add(aura);
  }

  const particleCount = 520;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const colorA = new THREE.Color(0xa855f7);
  const colorB = new THREE.Color(0xf472b6);

  for (let i = 0; i < particleCount; i += 1) {
    const index = i * 3;
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.2 + Math.random() * 7.2;
    positions[index] = Math.cos(angle) * radius;
    positions[index + 1] = (Math.random() - 0.5) * 16;
    positions[index + 2] = Math.sin(angle) * radius * 0.52 + (Math.random() - 0.5) * 3.5;

    const mixed = colorA.clone().lerp(colorB, Math.random() * 0.42);
    colors[index] = mixed.r;
    colors[index + 1] = mixed.g;
    colors[index + 2] = mixed.b;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  );
  scene.add(particles);

  const resize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.position.z = width < 720 ? 17 : 13.5;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  resize();
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  let frameId = 0;

  const animate = () => {
    const elapsed = clock.getElapsedTime();

    cinematicGroup.rotation.y = 0.22 + elapsed * 0.34;
    cinematicGroup.rotation.z = -0.46 + Math.sin(elapsed * 0.42) * 0.12;
    cinematicGroup.position.z = Math.sin(elapsed * 0.58) * 0.65;
    particles.rotation.y = elapsed * -0.06;
    particles.rotation.z = elapsed * 0.025;

    renderer.render(scene, camera);
    frameId = window.requestAnimationFrame(animate);
  };

  animate();

  return () => {
    window.cancelAnimationFrame(frameId);
    window.removeEventListener('resize', resize);
    renderer.dispose();

    scene.traverse((object) => {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  };
}

export default function WelcomeSplash() {
  const canvasRef = useRef(null);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    document.body.classList.add('splash-active');

    return () => {
      document.body.classList.remove('splash-active');
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return undefined;
    return buildHelixScene(canvasRef.current);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsFading(true), SPLASH_DURATION);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isFading) return undefined;

    document.body.classList.remove('splash-active');
    const timer = setTimeout(() => {
      const el = document.getElementById('reactSplashRoot');
      if (el) el.remove();
    }, 800);

    return () => clearTimeout(timer);
  }, [isFading]);

  return (
    <div id="reactSplashRoot" className={`splash-screen ${isFading ? 'fade-out' : ''}`}>
      <canvas ref={canvasRef} className="dna-canvas" aria-hidden="true" />
      <div className="splash-vignette" aria-hidden="true" />
      <div className="splash-copy">
        <span className="splash-kicker">Young Radiation Oncology Conference</span>
        <h1>YROC 2027</h1>
      </div>
    </div>
  );
}
