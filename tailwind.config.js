/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black:{
          400:"#868686",
          900:"#1A1A1A",
    
        },
        base:"#FFFFFF",
        
        primary: {
           
          100: '#FED9B3',
        
          400: '#EDB77',
      
          600: '#A77C5B',
         
          900: '#6F4D34',  
        },
      },
      fontSize: {
        sm:"14",
        base: '16px',
        lg: '18px',
        xl: '24px',
      },
    },
  },
  plugins: [],
}

