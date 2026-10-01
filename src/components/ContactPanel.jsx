import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const contactLinks = [
  {
    label: "GitHub",
    href: "https://github.com/chadiboudaher",
    icon: (
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.84a9.6 9.6 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/chadiboudaher1/",
    icon: (
      <>
        <path d="M6.5 8.25H3.25V21H6.5V8.25Z" />
        <path d="M4.88 3A1.88 1.88 0 1 0 4.87 6.75 1.88 1.88 0 0 0 4.88 3Z" />
        <path d="M21 13.69c0-3.84-2.05-5.63-4.79-5.63a4.14 4.14 0 0 0-3.74 2.06V8.25H9.22V21h3.25v-6.31c0-1.66.32-3.28 2.39-3.28 2.04 0 2.07 1.91 2.07 3.39V21H21v-7.31Z" />
      </>
    ),
  },
  {
    label: "Email",
    href: "mailto:chadiboudaher7@gmail.com",
    icon: (
      <path d="M3.75 5h16.5A1.75 1.75 0 0 1 22 6.75v10.5A1.75 1.75 0 0 1 20.25 19H3.75A1.75 1.75 0 0 1 2 17.25V6.75A1.75 1.75 0 0 1 3.75 5Zm.08 2 8.17 6.1L20.17 7H3.83Zm16.17 9.93V9.05l-7.4 5.52a1 1 0 0 1-1.2 0L4 9.05v7.88c0 .04.03.07.07.07h15.86c.04 0 .07-.03.07-.07Z" />
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
      className="contact-overlay"
      ref={overlayRef}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closePanel();
      }}
      role="presentation"
    >
      <section
        className="contact-panel"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
      >
        <button
          className="contact-panel__close"
          ref={closeButtonRef}
          type="button"
          onClick={closePanel}
          aria-label="Close Contact section"
        >
          <span aria-hidden="true">×</span>
        </button>

        <h1 id="contact-title">CONTACT</h1>

        <p className="contact-panel__message">
          Let&rsquo;s build something interesting together.
        </p>

        <nav className="contact-links" aria-label="Contact links">
          {contactLinks.map(({ label, href, icon }) => (
            <a
              className="contact-link"
              href={href}
              key={label}
              aria-label={label}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                {icon}
              </svg>
              <span>{label}</span>
            </a>
          ))}
        </nav>
      </section>
    </div>
  );
}
