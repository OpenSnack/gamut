/* eslint-env node */

module.exports = {
    content: [
        './index.html',
        './src/**/*.{vue,js,ts,jsx,tsx}',
    ],
    safelist: [
        { pattern: /.*-rainbow-[0-9]{3}/ }
    ],
    theme: {
        screens: {
            mobile: { max: '639px' },
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1440px',
            '3xl': '1600px',
            '4xl': '1921px'
        },
        fontFamily: {
            default: ['Bitter', 'serif']
        },
        extend: {
            colors: {
                rainbow: {
                    // these match values from gamutColours
                    100: 'rgb(255, 192, 192)',
                    200: 'rgb(251, 199, 59)',
                    300: 'rgb(178, 245, 112)',
                    400: 'rgb(150, 253, 178)',
                    500: 'rgb(12, 255, 255)',
                    600: 'rgb(150, 178, 253)',
                    700: 'rgb(178, 112, 245)',
                    800: 'rgb(251, 59, 199)'
                },
                gray: {
                    main: 'rgb(135,137,165)'
                }
            }
        }
    },
    plugins: [],
};
