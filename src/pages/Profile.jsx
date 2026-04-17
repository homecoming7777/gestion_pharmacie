import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { userService } from '../services/settingsService'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  useEffect(() => {
    const currentUser =
      JSON.parse(localStorage.getItem('user')) ||
      JSON.parse(sessionStorage.getItem('user'))

    if (currentUser) {
      setUser(currentUser)
      setForm({
        name: currentUser.name,
        email: currentUser.email,
        password: currentUser.password,
      })
    }
  }, [])

  const handleUpdate = () => {
    if (!user) return

    const updatedUser = {
      ...user,
      name: form.name,
      email: form.email,
      password: form.password,
    }

    userService.update(updatedUser)

    localStorage.setItem('user', JSON.stringify(updatedUser))
    sessionStorage.setItem('user', JSON.stringify(updatedUser))

    toast.success('Profile updated')
  }

  if (!user) return null

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">Mon Profil</h1>

      <div className="card space-y-4">
        <div>
          <label className="label">Nom</label>
          <input
            className="input"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Email</label>
          <input
            className="input"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div>
          <label className="label">Mot de passe</label>
          <input
            type="password"
            className="input"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button onClick={handleUpdate} className="btn-primary w-full">
          Sauvegarder
        </button>
      </div>
    </div>
  )
}

export default Profile