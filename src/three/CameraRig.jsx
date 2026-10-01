import { useEffect, useRef } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { MathUtils, Vector3 } from "three";

const TARGET = [2, 2.2, -4.7];
const DESKTOP_POSITION = [27, 7, -8];
// Keep the portrait view near its original visual distance, with a subtle
// rightward offset for the narrower composition.
const MOBILE_POSITION = [40, 6, -10];
const MAX_DISTANCE = 40;
const MAX_POLAR_ANGLE = MathUtils.degToRad(85);

export default function CameraRig({ controlsEnabled, resetCameraToken }) {
  const width = useThree((state) => state.size.width);
  const height = useThree((state) => state.size.height);
  const isMobile = width < 700 || width / height < 0.85;
  const controlsRef = useRef(null);
  const resetRef = useRef(null);
  const isMobileRef = useRef(isMobile);

  useEffect(() => {
    isMobileRef.current = isMobile;
  }, [isMobile]);
  useEffect(() => {
    if (!resetCameraToken || !controlsRef.current) return;

    const controls = controlsRef.current;
    resetRef.current = {
      elapsed: 0,
      fromPosition: controls.object.position.clone(),
      fromTarget: controls.target.clone(),
      toPosition: new Vector3(
        ...(isMobileRef.current ? MOBILE_POSITION : DESKTOP_POSITION),
      ),
      toTarget: new Vector3(...TARGET),
    };
  }, [resetCameraToken]);

  useFrame((_, delta) => {
    const reset = resetRef.current;
    const controls = controlsRef.current;
    if (!reset || !controls) return;

    reset.elapsed = Math.min(reset.elapsed + delta, 1.15);
    const progress = reset.elapsed / 1.15;
    const eased = 1 - (1 - progress) ** 3;
    controls.object.position.lerpVectors(
      reset.fromPosition,
      reset.toPosition,
      eased,
    );
    controls.target.lerpVectors(reset.fromTarget, reset.toTarget, eased);
    controls.update();

    if (progress === 1) resetRef.current = null;
  });

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
        ref={controlsRef}
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
