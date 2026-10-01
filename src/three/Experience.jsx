import { memo } from "react";
import CameraRig from "./CameraRig";
import Lighting from "./Lighting";
import PortfolioModel from "./PortfolioModel";
import SceneWarmup from "./SceneWarmup";

function Experience({
  onLoaded,
  onPrepared,
  controlsEnabled,
  onSectionSelect,
  resetCameraToken,
}) {
  return (
    <>
      <color attach="background" args={["#ffe29a"]} />
      <fog attach="fog" args={["#ffe29a", 24, 55]} />
      <Lighting />
      <PortfolioModel onLoaded={onLoaded} onSectionSelect={onSectionSelect} />
      <CameraRig
        controlsEnabled={controlsEnabled}
        resetCameraToken={resetCameraToken}
      />
      <SceneWarmup onPrepared={onPrepared} />
    </>
  );
}

// Entering only changes the HTML overlay. Keep that state update from
// reconciling the complete Three.js scene at the start of the transition.
export default memo(Experience);
