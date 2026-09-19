import { useProgress } from "@react-three/drei";

export default function LoadingScreen({ isLoaded }) {
  const { progress } = useProgress();
  const displayProgress = Math.min(100, Math.round(progress));

  return (
    <div
      className={`loading-screen${isLoaded ? " loading-screen--hidden" : ""}`}
      aria-live="polite"
      aria-hidden={isLoaded}
    >
      <div className="loading-screen__content">
        <span className="loading-screen__eyebrow">Welcome to the outdoors</span>
        <p className="loading-screen__title">Loading campsite...</p>
        <div
          className="loading-screen__track"
          role="progressbar"
          aria-label="Loading campsite"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={displayProgress}
        >
          <span
            className="loading-screen__progress"
            style={{ transform: `scaleX(${displayProgress / 100})` }}
          />
        </div>
        <span className="loading-screen__percentage">{displayProgress}%</span>
      </div>
    </div>
  );
}
