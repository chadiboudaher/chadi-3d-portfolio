import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const warmups = new WeakMap();

function warmupRenderer(renderer, scene, camera) {
  let warmup = warmups.get(renderer);

  if (!warmup) {
    // The scene has already rendered behind the loading screen, so its textures
    // are resident. compileAsync completes any remaining shader programs while
    // the user is still looking at the loading UI.
    warmup = renderer.compileAsync(scene, camera);
    warmups.set(renderer, warmup);
  }

  return warmup;
}

export default function SceneWarmup({ onFirstFrameRendered }) {
  const renderer = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);

  const compiledAtFrameRef = useRef(null);
  const reportedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const markCompiled = () => {
      if (!cancelled) compiledAtFrameRef.current = renderer.info.render.frame;
    };

    warmupRenderer(renderer, scene, camera).then(markCompiled, () => {
      // Shader parallel-compilation support varies by browser/driver. Falling
      // back preserves the existing rendered scene rather than trapping the UI.
      markCompiled();
    });

    return () => {
      cancelled = true;
    };
  }, [camera, renderer, scene]);

  useFrame(() => {
    const compiledAtFrame = compiledAtFrameRef.current;
    if (
      compiledAtFrame !== null &&
      renderer.info.render.frame > compiledAtFrame &&
      !reportedRef.current
    ) {
      // The renderer's frame counter only advances after gl.render(), so this
      // proves that a complete prepared frame ran behind the loading overlay.
      reportedRef.current = true;
      onFirstFrameRendered();
    }
  });

  return null;
}
