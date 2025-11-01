// src/components/AnatomyViewer.tsx
import React, { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { useGLTF, OrbitControls, Html, useProgress } from "@react-three/drei";
import * as THREE from "three";

interface ModelProps {
  url: string;
  onSelect?: (name: string, info: string) => void;
}

function LoaderFallback() {
  const { active, progress } = useProgress();
  return (
    <Html center>
      <div style={{ color: "var(--muted)", padding: 12, textAlign: "center" }}>
        {active ? `Lädt... ${Math.round(progress)}%` : "Lädt 3D-Modell..."}
      </div>
    </Html>
  );
}

function Model({ url, onSelect }: ModelProps) {
  const gltf = useGLTF(url) as any;
  const scene: THREE.Object3D = gltf.scene;

  useEffect(() => {
    if (!scene) return;

  // 🧠 Automatische Zentrierung
  const box = new THREE.Box3().setFromObject(scene);
  const center = new THREE.Vector3();
  box.getCenter(center);
  scene.position.sub(center); // verschiebt das Modell so, dass es zentriert ist

  // 🧩 Optional: Höhe justieren (z. B. um 0.5 nach unten, damit Füße unten bleiben)
  scene.position.y -= 0.5;
    scene.scale.set(1.1, 1.1, 1.1);
    scene.traverse((c: any) => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;
        if (!c.name || c.name.trim() === "") c.name = "part";
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

    const info = `Ausgewählt: ${name}`;
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
    <Canvas shadows gl={{ antialias: true }} camera={{ position: [0, 1.6, 4], fov: 40 }}>
      <ambientLight intensity={0.6} />
      <directionalLight castShadow intensity={0.8} position={[5, 10, 5]} />
      <hemisphereLight intensity={0.15} />

      <Suspense fallback={<LoaderFallback />}>
        <Model url={modelUrl} onSelect={onSelect} />
      </Suspense>

      <OrbitControls target={[0, 1.6, 0]} enablePan enableZoom enableRotate />
    </Canvas>
  );
}
