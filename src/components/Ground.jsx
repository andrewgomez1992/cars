const Ground = ({ size = 500, color = "#228B22" }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <planeGeometry args={[size, size]} />
    <meshStandardMaterial color={color} />
  </mesh>
);
export default Ground;
