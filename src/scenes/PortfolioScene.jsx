// src/scenes/PortfolioScene.jsx

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sky, Environment, OrbitControls } from "@react-three/drei";
import Car from "../components/Car";
import Ground from "../components/Ground";
import Road from "../components/Road";
import { TriggerZone } from "../components/TriggerZone";

// CameraFollow lives inside the Canvas so useFrame is valid
const CameraFollow = ({ controls, target }) => {
  useFrame(() => {
    if (controls.current && target.current) {
      controls.current.target.lerp(target.current.position, 0.1);
      controls.current.update();
    }
  });
  return null;
};

const PortfolioScene = ({ onEnterZone, onLeaveZone }) => {
  const carRef = useRef();
  const controls = useRef();

  return (
    <Canvas
      shadows
      camera={{ position: [0, 8, 16], fov: 60 }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Environment */}
      <Sky sunPosition={[50, 20, 50]} turbidity={8} />
      <Environment preset="city" />

      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[10, 20, 10]}
        intensity={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <Suspense fallback={null}>
        {/* Plaza & Road */}
        <Ground size={30} color="#444" />
        <Road width={6} length={50} repeat={20} position={[0, 0.02, -25]} />

        {/* Drivable car */}
        <Car ref={carRef} scale={1} />

        {/* Trigger zone */}
        <TriggerZone
          target={carRef}
          position={[0, 1, -12]}
          size={[8, 2, 20]}
          onEnter={() => onEnterZone("skills")}
          onLeave={onLeaveZone}
        />
      </Suspense>

      {/* Orbit controls for zoom & rotate */}
      <OrbitControls
        ref={controls}
        makeDefault
        enablePan={false}
        enableZoom
        enableRotate
        minDistance={5}
        maxDistance={50}
        zoomSpeed={0.6}
        rotateSpeed={0.4}
      />

      {/* Camera follow logic inside Canvas */}
      <CameraFollow controls={controls} target={carRef} />
    </Canvas>
  );
};

export default PortfolioScene;
