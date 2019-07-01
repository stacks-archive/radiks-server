module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    'jest/globals': true,
  },
  rules: {
    'import/prefer-default-export': [0],
    'no-underscore-dangle': [0],
    'no-console': [0],
  },
  plugins: ['jest'],
};
