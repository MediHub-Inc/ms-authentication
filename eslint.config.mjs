// @ts-check
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import tsParser from '@typescript-eslint/parser'
import unusedImportsPlugin from 'eslint-plugin-unused-imports'
import airbnbBase from 'eslint-config-airbnb-base'
import airbnbBaseTs from 'eslint-config-airbnb-base-typescript'

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**, **/src/database/migrations/**'],
  },

  js.configs.recommended,

  {
    files: ['**/*.{js,ts,mjs,cjs}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true,
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': unusedImportsPlugin,
    },
    rules: {
      // Reglas base de Airbnb
      ...airbnbBase.rules,
      ...airbnbBaseTs.rules,

      // Personalizaciones
      'no-unused-vars': 'off',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
  },
]
