import { useSignals } from '@preact/signals-react/runtime'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from '~/app/reduxStore'
import { useDi } from '~/shared/di'
import { FeatureToggle } from '~/shared/feature-flags'
import { ThemeToggle } from '~/shared/theme'
import { Cart } from '~/widgets/cart'
import { ProductList } from '~/widgets/popular-products'
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
        <h1 className={styles.title}>HolyJS workshop (modular architecture)</h1>
        <div className={styles.layout}>
          <ProductList />
          {featureFlagsService.get('cart') && <div className={styles.sidebar}><Cart /></div>}
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
