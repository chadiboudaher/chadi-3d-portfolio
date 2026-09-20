import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { MathUtils } from "three";

const TARGET = [2, 2.2, -3];
const DESKTOP_POSITION = [27, 5.4, -4];
const MOBILE_POSITION = [47, 12, -6];

export default function CameraRig({ controlsEnabled }) {
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  const isMobile = width < 700 || width / height < 0.85;

  return (
    <>
      <PerspectiveCamera
        key={isMobile ? "mobile" : "desktop"}
        makeDefault
        position={isMobile ? MOBILE_POSITION : DESKTOP_POSITION}
        fov={isMobile ? 43 : 40}
        near={0.1}
        far={150}
      />
      <OrbitControls
        makeDefault
        enabled={controlsEnabled}
        target={TARGET}
        enableDamping
        dampingFactor={0.065}
        enablePan={false}
        minDistance={7}
        maxDistance={30}
        minPolarAngle={MathUtils.degToRad(28)}
        maxPolarAngle={MathUtils.degToRad(78)}
        minAzimuthAngle={MathUtils.degToRad(19)}
        maxAzimuthAngle={MathUtils.degToRad(190)}
        rotateSpeed={0.65}
        zoomSpeed={0.65}
      />
    </>
  );
}
