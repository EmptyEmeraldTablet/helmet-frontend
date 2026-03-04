import { onBeforeUnmount, ref } from 'vue'

export type WebSocketStatus = 'idle' | 'connecting' | 'open' | 'closed' | 'error'

export const useWebSocket = (url: string) => {
  const status = ref<WebSocketStatus>('idle')
  const socket = ref<WebSocket | null>(null)
  const lastMessage = ref<string>('')

  const connect = () => {
    if (!url || status.value === 'connecting' || status.value === 'open') {
      return
    }
    status.value = 'connecting'
    socket.value = new WebSocket(url)

    socket.value.onopen = () => {
      status.value = 'open'
    }
    socket.value.onerror = () => {
      status.value = 'error'
    }
    socket.value.onclose = () => {
      status.value = 'closed'
    }
    socket.value.onmessage = (event) => {
      lastMessage.value = event.data
    }
  }

  const disconnect = () => {
    socket.value?.close()
    socket.value = null
    status.value = 'closed'
  }

  onBeforeUnmount(() => {
    disconnect()
  })

  return { status, lastMessage, connect, disconnect }
}
