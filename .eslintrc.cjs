module.exports = {
  env: {
    browser: true,
    es2021: true,
    'vue/setup-compiler-macros': true
  },
  globals: {
    PROJECT_BUILD_TIME: 'readonly'
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: ['vue', '@typescript-eslint', 'prettier'],
  extends: ['plugin:vue/vue3-recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    // 函数括号前键入空格
    'space-before-function-paren': 'off',
    // 对象末尾是否需要逗号
    'comma-dangle': ['error', 'never'],
    'no-shadow': 'off',
    'no-unused-vars': 'off',
    'no-use-before-define': 'off',

    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['index']
      }
    ],

    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: true
      }
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { ignoreRestSiblings: true, varsIgnorePattern: '^_' }
    ],
    '@typescript-eslint/no-use-before-define': [
      'error',
      { classes: true, functions: false, typedefs: false }
    ],
    '@typescript-eslint/no-var-requires': 'off'
  }
}
