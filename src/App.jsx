import './App.css'
import AppLayout from './Pages/MainPage/AppLayout'
import { ThemeProvider } from './theme/themeProvider'
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'

const Preachers = lazy(() => import('./Pages/PreachersPage/Preachers'))
const Employees = lazy(() => import('./Pages/EmployeesPage/Employees'))
const Mosque = lazy(() => import('./Pages/MosquesPage/Mosque'))
const Dashboard = lazy(() => import('./Pages/DashboardPage/Dashboard'))
const Announcements = lazy(() => import('./Pages/Announcements/Announcements'))
const Donations =lazy(()=> import('./Pages/DonationsPage/Donations'))

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppLayout>
        <Outlet />
      </AppLayout>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'preachers', element: <Preachers /> },
      { path: 'employees', element: <Employees /> },
      { path: 'mosques', element: <Mosque /> },
      { path: '*', element: <Navigate to="/" replace /> },
      { path: 'announcements', element: <Announcements /> },
      { path: 'donations', element: <Donations /> },
    ],
  },
])

function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={null}>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  )
}

export default App
