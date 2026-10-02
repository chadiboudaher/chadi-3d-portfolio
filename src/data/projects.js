export const projects = [
  {
    id: "lavsc-builder",
    title: "Lebanese Arabic Audio-Visual Corpus Builder",
    subtitle: "A practical pipeline for building lip-reading research data.",
    description:
      "A data pipeline that turns Lebanese Arabic video into aligned, research-ready audio-visual samples.",
    problem:
      "Reduces the manual work required to collect, clean, segment, and validate under-resourced speech data.",
    stack: ["Python", "PyTorch", "OpenCV", "FFmpeg"],
    repo: "https://github.com/chadiboudaher",
    accent: "coral",
  },
  {
    id: "ml-media-orchestrator",
    title: "ML Media Orchestrator",
    subtitle: "Reliable media processing for machine-learning workflows.",
    description:
      "A backend orchestration layer for repeatable media ingestion, processing, and model-ready exports.",
    problem:
      "Keeps long-running media jobs observable and consistent while separating API concerns from processing workers.",
    stack: ["Python", "FastAPI", "Docker", "FFmpeg"],
    repo: "https://github.com/chadiboudaher",
    accent: "gold",
  },
  {
    id: "visual-speech-recognition",
    title: "Arabic Visual Speech Recognition",
    subtitle: "Exploring robust lip reading for Lebanese Arabic.",
    description:
      "A multimodal research project investigating visual features and sequence models for recognizing Arabic speech from lip movement.",
    problem:
      "Explores more accessible speech interfaces for noisy settings and a language variety with limited public resources.",
    stack: ["Python", "PyTorch", "OpenCV", "Deep Learning"],
    repo: "https://github.com/chadiboudaher",
    accent: "sage",
  },
];

export const githubProfile = "https://github.com/chadiboudaher";
