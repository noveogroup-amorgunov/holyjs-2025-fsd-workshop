import { container } from '~/app/diContainer'

export function useDi<T extends ReturnType<typeof container.getKeys>[number]>(token: T) {
  return container.get(token)
}
