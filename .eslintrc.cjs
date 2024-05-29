/* eslint-env node */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  rules: {
    "no-unused-vars": "off",
    "no-import-assign": "off",
    "no-redeclare": "off",
    "no-undef": "off",
    "no-inner-declarations": "off",
    "no-case-declarations": "off", // case절에서의 정의 금지
    "no-prototype-builtins": "off",
    "no-useless-escape": "off",
    "vue/no-reserved-keys": "off", // 추후에 confilct나는 등의 경우에는 뺄 것
    "no-debugger": "off"
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  }
}
