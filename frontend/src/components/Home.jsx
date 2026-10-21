import { Navigate } from 'react-router'

function Home() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />
  }

  if (user?.role === 'student') {
    return <Navigate to="/my-fees" replace />
  }

  return <Navigate to="/login" replace />
}

export default Home
