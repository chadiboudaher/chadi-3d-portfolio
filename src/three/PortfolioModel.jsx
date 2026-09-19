import { useCallback, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { gsap } from "gsap";

const MODEL_PATH = "/models/portfolio.glb";
const HOVER_SCALE = 1.15;
const HOVER_TWEEN = {
  duration: 0.25,
  ease: "power2.out",
  overwrite: true,
};

function findHoverRoot(object, scene) {
  let currentObject = object;

  while (currentObject) {
    if (currentObject.name.toLowerCase().includes("hover")) {
      return currentObject;
    }

    if (currentObject === scene) break;
    currentObject = currentObject.parent;
  }

  return null;
}

export default function PortfolioModel({ onLoaded }) {
  const { scene } = useGLTF(MODEL_PATH);
  const hoveredSign = useRef(null);
  const originalScales = useRef(new Map());

  const animateSign = useCallback((sign, multiplier) => {
    const originalScale = originalScales.current.get(sign);
    if (!originalScale) return;

    gsap.killTweensOf(sign.scale);
    gsap.to(sign.scale, {
      x: originalScale.x * multiplier,
      y: originalScale.y * multiplier,
      z: originalScale.z * multiplier,
      ...HOVER_TWEEN,
    });
  }, []);

  const setHoveredSign = useCallback(
    (nextSign) => {
      if (hoveredSign.current === nextSign) return;

      if (hoveredSign.current) animateSign(hoveredSign.current, 1);

      hoveredSign.current = nextSign;
      document.body.style.cursor = nextSign ? "pointer" : "";

      if (nextSign) animateSign(nextSign, HOVER_SCALE);
    },
    [animateSign],
  );

  useEffect(() => {
    const signScales = originalScales.current;
    scene.traverse((object) => {
      if (!object.isMesh) return;
      if (object.name.toLowerCase().includes("hover")) {
        signScales.set(object, object.scale.clone());
      }

      object.castShadow = true;
      object.receiveShadow = true;
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    onLoaded();
    return () => {
      signScales.forEach((originalScale, sign) => {
        gsap.killTweensOf(sign.scale);
        sign.scale.copy(originalScale);
      });
      signScales.clear();
      hoveredSign.current = null;
      document.body.style.cursor = "";
    };
  }, [onLoaded, scene]);

  const handlePointerMove = useCallback(
    (event) => {
      const sign = findHoverRoot(event.object, scene);

      if (sign) event.stopPropagation();
      setHoveredSign(sign);
    },
    [scene, setHoveredSign],
  );

  const handlePointerOut = useCallback(
    (event) => {
      const currentSign = hoveredSign.current;
      if (!currentSign) return;

      const isStillOverCurrentSign = event.intersections.some(
        (intersection) =>
          findHoverRoot(intersection.object, scene) === currentSign,
      );

      if (!isStillOverCurrentSign) setHoveredSign(null);
    },
    [scene, setHoveredSign],
  );

  return (
    <primitive
      object={scene}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
    />
  );
}

useGLTF.preload(MODEL_PATH);
