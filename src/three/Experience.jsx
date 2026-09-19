import CameraRig from "./CameraRig";
import Lighting from "./Lighting";
import PortfolioModel from "./PortfolioModel";

export default function Experience({ onLoaded, controlsEnabled }) {
  return (
    <>
      <color attach="background" args={["#ffe29a"]} />
      <fog attach="fog" args={["#ffe29a", 24, 55]} />
      <Lighting />
      <PortfolioModel onLoaded={onLoaded} />
      <CameraRig />
      <CameraRig controlsEnabled={controlsEnabled} />
    </>
  );
}
