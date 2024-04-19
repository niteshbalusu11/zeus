module.exports = {
  globals: {
    'JSX': true,
    'Buffer': true
  },
  root: true,
  extends: ['@react-native', 'plugin:import/recommended', 'plugin:import/typescript'],
  plugins: ['import'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname
  },
  rules: {
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-shadow': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    'comma-dangle': 'off',
    'curly': 'off',
    'import/default': 'off',
    'import/named': 'off',
    'import/namespace': 'off',
    'import/no-named-as-default': 'off',
    'import/no-named-as-default-member': 'off',
    'react/no-string-refs': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-native/no-inline-styles': 'off',
    'camelcase': 'off',
    'no-case-declarations': 'off',
    'no-control-regex': 'off',
    'no-undef': 2,
    'no-unused-vars': 0,
    'object-shorthand': ['error', 'always'],
    'prefer-spread': 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    // TODO re-evaluate
    'dot-notation': 'off',
    'eqeqeq': 'off',
    'no-bitwise': 'off',
    'no-const-assign': 'off',
    'no-div-regex': 'off',
    'no-lone-blocks': 'off',
    'no-void': 'off',
    'radix': 'off',
    'react/no-unstable-nested-components': 'off',
    'react/self-closing-comp': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'semi': 'off',
    'quotes': 'off',
    // new
    'import/no-unresolved': [2, {commonjs: true, amd: true}]
  },
};
