export const siteConfig = {
  // ====== CUSTOMIZE THESE FOR EACH TOOL ======
  name: "JSON to TypeScript",
  title: "JSON to TypeScript - Instantly Convert JSON to TypeScript Interfaces",
  description:
    "Paste any JSON and instantly generate clean TypeScript interfaces and types. Supports nested objects, arrays, optional fields, and union types. 100% client-side — your data never leaves your browser.",
  url: "https://json-to-typescript.tools.jagodana.com",
  ogImage: "/opengraph-image",

  // Header
  headerIcon: "Braces",
  brandAccentColor: "#6366f1",

  // SEO
  keywords: [
    "json to typescript",
    "json to ts",
    "json to interface",
    "typescript interface generator",
    "json converter",
    "typescript type generator",
    "json schema to typescript",
  ],
  applicationCategory: "DeveloperApplication",

  // Theme
  themeColor: "#3b82f6",

  // Branding
  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  socialProfiles: [
    "https://twitter.com/jagodana",
    "https://www.linkedin.com/company/jagodana-llc",
  ],

  links: {
    github:
      "https://github.com/Jagodana-Studio-Private-Limited/json-to-typescript",
    website: "https://jagodana.com",
  },

  footer: {
    about:
      "JSON to TypeScript converts raw JSON data into clean, well-structured TypeScript interfaces. Built for developers who want type safety without the manual work.",
    featuresTitle: "Features",
    features: [
      "Instant JSON to TypeScript conversion",
      "Nested object & array support",
      "Optional field detection",
      "One-click copy to clipboard",
    ],
  },

  hero: {
    badge: "Developer Tool",
    titleLine1: "JSON to",
    titleGradient: "TypeScript",
    subtitle:
      "Paste any JSON and instantly generate clean, well-typed TypeScript interfaces. Supports nested objects, arrays, optional fields, and more.",
  },

  featureCards: [
    {
      icon: "⚡",
      title: "Instant Conversion",
      description:
        "Paste JSON and get TypeScript interfaces in real-time. No waiting, no submissions — it just works.",
    },
    {
      icon: "🔒",
      title: "100% Client-Side",
      description:
        "Your data never leaves your browser. All processing happens locally for complete privacy.",
    },
    {
      icon: "🧩",
      title: "Smart Type Inference",
      description:
        "Handles nested objects, arrays, union types, and optional fields intelligently.",
    },
  ],

  relatedTools: [
    {
      name: "JSON Formatter",
      url: "https://json-formatter.tools.jagodana.com",
      icon: "📋",
      description: "Format and validate JSON data with syntax highlighting.",
    },
    {
      name: "JSON Path Finder",
      url: "https://json-path-finder.tools.jagodana.com",
      icon: "🔍",
      description: "Navigate and extract values from JSON using JSONPath.",
    },
    {
      name: "Regex Playground",
      url: "https://regex-playground.jagodana.com",
      icon: "🧪",
      description: "Build, test & debug regular expressions in real-time.",
    },
    {
      name: "UUID Generator",
      url: "https://uuid-generator.tools.jagodana.com",
      icon: "🆔",
      description: "Generate v4 and v7 UUIDs instantly.",
    },
    {
      name: "Hash Generator",
      url: "https://hash-generator.tools.jagodana.com",
      icon: "🔐",
      description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.",
    },
    {
      name: "Base64 Image Tool",
      url: "https://base64-image-tool.tools.jagodana.com",
      icon: "🖼️",
      description: "Encode and decode images to/from Base64.",
    },
  ],

  howToSteps: [
    {
      name: "Paste your JSON",
      text: "Copy your JSON data from an API response, config file, or any source and paste it into the input editor.",
      url: "",
    },
    {
      name: "Review TypeScript output",
      text: "The tool instantly generates TypeScript interfaces with proper types, nested structures, and naming.",
      url: "",
    },
    {
      name: "Copy and use",
      text: "Click the copy button to copy the generated TypeScript code to your clipboard and paste it into your project.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M",

  faq: [
    {
      question: "How does JSON to TypeScript conversion work?",
      answer:
        "The tool parses your JSON data and infers TypeScript types from the values. Objects become interfaces, arrays are typed by their element types, and primitives map to string, number, boolean, or null.",
    },
    {
      question: "Does it handle nested JSON objects?",
      answer:
        "Yes! Nested objects are converted into separate TypeScript interfaces with proper references. Deeply nested structures are fully supported.",
    },
    {
      question: "Is my data safe?",
      answer:
        "Absolutely. All conversion happens in your browser using JavaScript. No data is sent to any server. Your JSON never leaves your machine.",
    },
    {
      question: "Can it handle arrays with mixed types?",
      answer:
        "Yes. If an array contains elements of different types, the tool generates a union type (e.g., string | number) to represent all possible element types.",
    },
  ],

  pages: {
    "/": {
      title:
        "JSON to TypeScript - Instantly Convert JSON to TypeScript Interfaces",
      description:
        "Paste any JSON and instantly generate clean TypeScript interfaces and types. Supports nested objects, arrays, optional fields, and union types. 100% client-side.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
