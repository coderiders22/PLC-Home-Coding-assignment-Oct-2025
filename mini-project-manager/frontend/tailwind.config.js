module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366f1", // indigo-500/600 vibe
          foreground: "#ffffff",
        },
        accent: {
          DEFAULT: "#a855f7", // purple-500/600 vibe
          foreground: "#ffffff",
        },
      },
      boxShadow: {
        neon: "0 10px 25px rgba(99, 102, 241, 0.35)",
      },
      backgroundImage: {
        "gradient-glow":
          "radial-gradient(80% 60% at 20% 10%, rgba(99,102,241,0.35) 0%, rgba(168,85,247,0.25) 40%, rgba(0,0,0,0) 70%), radial-gradient(60% 40% at 90% 20%, rgba(34,197,94,0.18) 0%, rgba(0,0,0,0) 70%)",
      },
      dropShadow: {
        neon: "0 0 10px rgba(99,102,241,0.6)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.8s infinite linear",
        float: "float 3s ease-in-out infinite",
      },
      borderRadius: {
        xl: "1rem",
        '2xl': "1.25rem",
      },
    },
  },
  plugins: [],
};
