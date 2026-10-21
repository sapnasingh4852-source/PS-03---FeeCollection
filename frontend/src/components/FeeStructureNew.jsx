import { useNavigate } from 'react-router'
import FeeStructureForm from './FeeStructureForm.jsx'

function FeeStructureNew() {
  const navigate = useNavigate()

  async function handleSubmit(values) {
    const res = await fetch('/api/fees', {
      method: 'POST',
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
      <h1>Add Fee Structure</h1>
      <FeeStructureForm submitLabel="Add Fee Structure" onSubmit={handleSubmit} />
    </section>
  )
}

export default FeeStructureNew
