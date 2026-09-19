import { useEffect, useState } from "react";

export default function NavigationHint({ visible }) {
  const [isDismissed, setIsDismissed] = useState(false);
  const isTouchDevice =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none), (pointer: coarse)").matches;

  useEffect(() => {
    if (!visible) return undefined;

    const timeout = window.setTimeout(() => setIsDismissed(true), 5200);
    return () => window.clearTimeout(timeout);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`navigation-hint${isDismissed ? " navigation-hint--hidden" : ""}`}
    >
      <span className="navigation-hint__icon" aria-hidden="true" />
      <span>
        {isTouchDevice
          ? "Swipe to explore • Pinch to zoom"
          : "Drag to explore • Scroll to zoom"}
      </span>
    </div>
  );
}
