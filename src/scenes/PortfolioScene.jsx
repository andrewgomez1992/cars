import { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky, Environment, OrthographicCamera } from "@react-three/drei";
import Car from "../components/Car";
import Ground from "../components/Ground";
import Road from "../components/Road";
import { TriggerZone } from "../components/TriggerZone";
import { FollowCamera } from "../components/FollowCamera";

const PortfolioScene = ({ onEnterZone, onLeaveZone }) => {
  const carRef = useRef();

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
        {/* Central Plaza ground */}
        <Ground size={30} color="#444" />

        {/* Skills Avenue road */}
        <Road width={6} length={50} repeat={20} position={[0, 0.02, -25]} />

        {/* Driveable Car */}
        <Car ref={carRef} scale={1} />

        {/* Trigger zone for Skills */}
        <TriggerZone
          target={carRef}
          position={[0, 1, -12]}
          size={[8, 2, 20]}
          onEnter={() => onEnterZone("skills")}
          onLeave={() => onLeaveZone()}
        />
      </Suspense>

      {/* Chase camera */}
      <FollowCamera target={carRef} offset={[0, 12, -18]} />
    </Canvas>
  );
};

export default PortfolioScene;
