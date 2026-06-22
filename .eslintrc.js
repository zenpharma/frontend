// ESLint config for zen-pharma-frontend (React 18)
// Extends the react-app preset that ships with react-scripts — avoids
// duplicating React-specific rules that react-scripts already configures.
module.exports = {
  extends: [
    'react-app',
    'react-app/jest',
  ],
  rules: {
    // ── Code quality ──────────────────────────────────────────────────────
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',

    // ── React ─────────────────────────────────────────────────────────────
    'react/prop-types': 'off',
    'react/no-unused-state': 'warn',
    'react/jsx-no-duplicate-props': 'error',
  },
};
