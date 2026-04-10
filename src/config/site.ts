export const siteConfig = {
  // ====== CUSTOMIZE THESE FOR EACH TOOL ======
  name: "JSON to TypeScript",
  title: "JSON to TypeScript Interface Generator — Free Online Tool",
  description:
    "Convert any JSON object to TypeScript interfaces or type aliases instantly. Paste your JSON, get clean TypeScript types — supports nested objects, arrays, optional properties, and union types. Free, private, no signup.",
  url: "https://json-to-typescript.tools.jagodana.com",
  ogImage: "/opengraph-image",

  // Header
  headerIcon: "FileCode", // lucide-react icon name
  brandAccentColor: "#6366f1", // hex accent for OG image gradient (must match --brand-accent in globals.css)

  // SEO
  keywords: [
    "json to typescript",
    "json to typescript interface",
    "json to ts types",
    "convert json to typescript",
    "typescript interface generator",
    "json type generator",
    "typescript type generator",
    "online typescript tool",
    "json schema to typescript",
    "free typescript tool",
  ],
  applicationCategory: "DeveloperApplication",

  // Theme
  themeColor: "#3b82f6", // blue-500

  // Branding
  creator: "Jagodana",
  creatorUrl: "https://jagodana.com",
  twitterHandle: "@jagodana",

  // Social Profiles (for Organization schema sameAs)
  socialProfiles: [
    "https://twitter.com/jagodana",
    "https://www.linkedin.com/company/jagodana-llc",
  ],

  // Links
  links: {
    github:
      "https://github.com/Jagodana-Studio-Private-Limited/json-to-typescript",
    website: "https://jagodana.com",
  },

  // Footer
  footer: {
    about:
      "JSON to TypeScript instantly converts any JSON object into clean TypeScript interfaces or type aliases — right in your browser. No data leaves your machine.",
    featuresTitle: "Features",
    features: [
      "Nested object support",
      "Interface & type alias output",
      "Optional property detection",
      "Array & union type inference",
    ],
  },

  // Hero Section
  hero: {
    badge: "Free TypeScript Tool",
    titleLine1: "Turn JSON into",
    titleGradient: "TypeScript Types",
    subtitle:
      "Paste any JSON and get clean TypeScript interfaces or type aliases in seconds. Supports nested objects, arrays, optional fields, and union types — 100% browser-based, zero data sent.",
  },

  // Feature Cards (shown on homepage)
  featureCards: [
    {
      icon: "🧩",
      title: "Nested Objects",
      description:
        "Deeply nested JSON structures are converted to properly named, hierarchical TypeScript interfaces automatically.",
    },
    {
      icon: "⚡",
      title: "Real-Time Output",
      description:
        "As you type or paste JSON, TypeScript types are generated instantly — no button to click, no waiting.",
    },
    {
      icon: "🔒",
      title: "100% Private",
      description:
        "All processing happens in your browser. Your JSON never leaves your device — safe for sensitive API payloads.",
    },
  ],

  // Related Tools (cross-linking to sibling Jagodana tools for internal SEO)
  relatedTools: [
    {
      name: "JSON Formatter",
      url: "https://json-formatter.tools.jagodana.com",
      icon: "📋",
      description: "Format and beautify JSON with syntax highlighting.",
    },
    {
      name: "JSON Schema Generator",
      url: "https://json-schema-generator.tools.jagodana.com",
      icon: "📐",
      description: "Instantly convert JSON to a JSON Schema.",
    },
    {
      name: "JSON Path Finder",
      url: "https://json-path-finder.tools.jagodana.com",
      icon: "🔍",
      description: "Navigate and query JSON with JSONPath expressions.",
    },
    {
      name: "JWT Decoder",
      url: "https://jwt-decoder.tools.jagodana.com",
      icon: "🔑",
      description: "Decode and inspect JSON Web Tokens instantly.",
    },
    {
      name: "YAML to JSON Converter",
      url: "https://yaml-json-converter.tools.jagodana.com",
      icon: "🔄",
      description: "Convert YAML to JSON and back in one click.",
    },
    {
      name: "Regex Playground",
      url: "https://regex-playground.tools.jagodana.com",
      icon: "🧪",
      description: "Build, test & debug regular expressions in real-time.",
    },
  ],

  // HowTo Steps (drives HowTo JSON-LD schema for rich results)
  howToSteps: [
    {
      name: "Paste your JSON",
      text: "Copy any JSON object, array, or API response and paste it into the input panel on the left.",
      url: "",
    },
    {
      name: "Configure options",
      text: "Choose interface vs type alias, toggle optional properties, add export keyword, or enable readonly modifiers.",
      url: "",
    },
    {
      name: "Copy TypeScript types",
      text: "Click Copy to grab the generated TypeScript interfaces and paste them directly into your codebase.",
      url: "",
    },
  ],
  howToTotalTime: "PT1M", // ISO 8601 duration

  // FAQ (drives both the FAQ UI section and FAQPage JSON-LD schema)
  faq: [
    {
      question: "What does the JSON to TypeScript tool do?",
      answer:
        "It converts any valid JSON object or array into TypeScript interfaces or type aliases. Paste your JSON on the left and see clean, ready-to-use TypeScript types on the right — instantly.",
    },
    {
      question: "Does it handle nested objects and arrays?",
      answer:
        "Yes. Nested objects are extracted into separate named interfaces (e.g., UserAddress, OrderItem[]). Arrays of objects produce typed array definitions, and mixed-type arrays become union types.",
    },
    {
      question: "Can I generate type aliases instead of interfaces?",
      answer:
        "Absolutely. Toggle the 'Type Alias' option to switch from interface Foo {} to type Foo = {}. Both outputs are fully valid TypeScript.",
    },
    {
      question: "Is my JSON data sent to any server?",
      answer:
        "No. Everything runs entirely in your browser using JavaScript. Your JSON is never transmitted, stored, or logged anywhere. It's safe to paste sensitive API payloads.",
    },
    {
      question: "What happens with optional properties?",
      answer:
        "When 'Optional Properties' is enabled and your input contains an array of objects, any key that doesn't appear in every object is marked as optional (key?: Type). For a single object, all keys are required by default.",
    },
    {
      question: "Can I add the export keyword to interfaces?",
      answer:
        "Yes — toggle 'Export Types' and every generated interface or type alias is prefixed with export. This lets you paste them directly into a .ts module file.",
    },
  ],

  // ====== PAGES (for sitemap + per-page SEO) ======
  pages: {
    "/": {
      title: "JSON to TypeScript Interface Generator — Free Online Tool",
      description:
        "Convert any JSON object to TypeScript interfaces or type aliases instantly. Supports nested objects, arrays, optional properties. Free, private, browser-based.",
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  },
} as const;

export type SiteConfig = typeof siteConfig;
