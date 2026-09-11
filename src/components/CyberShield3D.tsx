import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, ShieldCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface CyberShield3DProps {
  score?: number | null;
  className?: string;
  height?: number;
  interactive?: boolean;
}

export const CyberShield3D: React.FC<CyberShield3DProps> = ({
  score = null,
  className = '',
  height = 320,
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0.002, y: 0.005 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Color theme based on risk score
    let primaryColorHex = 0x3b82f6; // Safe: Steel Blue
    let secondaryColorHex = 0x10b981; // Emerald
    let glowColorHex = 0x60a5fa;

    if (score !== null) {
      if (score >= 60) {
        primaryColorHex = 0xef4444; // High Risk: Crimson
        secondaryColorHex = 0xf43f5e;
        glowColorHex = 0xf87171;
      } else if (score >= 30) {
        primaryColorHex = 0xf59e0b; // Suspicious: Amber
        secondaryColorHex = 0xd97706;
        glowColorHex = 0xfbbf24;
      }
    }

    const group = new THREE.Group();
    scene.add(group);

    // 1. Inner Defense Core (Geodesic Octahedron / Icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: primaryColorHex,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
      roughness: 0.2,
      metalness: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    group.add(coreMesh);

    // Solid inner glowing orb
    const innerOrbGeo = new THREE.SphereGeometry(1.0, 24, 24);
    const innerOrbMat = new THREE.MeshBasicMaterial({
      color: primaryColorHex,
      transparent: true,
      opacity: 0.25,
      wireframe: false,
    });
    const innerOrb = new THREE.Mesh(innerOrbGeo, innerOrbMat);
    group.add(innerOrb);

    // 2. Outer Orbital Gyro Ring 1
    const ring1Geo = new THREE.TorusGeometry(2.4, 0.04, 16, 80);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: secondaryColorHex,
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    // 3. Outer Orbital Gyro Ring 2
    const ring2Geo = new THREE.TorusGeometry(2.8, 0.03, 16, 80);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: glowColorHex,
      transparent: true,
      opacity: 0.45,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    // 4. Perimeter Threat Detection Radar Ring
    const radarGeo = new THREE.RingGeometry(3.1, 3.16, 64);
    const radarMat = new THREE.MeshBasicMaterial({
      color: primaryColorHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const radarRing = new THREE.Mesh(radarGeo, radarMat);
    radarRing.rotation.x = Math.PI / 2;
    group.add(radarRing);

    // 5. Orbiting Sensor Nodes (6 mini security nodes)
    const nodeGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const nodeMat = new THREE.MeshBasicMaterial({ color: glowColorHex });
    const nodes: THREE.Mesh[] = [];
    const nodeCount = 6;
    for (let i = 0; i < nodeCount; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      nodes.push(node);
      group.add(node);
    }

    // 6. Cyber Particle Field
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 3.5 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: glowColorHex,
      size: 0.05,
      transparent: true,
      opacity: 0.65,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    group.add(particleSystem);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(primaryColorHex, 2.5, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Mouse Interaction
    const handleMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDraggingRef.current = true;
      setIsInteracting(true);
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !isDraggingRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      group.rotation.y += deltaX * 0.008;
      group.rotation.x += deltaY * 0.008;

      rotationVelocityRef.current = {
        x: deltaY * 0.001,
        y: deltaX * 0.001,
      };

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      setTimeout(() => setIsInteracting(false), 800);
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Touch support for mobile devices
    const handleTouchStart = (e: TouchEvent) => {
      if (!interactive || e.touches.length === 0) return;
      isDraggingRef.current = true;
      setIsInteracting(true);
      previousMousePositionRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!interactive || !isDraggingRef.current || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
      const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

      group.rotation.y += deltaX * 0.008;
      group.rotation.x += deltaY * 0.008;

      previousMousePositionRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
      setTimeout(() => setIsInteracting(false), 800);
    };

    domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const speedMultiplier = score !== null && score >= 60 ? 2.2 : score !== null && score >= 30 ? 1.5 : 1.0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!isDraggingRef.current) {
        group.rotation.y += 0.005 * speedMultiplier;
        group.rotation.x += 0.002 * speedMultiplier;
      }

      // Dynamic independent rotations
      ring1.rotation.z += 0.01 * speedMultiplier;
      ring2.rotation.x += 0.008 * speedMultiplier;
      radarRing.rotation.z -= 0.006 * speedMultiplier;
      particleSystem.rotation.y -= 0.002;

      // Position nodes along ring1
      const ringRadius = 2.4;
      for (let i = 0; i < nodeCount; i++) {
        const angle = elapsedTime * 0.8 * speedMultiplier + (i * (Math.PI * 2)) / nodeCount;
        nodes[i].position.set(
          Math.cos(angle) * ringRadius,
          Math.sin(angle) * ringRadius * Math.sin(ring1.rotation.x),
          Math.sin(angle) * ringRadius * Math.cos(ring1.rotation.x)
        );
      }

      // Breathing scale on inner orb
      const pulse = 1 + Math.sin(elapsedTime * 2.5 * speedMultiplier) * 0.06;
      innerOrb.scale.set(pulse, pulse, pulse);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer for responsive fluid sizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        if (newWidth > 0) {
          camera.aspect = newWidth / height;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, height);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      resizeObserver.disconnect();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      innerOrbGeo.dispose();
      innerOrbMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      radarGeo.dispose();
      radarMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [score, height, interactive]);

  const getStatusBadge = () => {
    if (score === null) {
      return {
        label: 'Ready for Scan',
        color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
        icon: ShieldCheck,
      };
    }
    if (score >= 60) {
      return {
        label: `High Scam Threat (${score}/100)`,
        color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
        icon: ShieldAlert,
      };
    }
    if (score >= 30) {
      return {
        label: `Caution Needed (${score}/100)`,
        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
        icon: AlertTriangle,
      };
    }
    return {
      label: `Safe (${score}/100)`,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      icon: ShieldCheck,
    };
  };

  const status = getStatusBadge();
  const StatusIcon = status.icon;

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full relative cursor-grab active:cursor-grabbing flex items-center justify-center"
        style={{ height }}
        title="Click and drag to rotate the 3D security model"
      />

      {/* Floating 3D status badge */}
      <div className="absolute bottom-2 flex items-center gap-2 pointer-events-none">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md transition-all ${status.color}`}
        >
          <StatusIcon className="w-3.5 h-3.5" />
          {status.label}
        </span>
        <span className="text-[10px] text-slate-400 hidden sm:inline-flex items-center gap-1 bg-slate-900/60 px-2 py-0.5 rounded-full border border-slate-800">
          <RotateCw className="w-2.5 h-2.5" />
          Drag 3D Shield
        </span>
      </div>
    </div>
  );
};
