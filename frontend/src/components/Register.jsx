import { useState } from 'react'
import { Link } from 'react-router'

const EMPTY = { name: '', email: '', password: '', role: 'student', rollNo: '', course: '' }

function Register() {
  const [values, setValues] = useState(EMPTY)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage('')
    setError('')

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.message)
      return
    }

    setMessage('Registration successful! Please login.')
    setValues({ ...EMPTY, password: '' })
  }

  return (
    <section className="form-page">
      <h1>Register</h1>

      <form className="form" onSubmit={handleSubmit}>
        {error && <p className="alert">{error}</p>}
        {message && <p className="success">{message}</p>}

        <label>
          Name
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={values.name}
            onChange={handleChange}
            required
          />
        </label>

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

        <label>
          Role
          <select name="role" value={values.role} onChange={handleChange}>
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </label>

        {values.role === 'student' && (
          <>
            <label>
              Roll Number
              <input
                type="text"
                name="rollNo"
                placeholder="Enter Roll Number"
                value={values.rollNo}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Course
              <input
                type="text"
                name="course"
                placeholder="Enter Course"
                value={values.course}
                onChange={handleChange}
                required
              />
            </label>
          </>
        )}

        <div className="actions">
          <button type="submit" className="btn">Register</button>
          <Link to="/login" className="btn btn-outline">
            Already registered? Login
          </Link>
        </div>
      </form>
    </section>
  )
}

export default Register
