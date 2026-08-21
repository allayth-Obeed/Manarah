import './App.css'
import AppLayout from './Pages/MainPage/AppLayout'
import { ThemeProvider } from './theme/themeProvider'
import { UserProvider } from './context/UserProvider' // ADDED: مصدر واحد لبيانات المستخدم/الدور لكل التطبيق بدل جلب منفصل بكل صفحة
import { NotificationsProvider } from './context/NotificationsProvider' // ADDED: اتصال Socket.IO + إشعارات لحظية على مستوى التطبيق
import { useCurrentUser } from './context/userContext' // ADDED: لعرض لوحة شخصية مختلفة لغير ADMIN/MANAGER بالمسار الرئيسي
import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom'
import AuthGuard from './components/common/AuthGuard'

const Preachers = lazy(() => import('./Pages/PreachersPage/Preachers'))
const Employees = lazy(() => import('./Pages/EmployeesPage/Employees'))
const Mosque = lazy(() => import('./Pages/MosquesPage/Mosque'))
const MosqueDirectory = lazy(() => import('./Pages/MosquesPage/MosqueDirectory'))
const Dashboard = lazy(() => import('./Pages/DashboardPage/Dashboard'))
const MyOverview = lazy(() => import('./Pages/DashboardPage/MyOverview'))
const Announcements = lazy(() => import('./Pages/Announcements/Announcements'))
const Donations = lazy(() => import('./Pages/DonationsPage/Donations'))
const Maintenance = lazy(() => import('./Pages/MaintenancePage/Maintenance'))
const Users = lazy(() => import('./Pages/UsersPage/Users'))
const SignInPage = lazy(() => import('./Pages/AuthPages/SignInPage'))
const SignUpPage = lazy(() => import('./Pages/AuthPages/SignUpPage'))

// ADDED: ADMIN/MANAGER يريان لوحة التحكم الإدارية الكاملة، وبقية الأدوار (خطيب/موظف/مستخدم عادي)
// يرون لوحتهم الشخصية فقط — إدارة المساجد/الموظفين/التبرعات لا تخصهم أصلاً
function HomeRoute() {
  const { canWrite } = useCurrentUser()
  return canWrite ? <Dashboard /> : <MyOverview />
}

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
      { index: true, element: <HomeRoute /> },
      { path: 'preachers', element: <Preachers /> },
      { path: 'employees', element: <Employees /> },
      { path: 'mosques', element: <Mosque /> },
      { path: 'mosque-directory', element: <MosqueDirectory /> },
      { path: 'announcements', element: <Announcements /> },
      { path: 'donations', element: <Donations /> },
      { path: 'maintenance', element: <Maintenance /> },
      { path: 'users', element: <Users /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

function App() {
  return (
    <ThemeProvider>
      {/* ADDED: يلف كل المسارات (حتى صفحات الدخول) لأن validateToken يتعامل بأمان مع عدم وجود توكن */}
      <UserProvider>
        <NotificationsProvider>
          <Suspense fallback={null}>
            <RouterProvider router={router} />
          </Suspense>
        </NotificationsProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
