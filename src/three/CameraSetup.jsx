import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function CameraSetup() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(8.42, 5.73, 11.84);

    camera.lookAt(0.3, 1.2, -0.5);

    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}
