import { useEffect, useState } from 'react'
import { Link } from 'react-router'

async function fetchMyFees(studentId, setData, setError) {
  const res = await fetch(`/api/students/${studentId}/fees`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const data = await res.json()

  if (!res.ok) {
    setError(data.message)
    return
  }

  setData(data)
}

function MyFees() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMyFees(user._id, setData, setError)
  }, [user._id])

  if (error) {
    return <p className="alert">{error}</p>
  }

  if (!data) {
    return <p className="status">Loading my fees...</p>
  }

  const { summary, payments } = data

  return (
    <section>
      <div className="page-head">
        <h1>My Fees</h1>
      </div>

      <p className="status">
        Status: <strong>{summary.status}</strong>
        {summary.overdue && ' · Due date has passed, late fee is being added.'}
      </p>

      <div className="grid stats">
        <article className="card">
          <h2>Total Payable</h2>
          <p className="stat">₹{summary.payable}</p>
        </article>

        <article className="card">
          <h2>Late Fee</h2>
          <p className="stat">₹{summary.lateFee}</p>
        </article>

        <article className="card">
          <h2>Paid</h2>
          <p className="stat">₹{summary.paid}</p>
        </article>

        <article className="card">
          <h2>Pending</h2>
          <p className="stat">₹{summary.pending}</p>
        </article>
      </div>

      <h1>My Payment History</h1>

      {payments.length === 0 && <p className="status">No payments made yet.</p>}

      <div className="grid">
        {payments.map((payment) => (
          <article key={payment._id} className="card">
            <h2>{payment.receiptNo}</h2>

            <dl>
              <dt>Date</dt>
              <dd>{new Date(payment.date).toLocaleDateString()}</dd>
              <dt>Amount</dt>
              <dd>₹{payment.amount}</dd>
              <dt>Mode</dt>
              <dd>{payment.mode}</dd>
              <dt>Transaction Ref</dt>
              <dd>{payment.transactionRef || '—'}</dd>
            </dl>

            <div className="actions">
              <Link to={`/receipts/${payment.receiptNo}`} className="btn btn-small">
                View Receipt
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MyFees
