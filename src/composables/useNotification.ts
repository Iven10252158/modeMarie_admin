import { ref } from 'vue'

interface Notification {
  message: string|null,
  id: number,
  isOpen: boolean
}
// 組件名稱跟composables一樣比較好
export const notifications = ref<Notification[]>([])
export const isAlertShow = ref(false)
const notification = ref({
  isOpen: false,
  timer: 0,
  error: ({ content = '' }: {content: string|null}) => {
    const id = Date.now()
    notification.value.isOpen = true
    notifications.value.push({ message: content, id, isOpen: notification.value.isOpen })
    if (notifications.value.length === 2) {
      clearTimeout(notification.value.timer)
      setTimeout(() => {
        notifications.value.shift()
      }, 200)
    }
  },
  close: (index:number) => {
    notifications.value[index].isOpen = false
    notifications.value.splice(index, 1)
  },
  autoClose: () => {
    notification.value.timer = setTimeout(() => {
      notification.value.isOpen = false
      notifications.value.shift()
    }, 5000)
  }
})

export const useNotification = () => {
  return {
    notification,
    notifications
  }
}
