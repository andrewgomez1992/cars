import { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Car } from "../components/Car";
import Ground from "../components/Ground";
import { FollowCamera } from "../components/FollowCamera";

const MainScene = () => {
  const carRef = useRef();

  return (
    <Canvas shadows camera={{ fov: 50 }}>
      {/* lights */}
      <ambientLight intensity={0.5} />
      <directionalLight castShadow position={[10, 10, 5]} intensity={1.2} />

      {/* car + ground */}
      <Suspense fallback={null}>
        <Car ref={carRef} />
      </Suspense>
      <Ground />

      {/* grid helper */}
      <gridHelper args={[200, 200, "#888", "#444"]} />

      {/* chase cam */}
      <FollowCamera target={carRef} offset={[0, 3, -6]} />
    </Canvas>
  );
};

export default MainScene;
