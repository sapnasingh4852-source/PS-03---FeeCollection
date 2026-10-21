import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

async function fetchReceipt(receiptNo, setPayment, setError) {
  const res = await fetch(`/api/payments/receipt/${receiptNo}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const data = await res.json()

  if (!res.ok) {
    setError(data.message)
    return
  }

  setPayment(data)
}

function Receipt() {
  const { receiptNo } = useParams()
  const [payment, setPayment] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchReceipt(receiptNo, setPayment, setError)
  }, [receiptNo])

  if (error) {
    return <p className="alert">{error}</p>
  }

  if (!payment) {
    return <p className="status">Loading receipt...</p>
  }

  const { student } = payment

  return (
    <section className="receipt-page">
      <div className="receipt">
        <div className="receipt-head">
          <h1>FeeFlow Institute</h1>
          <p>Fee Collection & Receipt Management System</p>
          <h2>RECEIPT</h2>
          <p className="receipt-no">{payment.receiptNo}</p>
        </div>

        <dl className="receipt-details">
          <dt>Receipt No</dt>
          <dd>{payment.receiptNo}</dd>
          <dt>Date</dt>
          <dd>{new Date(payment.date).toLocaleDateString()}</dd>
          <dt>Student Name</dt>
          <dd>{student.name}</dd>
          <dt>Roll No</dt>
          <dd>{student.rollNo}</dd>
          <dt>Course</dt>
          <dd>{student.course}</dd>
          <dt>Payment Mode</dt>
          <dd>{payment.mode}</dd>
          <dt>Transaction Ref</dt>
          <dd>{payment.transactionRef || '—'}</dd>
        </dl>

        <div className="receipt-amount">
          <span>Amount Received</span>
          <strong>₹{payment.amount}</strong>
        </div>

        <button type="button" className="btn no-print" onClick={() => window.print()}>
          Print Receipt
        </button>
      </div>
    </section>
  )
}

export default Receipt
