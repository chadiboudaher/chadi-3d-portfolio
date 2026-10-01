function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.5 8.5V4.8m0 0h3.7m-3.7 0A8 8 0 1 1 4 14" />
      <path d="M9 14.5 12 12l3 2.5V18H9v-3.5Z" />
    </svg>
  );
}

export default function SceneInterface({ onCameraReset }) {
  return (
    <div className="scene-interface">
      <div className="scene-interface__utilities" aria-label="Scene controls">
        <button
          className="scene-interface__control"
          type="button"
          onClick={onCameraReset}
          aria-label="Reset camera view"
          title="Reset camera"
        >
          <ResetIcon />
        </button>
      </div>

      <a
        className="scene-interface__resume"
        href="/resume.pdf"
        target="_blank"
        rel="noreferrer"
      >
        Resume <span aria-hidden="true">↗</span>
      </a>

      <div className="scene-interface__meta">
        <p className="scene-interface__currently">
          <span>Currently</span> — Lebanese Arabic Visual Speech Recognition
        </p>
        <p className="scene-interface__credit">
          Designed &amp; built by Chadi Boudaher · 2026
        </p>
      </div>
    </div>
  );
}
