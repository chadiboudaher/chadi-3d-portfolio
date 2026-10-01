import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { MathUtils } from "three";

const TARGET = [2, 2.2, -3];
const DESKTOP_POSITION = [27, 5.4, -4];
// Keep the portrait view near its original visual distance, with a subtle
// rightward offset for the narrower composition.
const MOBILE_POSITION = [35, 6, -10];
const MAX_DISTANCE = 40;
const MAX_POLAR_ANGLE = MathUtils.degToRad(85);

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
        // Keep update() running behind the intro so the camera is already
        // oriented toward TARGET before the overlay reveals it. Disabling the
        // controls themselves used to defer that first update until Enter.
        enableRotate={controlsEnabled}
        enableZoom={controlsEnabled}
        target={TARGET}
        enableDamping
        dampingFactor={0.065}
        enablePan={false}
        minDistance={7}
        // Both initial compositions are within this limit, so the first
        // controls update preserves the camera position when Enter completes.
        maxDistance={MAX_DISTANCE}
        minPolarAngle={MathUtils.degToRad(28)}
        // The desktop composition starts around 83 degrees. Keep it inside the
        // interaction limits so the first update does not raise the camera.
        maxPolarAngle={MAX_POLAR_ANGLE}
        minAzimuthAngle={MathUtils.degToRad(19)}
        maxAzimuthAngle={MathUtils.degToRad(190)}
        rotateSpeed={0.65}
        zoomSpeed={0.65}
      />
    </>
  );
}
