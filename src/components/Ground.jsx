const Ground = ({ size = 200 }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
    <planeGeometry args={[size, size]} />
    <meshStandardMaterial color="lightgray" />
  </mesh>
);

export default Ground;
