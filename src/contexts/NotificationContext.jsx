import React, { createContext, useState } from 'react'
import Toast from '../components/Toast'

export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  
  const showToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
  }
  
  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }
  
  return (
    <NotificationContext.Provider value={{ showToast }}>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </NotificationContext.Provider>
  )
}