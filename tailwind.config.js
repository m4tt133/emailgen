module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      max: { min: "1920px" },
      xxl: { max: "1300px" },
      xl: { min: "1279px" },
      lg: { min: "1023px" },
      mdd: { max: "967px" },
      md: { max: "767px" },
      sm: { max: "639px" },
      xs: { max: "439px" },
    },
  },
  plugins: [],
};
