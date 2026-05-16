import './App.css'
import AppLayout from './Pages/MainPage/AppLayout'
import { ThemeProvider } from './theme/themeProvider'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Preachers from './Pages/PreachersPage/Preachers'
import Employees from './Pages/EmployeesPage/Employees'
import Mosque from './Pages/MosquesPage/Mosque'
import Dashboard from './Pages/DashboardPage/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/preachers" element={<Preachers />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/mosques" element={<Mosque />} />
          </Routes>
        </AppLayout>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
