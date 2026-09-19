import { useGLTF } from "@react-three/drei";

export default function PortfolioModel() {
  const { scene } = useGLTF("/models/portfolio-v2.glb");

  return <primitive object={scene} />;
}

useGLTF.preload("/models/portfolio-v2.glb");
