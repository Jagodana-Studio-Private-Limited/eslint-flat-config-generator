export const siteConfig = {
  name: "ESLint Flat Config Generator",
  title: "ESLint Flat Config Generator — Create eslint.config.js Instantly",
  description:
    "Generate ESLint 9 flat configuration files (eslint.config.js) for React, Vue, Next.js, and Node.js projects. Supports TypeScript, Prettier integration, and custom rule presets.",
  url: "https://eslint-flat-config-generator.tools.jagodana.com",
  ogImage: "/opengraph-image",

  headerIcon: "Code2",
  brandAccentColor: "#6366f1",

  keywords: [
    "eslint flat config generator",
    "eslint.config.js generator",
    "eslint 9 configuration",
    "eslint typescript config",
    "eslint react config",
    "eslint nextjs config",
    "eslint flat config tutorial",
    "eslint prettier config",
    "eslint config generator online",
    "eslint flat config example",
  ],
  applicationCategory: "DeveloperApplication",

  themeColor: "#3b82f6",

  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: [
    "https://twitter.com/jagodana",
  ],

  links: {
    github:
      "https://github.com/Jagodana-Studio-Private-Limited/eslint-flat-config-generator",
    website: "https://jagodana.com",
  },

  footer: {
    about:
      "Free online ESLint flat config generator. Create eslint.config.js files for any JavaScript or TypeScript project in seconds — no signup required.",
    featuresTitle: "Features",
    features: [
      "React, Vue, Next.js & Node.js support",
      "TypeScript-ready configuration",
      "Prettier integration",
      "Strict, recommended & minimal presets",
    ],
  },

  hero: {
    badge: "ESLint 9 Flat Config Ready",
    titleLine1: "Generate Your",
    titleGradient: "eslint.config.js",
    subtitle:
      "Stop copy-pasting ESLint configs. Pick your framework, toggle TypeScript and Prettier, choose a rule preset — download a ready-to-use flat config in seconds.",
  },

  featureCards: [
    {
      icon: "⚡",
      title: "Instant Generation",
      description:
        "Configure your options and get a valid eslint.config.js or eslint.config.mjs with correct imports and plugins instantly.",
    },
    {
      icon: "🔧",
      title: "Framework-Specific Rules",
      description:
        "Includes React Hooks, React Refresh, Vue, and Next.js-specific plugin configs out of the box.",
    },
    {
      icon: "🎯",
      title: "TypeScript & Prettier",
      description:
        "Toggle TypeScript support with typescript-eslint and Prettier integration with a single click.",
    },
  ],

  relatedTools: [
    {
      name: "Gitignore Generator",
      url: "https://gitignore-generator.tools.jagodana.com",
      icon: "🚫",
      description: "Generate .gitignore files for any project type.",
    },
    {
      name: "TSConfig Generator",
      url: "https://tsconfig-generator.tools.jagodana.com",
      icon: "📘",
      description: "Generate TypeScript tsconfig.json files instantly.",
    },
    {
      name: "Prettier Config Generator",
      url: "https://prettier-config-generator.tools.jagodana.com",
      icon: "✨",
      description: "Generate .prettierrc configuration files.",
    },
    {
      name: "Regex Playground",
      url: "https://regex-playground.tools.jagodana.com",
      icon: "🧪",
      description: "Build, test and debug regular expressions in real-time.",
    },
    {
      name: "GitHub Actions Generator",
      url: "https://github-actions-generator.tools.jagodana.com",
      icon: "🚀",
      description: "Generate GitHub Actions workflow YAML files.",
    },
    {
      name: "Dockerfile Generator",
      url: "https://dockerfile-generator.tools.jagodana.com",
      icon: "🐳",
      description: "Generate production-ready Dockerfiles for any stack.",
    },
  ],

  howToSteps: [
    {
      name: "Select your framework",
      text: "Choose React, Next.js, Vue, Node.js, or Vanilla JS from the Framework dropdown.",
      url: "",
    },
    {
      name: "Configure options",
      text: "Toggle TypeScript support, Prettier integration, and choose a rule preset (Recommended, Strict, or Minimal).",
      url: "",
    },
    {
      name: "Copy or download the config",
      text: "Click Copy to copy the generated eslint.config.js to your clipboard, or Download to save it directly.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  faq: [
    {
      question: "What is ESLint flat config?",
      answer:
        "ESLint flat config is the new configuration system introduced in ESLint v9. It uses a single eslint.config.js (or .mjs/.cjs) file instead of the old .eslintrc.* files. Flat config provides a simpler, more explicit way to configure ESLint using JavaScript, with native support for ES modules.",
    },
    {
      question: "Do I need to install additional packages?",
      answer:
        "Yes — the generated config includes an npm install command at the top listing all required packages. For TypeScript projects you'll need typescript-eslint; for React you'll need eslint-plugin-react-hooks and eslint-plugin-react-refresh; for Prettier you'll need eslint-config-prettier.",
    },
    {
      question: "Is the generated config compatible with ESLint 9?",
      answer:
        "Yes. All generated configs use the flat config format which is the default in ESLint 9+. If you're on ESLint 8, you can use flat config by setting ESLINT_USE_FLAT_CONFIG=true or using the --flag unstable_config_lookup_from_file flag.",
    },
    {
      question: "What is the difference between the rule presets?",
      answer:
        "Recommended enables ESLint's recommended rule set — a safe baseline for most projects. Strict adds additional opinionated rules that catch more potential issues (e.g., typescript-eslint strict mode). Minimal disables most rules and only enables a small set of critical checks, ideal for gradually adopting ESLint in an existing codebase.",
    },
    {
      question: "Can I use this config with Next.js App Router?",
      answer:
        "Yes. The Next.js preset includes the official @next/eslint-plugin-next plugin with core-web-vitals rules, and disables the no-img-element rule for App Router projects. TypeScript support is included by default for Next.js.",
    },
    {
      question: "Is this tool free and does it store my config?",
      answer:
        "Completely free and 100% client-side. No data is sent to a server — the config is generated entirely in your browser. Nothing is stored or logged.",
    },
  ],

  pages: {
    "/": {
      title:
        "ESLint Flat Config Generator — Create eslint.config.js Instantly",
      description:
        "Generate ESLint 9 flat configuration files (eslint.config.js) for React, Vue, Next.js, and Node.js projects. Supports TypeScript, Prettier integration, and custom rule presets.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },

} as const;

export type SiteConfig = typeof siteConfig;
