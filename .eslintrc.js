// This is a workaround for https://github.com/eslint/eslint/issues/3458
require('@rushstack/eslint-config/patch-eslint6')

module.exports = {
  extends: ['io'],
  parserOptions: {
    tsconfigRootDir: __dirname,
  },
  settings: {
    react: {
      version: "16.13.0",
    },
  },
}
