module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
    'cypress/globals': true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:cypress/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './cypress/tsconfig.json'],
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'react-refresh',
    'cypress'
  ],
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    '@typescript-eslint/no-unused-vars': ['warn'],
    'react/prop-types': 'off',
    'cypress/no-unnecessary-waiting': 'error',
    'cypress/assertion-before-screenshot': 'warn',
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'off'
  },
  overrides: [
    {
      files: ['cypress/**/*.ts'],
      rules: {
        '@typescript-eslint/no-unused-expressions': 'off'
      }
    }
  ]
}