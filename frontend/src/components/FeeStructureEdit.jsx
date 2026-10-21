import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import FeeStructureForm from './FeeStructureForm.jsx'

async function fetchFeeStructure(id, setFeeStructure, setError) {
  const res = await fetch('/api/fees', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  })

  const data = await res.json()

  if (!res.ok) {
    setError(data.message)
    return
  }

  setFeeStructure(data.find((fee) => fee._id === id))
}

function FeeStructureEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [feeStructure, setFeeStructure] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFeeStructure(id, setFeeStructure, setError)
  }, [id])

  async function handleSubmit(values) {
    const res = await fetch(`/api/fees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(values),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message)
    }

    navigate('/admin/fees')
  }

  return (
    <section className="form-page">
      <h1>Edit Fee Structure</h1>

      {error && <p className="alert">{error}</p>}
      {!error && !feeStructure && <p className="status">Loading fee structure...</p>}
      {feeStructure && (
        <FeeStructureForm
          initialValues={feeStructure}
          submitLabel="Save Changes"
          onSubmit={handleSubmit}
        />
      )}
    </section>
  )
}

export default FeeStructureEdit
