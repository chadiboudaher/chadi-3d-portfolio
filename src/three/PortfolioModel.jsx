import { useCallback, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { gsap } from "gsap";

const MODEL_PATH = "/models/portfolio.glb";
const SATELLITE_ROTATION_AXIS = "y";
const SATELLITE_SCAN_RANGE = Math.PI / 4;
const SATELLITE_SCAN_DURATION = 6;
const HOVER_SCALE = 1.15;
const HOVER_TWEEN = {
  duration: 0.25,
  ease: "power2.out",
  overwrite: true,
};

const SECTION_BY_ROOT_NAME = {
  about_hover: "about",
  projects_hover: "projects",
  contact_hover: "contact",
};

function findInteractiveRoot(object, scene) {
  let currentObject = object;

  while (currentObject) {
    if (currentObject.name.toLowerCase().includes("_hover")) {
      return currentObject;
    }

    if (currentObject === scene) break;
    currentObject = currentObject.parent;
  }

  return null;
}

export default function PortfolioModel({ onLoaded, onSectionSelect }) {
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
    const satellite = scene.getObjectByName("Satellite_Rotate");
    if (!satellite) return undefined;

    const initialRotation = satellite.rotation[SATELLITE_ROTATION_AXIS];
    const rotationTween = gsap.fromTo(
      satellite.rotation,
      {
        [SATELLITE_ROTATION_AXIS]: initialRotation - SATELLITE_SCAN_RANGE,
      },
      {
        [SATELLITE_ROTATION_AXIS]: initialRotation + SATELLITE_SCAN_RANGE,
        duration: SATELLITE_SCAN_DURATION,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      },
    );

    return () => {
      rotationTween.kill();
      satellite.rotation[SATELLITE_ROTATION_AXIS] = initialRotation;
    };
  }, [scene]);

  useEffect(() => {
    const signScales = originalScales.current;
    scene.traverse((object) => {
      if (object.name.toLowerCase().includes("_hover")) {
        signScales.set(object, object.scale.clone());
      }
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
      const sign = findInteractiveRoot(event.object, scene);

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
          findInteractiveRoot(intersection.object, scene) === currentSign,
      );

      if (!isStillOverCurrentSign) setHoveredSign(null);
    },
    [scene, setHoveredSign],
  );

  const handleClick = useCallback(
    (event) => {
      const sign = findInteractiveRoot(event.object, scene);
      const section = sign
        ? SECTION_BY_ROOT_NAME[sign.name.toLowerCase()]
        : undefined;
      if (!section) return;

      event.stopPropagation();
      onSectionSelect(section);
    },
    [onSectionSelect, scene],
  );

  return (
    <primitive
      object={scene}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    />
  );
}

useGLTF.preload(MODEL_PATH);
