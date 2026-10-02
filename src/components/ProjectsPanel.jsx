import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";

import { githubProfile, projects } from "../data/projects";

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 5h5v5M19 5l-8 8M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.84a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export default function ProjectsPanel({ onClose }) {
  const [activeProject, setActiveProject] = useState(null);
  const overlayRef = useRef(null);
  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);
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
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closePanel]);

  return (
    <div
      className="projects-overlay"
      ref={overlayRef}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closePanel();
      }}
      role="presentation"
    >
      <section
        className="projects-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="projects-title"
      >
        <button
          className="projects-panel__close"
          ref={closeButtonRef}
          type="button"
          onClick={closePanel}
          aria-label="Close Projects panel"
        >
          <span aria-hidden="true">×</span>
        </button>

        <header className="projects-panel__header">
          <p className="projects-panel__eyebrow">
            A few things I&rsquo;ve built
          </p>
          <h1 id="projects-title">PROJECTS</h1>
          <p>Select a card to pull it from the deck.</p>
        </header>

        <div className="project-deck" data-active={activeProject ?? "none"}>
          {projects.map((project, index) => {
            const isActive = activeProject === index;
            return (
              <article
                className={`project-card project-card--${project.accent}${isActive ? " project-card--active" : ""}`}
                key={project.id}
                style={{ "--card-index": index }}
              >
                <button
                  className="project-card__select"
                  type="button"
                  onClick={() => setActiveProject(index)}
                  aria-label={`${isActive ? "Selected: " : "View details for "}${project.title}`}
                  aria-expanded={isActive}
                >
                  <span className="project-card__number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <span className="project-card__title">{project.title}</span>
                  <span className="project-card__subtitle">
                    {project.subtitle}
                  </span>
                  <span className="project-card__hint" aria-hidden="true">
                    {isActive ? "Selected" : "Pull this card"} <span>↗</span>
                  </span>
                </button>

                <div
                  className="project-card__details"
                  aria-hidden={!isActive}
                  inert={!isActive}
                >
                  <p>{project.description}</p>
                  <div className="project-card__problem">
                    <strong>What it solves</strong>
                    <p>{project.problem}</p>
                  </div>
                  <ul
                    className="project-card__stack"
                    aria-label="Technology stack"
                  >
                    {project.stack.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>
                  <a href={project.repo} target="_blank" rel="noreferrer">
                    <GitHubIcon />
                    View repository
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </article>
            );
          })}

          <a
            className="project-card project-card--github"
            href={githubProfile}
            target="_blank"
            rel="noreferrer"
            aria-label="Explore more projects on Chadi's GitHub (opens in a new tab)"
          >
            <span className="project-card--github__icon">
              <GitHubIcon />
            </span>
            <span className="project-card--github__copy">
              <small>More projects</small>
              <strong>Explore my GitHub</strong>
            </span>
            <ExternalLinkIcon />
          </a>
        </div>
      </section>
    </div>
  );
}
