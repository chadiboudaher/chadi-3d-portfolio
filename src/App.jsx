import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import PortfolioModel from "./three/PortfolioModel";

function App() {
  return (
    <Canvas
      camera={{
        position: [8, 6, 10],
        fov: 40,
      }}
    >
      <color attach="background" args={["#A9C7D9"]} />

      <ambientLight intensity={0.8} />

      <directionalLight position={[5, 10, 5]} intensity={2} />

      <PortfolioModel />

      <OrbitControls />
    </Canvas>
  );
}

export default App;
