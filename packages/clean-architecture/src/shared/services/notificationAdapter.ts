import type { NotificationService } from '~/shared/ports'

export function notificationAdapter(): NotificationService {
  return {
    notify: (message: string) => {
      console.warn(message)
    },
  }
}
