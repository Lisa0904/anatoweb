import React, { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber"; // ✅ type-only import
import { useGLTF, OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";


// 🧩 Props für Model
interface ModelProps {
  url: string;
  onSelect?: (name: string, info: string) => void;
}

// 🧩 Model-Komponente
function Model({ url, onSelect }: ModelProps) {
  const { scene } = useGLTF(url);
  const highlightRef = useRef<THREE.Object3D | null>(null);

  useEffect(() => {
    scene.scale.set(1.1, 1.1, 1.1);
    scene.traverse((c) => {
      const mesh = c as THREE.Mesh;
      if (mesh.isMesh) {
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (!mesh.name) mesh.name = "part";
      }
    });
  }, [scene]);

  // 🧠 Klick-Handler
  function handlePointerDown(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();

    const obj = e.object as THREE.Object3D;
    let name = obj.name || (obj.parent && obj.parent.name) || "Objekt";

    // suche ggf. höher benannten Knoten
    let node: THREE.Object3D | null = obj;
    for (let i = 0; i < 6; i++) {
      if (node?.name && node.name !== "") break;
      node = node?.parent || null;
    }
    if (node && node.name) name = node.name;

    // ✨ Highlight Effekt
    const meshes: THREE.Mesh[] = [];
    if ((obj as any).traverse) {
      (obj as any).traverse((m: THREE.Mesh) => m.isMesh && meshes.push(m));
    } else if ((obj as THREE.Mesh).isMesh) {
      meshes.push(obj as THREE.Mesh);
    }

    meshes.forEach((m) => {
      const mat = m.material as THREE.MeshStandardMaterial;

      if (!m.userData.origEmissive) {
        m.userData.origEmissive = mat.emissive ? mat.emissive.clone() : null;
      }

      if (mat.emissive) {
        mat.emissive.setHex(0x2ecc71);
      }
    });

    setTimeout(() => {
      meshes.forEach((m) => {
        const mat = m.material as THREE.MeshStandardMaterial;
        if (mat.emissive && m.userData.origEmissive) {
          mat.emissive.copy(m.userData.origEmissive);
        }
      });
    }, 900);

    const info = `Ausgewählt: ${name}. (Hier könnt ihr detaillierte Informationen anzeigen.)`;
    onSelect && onSelect(name, info);
  }

  return <primitive object={scene} onPointerDown={handlePointerDown} />;
}

// 🧩 SuspenseFallback-Komponente
function SuspenseFallback() {
  useThree(); // Zugriff auf Context nötig für <Html>
  return (
    <Html>
      <div style={{ color: "var(--muted)", padding: 12 }}>
        Lädt 3D-Modell...
      </div>
    </Html>
  );
}

// 🧩 SceneWrapper
interface SceneWrapperProps {
  onSelect?: (name: string, info: string) => void;
}

function SceneWrapper({ onSelect }: SceneWrapperProps) {
  const url = "/3d_model_anatoweb.glb";
  return (
    <Canvas camera={{ position: [0, 1.2, 3], fov: 40 }}>
      <ambientLight intensity={0.7} />
      <directionalLight intensity={0.7} position={[5, 10, 5]} />
      <spotLight intensity={0.6} position={[-10, 10, -10]} />
      <SuspenseFallback />
      <Model url={url} onSelect={onSelect} />
      <OrbitControls target={[0, 1, 0]} enablePan enableZoom />
    </Canvas>
  );
}

// 🧩 Hauptkomponente
interface AnatomyViewerProps {
  onSelect?: (name: string, info: string) => void;
}

export default function AnatomyViewer({ onSelect }: AnatomyViewerProps) {
  return <SceneWrapper onSelect={onSelect} />;
}

// Drei.js Loader vorbereiten
useGLTF.preload("/3d_model_anatoweb.glb");
