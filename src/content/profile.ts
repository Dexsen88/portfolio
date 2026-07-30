/* ==================================================================
   EDIT THIS FILE — it is the only file you need to touch.
   ------------------------------------------------------------------
   Content is taken from the LinkedIn export in
   "Dexsen Soepardi.md". Anything marked // TODO was missing from that
   export (mostly start/end dates) — fill those in and the timeline
   will show them automatically.
   ================================================================== */

export type Social = {
  label: string;
  handle: string;
  href: string;
};

export type Shot = {
  /** Path inside /public. Missing files are skipped, not shown broken. */
  src: string;
  alt: string;
  /**
   * "contain" letterboxes the whole image against the panel, for
   * certificates and badge cards that must not be cropped. Defaults to
   * "cover", which fills the tile and is right for photographs.
   */
  fit?: "cover" | "contain";
};

export type Role = {
  company: string;
  title: string;
  /** Omit if unknown — the timeline simply leaves the column empty. */
  period?: string;
  location?: string;
  summary: string;
  highlights: string[];
  stack: string[];
  /** Earlier titles held at the same organisation. */
  previously?: { title: string; period: string }[];
  /** Repos or write-ups produced during the role. */
  links?: { label: string; href: string }[];
  images?: Shot[];
};

export type Study = {
  school: string;
  qualification: string;
  period?: string;
  location?: string;
  detail: string;
};

export type Project = {
  name: string;
  tagline: string;
  description: string;
  year?: string;
  tags: string[];
  href?: string;
  /** Link text for `href`. Defaults to "Live site". */
  hrefLabel?: string;
  repo?: string;
  featured?: boolean;
  images?: Shot[];
};

export type SkillGroup = {
  group: string;
  items: string[];
};

export type Stat = {
  value: number;
  suffix: string;
  label: string;
};

/* ------------------------------------------------------------------
   Identity
   ------------------------------------------------------------------ */
export const identity = {
  /** Shown in the browser tab, nav mark and footer. */
  name: "Dexsen",
  fullName: "Dexsen Soepardi",

  /** The giant hero headline — one array entry per rendered line.
   *  It sets at up to 180px, so keep each line to one or two words. */
  headline: ["Community", "meets", "code"],

  /** One line under the headline. */
  intro:
    "Community Success Lead at The5ers.com, final-year Computer Science student at BINUS, and the founder behind two Indonesian e-commerce ventures.",

  eyebrow: "Portfolio 2026",

  currentRole: "Community Success Team Lead",
  currentCompany: "The5ers.com",
  location: "Jakarta, Indonesia",

  /** Set false to hide the pulsing "available" dot. */
  availableForWork: true,
  availabilityNote: "Open to new opportunities",
};

/* ------------------------------------------------------------------
   Portrait
   ------------------------------------------------------------------ */
export const photo = {
  /** Path inside /public. Set to "" to hide the portrait entirely. */
  src: "/dex.jpg",
  alt: `${identity.fullName}, portrait`,
  /**
   * Set true only if the file is a transparent PNG with the background
   * already removed. When false the square edges are dissolved with a
   * radial mask so the photo melts into the page instead.
   */
  cutout: false,
};

/* ------------------------------------------------------------------
   About
   ------------------------------------------------------------------ */
export const about = {
  heading: "About",
  paragraphs: [
    "I'm a Computer Science student at BINUS University, finishing in 2026. Most of my week goes to The5ers.com, where I lead the Community Success team for a proprietary trading firm. It's remote work across time zones, for traders who need answers quickly.",
    "Before that I built things of my own. SENSEGAME.ID grew into a gaming and gadgets retailer serving around 25,000 customers a month, and SENSEGOLF is a curated golf consignment store I founded and ran end to end. Internships at Blibli and Cyber Smart Network Asia pulled me back toward engineering: secure code, Go and Next.js, and a route optimisation system in Python.",
    "That mix is the point. I'm as comfortable reading a balance sheet as a stack trace, and I'd rather work somewhere that needs both.",
  ],
  /** Counters animate up when the section scrolls into view. */
  stats: [
    { value: 25000, suffix: "+", label: "Monthly customers at SENSEGAME.ID" },
    { value: 2, suffix: "", label: "Ventures founded" },
    { value: 3, suffix: "", label: "Languages spoken" },
  ] as Stat[],
};

/* ------------------------------------------------------------------
   Experience — newest first
   ------------------------------------------------------------------ */
export const experience: Role[] = [
  {
    company: "The5ers.com",
    title: "Community Success Team Lead",
    period: "Dec 2025 to Present",
    location: "Raanana, Israel · Remote",
    summary:
      "Lead the Community Success team at a proprietary trading firm, supporting its funded traders across time zones.",
    highlights: [
      "Moved from voluntary moderator to team lead in five months.",
      "Also a Funded Trader with the firm on contract since Apr 2025, holding a funded certificate.",
    ],
    stack: ["Leadership", "Community", "Communication"],
    previously: [
      { title: "Community Success Team", period: "Aug 2025 to Dec 2025" },
      { title: "Voluntary Community Moderator", period: "Jul 2025 to Aug 2025" },
    ],
    images: [
      {
        src: "/work/the5ers-funded-trader.jpg",
        alt: "The5ers Officially Funded Trader certificate, High Stakes 60K, April 2025",
        fit: "contain",
      },
      {
        src: "/work/the5ers-quality-trade.jpg",
        alt: "The5ers Quality Trade Score 90+ badge for XAUUSD, July 2026",
        fit: "contain",
      },
      {
        src: "/work/the5ers-payouts.jpg",
        alt: "The5ers total payouts badge, June 2026",
        fit: "contain",
      },
    ],
  },
  {
    company: "Alignerr",
    title: "Data Annotator",
    period: "Apr 2026 to Jun 2026",
    location: "Remote",
    summary:
      "Annotated and reviewed data used to train and evaluate AI models.",
    highlights: [],
    stack: ["Data Annotation"],
  },
  {
    company: "Blibli.com",
    title: "Cybersecurity Engineer Intern",
    period: "Feb 2025 to Feb 2026",
    location: "Jakarta, ID",
    summary: "Security internship scoped to secure code.",
    highlights: [
      "Built a site running locally to practise secure code hands on, using a local Moodle instance as the target application.",
      "Kept the research and source material in an Obsidian vault.",
    ],
    stack: ["Secure Code", "Application Security", "Moodle"],
    links: [
      {
        label: "ObsidianVault",
        href: "https://github.com/Dexsen88/ObsidianVault",
      },
      { label: "Moodle", href: "https://github.com/Dexsen88/Moodle" },
    ],
    images: [
      {
        src: "/work/blibli.jpg",
        alt: "The security team at the Blibli and tiket.com office in Jakarta",
      },
    ],
  },
  {
    company: "Cyber Smart Network Asia, PT",
    title: "Software Engineer Intern",
    period: "Aug 2024 to Sep 2024",
    location: "Jakarta, ID",
    summary:
      "Backend and frontend work alongside ERP research, ending in a routing project shipped with the team.",
    highlights: [
      "Built foundational backend and frontend skills studying Go and Next.js.",
      "Studied Odoo in depth for ERP-driven business process automation.",
      "Optimised the algorithm behind the Dynamic Route Optimization and Visualization System using Python, HTML and JSON.",
    ],
    stack: ["Python", "Go", "Next.js", "Odoo", "ERP", "JSON", "HTML"],
    images: [
      {
        src: "/work/cyber-smart-network-asia.jpg",
        alt: "The intern team at the Cyber Smart Network Asia office",
      },
    ],
  },
  {
    company: "HIMTI BINUS University",
    title: "Member · Activist Candidate",
    period: "Sep 2022 to Present",
    location: "Jakarta, ID",
    summary:
      "Student association for computer science at BINUS, across the Response and Publication & Marketing divisions.",
    highlights: [
      "Response Division (Dec 2022 to Jan 2023): MC for the Finding Knowledge Response in Program Design Methods.",
      "Publication & Marketing (Nov 2022 to Dec 2022): created content for HIMTI's social platforms and negotiated vendor partnerships.",
      "Studied C, calculus, data structures, scientific computing in Python, program design methods and basic statistics.",
    ],
    stack: ["C", "Teamwork", "Public Speaking", "Marketing"],
  },
  {
    company: "IPEKA",
    title: "Head of Promotions, SKIPIJAM REBORN",
    period: "Jan 2022 to May 2022",
    location: "Jakarta, ID",
    summary:
      "Ran paid promotion and fundraising for SKIPIJAM REBORN, an annual inter-school event.",
    highlights: [
      "Managed paid promotions to raise funds supporting the event.",
      "Worked with stakeholders to deliver the promotional strategy.",
    ],
    stack: ["Marketing Strategy", "Business", "Excel"],
  },
];

/* ------------------------------------------------------------------
   Education — newest first
   ------------------------------------------------------------------ */
export const education: Study[] = [
  {
    school: "BINUS University",
    qualification: "Bachelor's degree, Computer Science",
    period: "Jul 2022 to Jul 2026",
    location: "Jakarta, ID",
    detail:
      "Coursework across algorithms and programming, data structures, discrete mathematics, linear algebra, calculus, scientific computing, basic statistics, program design methods and human computer interaction.",
  },
  {
    school: "IPEKA Puri Senior High School",
    qualification: "High School Diploma, Natural Sciences",
    period: "2019 to 2022",
    location: "Jakarta, ID",
    detail: "Natural sciences track.",
  },
];

/* ------------------------------------------------------------------
   Credentials — rendered as a strip under Education
   ------------------------------------------------------------------ */
export const certifications = [
  { name: "IELTS", issuer: "British Council", date: "Issued Dec 2024" },
];

export const languages = [
  { name: "Indonesian", level: "Native / bilingual" },
  { name: "English", level: "Full professional" },
  { name: "Chinese", level: "Limited working" },
];

/* ------------------------------------------------------------------
   Ventures & projects — the `featured: true` card spans two columns
   ------------------------------------------------------------------ */
export const projects: Project[] = [
  {
    name: "SENSEGAME.ID",
    tagline: "Gaming & gadgets e-commerce",
    description:
      "Co-founded and grew a gaming and gadgets retailer to 400 to 500 million IDR monthly turnover, moving 300 to 400 products to roughly 25,000 customers a month. Shaped the company vision, curated the product range and built the brand around customer satisfaction.",
    tags: ["Co-Founder", "E-commerce", "Sales", "Leadership", "Treasury"],
    href: "https://www.instagram.com/sensegame.id/",
    hrefLabel: "Instagram",
    featured: true,
    images: [
      {
        src: "/work/sensegame-1.jpg",
        alt: "SENSEGAME.ID team meeting",
      },
      {
        src: "/work/sensegame-2.jpg",
        alt: "Signing the SENSEGAME.ID partnership agreement",
      },
    ],
  },
  {
    name: "SENSEGOLF",
    tagline: "Curated golf consignment",
    description:
      "Founded a consignment store for golf equipment reaching 100 to 200 million IDR monthly turnover across 30 to 50 products sold online. Led operations, strategy and financial performance end to end.",
    tags: ["Founder", "E-commerce", "Operations", "Marketing"],
    href: "https://www.instagram.com/sensegolf/",
    hrefLabel: "Instagram",
  },
  {
    name: "DynamicRoute",
    tagline: "Route optimisation & visualisation",
    description:
      "Dynamic Route Optimization and Visualization System, built with the team at Cyber Smart Network Asia. I optimised the routing algorithm and its visualisation layer in Python, HTML and JSON.",
    tags: ["Python", "HTML", "JSON", "Algorithms"],
    repo: "https://github.com/Dexsen88/DynamicRoute",
  },
  {
    name: "SKIPIJAM REBORN",
    tagline: "Inter-school event campaign",
    description:
      "Led promotions and fundraising for IPEKA's annual inter-school event, coordinating stakeholders to drive participation and cover event costs.",
    tags: ["Marketing", "Fundraising", "Events"],
  },
];

/* ------------------------------------------------------------------
   Skills
   ------------------------------------------------------------------ */
export const skills: SkillGroup[] = [
  {
    group: "Languages",
    items: ["Java", "Python", "C", "C++", "Go", "JavaScript", "SQL", "HTML", "CSS", "JSON"],
  },
  {
    group: "Platforms",
    items: [
      "Next.js",
      "Android Studio",
      "Android Development",
      "Odoo",
      "ERP",
      "DBMS",
      "API Integration",
      "Modular Architecture",
    ],
  },
  {
    group: "Design",
    items: [
      "UI/UX Design",
      "User Experience",
      "User Interface Design",
      "Human Computer Interaction",
      "Adobe Photoshop",
    ],
  },
  {
    group: "Foundations",
    items: [
      "Data Structures",
      "Algorithms",
      "Discrete Mathematics",
      "Linear Algebra",
      "Calculus",
      "Scientific Computing",
      "Basic Statistics",
    ],
  },
  {
    group: "Business",
    items: [
      "Leadership",
      "Marketing Strategy",
      "Social Media Marketing",
      "Sales",
      "Treasury Management",
      "Human Resource Development",
      "Public Speaking",
      "Teamwork",
      "Communication",
    ],
  },
];

/** Scrolling band under the hero. Short words work best. */
export const marqueeWords: string[] = [
  "Community Success",
  "Computer Science",
  "Next.js",
  "Go",
  "UI/UX",
  "Leadership",
  "Android",
  "Odoo",
];

/* ------------------------------------------------------------------
   Contact
   ------------------------------------------------------------------ */
export const contact = {
  heading: ["Let's build", "something"],
  blurb:
    "A community to grow, a product to ship, or a role to fill. Whichever it is, my inbox is open.",
  email: "dexsensutedja123@gmail.com",
  socials: [
    {
      label: "LinkedIn",
      handle: "in/dexsen",
      href: "https://www.linkedin.com/in/dexsen/",
    },
    {
      label: "GitHub",
      handle: "@Dexsen88",
      href: "https://github.com/Dexsen88",
    },
  ] as Social[],
};

/* ------------------------------------------------------------------
   Navigation
   ------------------------------------------------------------------ */
export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
];

/* ------------------------------------------------------------------
   SEO — used by app/layout.tsx
   ------------------------------------------------------------------ */
export const seo = {
  title: `${identity.fullName} · ${identity.currentRole}`,
  description: identity.intro,
  /** Backs metadataBase: the canonical link and social share previews. */
  url: "https://dexsen.xyz",
};
