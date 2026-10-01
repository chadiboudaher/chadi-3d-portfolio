import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const contactLinks = [
  {
    label: "Email",
    detail: "Say hello",
    href: "mailto:chadiboudaher7@gmail.com",
    filled: false,
    icon: (
      <>
        <rect x="4" y="6" width="24" height="20" rx="4" />
        <path d="m6.5 9 9.5 8 9.5-8" />
      </>
    ),
  },
  {
    label: "GitHub",
    detail: "See my work",
    href: "https://github.com/chadiboudaher",
    filled: true,
    icon: (
      <path d="M16 3.8a12.4 12.4 0 0 0-3.9 24.2c.6.1.8-.3.8-.6v-2.2c-3.4.7-4.1-1.4-4.1-1.4-.5-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.3.1 2 1.3 2 1.3 1.1 2 3 1.4 3.7 1 .1-.8.4-1.4.8-1.8-2.7-.3-5.6-1.4-5.6-6.1 0-1.4.5-2.5 1.3-3.4-.1-.3-.6-1.6.1-3.4 0 0 1.1-.3 3.5 1.3a12 12 0 0 1 6.4 0c2.4-1.6 3.5-1.3 3.5-1.3.7 1.8.2 3.1.1 3.4.8.9 1.3 2 1.3 3.4 0 4.8-2.9 5.8-5.6 6.1.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12.4 12.4 0 0 0 16 3.8Z" />
    ),
  },
  {
    label: "LinkedIn",
    detail: "Let's connect",
    href: "https://www.linkedin.com/in/chadi-boudaher/",
    filled: true,
    icon: (
      <>
        <rect x="5" y="12" width="5" height="15" rx="1" />
        <circle cx="7.5" cy="7.5" r="2.5" />
        <path d="M14 27V12h5v2.2c1-1.6 2.6-2.7 5-2.7 3.6 0 5 2.4 5 6.4V27h-5v-8.1c0-2-.7-3.3-2.5-3.3-2 0-2.5 1.5-2.5 3.3V27Z" />
      </>
    ),
  },
];

export default function ContactPanel({ onClose }) {
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
        y: 14,
        rotation: -1,
        scale: 0.97,
        opacity: 0,
        duration: 0.24,
        ease: "power2.in",
      })
      .to(
        overlayRef.current,
        { autoAlpha: 0, duration: 0.18, ease: "power1.in" },
        "-=0.12",
      );
  }, [onClose]);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.3, ease: "power1.out" },
      );
      gsap.fromTo(
        panelRef.current,
        { y: 22, rotation: 1.5, scale: 0.96 },
        { y: 0, rotation: 0, scale: 1, duration: 0.46, ease: "back.out(1.35)" },
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
      className="contact-overlay"
      ref={overlayRef}
      onMouseDown={(event) =>
        event.target === event.currentTarget && closePanel()
      }
      role="presentation"
    >
      <article
        className="contact-card"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        aria-describedby="contact-description"
      >
        <button
          className="contact-card__close"
          ref={closeButtonRef}
          type="button"
          onClick={closePanel}
          aria-label="Close Contact panel"
        >
          <span aria-hidden="true">×</span>
        </button>
        <div className="contact-card__heading">
          <span className="contact-card__spark" aria-hidden="true">
            ✦
          </span>
          <h1 id="contact-title">LET’S CONNECT</h1>
          <span className="contact-card__spark" aria-hidden="true">
            ✦
          </span>
        </div>
        <p id="contact-description" className="contact-card__message">
          Have an idea, a project, or just want to say hello? I’d love to hear
          from you.
        </p>
        <nav className="contact-card__links" aria-label="Contact links">
          {contactLinks.map(({ label, detail, href, icon, filled }, index) => (
            <a
              className="contact-card__link"
              href={href}
              key={label}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              style={{ "--link-index": index }}
            >
              <span
                className={`contact-card__icon${filled ? " contact-card__icon--filled" : ""}`}
                aria-hidden="true"
              >
                <svg viewBox="0 0 32 32">{icon}</svg>
              </span>
              <strong>{label}</strong>
              <span>{detail}</span>
            </a>
          ))}
        </nav>
      </article>
    </div>
  );
}
