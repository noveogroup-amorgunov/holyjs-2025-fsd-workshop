import { Container } from '~/shared/di'
import { featureFlagService } from '~/shared/feature-flags'
import { themeService } from '~/shared/theme'

export const container = new Container({
  FEATURE_FLAGS_SERVICE_TOKEN: featureFlagService,
  THEME_SERVICE_TOKEN: themeService,
} as const)
