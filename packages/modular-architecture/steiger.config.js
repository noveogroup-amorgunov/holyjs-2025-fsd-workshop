import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    files: [
      'src/shared/di/useDi.tsx',
    ],
    rules: {
      'fsd/forbidden-imports': 'off',
    },
  },
])
