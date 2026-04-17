import { Navigate } from 'react-router-dom'

const PublicRoute = ({ children }) => {
  const user =
    JSON.parse(localStorage.getItem('user')) ||
    JSON.parse(sessionStorage.getItem('user'))

  if (user) {
    return <Navigate to="/" replace />
  }

  return children
}

export default PublicRoute