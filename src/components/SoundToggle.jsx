export default function SoundToggle({ isMuted, onToggle }) {
  const label = isMuted ? "Turn ambience on" : "Turn ambience off";

  return (
    <button
      className="sound-toggle"
      type="button"
      onClick={onToggle}
      aria-label={label}
      aria-pressed={isMuted}
      title={label}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9v6h4l5 4V5L8 9H4Z" />
        {isMuted ? (
          <path d="m17 9 4 4m0-4-4 4" />
        ) : (
          <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" />
        )}
      </svg>
    </button>
  );
}
