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
    'new-cap': [0],
    'import/no-unresolved': [0],
    semi: [2, 'always'],
    '@typescript-eslint/explicit-function-return-type': [0],
    '@typescript-eslint/no-explicit-any': [0],
    '@typescript-eslint/explicit-member-accessibility': [0],
  },
  plugins: ['jest'],
};
