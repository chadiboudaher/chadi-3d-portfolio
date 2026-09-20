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

const personalInterests = [
  {
    title: "Chess",
    description:
      "I enjoy the strategy, patience, and problem solving behind the game.",
  },
  {
    title: "Reading",
    description:
      "Usually something around technology, research, or whatever topic has caught my curiosity.",
  },
];

export default function AboutPanel({ onClose }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
  const interestRefs = useRef([]);
  const isClosingRef = useRef(false);

  const closePanel = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    gsap
      .timeline({ onComplete: onClose })
      .to(panelRef.current, {
        y: 12,
        scale: 0.98,
        opacity: 0,
        duration: 0.26,
        ease: "power2.in",
      })
      .to(
        overlayRef.current,
        { autoAlpha: 0, duration: 0.2, ease: "power1.in" },
        "-=0.16",
      );
  }, [onClose]);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.32, ease: "power1.out" },
      );
      gsap.fromTo(
        panelRef.current,
        { y: 18, scale: 0.98 },
        { y: 0, scale: 1, duration: 0.42, ease: "power2.out" },
      );
    }, overlayRef);

    closeButtonRef.current?.focus();
    return () => context.revert();
  }, [closePanel]);

  useLayoutEffect(() => {
    const interests = interestRefs.current.filter(Boolean);
    const context = gsap.context(() => {}, panelRef);

    return () => {
      gsap.killTweensOf(interests);
      context.revert();
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closePanel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closePanel]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) closePanel();
  };
  const animateInterest = (target, properties, duration = 0.3) => {
    gsap.killTweensOf(target);
    gsap.to(target, {
      ...properties,
      duration,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleInterestEnter = (event, index) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    animateInterest(event.currentTarget, {
      y: -4,
      rotation: index === 0 ? -1.25 : 1.25,
      scale: 1.03,
    });
  };

  const handleInterestLeave = (event) => {
    animateInterest(event.currentTarget, { y: 0, rotation: 0, scale: 1 });
  };

  const handleInterestDown = (event) => {
    if (event.pointerType === "mouse") return;
    animateInterest(
      event.currentTarget,
      { y: 0, rotation: 0, scale: 0.97 },
      0.2,
    );
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
          <section className="about-panel__section">
            <h1 id="about-title">ABOUT ME</h1>
            <div className="about-panel__copy">
              <p className="about-panel__hello">Hi, I’m Chadi.</p>
              <p>
                I’m a Computer &amp; Communications Engineering master’s student
                focused on AI/ML and software engineering.
              </p>
              <p>
                I enjoy building projects that combine research with practical
                engineering, especially in computer vision, speech processing,
                multimodal AI, and backend systems.
              </p>
              <p>
                Currently, I’m working on Arabic Visual Speech Recognition for
                Lebanese Arabic, including building an audio-visual corpus
                pipeline and experimenting with deep learning approaches for lip
                reading.
              </p>
            </div>
          </section>

          <section className="about-panel__section">
            <div className="about-panel__details">
              <div className="about-panel__detail">
                <h2>WHERE ARE YOU BASED?</h2>
                <p>Lebanon</p>
              </div>
              <div className="about-panel__detail">
                <h2>HOW DO YOU APPROACH YOUR WORK?</h2>
                <p>
                  I like to first understand the problem clearly, break it into
                  smaller pieces, and then experiment until I find an approach
                  that works. I enjoy learning through building, testing ideas,
                  and improving them as I go.
                </p>
              </div>
            </div>
          </section>

          <section className="about-panel__section">
            <h2>WHAT I WORK WITH</h2>
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

          <section className="about-panel__section">
            <h2>A HUMANIZING TOUCH</h2>
            <div className="about-panel__interests">
              {personalInterests.map(({ title, description }, index) => (
                <div
                  className="about-panel__interest"
                  key={title}
                  ref={(element) => {
                    interestRefs.current[index] = element;
                  }}
                  onPointerEnter={(event) => handleInterestEnter(event, index)}
                  onPointerLeave={handleInterestLeave}
                  onPointerDown={handleInterestDown}
                  onPointerUp={handleInterestLeave}
                  onPointerCancel={handleInterestLeave}
                >
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>
    </div>
  );
}
