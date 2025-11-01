import React, { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useGLTF, OrbitControls, Html } from "@react-three/drei";

function Model({ url, onSelect }){
  const { scene } = useGLTF(url);
  const highlightRef = useRef(null);

  useEffect(() => {
    // optional: initial scale/rotation to fit nicely
    scene.scale.set(1.1,1.1,1.1);
    scene.traverse((c) => {
      if(c.isMesh){
        c.castShadow = true;
        c.receiveShadow = true;
        // ensure names exist
        if(!c.name) c.name = "part";
      }
    });
  }, [scene]);

  function handlePointerDown(e){
    e.stopPropagation();
    const obj = e.object;
    // find top-level meaningful name
    let name = obj.name || (obj.parent && obj.parent.name) || "Objekt";
    // try to climb to find a named group that represents organ
    let node = obj;
    for(let i=0;i<6;i++){
      if(node?.name && node.name !== "") break;
      node = node.parent;
    }
    if(node && node.name) name = node.name;

    // basic highlight: temporarily set emissive color then revert
    const meshes = [];
    obj.traverse ? obj.traverse((m) => m.isMesh && meshes.push(m)) : meshes.push(obj);
    meshes.forEach(m => {
      if(!m.userData.origEmissive){ m.userData.origEmissive = m.material.emissive ? m.material.emissive.clone() : null; }
      if(m.material.emissive) m.material.emissive.setHex(0x2ecc71);
    });
    setTimeout(()=>{ meshes.forEach(m => {
      if(m.material.emissive && m.userData.origEmissive) m.material.emissive.copy(m.userData.origEmissive);
    })}, 900);

    // simple info lookup (could be extended)
    const info = `Ausgewählt: ${name}. (Hier könnt ihr detaillierte Informationen anzeigen.)`;
    onSelect && onSelect(name, info);
  }

  return <primitive object={scene} onPointerDown={handlePointerDown} />;
}

function SceneWrapper({ onSelect }){
  const url = "/3d_model_anatoweb.glb";
  return (
    <Canvas camera={{ position: [0, 1.2, 3], fov: 40 }}>
      <ambientLight intensity={0.7} />
      <directionalLight intensity={0.7} position={[5,10,5]} />
      <spotLight intensity={0.6} position={[-10,10,-10]} />
      <SuspenseFallback />
      <Model url={url} onSelect={onSelect} />
      <OrbitControls target={[0,1,0]} enablePan={true} enableZoom={true} />
    </Canvas>
  );
}

function SuspenseFallback(){
  const { gl } = useThree();
  return (
    <Html>
      <div style={{color:"var(--muted)", padding:12}}>Lädt 3D-Modell...</div>
    </Html>
  );
}

export default function AnatomyViewer({ onSelect }){
  return <SceneWrapper onSelect={onSelect} />;
}