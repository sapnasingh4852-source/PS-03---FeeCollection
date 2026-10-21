import { useState } from 'react'
import { Link } from 'react-router'

const EMPTY = { course: '', feeHead: 'Tuition', amount: '', dueDate: '', lateFeePerDay: '' }

// Shared by the Add and Edit fee structure pages
function FeeStructureForm({ initialValues = EMPTY, submitLabel, onSubmit }) {
  const [values, setValues] = useState(initialValues)
  const [error, setError] = useState('')

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    try {
      await onSubmit(values)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {error && <p className="alert">{error}</p>}

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

      <label>
        Fee Head
        <select name="feeHead" value={values.feeHead} onChange={handleChange}>
          <option>Tuition</option>
          <option>Exam</option>
          <option>Transport</option>
        </select>
      </label>

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
        Due Date
        <input
          type="date"
          name="dueDate"
          value={values.dueDate ? values.dueDate.slice(0, 10) : ''}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Late Fee Per Day
        <input
          type="number"
          name="lateFeePerDay"
          placeholder="Enter Late Fee Per Day"
          min="0"
          value={values.lateFeePerDay}
          onChange={handleChange}
        />
      </label>

      <div className="actions">
        <button type="submit" className="btn">{submitLabel}</button>
        <Link to="/admin/fees" className="btn btn-outline">
          Cancel
        </Link>
      </div>
    </form>
  )
}

export default FeeStructureForm
