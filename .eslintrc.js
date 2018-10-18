module.exports = {
  extends: "airbnb-base",
  env: {
    "jest/globals": true
  },
  rules: {
    "import/prefer-default-export": [0],
    "no-underscore-dangle": [0],
    "no-console": [0]
  },
  plugins: [
    'jest'
  ]
};