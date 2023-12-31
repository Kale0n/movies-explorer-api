module.exports = {
  env: {
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-underscore-dangle': [
      'error', { allow: ['_id'] },
    ],
    'no-unused-vars': [
      'error', { args: 'none' },
    ],
    'max-classes-per-file': 'off',
  },
};
