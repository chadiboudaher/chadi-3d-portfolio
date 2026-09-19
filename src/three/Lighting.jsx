import { Environment } from "@react-three/drei";

export default function Lighting() {
  return (
    <>
      <ambientLight intensity={0.55} color="#fff1cf" />
      <hemisphereLight args={["#ffe5a3", "#63513a", 0.75]} />
      <directionalLight
        castShadow
        color="#ffd08a"
        intensity={2.1}
        position={[8, 13, 7]}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-near={1}
        shadow-camera-far={35}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.00015}
      />
      <Environment preset="sunset" environmentIntensity={0.35} />
    </>
  );
}
