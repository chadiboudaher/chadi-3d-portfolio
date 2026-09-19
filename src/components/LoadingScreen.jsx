import { useProgress } from "@react-three/drei";

export default function LoadingScreen({
  isReady,
  isEntering,
  onEnter,
  onEntered,
}) {
  const { progress } = useProgress();
  const displayProgress = Math.min(100, Math.round(progress));

  return (
    <div
      className={`loading-screen${isEntering ? " loading-screen--hidden" : ""}`}
      aria-live="polite"
      aria-hidden={isEntering}
      onTransitionEnd={(event) => {
        if (isEntering && event.propertyName === "opacity") onEntered();
      }}
    >
      <div className="loading-screen__content">
        <span className="loading-screen__eyebrow">Welcome to the outdoors</span>
        {isReady ? (
          <div className="loading-screen__ready">
            <p className="loading-screen__title">Ready to explore</p>
            <button
              className="loading-screen__enter"
              type="button"
              onClick={onEnter}
              disabled={isEntering}
            >
              Enter
            </button>
          </div>
        ) : (
          <div className="loading-screen__loading">
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
            <span className="loading-screen__percentage">
              {displayProgress}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
