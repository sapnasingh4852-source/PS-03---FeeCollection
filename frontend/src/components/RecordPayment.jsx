import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'

const EMPTY = { studentId: '', amount: '', mode: 'Cash', date: '', transactionRef: '' }

async function fetchStudents(setStudents, setError) {
  const res = await fetch('/api/students', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const data = await res.json()

  if (!res.ok) {
    setError(data.message)
    return
  }

  setStudents(data)
}

function RecordPayment() {
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [values, setValues] = useState(EMPTY)
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStudents(setStudents, setError)
  }, [])

  async function handleStudentChange(e) {
    const studentId = e.target.value
    setValues({ ...values, studentId })
    setSummary(null)

    if (!studentId) return

    const res = await fetch(`/api/students/${studentId}/fees`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })

    const data = await res.json()

    if (res.ok) {
      setSummary(data.summary)
    }
  }

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(values),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.message)
      return
    }

    // every payment gets its own receipt page
    navigate(`/receipts/${data.receiptNo}`)
  }

  return (
    <section className="form-page">
      <h1>Record Payment</h1>

      <form className="form" onSubmit={handleSubmit}>
        {error && <p className="alert">{error}</p>}

        <label>
          Student
          <select name="studentId" value={values.studentId} onChange={handleStudentChange} required>
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.name} ({student.rollNo}) - {student.course}
              </option>
            ))}
          </select>
        </label>

        {summary && (
          <p className="status">
            Payable ₹{summary.payable} (late fee ₹{summary.lateFee}), paid ₹{summary.paid},
            pending ₹{summary.pending}
          </p>
        )}

        <label>
          Amount
          <input
            type="number"
            name="amount"
            placeholder="Enter Amount"
            min="1"
            value={values.amount}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Mode
          <select name="mode" value={values.mode} onChange={handleChange}>
            <option>Cash</option>
            <option>UPI</option>
            <option>Card</option>
          </select>
        </label>

        <label>
          Date
          <input
            type="date"
            name="date"
            value={values.date}
            onChange={handleChange}
          />
        </label>

        <label>
          Transaction Reference
          <input
            type="text"
            name="transactionRef"
            placeholder="Enter Transaction Reference"
            value={values.transactionRef}
            onChange={handleChange}
          />
        </label>

        <div className="actions">
          <button type="submit" className="btn">Record Payment</button>
          <Link to="/admin/dashboard" className="btn btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  )
}

export default RecordPayment
