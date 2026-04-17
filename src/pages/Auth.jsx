import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Auth = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    remember: false,
  })

  const handleRegister = () => {
    const users = JSON.parse(localStorage.getItem('users')) || []

    const exists = users.find(u => u.email === form.email)
    if (exists) {
      toast.error('Email already exists')
      return
    }

    users.push({
      id: Date.now(),
      name: form.name,
      email: form.email,
      password: form.password,
    })

    localStorage.setItem('users', JSON.stringify(users))

    toast.success('Account created')
    setIsLogin(true)
  }

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users')) || []

    const user = users.find(
      u => u.email === form.email && u.password === form.password
    )

    if (!user) {
      toast.error('Invalid credentials')
      return
    }

    if (form.remember) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      sessionStorage.setItem('user', JSON.stringify(user))
    }

    toast.success('Login success')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-950">
      <div className="bg-blue-900 border-2 border-blue-200 p-6 rounded-xl w-full max-w-md space-y-4">
        <h2 className="text-xl font-bold text-center">
          {isLogin ? 'Login' : 'Register'}
        </h2>

        {!isLogin && (
          <input
            className="input"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        )}

        <input
          className="input"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="input"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />

        {isLogin && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={e =>
                setForm({ ...form, remember: e.target.checked })
              }
            />
            Remember me
          </label>
        )}

        <button
          onClick={isLogin ? handleLogin : handleRegister}
          className="bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>

        <p
          className="text-sm text-center cursor-pointer text-gray-300 hover:text-gray-100"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register"
            : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  )
}

export default Auth