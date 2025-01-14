import js from '@eslint/js';
import reactRecommended from 'eslint-plugin-react/configs/recommended';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import importPlugin from 'eslint-plugin-import';
import securityPlugin from 'eslint-plugin-security';

export default [
  // Base configuration
  js.configs.recommended,
  
  // React recommended configuration
  {
    ...reactRecommended,
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      'react-hooks': reactHooksPlugin,
      '@typescript-eslint': typescriptEslint,
      'perfectionist': perfectionistPlugin,
      'import': importPlugin,
      'security': securityPlugin
    },
    rules: {
      ...reactRecommended.rules,
      
      // React hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // TypeScript-specific rules
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      
      // Import rules
      'import/order': ['error', {
        groups: [
          'builtin', 
          'external', 
          'internal', 
          'parent', 
          'sibling', 
          'index'
        ],
        'newlines-between': 'always'
      }],
      'import/no-unresolved': 'error',
      
      // Security rules
      'security/detect-object-injection': 'warn',
      'security/detect-possible-timing-attacks': 'error',
      
      // Perfectionist sorting
      'perfectionist/sort-imports': ['error', {
        type: 'natural',
        order: 'asc'
      }],
      'perfectionist/sort-objects': ['error', {
        type: 'natural',
        order: 'asc'
      }],
      
      // React-specific rules
      'react/prop-types': 'off', // TypeScript handles prop types
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      
      // General best practices
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      'complexity': ['warn', { max: 15 }],
      'max-depth': ['warn', { max: 4 }],
      'max-lines-per-function': ['warn', { max: 50, skipBlankLines: true }]
    },
    
    // Ignore specific files
    ignores: [
      'dist/', 
      'node_modules/', 
      '.eslintrc.js', 
      'vite.config.ts', 
      '**/*.config.js'
    ]
  },
  
  // Prettier configuration (disable conflicting rules)
  prettierConfig,
  
  // Specific overrides for test files
  {
    files: ['**/*.test.{js,jsx,ts,tsx}'],
    rules: {
      'max-lines-per-function': 'off',
      'max-depth': 'off'
    }
  }
];
