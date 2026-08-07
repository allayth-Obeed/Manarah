import './App.css'
import AppLayout from './Pages/MainPage/AppLayout'
import { ThemeProvider } from './theme/themeProvider'
import { UserProvider } from './context/UserProvider' // ADDED: مصدر واحد لبيانات المستخدم/الدور لكل التطبيق بدل جلب منفصل بكل صفحة
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import AuthGuard from './components/common/AuthGuard'

const Preachers = lazy(() => import('./Pages/PreachersPage/Preachers'))
const Employees = lazy(() => import('./Pages/EmployeesPage/Employees'))
const Mosque = lazy(() => import('./Pages/MosquesPage/Mosque'))
const Dashboard = lazy(() => import('./Pages/DashboardPage/Dashboard'))
const Announcements = lazy(() => import('./Pages/Announcements/Announcements'))
const Donations = lazy(() => import('./Pages/DonationsPage/Donations'))
const SignInPage = lazy(() => import('./Pages/AuthPages/SignInPage'))
const SignUpPage = lazy(() => import('./Pages/AuthPages/SignUpPage'))

const router = createBrowserRouter([
  {
    path: '/auth/signin',
    element: <SignInPage />,
  },
  {
    path: '/auth/signup',
    element: <SignUpPage />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'preachers', element: <Preachers /> },
      { path: 'employees', element: <Employees /> },
      { path: 'mosques', element: <Mosque /> },
      { path: 'announcements', element: <Announcements /> },
      { path: 'donations', element: <Donations /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

function App() {
  return (
    <ThemeProvider>
      {/* ADDED: يلف كل المسارات (حتى صفحات الدخول) لأن validateToken يتعامل بأمان مع عدم وجود توكن */}
      <UserProvider>
        <Suspense fallback={null}>
          <RouterProvider router={router} />
        </Suspense>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
