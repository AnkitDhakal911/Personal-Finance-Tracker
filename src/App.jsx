import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './Components/frontend/Header/Header'
import Footer from './Components/frontend/Footer/Footer'
import Home from './Components/frontend/Home/Home'
import Login from './Components/frontend/Login/Login'
import Signup from './Components/frontend/Signup/Signup'
import Profile from './Components/frontend/Profile/Profile'
// import Categories from './Components/frontend/Categories/Categories' // Removed Categories import
import Goals from './Components/frontend/Goals/Goals'
import Admin from './Components/frontend/Admin/Admin'
import About from './Components/frontend/About/About'
import Contact from './Components/frontend/Contact/Contact'
import ProtectedRoute from './Components/frontend/Context/ProtectedRoute'
import CreateTransaction from './Components/frontend/Transaction/CreateTransaction'
import Transaction from './Components/frontend/Transaction/Transaction'
import CreateGoal from './Components/frontend/Goals/CreateGoal'
import { useAuth } from './Components/frontend/Context/AuthContext'

function App() {
  const { user, loading } = useAuth()
  const location = useLocation()

  const hideHeaderFooter = location.pathname === '/' || location.pathname === '/login'

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-xl">Loading...</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeaderFooter && <Header />}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Routes for authenticated users */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            {/* <Route path="/categories" element={<Categories />} /> */} {/* Removed Categories route */}
            <Route path="/transactions/new" element={<CreateTransaction />} />
            <Route path="/transactions/edit/:id" element={<CreateTransaction />} />
            <Route path="/transactions/:id" element={<Transaction />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/goals/new" element={<CreateGoal />} />
            <Route path="/goals/edit/:id" element={<CreateGoal />} />

            {/* Admin-only Route */}
            {user?.role === 'admin' && (
              <Route path="/admin" element={<Admin />} />
            )}
          </Route>
        </Routes>
      </main>
      {!hideHeaderFooter && <Footer />}
    </div>
  )
}

export default App 