import { Suspense, useCallback, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import LoadingScreen from "./components/LoadingScreen";
import NavigationHint from "./components/NavigationHint";
import Experience from "./three/Experience";

function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [minimumDurationElapsed, setMinimumDurationElapsed] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const isReady = assetsLoaded && minimumDurationElapsed;

  const handleLoaded = useCallback(() => setAssetsLoaded(true), []);
  const handleEnter = useCallback(() => {
    if (!isReady || isEntering) return;
    setIsEntering(true);
  }, [isEntering, isReady]);
  const handleEntered = useCallback(() => setHasEntered(true), []);

  useEffect(() => {
    const timeout = window.setTimeout(
      () => setMinimumDurationElapsed(true),
      2800,
    );
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <main className="experience" aria-label="Interactive campsite portfolio">
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{ position: [9.2, 6.4, 13.2], fov: 40, near: 0.1, far: 150 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          outputColorSpace: SRGBColorSpace,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1,
        }}
      >
        <Suspense fallback={null}>
          <Experience onLoaded={handleLoaded} controlsEnabled={hasEntered} />
        </Suspense>
      </Canvas>
      {!hasEntered && (
        <LoadingScreen
          isReady={isReady}
          isEntering={isEntering}
          onEnter={handleEnter}
          onEntered={handleEntered}
        />
      )}
      <NavigationHint visible={hasEntered} />
    </main>
  );
}

export default App;
