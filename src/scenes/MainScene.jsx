import { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sky, Environment } from "@react-three/drei";
import Car from "../components/Car";
import Ground from "../components/Ground";
import Road from "../components/Road";
import Trees from "./Trees";
import { FollowCamera } from "../components/FollowCamera";

const MainScene = () => {
  const carRef = useRef();

  return (
    <Canvas
      shadows
      camera={{ position: [0, 6, 14], fov: 60 }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* sky + HDR environment */}
      <Sky sunPosition={[100, 20, 100]} turbidity={8} />
      <Environment preset="city" />

      {/* lights */}
      <hemisphereLight intensity={0.6} />
      <directionalLight
        castShadow
        position={[10, 20, 10]}
        intensity={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      <Suspense fallback={null}>
        {/* environment */}
        <Ground />
        <Road />
        <Trees />

        {/* your car */}
        <Car ref={carRef} />
      </Suspense>

      {/* chase cam behind the car */}
      <FollowCamera target={carRef} offset={[0, 3, -10]} />
    </Canvas>
  );
};

export default MainScene;
