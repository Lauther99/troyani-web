// import type { Config } from "tailwindcss";

// const config: Config = {
//   darkMode: "class",
//   content: [
//     "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         primary: {
//           DEFAULT: "var(--color-primary)",
//           hover: "var(--color-primary-hover)",
//         },
//         secondary: {
//           DEFAULT: "var(--color-secondary)",
//           hover: "var(--color-secondary-hover)",
//         },
//         background: "var(--color-background)",
//         surface: "var(--color-surface)",
//         "dark-section": "var(--color-dark-section)",
//         card: "var(--color-card)",
//         text: {
//           primary: "var(--color-text-primary)",
//           secondary: "var(--color-text-secondary)",
//           light: "var(--color-text-light)",
//           inverse: "var(--color-text-inverse)",
//         },
//         border: "var(--color-border)",
//         accent: "var(--color-accent)",
//       },
//       fontFamily: {
//         sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
//         mono: ["var(--font-geist-mono)", "monospace"],
//       },
//       animation: {
//         "fade-in-up": "fadeInUp 0.6s ease-out forwards",
//         "slide-in-left": "slideInLeft 0.6s ease-out forwards",
//         "slide-in-right": "slideInRight 0.6s ease-out forwards",
//         "scale-in": "scaleIn 0.4s ease-out forwards",
//       },
//       keyframes: {
//         fadeInUp: {
//           "0%": { opacity: "0", transform: "translateY(30px)" },
//           "100%": { opacity: "1", transform: "translateY(0)" },
//         },
//         slideInLeft: {
//           "0%": { opacity: "0", transform: "translateX(-50px)" },
//           "100%": { opacity: "1", transform: "translateX(0)" },
//         },
//         slideInRight: {
//           "0%": { opacity: "0", transform: "translateX(50px)" },
//           "100%": { opacity: "1", transform: "translateX(0)" },
//         },
//         scaleIn: {
//           "0%": { opacity: "0", transform: "scale(0.9)" },
//           "100%": { opacity: "1", transform: "scale(1)" },
//         },
//       },
//     },
//   },
//   plugins: [],
// };

// export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;