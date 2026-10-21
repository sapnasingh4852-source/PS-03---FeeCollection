import { useState } from 'react'
import { Link } from 'react-router'

function Login() {
  const [values, setValues] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.message)
      return
    }

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))

    // full reload so the navbar shows the links of the logged-in role
    window.location.href = data.user.role === 'admin' ? '/admin/dashboard' : '/my-fees'
  }

  return (
    <section className="form-page">
      <h1>Login</h1>

      <form className="form" onSubmit={handleSubmit}>
        {error && <p className="alert">{error}</p>}

        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={values.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={values.password}
            onChange={handleChange}
            required
          />
        </label>

        <div className="actions">
          <button type="submit" className="btn">Login</button>
          <Link to="/register" className="btn btn-outline">
            New user? Register
          </Link>
        </div>
      </form>
    </section>
  )
}

export default Login
