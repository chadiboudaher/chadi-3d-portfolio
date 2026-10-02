import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";

import LoadingScreen from "./components/LoadingScreen";
import NavigationHint from "./components/NavigationHint";
import SceneInterface from "./components/SceneInterface";
import AboutPanel from "./components/AboutPanel";
import ContactPanel from "./components/ContactPanel";
import ProjectsPanel from "./components/ProjectsPanel";
import SoundToggle from "./components/SoundToggle";

import useAmbientAudio from "./audio/useAmbientAudio";
import Experience from "./three/Experience";

function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [scenePrepared, setScenePrepared] = useState(false);
  const [minimumDurationElapsed, setMinimumDurationElapsed] = useState(false);

  const [isEntering, setIsEntering] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const [activeSection, setActiveSection] = useState(null);
  const [resetCameraToken, setResetCameraToken] = useState(0);

  const hoverLabelRef = useRef(null);
  const currentHoverLabel = useRef(null);

  const { isMuted, start: startAmbience, toggleMuted } = useAmbientAudio();

  const isReady = assetsLoaded && scenePrepared && minimumDurationElapsed;

  const handleLoaded = useCallback(() => {
    setAssetsLoaded(true);
  }, []);

  const handleScenePrepared = useCallback(() => {
    setScenePrepared(true);
  }, []);

  const handleEnter = useCallback(() => {
    if (!isReady || isEntering) return;

    startAmbience();
    setIsEntering(true);
  }, [isEntering, isReady, startAmbience]);

  const handleEntered = useCallback(() => {
    setHasEntered(true);
  }, []);

  const handleSectionSelect = useCallback((section) => {
    setActiveSection(section);
  }, []);

  const handleSectionClose = useCallback(() => {
    setActiveSection(null);
  }, []);

  const handleCameraReset = useCallback(() => {
    setResetCameraToken((token) => token + 1);
  }, []);

  const handleSceneHover = useCallback((label, x, y) => {
    const element = hoverLabelRef.current;
    if (!element) return;

    if (!label) {
      currentHoverLabel.current = null;
      element.classList.remove("scene-hover-label--visible");
      return;
    }

    if (currentHoverLabel.current !== label) {
      currentHoverLabel.current = label;
      element.textContent = `[ ${label} ]`;
    }

    element.style.transform = `translate3d(${x + 14}px, ${y + 16}px, 0)`;
    element.classList.add("scene-hover-label--visible");
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setMinimumDurationElapsed(true);
    }, 2800);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <main className="experience" aria-label="Interactive campsite portfolio">
      <Canvas
        dpr={[1, 2]}
        shadows
        camera={{
          position: [9.2, 6.4, 13.2],
          fov: 40,
          near: 0.1,
          far: 150,
        }}
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
          <Experience
            onLoaded={handleLoaded}
            onPrepared={handleScenePrepared}
            controlsEnabled={hasEntered && activeSection === null}
            onSceneHover={handleSceneHover}
            onSectionSelect={handleSectionSelect}
            resetCameraToken={resetCameraToken}
          />
        </Suspense>
      </Canvas>
      <div
        ref={hoverLabelRef}
        className="scene-hover-label"
        aria-hidden="true"
      />
      {!hasEntered && (
        <LoadingScreen
          isReady={isReady}
          isEntering={isEntering}
          onEnter={handleEnter}
          onEntered={handleEntered}
        />
      )}

      <NavigationHint visible={hasEntered} />

      {hasEntered && (
        <>
          <div
            className="scene-controls"
            role="group"
            aria-label="Scene controls"
          >
            <SoundToggle isMuted={isMuted} onToggle={toggleMuted} />
            <button
              className="scene-control scene-control--line"
              type="button"
              onClick={handleCameraReset}
              aria-label="Reset camera"
              title="Reset camera"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5.5 8.5V4.8m0 0h3.7m-3.7 0A8 8 0 1 1 4 14" />
                <path d="M9 14.5 12 12l3 2.5V18H9v-3.5Z" />
              </svg>
            </button>
            <a
              className="scene-control scene-control--line"
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              aria-label="Open resume"
              title="Resume"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 3.5h6l4 4V20.5H7Z" />
                <path d="M13 3.5v4h4M10 12h4M10 15.5h4" />
              </svg>
            </a>
            <a
              className="scene-control scene-control--line"
              href="https://www.chess.com/member/kiwi-v1"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open Chess.com profile"
              title="Challenge me on Chess.com"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 20h11M8 17h9l1 3H7l1-3Z" />
                <path d="M9 17c0-2 1-3.2 3-4.5l-2-2.2L11 5l5 2 2 4-2.5 2.5L14 12l-1.5 1.5" />
                <path d="m11 5 2 4-3-1.2" />
                <circle
                  cx="14.5"
                  cy="8.5"
                  r="0.6"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
          </div>

          <SceneInterface />
        </>
      )}

      {activeSection === "about" && <AboutPanel onClose={handleSectionClose} />}

      {activeSection === "contact" && (
        <ContactPanel onClose={handleSectionClose} />
      )}

      {activeSection === "projects" && (
        <ProjectsPanel onClose={handleSectionClose} />
      )}
    </main>
  );
}

export default App;
