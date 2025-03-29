import type { User } from '~/shared/global-types'
import type { AuthenticationService } from '~/shared/ports'
import { fakeApi } from './api'

export function authAdapter(): AuthenticationService {
  return {
    async login(payload: {
      login: string
      password: string
    }): Promise<User> {
      return await fakeApi<User>({
        id: 'sample-user-id',
        login: payload.login,
        age: 23,
      })
    },
  }
}
