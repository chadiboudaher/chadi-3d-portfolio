import { Suspense, useCallback, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import LoadingScreen from "./components/LoadingScreen";
import NavigationHint from "./components/NavigationHint";
import Experience from "./three/Experience";

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleLoaded = useCallback(() => setIsLoaded(true), []);

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
          <Experience onLoaded={handleLoaded} />
        </Suspense>
      </Canvas>
      <LoadingScreen isLoaded={isLoaded} />
      <NavigationHint visible={isLoaded} />
    </main>
  );
}

export default App;
