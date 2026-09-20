import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const skillGroups = [
  {
    title: "AI / ML",
    skills:
      "PyTorch · Scikit-learn · OpenCV · Computer Vision · Sequence Models",
  },
  {
    title: "Backend",
    skills: "Python · FastAPI · PostgreSQL · REST APIs",
  },
  {
    title: "Tools",
    skills: "Git · Docker · Linux · FFmpeg",
  },
];

const COMPASS_CENTER = 120;
const COMPASS_POINTER_LENGTH = 54;
const COMPASS_POINTER_DURATION = 0.2;
const COMPASS_SPIN_DURATION = 0.8;
const COMPASS_SETTLE_DURATION = 0.5;

function MiniCompass() {
  const compassRef = useRef(null);
  const pointerRef = useRef(null);
  const spinTimelineRef = useRef(null);
  const isSpinningRef = useRef(false);

  useEffect(() => {
    const pointer = pointerRef.current;
    const compass = compassRef.current;

    return () => {
      spinTimelineRef.current?.kill();
      gsap.killTweensOf(pointer);
      gsap.killTweensOf(compass);
    };
  }, []);

  const handlePointerMove = (event) => {
    if (
      event.pointerType === "touch" ||
      isSpinningRef.current ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }

    const compass = event.currentTarget;
    const bounds = compass.getBoundingClientRect();

    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;

    const dx = event.clientX - centerX;
    const dy = event.clientY - centerY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const pointer = pointerRef.current;

    if (!pointer || length === 0) return;

    gsap.to(pointer, {
      attr: {
        x2: COMPASS_CENTER + (dx / length) * COMPASS_POINTER_LENGTH,
        y2: COMPASS_CENTER + (dy / length) * COMPASS_POINTER_LENGTH,
      },
      duration: COMPASS_POINTER_DURATION,
      ease: "power2.out",
      overwrite: true,
    });
  };

  const handlePointerEnter = (event) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    gsap.to(event.currentTarget, {
      y: -3,
      scale: 1.03,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handlePointerLeave = (event) => {
    gsap.to(event.currentTarget, {
      y: 0,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
      overwrite: "auto",
    });

    if (isSpinningRef.current) return;

    const pointer = pointerRef.current;

    if (!pointer) return;

    gsap.to(pointer, {
      attr: { x2: COMPASS_CENTER, y2: 66 },
      duration: 0.65,
      ease: "power2.out",
      overwrite: true,
    });
  };

  const spinPointer = () => {
    const pointer = pointerRef.current;

    if (!pointer || isSpinningRef.current) return;

    isSpinningRef.current = true;

    const currentX = Number(pointer.getAttribute("x2")) - COMPASS_CENTER;
    const currentY = Number(pointer.getAttribute("y2")) - COMPASS_CENTER;
    const angle = {
      value: (Math.atan2(currentX, -currentY) * 180) / Math.PI,
    };
    const updateEndpoint = () => {
      const radians = (angle.value * Math.PI) / 180;

      pointer.setAttribute(
        "x2",
        COMPASS_CENTER + Math.sin(radians) * COMPASS_POINTER_LENGTH,
      );
      pointer.setAttribute(
        "y2",
        COMPASS_CENTER - Math.cos(radians) * COMPASS_POINTER_LENGTH,
      );
    };
    const fullTurn = angle.value + 360;
    const north = Math.round(fullTurn / 360) * 360;

    spinTimelineRef.current = gsap
      .timeline({
        onComplete: () => {
          isSpinningRef.current = false;
          spinTimelineRef.current = null;

          pointer.setAttribute("x2", COMPASS_CENTER);
          pointer.setAttribute("y2", 66);
        },
      })
      .to(angle, {
        value: fullTurn,
        duration: COMPASS_SPIN_DURATION,
        ease: "power2.inOut",
        onUpdate: updateEndpoint,
      })
      .to(angle, {
        value: north,
        duration: COMPASS_SETTLE_DURATION,
        ease: "back.out(1.7)",
        onUpdate: updateEndpoint,
      });
  };

  return (
    <button
      className="mini-compass"
      ref={compassRef}
      type="button"
      aria-label="Spin Chadi's compass"
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={spinPointer}
    >
      <svg viewBox="0 0 240 240" aria-hidden="true">
        <defs>
          <marker
            id="compass-arrow"
            markerWidth="18"
            markerHeight="18"
            refX="10"
            refY="5"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path className="mini-compass__pointer-tip" d="M0 0 10 5 0 10z" />
          </marker>
        </defs>
        <circle className="mini-compass__rim" cx="120" cy="120" r="106" />

        <circle className="mini-compass__face" cx="120" cy="120" r="92" />

        <g className="mini-compass__ticks">
          <path d="M120 29v10M211 120h-10M120 211v-10M29 120h10" />

          <path d="M56 56l7 7M184 56l-7 7M184 184l-7-7M56 184l7-7" />
        </g>

        <g className="mini-compass__letters">
          <text x="120" y="59">
            N
          </text>

          <text x="183" y="126">
            E
          </text>

          <text x="120" y="194">
            S
          </text>

          <text x="56" y="126">
            W
          </text>
        </g>

        <line
          className="mini-compass__pointer"
          ref={pointerRef}
          x1="120"
          y1="120"
          x2="120"
          y2="66"
          markerEnd="url(#compass-arrow)"
        />

        {/* Center stays fixed */}
        <circle className="mini-compass__pivot" cx="120" cy="120" r="19" />

        <text className="mini-compass__monogram" x="120" y="126">
          CB
        </text>
      </svg>
    </button>
  );
}

export default function AboutPanel({ onClose }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const isClosingRef = useRef(false);

  const closePanel = useCallback(() => {
    if (isClosingRef.current) return;

    isClosingRef.current = true;

    gsap
      .timeline({
        onComplete: onClose,
      })
      .to(panelRef.current, {
        y: 12,
        scale: 0.98,
        opacity: 0,
        duration: 0.26,
        ease: "power2.in",
      })
      .to(
        overlayRef.current,
        {
          autoAlpha: 0,
          duration: 0.2,
          ease: "power1.in",
        },
        "-=0.16",
      );
  }, [onClose]);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
          duration: 0.32,
          ease: "power1.out",
        },
      );

      gsap.fromTo(
        panelRef.current,
        {
          y: 18,
          scale: 0.98,
        },
        {
          y: 0,
          scale: 1,
          duration: 0.42,
          ease: "power2.out",
        },
      );
    }, overlayRef);

    closeButtonRef.current?.focus();

    return () => {
      context.revert();
    };
  }, [closePanel]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closePanel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closePanel]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      closePanel();
    }
  };

  return (
    <div
      className="about-overlay"
      ref={overlayRef}
      onMouseDown={handleBackdropClick}
      role="presentation"
    >
      <article
        className="about-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
      >
        <button
          className="about-panel__close"
          ref={closeButtonRef}
          type="button"
          onClick={closePanel}
          aria-label="Close About panel"
        >
          <span aria-hidden="true">×</span>
        </button>

        <div className="about-panel__scroll">
          <section className="about-panel__intro">
            <div className="about-panel__intro-copy">
              <h1 id="about-title">ABOUT ME</h1>

              <div className="about-panel__copy">
                <p className="about-panel__hello">Hi, I’m Chadi.</p>

                <p>
                  I’m a Computer &amp; Communications Engineering master’s
                  student focused on AI/ML and software engineering.
                </p>

                <p>
                  I enjoy building projects that combine research with practical
                  engineering, especially in computer vision, speech processing,
                  multimodal AI, and backend systems.
                </p>

                <p>
                  Currently, I’m working on Arabic Visual Speech Recognition for
                  Lebanese Arabic, including building an audio-visual corpus
                  pipeline and experimenting with deep learning approaches for
                  lip reading.
                </p>
              </div>
            </div>

            <aside
              className="about-panel__identity"
              aria-label="Chadi Boudaher, Halba, Lebanon"
            >
              <MiniCompass />

              <p className="about-panel__name">Chadi Boudaher</p>

              <p className="about-panel__location">Halba, Lebanon</p>
            </aside>
          </section>

          <section className="about-panel__section">
            <h2>TOOLBOX</h2>

            <div className="about-panel__skills">
              {skillGroups.map(({ title, skills }) => (
                <div className="about-panel__skill" key={title}>
                  <h3>{title}</h3>
                  <p>{skills}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="about-panel__section">
            <h2>CURRENTLY EXPLORING</h2>

            <p className="about-panel__exploring">
              Multimodal AI · Visual Speech Recognition · Computer Vision ·
              Sequence Models · Scalable Backend Systems
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
