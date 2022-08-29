/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-strongly-recommended',
        'eslint:recommended',
        '@vue/eslint-config-airbnb-with-typescript',
    ],
    env: {
        'vue/setup-compiler-macros': true,
    },
    rules: {
        'arrow-parens': ['error', 'as-needed'],
        'comma-dangle': 'off',
        indent: 'off',
        '@typescript-eslint/indent': ['error', 4],
        '@typescript-eslint/comma-dangle': 'off',
        'vue/html-indent': ['error', 4],
        'vue/comma-dangle': 'off',
        'vue/max-attributes-per-line': ['error', {
            singleline: {
                max: 1
            },
            multiline: {
                max: 1
            }
        }]
    },
};
