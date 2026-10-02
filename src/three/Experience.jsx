import { memo } from "react";
import CameraRig from "./CameraRig";
import Lighting from "./Lighting";
import PortfolioModel from "./PortfolioModel";
import SceneWarmup from "./SceneWarmup";

function Experience({
  onModelPrepared,
  onCameraPrepared,
  onFirstFrameRendered,
  controlsEnabled,
  onSectionSelect,
  onSceneHover,
  resetCameraToken,
}) {
  return (
    <>
      <color attach="background" args={["#ffe29a"]} />
      <fog attach="fog" args={["#ffe29a", 24, 55]} />
      <Lighting />
      <PortfolioModel
        onPrepared={onModelPrepared}
        onSectionSelect={onSectionSelect}
        onSceneHover={onSceneHover}
      />
      <CameraRig
        controlsEnabled={controlsEnabled}
        resetCameraToken={resetCameraToken}
        onPrepared={onCameraPrepared}
      />
      <SceneWarmup onFirstFrameRendered={onFirstFrameRendered} />
    </>
  );
}

// Entering only changes the HTML overlay. Keep that state update from
// reconciling the complete Three.js scene at the start of the transition.
export default memo(Experience);
