import { useEffect, useState } from 'react'
import { Link } from 'react-router'

async function fetchFeeStructures(setFeeStructures, setError) {
  const res = await fetch('/api/fees', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const data = await res.json()

  if (!res.ok) {
    setError(data.message)
    return
  }

  setFeeStructures(data)
}

function FeeStructures() {
  const [feeStructures, setFeeStructures] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFeeStructures(setFeeStructures, setError)
  }, [])

  async function handleDelete(fee) {
    if (!window.confirm(`Delete ${fee.feeHead} fee for ${fee.course}?`)) return

    const res = await fetch(`/api/fees/${fee._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.message)
      return
    }

    setFeeStructures((list) => list.filter((item) => item._id !== fee._id))
  }

  return (
    <section>
      <div className="page-head">
        <h1>Fee Structures</h1>
        <Link to="/admin/fees/new" className="btn">+ Add Fee Structure</Link>
      </div>

      {error && <p className="alert">{error}</p>}
      {feeStructures.length === 0 && (
        <p className="status">No fee structures yet. Add the first one.</p>
      )}

      <div className="grid">
        {feeStructures.map((fee) => (
          <article key={fee._id} className="card">
            <h2>{fee.feeHead}</h2>

            <dl>
              <dt>Course</dt>
              <dd>{fee.course}</dd>
              <dt>Amount</dt>
              <dd>₹{fee.amount}</dd>
              <dt>Due Date</dt>
              <dd>{new Date(fee.dueDate).toLocaleDateString()}</dd>
              <dt>Late Fee / Day</dt>
              <dd>₹{fee.lateFeePerDay || 0}</dd>
            </dl>

            <div className="actions">
              <Link to={`/admin/fees/${fee._id}/edit`} className="btn btn-small">
                Edit
              </Link>
              <button
                type="button"
                className="btn btn-small btn-danger"
                onClick={() => handleDelete(fee)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default FeeStructures
