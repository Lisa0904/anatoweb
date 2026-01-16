import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";
import { useRef, useMemo, useEffect, useState } from "react";


// =======================================================
// NEUE KOMPONENTE: Partikel-Mensch-Darstellung
// =======================================================
function ParticleHuman({ color }: { color: number }) {

  const mesh = useRef<THREE.Points>(null);
  
  // 1. Partikel-Geometrie und Positionen erzeugen (statisch)
  // Wir verwenden eine simple Box-Geometrie und formen sie zu einer menschlichen Silhouette
  const particles = useMemo(() => {
    const count = 1500; // Anzahl der Partikel
    const positions = new Float32Array(count * 3);




    // Schleife über alle Partikel
for (let i = 0; i < count; i++) {

  // x, y, z = Position eines einzelnen Partikels im Raum
  let x: number, y: number, z: number;

  // Zufallswert zur Entscheidung, welches Körperteil erzeugt wird
  const r = Math.random();

  // =========================================================
  // KOPF
  // =========================================================
  if (r < 0.22) {

    // Zufälliger Winkel um die Y-Achse (links/rechts)
    const theta = Math.random() * Math.PI * 2;

    // Zufälliger Winkel von oben nach unten (für Kugelverteilung)
    const phi = Math.acos(2 * Math.random() - 1);

    // Halbachsen für einen ovalen Kopf (keine perfekte Kugel)
    const rx = 0.23; // Breite des Kopfes
    const ry = 0.26; // Höhe des Kopfes
    const rz = 0.21; // Tiefe des Kopfes

    // X-Position auf der Ovaloberfläche
    x = Math.sin(phi) * Math.cos(theta) * rx;

    // Y-Position + vertikaler Offset (Kopf sitzt oben auf dem Körper)
    y = Math.cos(phi) * ry + 1.45;

    // Z-Position auf der Ovaloberfläche
    z = Math.sin(phi) * Math.sin(theta) * rz;

  // =========================================================
  // TORSO (Brust + Bauch)
  // =========================================================
  } else if (r < 0.55) {

    // Zufallswert entlang der Körperhöhe (oben → unten)
    const t = Math.random();

    // Breite des Körpers nimmt nach unten leicht ab (konisch)
    const width = 0.67 * (1 - t * 0.2);

    // X: seitliche Ausdehnung des Oberkörpers
    x = (Math.random() - 0.5) * width;

    // Y: vertikale Position des Torsos
    y = t * 1.4 - 0.2;

    // Z: Tiefe des Körpers (Brust → Rücken)
    z = (Math.random() - 0.5) * 0.38;

  // =========================================================
  // ARME
  // =========================================================
} else if (r < 0.78) {

  const side = Math.random() < 0.5 ? -1 : 1; // links/rechts Arm
  const armT = Math.random(); // Position entlang Arm (0=Schulter,1=Hand)

  // Radius für volle Dicke → konstant, nicht nur oben oder unten
  const radius = 0.18; // dick genug

  // Kreisförmig in X/Z für Rundheit
  const angle = Math.random() * Math.PI * 2;

  // X: horizontal ausgestreckter Arm + Kreis-Rundheit
  x = side * (0.32 + armT * 0.45 + Math.cos(angle) * radius);

  // Y: Position entlang Arm (leicht nach unten geneigt)
  y = 1.05 - armT * 0.35;

  // Z: Kreisförmig für Dicke
  z = Math.sin(angle) * radius;

  // Hand-Andeutung
  if (armT > 0.85) {
    x += side * 0.08;
    y -= 0.03;
    z += (Math.random() - 0.5) * 0.08;
  }
}





  // =========================================================
  // BEINE
  // =========================================================
  else {

  const side = Math.random() < 0.5 ? -1 : 1;
  const legT = Math.random();

  const radius = 0.12; // dicke Beine

  const angle = Math.random() * Math.PI * 2;

  // X: Beine gerade, Rundheit
  x = side * (0.24 + Math.cos(angle) * radius);

  // Y: vertikal entlang Bein
  y = -0.2 - legT * 1.7;

  // Z: Rundheit
  z = Math.sin(angle) * radius;

  // Fuß-Andeutung
  if (legT > 0.88) {
    z += 0.14;
    y -= 0.05;
  }
}


  // =========================================================
  // Position des Partikels im Positions-Array speichern
  // =========================================================
  positions[i * 3 + 0] = x; // X-Koordinate
  positions[i * 3 + 1] = y; // Y-Koordinate
  positions[i * 3 + 2] = z; // Z-Koordinate
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
  color: color,
  size: 0.05,
  transparent: true,
  opacity: 0.9,
  sizeAttenuation: true
});


  return (
    <points ref={mesh} geometry={particles} material={mat} scale={1.2} />
  );
}

// =======================================================
// HAUPTKOMPONENTE
// =======================================================
export default function HeroModel() {
  const [isLightMode, setIsLightMode] = useState(false);

useEffect(() => {
  const media = window.matchMedia("(prefers-color-scheme: light)");
  setIsLightMode(media.matches);

  const listener = (e: MediaQueryListEvent) => setIsLightMode(e.matches);
  media.addEventListener("change", listener);

  return () => media.removeEventListener("change", listener);
}, []);

  return (
    <div
      style={{
        width: "100%",
        // 50vh ist ein guter Wert für den Hero-Bereich (nicht zu groß)
        height: "50vh", 
        position: "relative",
        // Wichtig: Pointer Events deaktivieren, damit der Klick an den Link in Home.tsx geht
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

        <ParticleHuman color={isLightMode ? "#1f7a45" : "#00ff55"} />


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