import { useEffect, useState } from "react";

export default function NavigationHint({ visible }) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const isTouchDevice =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none), (pointer: coarse)").matches;

  useEffect(() => {
    if (!visible) return undefined;

    const hideTimeout = window.setTimeout(() => setIsDismissed(true), 4000);
    const removeTimeout = window.setTimeout(() => setIsRemoved(true), 4700);
    return () => {
      window.clearTimeout(hideTimeout);
      window.clearTimeout(removeTimeout);
    };
  }, [visible]);

  if (!visible || isRemoved) return null;

  return (
    <div
      className={`navigation-hint${isDismissed ? " navigation-hint--hidden" : ""}`}
    >
      <span className="navigation-hint__icon" aria-hidden="true" />
      <span>
        {isTouchDevice
          ? "Drag to explore · Tap objects"
          : "Drag to explore · Scroll to zoom · Click objects"}
      </span>
    </div>
  );
}
