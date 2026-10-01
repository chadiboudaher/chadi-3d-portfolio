import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

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

export default function SceneWarmup({ onPrepared }) {
  const renderer = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    let cancelled = false;
    let frame;
    const markPreparedAfterPaint = () => {
      frame = window.requestAnimationFrame(() => {
        if (!cancelled) onPrepared();
      });
    };

    warmupRenderer(renderer, scene, camera).then(markPreparedAfterPaint, () => {
      // Shader parallel-compilation support varies by browser/driver. Falling
      // back preserves the existing rendered scene rather than trapping the UI.
      markPreparedAfterPaint();
    });

    return () => {
      cancelled = true;
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, [camera, onPrepared, renderer, scene]);

  return null;
}
