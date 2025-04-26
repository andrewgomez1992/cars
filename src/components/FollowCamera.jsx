import { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const FollowCamera = ({ target, offset = [0, 3, -6] }) => {
  const { camera } = useThree();
  const vec = useRef(new THREE.Vector3()).current;
  const off = useRef(new THREE.Vector3(...offset)).current;

  useFrame(() => {
    if (!target.current) return;
    target.current.getWorldPosition(vec);
    const worldOffset = off.clone().applyQuaternion(target.current.quaternion);
    camera.position.lerp(vec.clone().add(worldOffset), 0.05);
    camera.lookAt(vec);
  });

  return null;
};
