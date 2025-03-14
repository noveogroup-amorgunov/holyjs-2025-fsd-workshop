import { useSignals } from '@preact/signals-react/runtime'
import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { FeatureToggle } from '~/core/components/FeatureToggle/FeatureToggle'
import { ThemeToggle } from '~/core/components/ThemeToggle/ThemeToggle'
import { store } from '~/core/store/store'
import { Cart } from '~/modules/cart/components/Cart/Cart'
import { ProductList } from '~/modules/popular-products/components/ProductList/ProductList'
import styles from './App.module.css'
import { useDi } from './core/di/useDi'

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
