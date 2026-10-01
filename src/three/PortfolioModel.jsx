import { useCallback, useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { gsap } from "gsap";
import { Color } from "three";
import {
  findHoverRoot,
  getInteractionLabel,
  isAboutObject,
  isContactObject,
  isHoverObject,
} from "./interaction.js";

const MODEL_PATH = "/models/portfolio.glb";
const SATELLITE_ROTATION_AXIS = "y";
const SATELLITE_SCAN_RANGE = Math.PI / 4;
const SATELLITE_SCAN_DURATION = 6;
const HIGHLIGHT_COLOR = new Color("#fff4d6");
const HIGHLIGHT_AMOUNT = 0.08;

export default function PortfolioModel({
  onLoaded,
  onSectionSelect,
  onSceneHover,
}) {
  const { scene } = useGLTF(MODEL_PATH);
  const hoveredSign = useRef(null);
  const hoverMaterials = useRef(new Map());
  const supportsHover = useRef(
    window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );

  const setHighlight = useCallback((sign, highlighted) => {
    const materials = hoverMaterials.current.get(sign);
    materials?.forEach(({ material, color, emissive, emissiveIntensity }) => {
      if (color) {
        material.color.copy(color);
        if (highlighted) material.color.lerp(HIGHLIGHT_COLOR, HIGHLIGHT_AMOUNT);
      }
      if (emissive) {
        material.emissive.copy(emissive);
        if (highlighted) {
          material.emissive.lerp(HIGHLIGHT_COLOR, HIGHLIGHT_AMOUNT * 0.7);
        }
      }
      if (emissiveIntensity !== undefined) {
        material.emissiveIntensity = highlighted
          ? emissiveIntensity + 0.04
          : emissiveIntensity;
      }
      material.needsUpdate = true;
    });
  }, []);

  const resetHoveredSign = useCallback(() => {
    const sign = hoveredSign.current;

    if (sign) setHighlight(sign, false);

    hoveredSign.current = null;
    document.body.style.cursor = "default";
    onSceneHover(null);
  }, [onSceneHover, setHighlight]);

  const setHoveredSign = useCallback(
    (nextSign) => {
      if (hoveredSign.current === nextSign) return;

      if (hoveredSign.current) setHighlight(hoveredSign.current, false);

      hoveredSign.current = nextSign;
      document.body.style.cursor = nextSign ? "pointer" : "default";

      if (nextSign) setHighlight(nextSign, true);
    },
    [setHighlight],
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
    const materialGroups = hoverMaterials.current;
    scene.traverse((object) => {
      if (isHoverObject(object)) {
        const materials = [];
        object.traverse((child) => {
          if (!child.isMesh || !child.material) return;

          const sourceMaterials = Array.isArray(child.material)
            ? child.material
            : [child.material];
          const clonedMaterials = sourceMaterials.map((material) =>
            material.clone(),
          );
          child.userData.hoverOriginalMaterial = child.material;
          child.material = Array.isArray(child.material)
            ? clonedMaterials
            : clonedMaterials[0];

          clonedMaterials.forEach((material) => {
            materials.push({
              material,
              color: material.color?.clone(),
              emissive: material.emissive?.clone(),
              emissiveIntensity: material.emissiveIntensity,
            });
          });
        });
        materialGroups.set(object, materials);
      }
      if (object.isMesh) {
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    onLoaded();
    return () => {
      materialGroups.forEach((materials, sign) => {
        sign.traverse((child) => {
          if (!child.userData.hoverOriginalMaterial) return;
          child.material = child.userData.hoverOriginalMaterial;
          delete child.userData.hoverOriginalMaterial;
        });
        materials.forEach(({ material }) => material.dispose());
      });
      materialGroups.clear();
      hoveredSign.current = null;
      document.body.style.cursor = "default";
    };
  }, [onLoaded, onSceneHover, scene]);

  const handlePointerMove = useCallback(
    (event) => {
      if (!supportsHover.current) return;
      const sign = findHoverRoot(event.object);

      if (sign) event.stopPropagation();
      setHoveredSign(sign);
      const label = sign ? getInteractionLabel(sign) : null;
      onSceneHover(label, event.clientX, event.clientY);
    },
    [onSceneHover, setHoveredSign],
  );

  const handlePointerOut = useCallback(
    (event) => {
      const currentSign = hoveredSign.current;
      if (!currentSign) return;

      const isStillOverCurrentSign = event.intersections.some(
        (intersection) => findHoverRoot(intersection.object) === currentSign,
      );

      if (!isStillOverCurrentSign) {
        setHoveredSign(null);
        onSceneHover(null);
      }
    },
    [onSceneHover, setHoveredSign],
  );

  const handleClick = useCallback(
    (event) => {
      const sign = findHoverRoot(event.object);
      if (!sign) return;

      const section = isAboutObject(sign)
        ? "about"
        : isContactObject(sign)
          ? "contact"
          : null;

      if (!section) return;

      event.stopPropagation();
      resetHoveredSign();
      onSectionSelect(section);
    },
    [onSectionSelect, resetHoveredSign],
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
