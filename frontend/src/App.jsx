import { BrowserRouter, Routes, Route, Link } from 'react-router'
import Home from './components/Home.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'
import FeeStructures from './components/FeeStructures.jsx'
import FeeStructureNew from './components/FeeStructureNew.jsx'
import FeeStructureEdit from './components/FeeStructureEdit.jsx'
import RecordPayment from './components/RecordPayment.jsx'
import StudentFees from './components/StudentFees.jsx'
import MyFees from './components/MyFees.jsx'
import Receipt from './components/Receipt.jsx'

function App() {
  // the logged-in user is kept in localStorage, navbar links depend on the role
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // full reload so the navbar goes back to the logged-out links
    window.location.href = '/login'
  }

  return (
    <BrowserRouter>
      <nav className="navbar">
        <Link to="/" className="brand">FeeFlow</Link>

        <div className="nav-links">
          {user?.role === 'admin' && (
            <>
              <Link to="/admin/dashboard">Dashboard</Link>
              <Link to="/admin/fees">Fee Structures</Link>
              <Link to="/admin/payments/new">Record Payment</Link>
            </>
          )}

          {user?.role === 'student' && <Link to="/my-fees">My Fees</Link>}

          {!user && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}

          {user && (
            <button type="button" className="btn btn-small" onClick={logout}>
              Logout ({user.name})
            </button>
          )}
        </div>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/fees" element={<FeeStructures />} />
          <Route path="/admin/fees/new" element={<FeeStructureNew />} />
          <Route path="/admin/fees/:id/edit" element={<FeeStructureEdit />} />
          <Route path="/admin/payments/new" element={<RecordPayment />} />
          <Route path="/admin/students/:id/fees" element={<StudentFees />} />
          <Route path="/my-fees" element={<MyFees />} />
          <Route path="/receipts/:receiptNo" element={<Receipt />} />
          <Route path="*" element={<p className="status">Page not found.</p>} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
