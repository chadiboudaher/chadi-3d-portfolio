import { useEffect, useLayoutEffect, useRef } from "react";
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

export default function AboutPanel({ onClose }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

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
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) onClose();
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
          onClick={onClose}
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
        </div>
      </article>
    </div>
  );
}
