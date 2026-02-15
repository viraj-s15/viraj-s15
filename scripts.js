const chart = document.querySelector("[data-activity-chart]");
const cacheKey = "githubActivityCache_v1";
const cacheTtlMs = 30 * 60 * 1000;
const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
let githubUsername = "viraj-s15";
const defaultContent = {
  hero: {
    name: "VIRAJ SHAH_",
    badge: "I_USE_ARCH_BTW",
    status: ["LOC: MUMBAI_IN", "STATUS: ACTIVE_FOR_HIRE"],
    role: "Production AI Engineer // MLOps // Gen-AI",
    bio: "I build production ML systems, LLM orchestration, and applied research pipelines that ship fast and stay reliable. I help teams move from prototype to scalable infra with measurable latency and quality gains.",
    actions: [
      { label: "Execute_Reach_Out()", href: "mailto:viraj.v.shah03@gmail.com", kind: "primary" },
      { label: "Download_CV.pdf", href: "assets/viraj-shah-cv.pdf", kind: "ghost" },
    ],
  },
  experience: [
    {
      company: "Fibr.ai",
      website: "https://fibr.ai",
      timeline: "Dec 2024 — Present",
      roles: ["AI Engineer Intern · Dec 2024 — May 2025", "AI Engineer · Jun 2025 — Present"],
      bullets: [
        "Fine-tuned FluxDev and Hunyuan Video for realistic daily life object generation",
        "Migrated real-time personalization resolver from AWS Lambda to Cloud Run, cutting response times by 50%",
        "Built ComfyUI augmentation workflows and an autonomous web monitoring agent (Google ADK)",
      ],
    },
    {
      company: "Samsung PRISM R&D",
      website: "https://research.samsung.com",
      timeline: "Feb 2024 — Dec 2024",
      roles: ["ML Research Intern"],
      bullets: [
        "Built a super-resolution model with frequency projections, transformers, and diffusion",
        "Delivered +12% PSNR and +25% SSIM over SOTA baselines",
      ],
    },
    {
      company: "MakeAnyAI",
      website: "",
      timeline: "Dec 2023 — Nov 2024",
      roles: ["ML Engineer"],
      bullets: [
        "Built LLM orchestration across Slack, Google Docs, Salesforce, and HubSpot",
        "Shipped fine-tuned models for beta launch and a real-time AI meeting assistant",
      ],
    },
    {
      company: "MarketsMojo",
      website: "https://www.marketsmojo.com",
      timeline: "Aug 2023 — Oct 2023",
      roles: ["Data Science Intern"],
      bullets: [
        "Implemented aspect-based sentiment analysis with PyTorch, deployed on SageMaker",
        "Built stock trend pipeline with XGBoost + sentiment analyzer (79% accuracy)",
      ],
    },
  ],
  skills: [
    { label: "Languages", items: "Python, TypeScript, Rust" },
    { label: "Databases", items: "MongoDB, PostgreSQL, Cassandra, Neo4j, Vector Databases (Pinecone, ChromaDB)" },
    { label: "Message Queues", items: "Kafka, AWS SQS, GCP Pub/Sub" },
    {
      label: "Frameworks & Libraries",
      items:
        "PyTorch, Transformers, Deep Graph Library (DGL), FastAPI, Apache Beam, Google ADK, AutoGen, TensorZero",
    },
    { label: "MLOps Tooling", items: "MLflow, Kubeflow, Ray, DVC" },
    {
      label: "Cloud Technologies",
      items: "AWS SageMaker, Vertex AI, Azure AI Foundry",
    },
    { label: "DevOps", items: "Docker, GitHub Actions, Git, Linux" },
  ],
  education: [
    { left: "VIT University, Vellore : GPA 9.05/10", timeline: "Aug 2025" },
    { left: "Navneet Junior College, Mumbai : Score 96%", timeline: "Jul 2021" },
  ],
  footer: {
    links: [
      { label: "GITHUB", href: "https://github.com/viraj-s15" },
      { label: "LINKEDIN", href: "https://www.linkedin.com/in/viraj-s/" },
      { label: "HUGGINGFACE", href: "https://huggingface.co/Veer15" },
    ],
    meta: "PACKETS_SENT: 42,912KB | LOSS: 0%",
  },
  github: {
    username: "viraj-s15",
  },
};

const toPercent = (value, max) => {
  if (!max) return 10;
  return Math.max(10, Math.round((value / max) * 100));
};

const applyCounts = (counts) => {
  if (!chart) return;
  const max = Math.max(...counts, 1);
  const bars = chart.querySelectorAll("span");
  bars.forEach((bar, index) => {
    const count = counts[index] ?? 0;
    const label = `${dayLabels[index]}: ${count} events`;
    bar.style.setProperty("--bar", `${toPercent(count, max)}%`);
    bar.setAttribute("title", label);
    bar.setAttribute("aria-label", label);
    bar.dataset.count = String(count);
  });
};

const readCache = () => {
  try {
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.timestamp || !parsed.counts || !parsed.username) return null;
    if (parsed.username !== githubUsername) return null;
    if (Date.now() - parsed.timestamp > cacheTtlMs) return null;
    return parsed.counts;
  } catch (error) {
    return null;
  }
};

const writeCache = (counts) => {
  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        timestamp: Date.now(),
        counts,
        username: githubUsername,
      })
    );
  } catch (error) {
    return;
  }
};

const buildNode = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
};

const splitTimeline = (timelineText) => {
  const raw = (timelineText || "").trim();
  if (!raw) return { from: "", to: "" };
  const parts = raw.split("—").map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return { from: parts[0], to: parts.slice(1).join(" — ") };
  }
  return { from: raw, to: raw };
};

const renderHero = (hero) => {
  const name = document.querySelector('[data-field="hero-name"]');
  const badge = document.querySelector('[data-field="hero-badge"]');
  const status = document.querySelector('[data-field="hero-status"]');
  const role = document.querySelector('[data-field="hero-role"]');
  const bio = document.querySelector('[data-field="hero-bio"]');
  const actions = document.querySelector('[data-field="hero-actions"]');
  if (!hero || !name || !badge || !status || !role || !bio || !actions) return;

  name.textContent = hero.name || "";
  badge.textContent = hero.badge || "";
  role.textContent = hero.role || "";
  bio.textContent = hero.bio || "";

  status.innerHTML = "";
  (hero.status || []).forEach((item) => {
    status.appendChild(buildNode("span", "hero__chip", item));
  });

  actions.innerHTML = "";
  (hero.actions || []).forEach((action) => {
    const link = buildNode("a", `btn btn--${action.kind === "ghost" ? "ghost" : "primary"}`, action.label || "");
    link.href = action.href || "#";
    actions.appendChild(link);
  });
};

const renderExperience = (items) => {
  const root = document.querySelector('[data-field="experience-list"]');
  if (!root) return;
  root.innerHTML = "";

  (items || []).forEach((item) => {
    const article = buildNode("article", "entry");
    const titleWrap = buildNode("div", "entry__title");
    const title = buildNode("h3", "");
    if (item.website) {
      const companyLink = buildNode("a", "entry__company-link", item.company || "");
      companyLink.href = item.website;
      companyLink.target = "_blank";
      companyLink.rel = "noreferrer";
      title.appendChild(companyLink);
    } else {
      title.textContent = item.company || "";
    }
    titleWrap.appendChild(title);
    article.appendChild(titleWrap);

    const body = buildNode("div", "entry__body");
    const timelineRail = buildNode("div", "entry__timelineRail");
    const fromTo = splitTimeline(item.timeline);
    const from = buildNode("p", "entry__from", fromTo.from);
    const line = buildNode("span", "entry__line");
    const to = buildNode("p", "entry__to", fromTo.to);
    timelineRail.appendChild(to);
    timelineRail.appendChild(line);
    timelineRail.appendChild(from);

    const content = buildNode("div", "entry__content");
    const progress = buildNode("div", "entry__progress");
    (item.roles || []).forEach((role) => {
      progress.appendChild(buildNode("p", "entry__role", role));
    });
    const list = buildNode("ul", "entry__list");
    (item.bullets || []).forEach((bullet) => {
      list.appendChild(buildNode("li", "", bullet));
    });
    content.appendChild(progress);
    content.appendChild(list);

    body.appendChild(content);
    body.appendChild(timelineRail);
    article.appendChild(body);

    root.appendChild(article);
  });
};

const renderSkills = (groups) => {
  const root = document.querySelector('[data-field="skills-list"]');
  if (!root) return;
  root.innerHTML = "";

  (groups || []).forEach((group) => {
    const row = buildNode("div", "skill-row");
    const label = buildNode("span", "skill-row__label", `${group.label || ""} -`);
    const value = buildNode("span", "skill-row__items", group.items || "");
    row.appendChild(label);
    row.appendChild(value);
    root.appendChild(row);
  });
};

const renderEducation = (items) => {
  const root = document.querySelector('[data-field="education-list"]');
  if (!root) return;
  root.innerHTML = "";

  (items || []).forEach((item) => {
    const row = buildNode("div", "edu__row");
    row.appendChild(buildNode("p", "edu__left", item.left || ""));
    row.appendChild(buildNode("p", "edu__timeline", item.timeline || ""));
    root.appendChild(row);
  });
};

const renderFooter = (footer) => {
  const linksRoot = document.querySelector('[data-field="footer-links"]');
  const meta = document.querySelector('[data-field="footer-meta"]');
  if (!linksRoot || !meta || !footer) return;

  linksRoot.innerHTML = "";
  (footer.links || []).forEach((linkItem) => {
    const link = buildNode("a", "", linkItem.label || "");
    link.href = linkItem.href || "#";
    link.target = "_blank";
    link.rel = "noreferrer";
    linksRoot.appendChild(link);
  });
  meta.textContent = footer.meta || "";
};

const renderAll = (content) => {
  githubUsername = content.github?.username || githubUsername;
  renderHero(content.hero);
  renderExperience(content.experience);
  renderSkills(content.skills);
  renderEducation(content.education);
  renderFooter(content.footer);
};

const loadContent = async () => {
  try {
    const response = await fetch("content.json");
    if (!response.ok) throw new Error("content.json fetch failed");
    const content = await response.json();
    renderAll(content);
  } catch (error) {
    renderAll(defaultContent);
  }
};

const fetchGitHubActivity = async () => {
  if (!chart) return;

  try {
    const cached = readCache();
    if (cached) {
      applyCounts(cached);
      return;
    }

    const response = await fetch(`https://api.github.com/users/${githubUsername}/events/public`);
    if (!response.ok) throw new Error("GitHub API error");

    const events = await response.json();
    const counts = Array(7).fill(0);
    const now = new Date();

    events.forEach((event) => {
      const created = new Date(event.created_at);
      const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) counts[6 - diffDays] += 1;
    });

    applyCounts(counts);
    writeCache(counts);
  } catch (error) {
    const fallback = readCache() || Array(7).fill(1);
    applyCounts(fallback);
    chart.classList.add("is-static");
  }
};

const init = async () => {
  await loadContent();
  await fetchGitHubActivity();
};

init();
