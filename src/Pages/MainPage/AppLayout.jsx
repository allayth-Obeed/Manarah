import { memo, useMemo, useState } from 'react' // MODIFIED: useState لقائمة الإعدادات المنسدلة
import { useTheme } from '../../theme/themeContext'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import CssBaseline from '@mui/material/CssBaseline'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Popover from '@mui/material/Popover' // ADDED: لعرض قائمة الإعدادات عند الضغط على الزر
import Switch from '@mui/material/Switch' // ADDED: مفتاح تبديل الوضع الليلي داخل قائمة الإعدادات
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined'
import MosqueOutlinedIcon from '@mui/icons-material/MosqueOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined'
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined'
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined'
import MapOutlinedIcon from '@mui/icons-material/MapOutlined'
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined'
import MosqueRoundedIcon from '@mui/icons-material/MosqueRounded'
import TopBar from './TopBar'
import { NavLink, useLocation, useNavigate } from 'react-router-dom' // MODIFIED: useNavigate للتوجيه بعد تسجيل الخروج
import useAuth from '../../hooks/useAuth' // ADDED: signOut الحقيقي لزر تسجيل الخروج بالقائمة الجانبية
import { validateToken } from '../../services/authService' // ADDED: عرض بيانات الحساب الحقيقية داخل قائمة الإعدادات
import { useCurrentUser } from '../../context/userContext' // ADDED: تصفية القائمة الجانبية حسب الدور — صفحات الإدارة لا تخص غير ADMIN/MANAGER

const drawerWidth = 240

// audience: 'all' يظهر للجميع، 'admin' لـ ADMIN/MANAGER فقط (canWrite)، 'personal' لغير ADMIN/MANAGER فقط
// (بعض الصفحات لها نسخة إدارية كاملة ونسخة مبسّطة للقراءة فقط بنفس المفهوم — مثل المساجد)
const navItems = [
  { label: 'الرئيسية', icon: GridViewOutlinedIcon, path: '/', audience: 'all' },
  { label: 'المساجد', icon: MosqueOutlinedIcon, path: '/mosques', audience: 'admin' },
  { label: 'دليل المساجد', icon: MosqueOutlinedIcon, path: '/mosque-directory', audience: 'personal' },
  { label: 'توزيع الخطباء', icon: EventNoteOutlinedIcon, path: '/preachers', audience: 'admin' },
  { label: 'الموظفين', icon: BadgeOutlinedIcon, path: '/employees', audience: 'admin' },
  { label: 'التبرعات', icon: PaymentsOutlinedIcon, path: '/donations', audience: 'admin' },
  { label: 'الصيانة والشكاوى', icon: BuildOutlinedIcon, path: '/maintenance', audience: 'all' },
  { label: 'الإعلانات', icon: CampaignOutlinedIcon, path: '/announcements', audience: 'all' },
  { label: 'إدارة المستخدمين', icon: ManageAccountsOutlinedIcon, path: '/users', audience: 'admin' },
]

const NavItem = memo(({ item, pathname, palette }) => {
  const isActive = pathname === item.path
  const ItemIcon = item.icon

  return (
    <ListItem disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        component={NavLink}
        to={item.path}
        prefetch="intent"
        className="justify-center md:justify-start"
        sx={{
          borderRadius: 0,
          minHeight: 44,
          px: 2,
          gap: 1,
          borderRight: isActive
            ? `3px solid ${palette.navActiveBorder}`
            : '3px solid transparent',
          backgroundColor: isActive ? palette.navActiveBg : 'transparent',
          '&:hover': {
            backgroundColor: isActive ? palette.navActiveBg : palette.navHoverBg,
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 28,
            color: isActive ? palette.navActiveText : palette.navInactive,
          }}
        >
          <ItemIcon sx={{ fontSize: 20 }} />
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          sx={{
            m: 0,
            textAlign: 'right',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            WebkitMaskImage: {
              xs: 'linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,1) 60%)',
              md: 'none',
            },
            maskImage: {
              xs: 'linear-gradient(to left, rgba(0,0,0,0), rgba(0,0,0,1) 60%)',
              md: 'none',
            },
            '& .MuiTypography-root': {
              fontSize: 14,
              fontWeight: isActive ? 700 : 600,
              color: isActive ? palette.navActiveText : palette.navInactive,
            },
          }}
        />
      </ListItemButton>
    </ListItem>
  )
})

const AppLayout = ({ children }) => {
  const { activeTheme, themeMode, toggleTheme } = useTheme()
  const { pathname } = useLocation()
  const navigate = useNavigate() // ADDED: للتنقل إلى صفحة تسجيل الدخول بعد الخروج
  const { signOut } = useAuth() // ADDED: نفس منطق تسجيل الخروج المستخدم في TopBar
  const { canWrite } = useCurrentUser() // ADDED: تحديد القائمة الجانبية المناسبة حسب الدور
  const palette = activeTheme.layout

  const [settingsAnchor, setSettingsAnchor] = useState(null) // ADDED: عنصر الإرساء لقائمة الإعدادات المنسدلة (null = مغلقة)
  const [accountInfo, setAccountInfo] = useState({ name: '', email: '', role: '' }) // ADDED: بيانات الحساب الحقيقية المعروضة بالإعدادات

  const visibleNavItems = useMemo(
    () =>
      navItems.filter(
        (item) => item.audience === 'all' || (canWrite ? item.audience === 'admin' : item.audience === 'personal')
      ),
    [canWrite]
  )

  const navList = useMemo(
    () =>
      visibleNavItems.map((item) => (
        <NavItem
          key={item.label}
          item={item}
          pathname={pathname}
          palette={palette}
        />
      )),
    [visibleNavItems, pathname, palette]
  )

  // ADDED: فتح قائمة الإعدادات وجلب بيانات الحساب الحقيقية عند الضغط على الزر
  const handleOpenSettings = async (event) => {
    setSettingsAnchor(event.currentTarget)
    const result = await validateToken()
    if (result.valid && result.user) {
      setAccountInfo({
        name: result.user.name || '',
        email: result.user.email || '',
        role: result.user.role || '',
      })
    }
  }

  const handleCloseSettings = () => setSettingsAnchor(null) // ADDED: إغلاق قائمة الإعدادات

  // ADDED: تسجيل خروج حقيقي لزر القائمة الجانبية بدل زر بلا أي أثر
  const handleSidebarSignOut = async () => {
    await signOut()
    navigate('/auth/signin')
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen transition-colors duration-200 ease-in-out"
      style={{
        backgroundColor: activeTheme.colors.background,
        color: activeTheme.colors.text,
        fontFamily: activeTheme.fontFamily.arabic.join(', '),
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <TopBar toggleTheme={toggleTheme} themeMode={themeMode} />
        <Drawer
          sx={{
            width: { xs: 72, md: drawerWidth },
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: { xs: 72, md: drawerWidth },
              boxSizing: 'border-box',
              backgroundColor: palette.sidebarBg,
              color: activeTheme.colors.text,
              borderLeft: `2px solid ${palette.sidebarBorder}`,
              px: 1.5,
              py: 2,
            },
          }}
          variant="permanent"
          anchor="right"
        >
          <Box className="mt-3 mb-2 flex items-start gap-1.5 group" sx={{ cursor: 'pointer' }}>
            <Box
              sx={{ bgcolor: activeTheme.colors.primary }}
              className="w-10 h-10 rounded-md text-white flex items-center justify-center"
            >
              <MosqueRoundedIcon fontSize="18px" />
            </Box>
            <Box className="hidden md:block">
              <Typography
                sx={{
                  fontSize: 31,
                  lineHeight: 1.2,
                  fontWeight: 700,
                  color: palette.logoText,
                }}
              >
                مديرية الأوقاف
              </Typography>
              <Typography sx={{ fontSize: 14, lineHeight: 1.3, color: palette.subTitle }}>
                نظام إدارة الأصول
              </Typography>
            </Box>
          </Box>

          <List sx={{ mt: 1 }}>{navList}</List>

          <Box sx={{ flexGrow: 1 }} />

          <List>
            <ListItem disablePadding sx={{ mb: 0.5 }}>
              {/* MODIFIED: فتح قائمة إعدادات حقيقية بدل زر بلا أي أثر */}
              <ListItemButton sx={{ minHeight: 42, px: 2, gap: 1 }} onClick={handleOpenSettings}>
                <ListItemIcon sx={{ minWidth: 28, color: palette.navInactive }}>
                  <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="الإعدادات"
                  sx={{
                    m: 0,
                    textAlign: 'right',
                    '& .MuiTypography-root': {
                      fontSize: 14,
                      fontWeight: 600,
                      color: palette.navInactive,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              {/* MODIFIED: تسجيل خروج حقيقي بدل زر بلا أي أثر (كان مكرراً وميتاً مقارنة بزر TopBar) */}
              <ListItemButton sx={{ minHeight: 42, px: 2, gap: 1 }} onClick={handleSidebarSignOut}>
                <ListItemIcon sx={{ minWidth: 28, color: palette.danger }}>
                  <LogoutOutlinedIcon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary="تسجيل الخروج"
                  sx={{
                    m: 0,
                    textAlign: 'right',
                    '& .MuiTypography-root': {
                      fontSize: 14,
                      fontWeight: 600,
                      color: palette.danger,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          </List>

          {/* ADDED: قائمة الإعدادات المنسدلة — بيانات الحساب الحقيقية + مفتاح الوضع الليلي */}
          <Popover
            open={Boolean(settingsAnchor)}
            anchorEl={settingsAnchor}
            onClose={handleCloseSettings}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <Box sx={{ p: 2.5, minWidth: 220, bgcolor: activeTheme.colors.surface }} dir="rtl">
              <Typography sx={{ fontSize: 14, fontWeight: 700, color: activeTheme.colors.text }}>
                {accountInfo.name || '...'}
              </Typography>
              <Typography sx={{ fontSize: 12, color: activeTheme.colors.mutedText, mb: 1.5 }}>
                {accountInfo.email || '...'}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  pt: 1,
                  borderTop: `1px solid ${activeTheme.colors.border}`,
                }}
              >
                <Typography sx={{ fontSize: 13, color: activeTheme.colors.text }}>
                  الوضع الليلي
                </Typography>
                <Switch checked={themeMode === 'dark'} onChange={toggleTheme} size="small" />
              </Box>
            </Box>
          </Popover>

          <Box sx={{ height: 6 }} />
        </Drawer>
        <Box
          dir="ltr"
          component="main"
          sx={{ bgcolor: activeTheme.colors.background }}
          // MODIFIED: أضيف min-w-0 overflow-x-hidden — flex:1 وحدها لا تمنع flex item من التمدد
          // بعرض محتواه الداخلي (الجدول/البطاقات) بدل الانكماش لمساحته المتاحة فعلياً، لأن القيمة
          // الافتراضية min-width:auto تمنع الانكماش تحت العرض الجوهري للمحتوى؛ هذا كان يدفع جزءاً من
          // كل صفحة (RTL) خارج حدود الشاشة يسارياً بصمت بدل عرضه كاملاً أو التفاف/تمرير المحتوى بشكل صحيح
          className="flex flex-col flex-1 min-w-0 overflow-x-hidden p-6 mt-20"
        >
          {children}
        </Box>
      </Box>
    </div>
  )
}

export default AppLayout
