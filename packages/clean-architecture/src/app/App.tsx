import { useSignals } from '@preact/signals-react/runtime'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { HomePage } from '~/pages/home'
import { store, useDi } from '~/shared/services'
import { FeatureToggle, ThemeToggle } from '~/shared/ui'
import styles from './App.module.css'

function App() {
  useSignals()
  const featureFlagsService = useDi('FEATURE_FLAGS_SERVICE_TOKEN')
  const themeService = useDi('THEME_SERVICE_TOKEN')

  useEffect(() => {
    themeService.init()
  }, [themeService])

  return (
    <Provider store={store}>
      <div className={styles.app}>
        <h1 className={styles.title}>HolyJS workshop (clean architecture)</h1>
        <div className={styles.layout}>
          <HomePage sidebarClassName={styles.sidebar} />
        </div>
        <div className={styles.actions}>
          {featureFlagsService.get('darkTheme') && <ThemeToggle />}
          <FeatureToggle />
        </div>
      </div>
    </Provider>
  )
}

export default App
