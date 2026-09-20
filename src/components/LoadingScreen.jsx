import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export default function LoadingScreen({
  isReady,
  isEntering,
  onEnter,
  onEntered,
}) {
  const screenRef = useRef(null);
  const loadingRef = useRef(null);
  const readyRef = useRef(null);
  const buttonRef = useRef(null);
  const dotsTweenRef = useRef(null);

  useLayoutEffect(() => {
    const button = buttonRef.current;
    const context = gsap.context(() => {
      gsap.set(readyRef.current, { autoAlpha: 0, pointerEvents: "none" });

      dotsTweenRef.current = gsap.to(".loading-screen__dot", {
        y: "-0.28em",
        duration: 0.48,
        ease: "sine.inOut",
        stagger: {
          each: 0.14,
          repeat: -1,
          yoyo: true,
        },
      });
    }, screenRef);

    return () => {
      gsap.killTweensOf(button);
      context.revert();
    };
  }, []);

  useLayoutEffect(() => {
    if (!isReady) return undefined;

    const context = gsap.context(() => {
      dotsTweenRef.current?.kill();
      const timeline = gsap.timeline();
      timeline
        .to(loadingRef.current, {
          autoAlpha: 0,
          y: -8,
          duration: 0.38,
          ease: "power1.inOut",
        })
        .set(loadingRef.current, { pointerEvents: "none" })
        .set(readyRef.current, { pointerEvents: "auto" })
        .fromTo(
          readyRef.current,
          { autoAlpha: 0, y: 14, scale: 0.85 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            ease: "back.out(1.7)",
          },
        );
    }, screenRef);

    return () => context.revert();
  }, [isReady]);

  useLayoutEffect(() => {
    if (!isEntering) return undefined;

    const context = gsap.context(() => {
      gsap
        .timeline({ onComplete: onEntered })
        .to(buttonRef.current, {
          y: 5,
          scale: 0.97,
          duration: 0.09,
          ease: "power1.inOut",
        })
        .to(buttonRef.current, {
          y: 0,
          scale: 1,
          duration: 0.1,
          ease: "power1.out",
        })
        .to(screenRef.current, {
          autoAlpha: 0,
          duration: 0.7,
          ease: "power1.inOut",
        });
    }, screenRef);

    return () => context.revert();
  }, [isEntering, onEntered]);

  const handlePointerEnter = () => {
    if (isEntering) return;
    gsap.to(buttonRef.current, {
      y: -3,
      scale: 1.05,
      duration: 0.22,
      ease: "power1.out",
      overwrite: "auto",
    });
  };

  const handlePointerLeave = () => {
    if (isEntering) return;
    gsap.to(buttonRef.current, {
      y: 0,
      scale: 1,
      duration: 0.22,
      ease: "power1.inOut",
      overwrite: "auto",
    });
  };

  return (
    <div
      className="loading-screen"
      ref={screenRef}
      aria-live="polite"
      aria-busy={!isReady}
    >
      <div className="loading-screen__loading" ref={loadingRef}>
        <span>Loading</span>
        <span className="loading-screen__dots" aria-hidden="true">
          {[0, 1, 2].map((dot) => (
            <span className="loading-screen__dot" key={dot}>
              .
            </span>
          ))}
        </span>
      </div>

      <div className="loading-screen__ready" ref={readyRef}>
        <button
          className="loading-screen__enter"
          ref={buttonRef}
          type="button"
          onClick={onEnter}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          disabled={isEntering}
        >
          Enter!
        </button>
      </div>
    </div>
  );
}
