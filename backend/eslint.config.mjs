import baseConfig from '../eslint.config.mjs';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  ...baseConfig,

  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
      'max-len': ['error', { code: 100, tabWidth: 2, ignoreUrls: true }],
      'prettier/prettier': [
        'error',
        {
          semi: true,
          singleQuote: true,
          printWidth: 100,
          trailingComma: 'all',
          endOfLine: 'lf',
        },
      ],
    },
  },
  eslintConfigPrettier,
];
