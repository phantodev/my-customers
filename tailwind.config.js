import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              50: "#faf5ff", // purple-50
              100: "#f3e8ff", // purple-100
              200: "#e9d5ff", // purple-200
              300: "#d8b4fe", // purple-300
              400: "#c084fc", // purple-400
              500: "#a855f7", // purple-500 (Main primary color)
              600: "#9333ea", // purple-600
              700: "#7e22ce", // purple-700
              800: "#6b21a8", // purple-800
              900: "#581c87", // purple-900
              DEFAULT: "#a855f7", // Definido como purple-500, o tom principal
              foreground: "#FFFFFF",
            },
          },
        },
      },
    }),
  ],
};
