import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo } from "react";

// =======================================================
// NEUE KOMPONENTE: Partikel-Mensch-Darstellung
// =======================================================
function ParticleHuman() {
  const mesh = useRef<THREE.Points>(null);
  
  // 1. Partikel-Geometrie und Positionen erzeugen (statisch)
  // Wir verwenden eine simple Box-Geometrie und formen sie zu einer menschlichen Silhouette
  const particles = useMemo(() => {
    const count = 1500; // Anzahl der Partikel
    const positions = new Float32Array(count * 3);
    
    // Einfache Silhouette: Torso, Kopf, Arme/Beine angedeutet
    for (let i = 0; i < count; i++) {
      let x, y, z;
      
      // Hauptbereich: Torso (Mitte)
      if (Math.random() < 0.6) { 
        x = (Math.random() - 0.5) * 1; // Schmaler Körper
        y = (Math.random() * 2) - 0.5; // Hauptbereich
        z = (Math.random() - 0.5) * 0.4;
      // Kopf
      } else if (Math.random() < 0.8) { 
        x = (Math.random() - 0.5) * 0.4;
        y = (Math.random() * 0.4) + 1.5;
        z = (Math.random() - 0.5) * 0.3;
      // Extremitäten (Andeutung)
      } else {
        x = (Math.random() - 0.5) * 2; // Breiter streuen
        y = (Math.random() * 2) - 1.5;
        z = (Math.random() - 0.5) * 0.5;
      }

      positions[i * 3 + 0] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);

  // 2. Animation: Rotation und Pulsieren
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();

    // Leichte vertikale Verschiebung (Atmen)
    mesh.current.position.y = Math.sin(t * 0.5) * 0.1;

    // Sanfte Eigenrotation
    if (!mesh.current.parent?.userData.isRotating) {
        mesh.current.rotation.y = t * 0.1;
    }
  });

  const mat = new THREE.PointsMaterial({
    color: 0x32e36a, 
    size: 0.05,        // Größe der einzelnen Partikel
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true // Partikel werden in der Entfernung kleiner
  });

  return (
    <points ref={mesh} geometry={particles} material={mat} scale={1.2} />
  );
}

// =======================================================
// HAUPTKOMPONENTE
// =======================================================
export default function HeroModel() {
  return (
    <div
      style={{
        width: "100%",
        height: "50vh", 
        position: "relative",
        
        // ✅ NEU: Begrenze die Breite des Containers
        maxWidth: "500px", 
        margin: "0 auto", // Zentrieren des Containers
        
        pointerEvents: 'none', 
      }}
    >
      
      {/* >>> CANVAS <<< */}
      <Canvas
        // Kamera ist nah genug, um das Modell in seiner reduzierten Größe zu sehen
        camera={{ position: [0, 1.5, 3.5], fov: 60 }} 
        style={{ width: "100%", height: "100%", zIndex: 5 }}
      >
        <ambientLight intensity={2} /> 

        <ParticleHuman />

        {/* OrbitControls für Maus-Steuerung und Eigenrotation */}
        <OrbitControls
          enablePan={false}         
          enableZoom={true}         
          enableRotate={true}       
          autoRotate={true}         // Automatische Rotation, wenn inaktiv
          autoRotateSpeed={0.5}     
          target={[0, 0.5, 0]}      // Fokuspunkt auf der Mitte des Modells
        />
        <Preload all />
      </Canvas>
    </div>
  );
}