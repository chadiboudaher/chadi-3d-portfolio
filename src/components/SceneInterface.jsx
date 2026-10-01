function SoundIcon({ muted }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 10v4h4l5 4V6L8 10H4Z" />
      {muted ? (
        <path d="m17 9 4 6m0-6-4 6" />
      ) : (
        <path d="M16 9.2a4 4 0 0 1 0 5.6m2.2-7.8a7 7 0 0 1 0 10" />
      )}
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.5 8.5V4.8m0 0h3.7m-3.7 0A8 8 0 1 1 4 14" />
      <path d="M9 14.5 12 12l3 2.5V18H9v-3.5Z" />
    </svg>
  );
}

export default function SceneInterface({
  isMuted,
  onSoundToggle,
  onCameraReset,
}) {
  return (
    <div className="scene-interface">
      <div className="scene-interface__utilities" aria-label="Scene controls">
        <button
          className="scene-interface__control"
          type="button"
          onClick={onSoundToggle}
          aria-label={
            isMuted ? "Turn ambient sound on" : "Turn ambient sound off"
          }
          title={isMuted ? "Sound on" : "Sound off"}
          aria-pressed={isMuted}
        >
          <SoundIcon muted={isMuted} />
        </button>
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
