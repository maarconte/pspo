/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
		  colors: {
				primary: {
          50: '#EDE7F9',
          100: '#D1C4F0',
          200: '#B39EE6',
          300: '#9578DC',
          400: '#7F5CD3',
          500: '#6A35CE', // <--- Votre violet de base
          600: '#5E2EB6',
          700: '#51269D',
          800: '#441F85',
          900: '#2F125E',
          950: '#1A0936',
        },
        // CYAN SPRINT (Votre couleur d'accentuation)
        secondary: {
          50: '#E0FBF9',
          100: '#B3F4EF',
          200: '#80EDE4',
          300: '#4DE6D9',
          400: '#26E1D0',
          500: '#00D4C7', // <--- Votre cyan de base
          600: '#00BDB0',
          700: '#00A398',
          800: '#008A80',
          900: '#005F57',
          950: '#003632',
				},
		// DARK TECH (Pour les fonds sombres comme sur l'image)
        dark: {
          800: '#1F2937', // Gris bleuté
          900: '#111827', // Presque noir (fond principal)
          950: '#0B0F19', // Noir profond
        }
		  },
			// Ajout de l'image de dégradé personnalisée pour réutilisation facile
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #6A35CE 0%, #2D72D9 50%, #00D4C7 100%)',
      }
  	}
  },
  plugins: [],
}
