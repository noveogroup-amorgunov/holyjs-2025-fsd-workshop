import { useDi } from '~/shared/services'
import { Cart } from '../Cart/Cart'
import { ProductList } from '../ProductList/ProductList'

interface Props {
  sidebarClassName: string
}

export function HomePage({ sidebarClassName }: Props) {
  const featureFlagsService = useDi('FEATURE_FLAGS_SERVICE_TOKEN')

  return (
    <div>
      <ProductList />
      {featureFlagsService.get('cart') && <div className={sidebarClassName}><Cart /></div>}
    </div>
  )
}
