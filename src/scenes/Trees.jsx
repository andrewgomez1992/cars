import { useMemo } from "react";

const Trees = ({ count = 12, spacing = 20, xOffset = 8 }) => {
  const zs = useMemo(
    () => Array.from({ length: count }, (_, i) => (i - count / 2) * spacing),
    [count, spacing]
  );
  return (
    <>
      {zs.map((z, i) => (
        <group key={`L${i}`} position={[-xOffset, 1, z]}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 2, 0]}>
            <coneGeometry args={[1, 3, 8]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
        </group>
      ))}
      {zs.map((z, i) => (
        <group key={`R${i}`} position={[xOffset, 1, z]}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.2, 2, 8]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 2, 0]}>
            <coneGeometry args={[1, 3, 8]} />
            <meshStandardMaterial color="#228B22" />
          </mesh>
        </group>
      ))}
    </>
  );
};
export default Trees;
