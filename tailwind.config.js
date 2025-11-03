/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        red: {
          500: "#FF3D36",
        },
        white: {
          800: "#BABABA",
        },
        orange: {
          200: "#6E4E37",
          300: "#FFCA9F",
          600: "#FB5934",
        },
        black: {
          400: "#868686",
          700: "#0A0A30",
          900: "#1A1A1A",
        },
        base: "#FFFFFF",

        primary: {
          100: "#FED9B3",

          400: "#EDB77",

          600: "#A77C5B",

          900: "#6F4D34",
        },
      },
      fontSize: {
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "24px",
      },
      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
      },
      fontFamily: {
        windhavi: ['Windhavi', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
