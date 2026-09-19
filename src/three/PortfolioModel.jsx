import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

const MODEL_PATH = "/models/portfolio_scene.glb";

export default function PortfolioModel({ onLoaded }) {
  const { scene } = useGLTF(MODEL_PATH);

  useEffect(() => {
    scene.traverse((object) => {
      if (!object.isMesh) return;

      object.castShadow = true;
      object.receiveShadow = true;
    });

    onLoaded();
  }, [onLoaded, scene]);

  return <primitive object={scene} />;
}

useGLTF.preload(MODEL_PATH);
