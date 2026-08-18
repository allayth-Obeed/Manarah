/**
 * عميل Socket.IO موحّد — اتصال واحد بالبوابة اللحظية في الباك اند (NotificationsGateway)
 * يُصادَق بنفس توكن JWT المخزَّن محلياً (نفس مفتاح apiClient)
 */
import { io } from 'socket.io-client'
import { API_ORIGIN } from './apiClient'

let socket = null

export const connectSocket = () => {
  const token = localStorage.getItem('accessToken')
  if (!token) return null

  if (socket?.connected) return socket

  socket = io(API_ORIGIN, {
    auth: { token },
    transports: ['websocket', 'polling'],
  })

  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const getSocket = () => socket
