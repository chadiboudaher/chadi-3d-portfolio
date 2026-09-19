import { useGLTF } from "@react-three/drei";

export default function PortfolioModel() {
  const { scene } = useGLTF("/models/portfolio.glb");

  return <primitive object={scene} />;
}

useGLTF.preload("/models/portfolio.glb");
