import React, { Suspense, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { useGLTF, OrbitControls, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

interface ModelProps {
  url: string;
  onSelect?: (name: string, info: string) => void;
  onClearSelection?: () => void;
}

function LoaderFallback() {
  const { progress } = useProgress();
  const radius = 34;
  const circumference = 2 * Math.PI * radius;

  


  return (
    <Html center className="loader-container">
      <div style={{ textAlign: "center", color: "var(--muted)" }}>
        {/* Kreis */}
        <div style={{ position: "relative", width: 64, height: 64, margin: "0 auto 8px" }}>
          <svg
            style={{
              transform: "rotate(-90deg)",
              width: "100%",
              height: "100%",
            }}
          >
            {/* Hintergrund-Kreis */}
            <circle
              cx="32" cy="32" r="28"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="6"
              fill="none"
            />
            {/* Fortschritts-Kreis */}
            <circle
              cx="32" cy="32" r="28"
              stroke="var(--accent)"
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (progress / 100) * circumference}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 0.1s linear", // schnell, echtzeitnah
              }}
            />
          </svg>

          {/* Prozentanzeige */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: 16,
              color: "var(--text)",
              fontWeight: 600,
              minWidth: 40,
              textAlign: "center",
            }}
          >
            {Math.round(progress)}%
          </div>
        </div>

        <p style={{ fontSize: 14, color: "var(--muted)" }}>Lade Modell…</p>
      </div>
    </Html>
  );
}




function Model({ url, onSelect, lastSelectedRef, clearSelection }: {
  url: string;
  onSelect?: (name: string) => void;
  lastSelectedRef: React.MutableRefObject<THREE.Mesh[] | null>;
  clearSelection: () => void;
}){
  const gltf = useGLTF(url) as any;
  const scene: THREE.Object3D = gltf.scene;

  useEffect(() => {
    if (!scene) return;

    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    const size = new THREE.Vector3();
    box.getCenter(center);
    box.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 3 / maxDim; // dynamisch anpassen

    scene.position.sub(center);
    scene.scale.setScalar(scale);
    scene.position.y += size.y * 1.8 * scale; scene.scale.set(1.1, 1.1, 1.1); scene.traverse((c: any) => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
        if (!c.name || c.name.trim() === "") c.name = "part";

        // ✨ Glow hinzufügen: leichtes Eigenleuchten
        if (c.material && c.material.isMeshStandardMaterial) {
          const mat = c.material as THREE.MeshStandardMaterial;
          mat.emissive = new THREE.Color(0x222244); // sanftes blauviolett
          mat.emissiveIntensity = 0.12;
        }
      }
    });
  }, [scene]);

  function handlePointerDown(e: ThreeEvent<PointerEvent>) {
  e.stopPropagation();

  const obj = e.object as THREE.Object3D;

  // 🔍 Name suchen
  let node: THREE.Object3D | null = obj;
  for (let i = 0; i < 8 && node; i++) {
    if (node.name && node.name.trim() !== "") break;
    node = node.parent;
  }
  const name = node?.name || "Objekt";

  // 🎯 Alle Meshes des geklickten Objekts finden
  const meshes: THREE.Mesh[] = [];
  obj.traverse?.((m: any) => {
    if (m.isMesh) meshes.push(m as THREE.Mesh);
  });

  // ------------------------------
  // 1️⃣ Alte Auswahl weich ausblenden
  // ------------------------------
  if (lastSelectedRef.current) {
    lastSelectedRef.current.forEach((m) => {
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat && m.userData.origEmissive) {
        let start = mat.emissiveIntensity;
        const end = m.userData.origEmissiveIntensity ?? 0.12;
        const startColor = mat.emissive.clone();
        const endColor = m.userData.origEmissive.clone();

        animateEmissive(mat, startColor, endColor, start, end, 250);
      }
    });
  }

  // ------------------------------
  // 2️⃣ Neue Auswahl weich einblenden
  // ------------------------------
  meshes.forEach((m) => {
    const mat = m.material as THREE.MeshStandardMaterial;

    if (!m.userData.origEmissive) {
      m.userData.origEmissive = mat.emissive.clone();
      m.userData.origEmissiveIntensity = mat.emissiveIntensity;
    }

    // Theme-basiertes Grün
    const isLight = document.documentElement.classList.contains("light");
    const targetColor = new THREE.Color(isLight ? "#22c55e" : "#22c55e");
    const targetIntensity = isLight ? 0.7 : 0.5;

    animateEmissive(
      mat,
      mat.emissive.clone(),
      targetColor,
      mat.emissiveIntensity,
      targetIntensity,
      60
    );
  });

  // Speicherung der neuen Auswahl
  lastSelectedRef.current = meshes;

  // Info an Parent
  const info = `Ausgewählt: ${name}`;
  onSelect?.(name, info);
}

// 🟢 Smooth Fade Animation für Emissive
function animateEmissive(
  material: THREE.MeshStandardMaterial,
  startColor: THREE.Color,
  endColor: THREE.Color,
  startIntensity: number,
  endIntensity: number,
  duration: number
) {
  const start = performance.now();

  function update(now: number) {
    const t = Math.min((now - start) / duration, 1);

    // Color interpolation
    material.emissive.setRGB(
      startColor.r + (endColor.r - startColor.r) * t,
      startColor.g + (endColor.g - startColor.g) * t,
      startColor.b + (endColor.b - startColor.b) * t
    );

    // Intensity interpolation
    material.emissiveIntensity =
      startIntensity + (endIntensity - startIntensity) * t;

    if (t < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

  return <primitive
    object={scene}
    onPointerDown={handlePointerDown}
    onPointerMissed={(e) => {
      e.stopPropagation();
      clearSelection();
    }}
  />;
}

interface AnatomyViewerProps {
  modelUrl: string;
  onSelect?: (name: string, info: string) => void;
}

export default function AnatomyViewer({ modelUrl, onSelect }: AnatomyViewerProps) {
  const lastSelectedRef = useRef<THREE.Mesh[] | null>(null);

  


  
function clearSelection() {
  if (!lastSelectedRef.current) return;

  lastSelectedRef.current.forEach((m) => {
    const mat = m.material as THREE.MeshStandardMaterial;
    if (!mat) return;

    const origColor = m.userData.origEmissive.clone();
    const origIntensity = m.userData.origEmissiveIntensity ?? 0.12;

    animateEmissive(
      mat,
      mat.emissive.clone(),
      origColor,
      mat.emissiveIntensity,
      origIntensity,
      150 // schnelleres ausblenden
    );
  });

  lastSelectedRef.current = null;
}
  return (
    <Canvas
      className="viewer-canvas"
      shadows
      gl={{ antialias: true }}
      camera={{ position: [100, 90, 350], fov: 32 }}
      onPointerDown={(e) => {
    if (e.intersections.length === 0) {
      clearSelection();
    }
  }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight castShadow intensity={0.8} position={[5, 10, 5]} color="#ffffff" />
      <directionalLight intensity={0.5} position={[-5, 2, -5]} color="#9ae6b4" /> {/* leicht grünlich */}
      <hemisphereLight intensity={0.05} color="#ffffff" groundColor="#1a1a1a" />

      <Suspense fallback={<LoaderFallback />}>
        <Model url={modelUrl} onSelect={onSelect} lastSelectedRef={lastSelectedRef} clearSelection={clearSelection} />
      </Suspense>
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          height={300}
          intensity={0.6}   // 🔆 Glow-Stärke
        />
      </EffectComposer>

      {/* 🧠 Zielpunkt leicht in Brusthöhe */}
      <OrbitControls target={[0, 1.5, 0]} enablePan enableZoom enableRotate />
    </Canvas>
  );
}