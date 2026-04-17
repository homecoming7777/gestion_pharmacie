import { storage } from './localStorage'

const USERS_KEY = 'pharmacy_users'
const SESSION_KEY = 'pharmacy_session'

export const authService = {
  getUsers: () => storage.get(USERS_KEY) || [],

  register: (userData) => {
    const users = authService.getUsers()

    const exists = users.find(u => u.username === userData.username)
    if (exists) return null

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    }

    storage.set(USERS_KEY, [...users, newUser])
    return newUser
  },

  login: (username, password, remember) => {
    const users = authService.getUsers()

    const user = users.find(
      u => u.username === username && u.password === password
    )

    if (!user) return null

    if (remember) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user))
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
    }

    return user
  },

  getCurrentUser: () => {
    return (
      JSON.parse(localStorage.getItem(SESSION_KEY)) ||
      JSON.parse(sessionStorage.getItem(SESSION_KEY))
    )
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_KEY)
  },
}