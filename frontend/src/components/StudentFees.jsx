import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

async function fetchStudentFees(id, setData, setError) {
  const res = await fetch(`/api/students/${id}/fees`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const data = await res.json()

  if (!res.ok) {
    setError(data.message)
    return
  }

  setData(data)
}

function StudentFees() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStudentFees(id, setData, setError)
  }, [id])

  if (error) {
    return <p className="alert">{error}</p>
  }

  if (!data) {
    return <p className="status">Loading student fees...</p>
  }

  const { student, summary, payments } = data

  return (
    <section>
      <div className="page-head">
        <h1>Fees of {student.name}</h1>
        <Link to="/admin/payments/new" className="btn">+ Record Payment</Link>
      </div>

      <p className="status">
        Roll No: {student.rollNo} | Course: {student.course} | Status: <strong>{summary.status}</strong>
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

      <h1>Payment History</h1>

      {payments.length === 0 && <p className="status">No payments recorded for this student.</p>}

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

export default StudentFees
