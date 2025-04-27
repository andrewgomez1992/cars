import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const TriggerZone = ({ target, position, size, onEnter, onLeave }) => {
  const ref = useRef();
  const box = useMemo(() => new THREE.Box3(), []);
  const inside = useRef(false);

  useFrame(() => {
    if (!target.current || !ref.current) return;
    ref.current.updateMatrixWorld();
    box.setFromObject(ref.current);

    const isIn = box.containsPoint(target.current.position);
    if (isIn && !inside.current) {
      inside.current = true;
      onEnter?.();
    } else if (!isIn && inside.current) {
      inside.current = false;
      onLeave?.();
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
};
