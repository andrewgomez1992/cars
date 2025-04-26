import { forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useCarControls } from "../hooks/useCarControls";
import { useGLTF } from "@react-three/drei";

export const Car = forwardRef(
  ({ url = "/models/car.glb", scale = 0.5 }, ref) => {
    const gltf = useGLTF(url);
    const keys = useCarControls();

    useFrame((_, delta) => {
      const speed = 5 * delta;
      const turnSpeed = Math.PI * delta;

      if (keys.up) ref.current.translateZ(-speed);
      if (keys.down) ref.current.translateZ(speed);
      if (keys.left) ref.current.rotation.y += turnSpeed;
      if (keys.right) ref.current.rotation.y -= turnSpeed;
    });

    return <primitive ref={ref} object={gltf.scene.clone()} scale={scale} />;
  }
);

useGLTF.preload("/models/car.glb");
