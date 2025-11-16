import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { useGLTF, OrbitControls, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

interface ModelProps {
  url: string;
  onSelect?: (name: string, info: string) => void;
}

function LoaderFallback() {
  const { progress } = useProgress();
  const radius = 34;
  const circumference = 2 * Math.PI * radius;


  return (
    <Html
      center
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(2px)",
        pointerEvents: "none",
        borderRadius: "12px", // optional: passt sich der viewer-Form an
      }}
    >
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




function Model({ url, onSelect }: ModelProps) {
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
    scene.position.y -= size.y * 0.4 * scale; scene.scale.set(1.1, 1.1, 1.1); scene.traverse((c: any) => {
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
    let node: THREE.Object3D | null = obj;
    for (let i = 0; i < 8 && node; i++) {
      if (node.name && node.name !== "") break;
      node = node.parent;
    }
    const name = (node && node.name) || "Objekt";

    const meshes: THREE.Mesh[] = [];
    obj.traverse?.((m: any) => {
      if (m.isMesh) meshes.push(m as THREE.Mesh);
    });

    meshes.forEach((m) => {
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat) {
        if (!m.userData.origEmissive) {
          m.userData.origEmissive = mat.emissive ? mat.emissive.clone() : null;
        }
        if (mat.emissive) mat.emissive.setHex(0x2ecc71);
      }
    });

    setTimeout(() => {
      meshes.forEach((m) => {
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat && m.userData.origEmissive) {
          mat.emissive.copy(m.userData.origEmissive);
        }
      });
    }, 900);

    const info = 'Ausgewählt: ${name}';
    onSelect?.(name, info);
  }

  return <primitive object={scene} onPointerDown={handlePointerDown} />;
}

interface AnatomyViewerProps {
  modelUrl: string;
  onSelect?: (name: string, info: string) => void;
}

export default function AnatomyViewer({ modelUrl, onSelect }: AnatomyViewerProps) {
  return (
    <Canvas
  style={{ height: 550 }}
  shadows
  gl={{ antialias: true }}
  camera={{ position: [100, 85, 350], fov: 32 }} 
>
      <ambientLight intensity={0.5} />
      <directionalLight castShadow intensity={0.8} position={[5, 10, 5]} color="#ffffff" />
      <directionalLight intensity={0.5} position={[-5, 2, -5]} color="#9ae6b4" /> {/* leicht grünlich */}
      <hemisphereLight intensity={0.05} color="#ffffff" groundColor="#1a1a1a" />

      <Suspense fallback={<LoaderFallback />}>
        <Model url={modelUrl} onSelect={onSelect} />
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
      <OrbitControls target={[0, 1.2, 0]} enablePan enableZoom enableRotate />
    </Canvas>
  );
}