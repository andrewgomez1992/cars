const Road = ({ width = 12, length = 500 }) => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} receiveShadow>
    <planeGeometry args={[width, length]} />
    <meshStandardMaterial color="#333333" />
  </mesh>
);
export default Road;
