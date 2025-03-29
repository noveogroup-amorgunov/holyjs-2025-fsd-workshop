import fsd from '@feature-sliced/steiger-plugin'
import { defineConfig } from 'steiger'

export default defineConfig([
  ...fsd.configs.recommended,
  {
    files: [
      'src/entities/**',
      'src/features/**',
    ],
    rules: {
      'fsd/insignificant-slice': 'off',
    },
  },
  {
    files: [
      'src/shared/global-types.ts',
      'src/shared/services/di/useDi.tsx',
      'src/shared/services/store/reduxStore.ts',
    ],
    rules: {
      'fsd/forbidden-imports': 'off',
    },
  },
  {
    files: [
      // fix early import
      // Uncaught ReferenceError: Cannot access '<...>' before initialization
      'src/pages/home/model/popularProducts.ts',
      'src/shared/services/di/useDi.tsx',
    ],
    rules: {
      'fsd/no-public-api-sidestep': 'off',
    },
  },
])
