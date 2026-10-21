import { useEffect, useState } from 'react'
import { Link } from 'react-router'

async function fetchDashboard(setDashboard, setError) {
  const res = await fetch('/api/dashboard', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const data = await res.json()

  if (!res.ok) {
    setError(data.message)
    return
  }

  setDashboard(data)
}

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDashboard(setDashboard, setError)
  }, [])

  if (error) {
    return <p className="alert">{error}</p>
  }

  if (!dashboard) {
    return <p className="status">Loading dashboard...</p>
  }

  const modes = Object.entries(dashboard.modeWise)

  return (
    <section>
      <div className="page-head">
        <h1>Dashboard</h1>
        <Link to="/admin/payments/new" className="btn">+ Record Payment</Link>
      </div>

      <div className="grid stats">
        <article className="card">
          <h2>Total Collected</h2>
          <p className="stat">₹{dashboard.totalCollected}</p>
        </article>

        <article className="card">
          <h2>Total Pending</h2>
          <p className="stat">₹{dashboard.totalPending}</p>
        </article>

        <article className="card">
          <h2>Overdue Defaulters</h2>
          <p className="stat">{dashboard.defaulters.length}</p>
        </article>

        <article className="card">
          <h2>Students</h2>
          <p className="stat">{dashboard.students.length}</p>
        </article>
      </div>

      <h1>Mode-wise Collection</h1>

      {modes.length === 0 && <p className="status">No payments recorded yet.</p>}

      <div className="grid">
        {modes.map(([mode, amount]) => (
          <article key={mode} className="card">
            <h2>{mode}</h2>
            <p className="stat">₹{amount}</p>
          </article>
        ))}
      </div>

      <h1>Overdue Defaulters</h1>

      {dashboard.defaulters.length === 0 && (
        <p className="status">No overdue defaulters. Great job!</p>
      )}

      <div className="grid">
        {dashboard.defaulters.map(({ student, pending }) => (
          <article key={student._id} className="card">
            <h2>{student.name}</h2>

            <dl>
              <dt>Roll No</dt>
              <dd>{student.rollNo}</dd>
              <dt>Course</dt>
              <dd>{student.course}</dd>
              <dt>Pending</dt>
              <dd>₹{pending}</dd>
            </dl>

            <div className="actions">
              <Link to={`/admin/students/${student._id}/fees`} className="btn btn-small">
                View Fees
              </Link>
            </div>
          </article>
        ))}
      </div>

      <h1>All Students</h1>

      <div className="grid">
        {dashboard.students.map(({ student, summary }) => (
          <article key={student._id} className="card">
            <h2>{student.name}</h2>

            <dl>
              <dt>Roll No</dt>
              <dd>{student.rollNo}</dd>
              <dt>Course</dt>
              <dd>{student.course}</dd>
              <dt>Payable</dt>
              <dd>₹{summary.payable}</dd>
              <dt>Paid</dt>
              <dd>₹{summary.paid}</dd>
              <dt>Pending</dt>
              <dd>₹{summary.pending}</dd>
              <dt>Status</dt>
              <dd>
                <span className={`badge badge-${summary.status.replace(' ', '-').toLowerCase()}`}>
                  {summary.status}
                </span>
              </dd>
            </dl>

            <div className="actions">
              <Link to={`/admin/students/${student._id}/fees`} className="btn btn-small">
                View Fees
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AdminDashboard
