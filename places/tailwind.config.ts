import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgColor: 'var(--background-color)',
        textColor: 'rgb(var(--text-color) / <alpha-value>)',
        primary: 'rgb(var(--primary-color) / <alpha-value>)',
        accent: 'rgb(var(--accent-color) / <alpha-value>)',
        discrete: 'rgb(var(--discrete-color) / <alpha-value>)'
      },
      boxShadow: {
        'light': '0 0 20px 0px rgb(0 0 0)',
        'dark': '0 0 20px 5px rgb(0 0 0)',
      },
    },
  },
  plugins: [],
};
export default config;
