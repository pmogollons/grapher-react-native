module.exports = {
  'parser': '@babel/eslint-parser',
  'env': {
    'browser': true,
    'node': true,
    'es6': true,
    'react-native/react-native': true,
  },
  'plugins': [
    'react',
    'react-native',
  ],
  'ecmaFeatures': {
    'jsx': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  'rules': {
    'indent': [
      'error',
      2,
      {
        'SwitchCase': 1,
      },
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'always',
    ],
    'no-console': [
      'warn',
    ],
    'no-unused-vars': [
      'warn',
    ],
    'comma-dangle': [
      'warn',
      'always-multiline',
    ],
    'react/prop-types': [
      0,
    ],
    'react-native/no-unused-styles': [
      'warn',
    ],
    'react-native/no-inline-styles': [
      'warn',
    ],
  },
};
