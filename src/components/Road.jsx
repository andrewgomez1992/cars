import * as THREE from "three";
import { useTexture } from "@react-three/drei";

const Road = ({ width = 12, length = 500, repeat = 50 }) => {
  const asphalt = useTexture("/textures/asphalt.jpg");
  asphalt.wrapS = asphalt.wrapT = THREE.RepeatWrapping;
  asphalt.repeat.set(repeat, repeat * (width / length));

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
      <planeGeometry args={[width, length]} />
      <meshStandardMaterial map={asphalt} />
    </mesh>
  );
};

export default Road;
