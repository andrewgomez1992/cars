import { useTexture } from "@react-three/drei";
import * as THREE from "three";

const Ground = ({ size = 500, repeat = 100 }) => {
  const grass = useTexture("/textures/grass.jpg");
  grass.wrapS = grass.wrapT = THREE.RepeatWrapping;
  grass.repeat.set(repeat, repeat);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial map={grass} />
    </mesh>
  );
};

export default Ground;
