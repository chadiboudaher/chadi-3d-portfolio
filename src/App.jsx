import { Canvas } from "@react-three/fiber";

function App() {
  return (
    <Canvas>
      <ambientLight intensity={1} />

      <directionalLight position={[5, 5, 5]} intensity={2} />

      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </Canvas>
  );
}

export default App;
