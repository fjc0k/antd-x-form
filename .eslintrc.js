// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch-eslint6')

/** @type import('eslint').Linter.Config */
module.exports = {
  extends: ['io'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: '16.13.0',
    },
  },
  rules: {
    'indent': 0,
    '@typescript-eslint/indent': 0,
    '@typescript-eslint/member-delimiter-style': 0,
    'function-paren-newline': 0,
    'brace-style': 0,
    '@typescript-eslint/brace-style': 0,
    'operator-linebreak': 0,
  },
}
