import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useRef } from "react";

/** Wireframe-Human with smooth animation */
function HumanWireframe() {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();

    group.current.rotation.y = t * 0.25;
    group.current.position.y = Math.sin(t * 1.3) * 0.06;
  });

  const mat = new THREE.MeshBasicMaterial({
    color: "#32e36a",
    wireframe: true,
    transparent: true,
    opacity: 0.95,
  });

  function curvedTube(points: number[][], radius: number, segments = 90) {
    const curve = new THREE.CatmullRomCurve3(
      points.map((p) => new THREE.Vector3(...p)),
      false,
      "catmullrom"
    );
    return (
      <mesh
        geometry={new THREE.TubeGeometry(curve, segments, radius, 10, false)}
        material={mat}
      />
    );
  }

  const RIGHT = [
    [0, 1.8, 0],
    [0.25, 1.55, 0],
    [0.45, 1.35, 0],
    [0.4, 1.0, 0],
    [0.3, 0.45, 0],
    [0.38, 0.1, 0],
    [0.32, -0.8, 0],
    [0.2, -1.55, 0],
    [0.18, -2.1, 0],
  ];

  const LEFT = RIGHT.map(([x, y, z]) => [-x, y, z]);

  return (
    <group ref={group} scale={1.6}>
      <mesh position={[0, 1.75, 0]} material={mat}>
        <sphereGeometry args={[0.22, 32, 32]} />
      </mesh>

      {curvedTube(RIGHT, 0.05)}
      {curvedTube(LEFT, 0.05)}

      <mesh position={[0, 1.25, 0]} material={mat}>
        <sphereGeometry args={[0.42, 28, 28]} />
      </mesh>

      <mesh position={[0, 0.75, 0]} material={mat}>
        <sphereGeometry args={[0.33, 28, 28]} />
      </mesh>

      <mesh position={[0, 0.3, 0]} material={mat}>
        <sphereGeometry args={[0.37, 28, 28]} />
      </mesh>

      {curvedTube(
        [
          [0.45, 1.35, 0],
          [0.75, 1.05, 0],
          [0.85, 0.55, 0],
          [0.75, 0.2, 0],
        ],
        0.045
      )}

      {curvedTube(
        [
          [-0.45, 1.35, 0],
          [-0.75, 1.05, 0],
          [-0.85, 0.55, 0],
          [-0.75, 0.2, 0],
        ],
        0.045
      )}

      {curvedTube(
        [[0.25, 0.1, 0], [0.25, -0.85, 0], [0.22, -1.75, 0]],
        0.07
      )}
      {curvedTube(
        [[-0.25, 0.1, 0], [-0.25, -0.85, 0], [-0.22, -1.75, 0]],
        0.07
      )}
    </group>
  );
}

export default function HeroModel() {
  return (
    <div
      style={{
        width: "100%",
        height: "70vh",     // << fullscreen-height-like
        position: "relative",
      }}
    >
      {/* Fullscreen soft green glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "180%",
          height: "180%",
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(34,197,94,0.22), transparent 70%)",
          filter: "blur(140px)",
          zIndex: 0,
        }}
      />

      {/* >>> FULLSCREEN CANVAS <<< */}
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 45 }}
        style={{ width: "100%", height: "100%", zIndex: 5 }}
      >
        <ambientLight intensity={1.2} />

        <HumanWireframe />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          zoomSpeed={0.5}
          rotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}