module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    //project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
  },
  settings: {
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.ts', '.tsx'],
        moduleDirectory: ['node_modules', 'src/'],
      },
    },
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'react/react-in-jsx-scope': 0,
    'prettier/prettier': 2,
    '@typescript-eslint/no-non-null-assertion': 0,
    'import/default': 0,
    '@typescript-eslint/no-empty-interface': 0,
    'import/order': [
      2,
      {
        groups: ['external', 'builtin', 'index', 'sibling', 'parent', 'internal'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always-and-inside-groups',
      },
    ],
  },
}
