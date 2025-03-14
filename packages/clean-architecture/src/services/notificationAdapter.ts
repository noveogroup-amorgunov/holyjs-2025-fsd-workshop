import type { NotificationService } from '~/application/ports'

export function notificationAdapter(): NotificationService {
  return {
    notify: (message: string) => {
      console.log(message)
    },
  }
}
