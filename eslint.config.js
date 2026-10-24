import tsESLint from 'typescript-eslint';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default tsESLint.config(
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsESLint.parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
    },
  },
  {
    ignores: ['dist', 'node_modules', 'dist-ssr'],
  },
);
