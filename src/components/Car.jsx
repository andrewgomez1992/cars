import { forwardRef, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCarControls } from "../hooks/useCarControls";
import { useGLTF } from "@react-three/drei";

export const Car = forwardRef(({ url = "/models/car.glb", scale = 1 }, ref) => {
  const { scene } = useGLTF(url);
  const model = useMemo(() => scene.clone(), [scene]);
  const keys = useCarControls();
  const velocity = useRef(0);
  const maxSpeed = 20;
  const accelRate = 8; // slower accel for smoother ramp
  const turnRate = Math.PI;
  const tmpVec = useRef(new THREE.Vector3()).current;

  useFrame((_, delta) => {
    // target speed
    let target = 0;
    if (keys.up) target = maxSpeed;
    if (keys.down) target = -maxSpeed;

    // smooth velocity → target
    velocity.current = THREE.MathUtils.lerp(
      velocity.current,
      target,
      accelRate * delta
    );

    // steering only when moving
    if (Math.abs(velocity.current) > 0.5) {
      const dir = Math.sign(velocity.current);
      if (keys.left) ref.current.rotation.y += turnRate * delta * dir;
      if (keys.right) ref.current.rotation.y -= turnRate * delta * dir;
    }

    // move forward along actual forward vector
    ref.current.getWorldDirection(tmpVec);
    tmpVec.normalize();
    ref.current.position.addScaledVector(tmpVec, velocity.current * delta);
  });

  return (
    <primitive
      ref={ref}
      object={model}
      scale={scale}
      castShadow
      receiveShadow
    />
  );
});

useGLTF.preload("/models/car.glb");
export default Car;
