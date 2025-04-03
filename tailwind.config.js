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
              DEFAULT: "#006FEE", // Cor primária no tema claro
              foreground: "#FFFFFF", // Cor do texto no botão
            },
            focus: "#BEF264", // Cor de foco no tema claro
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#FFFF00", // Cor primária no tema escuro (exemplo)
              foreground: "#000000", // Cor do texto no botão no tema escuro
            },
            focus: "#BEF264", // Cor de foco no tema escuro
          },
        },
      },
      override: true,
    }),
  ],
};
