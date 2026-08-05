import { useEffect, useMemo, useState } from 'react' // MODIFIED: useMemo لحساب نتائج البحث الحية
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { Avatar, Box, Divider, IconButton, ClickAwayListener, Popover } from '@mui/material' // MODIFIED: Popover لعرض معلومات المستخدم عند الضغط على أيقونة الحساب
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'
import AccountCircle from '@mui/icons-material/AccountCircle'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LogoutIcon from '@mui/icons-material/Logout'
import { useTheme } from '../../theme/themeContext'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { validateToken } from '../../services/authService' // ADDED: useAuth ليس Context مشترك، فنجلب المستخدم الحقيقي مباشرة عبر /auth/me
import { getAllMosques } from '../../services/mosqueService' // ADDED: لتفعيل البحث الحقيقي عن المساجد
import { getAllPreachers } from '../../services/preacherService' // ADDED: لتفعيل البحث الحقيقي عن الأئمة
import { API_ORIGIN } from '../../services/apiClient' // ADDED: لبناء رابط كامل لصورة المستخدم (تُخدَّم من الباك اند مباشرة وليس عبر /api)

const drawerWidth = 240

// ADDED: ترجمة قيم Role الإنجليزية القادمة من الباك اند إلى تسميات عربية للعرض بالشريط العلوي
const roleLabels = {
  ADMIN: 'مشرف النظام',
  MANAGER: 'مدير',
  USER: 'مستخدم',
  PREACHER: 'داعية',
  EMPLOYEE: 'موظف',
}

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  maxWidth: 430,
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  position: 'absolute',
  right: 0,
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 1),
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    textAlign: 'right',
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}))

function TopBar() {
  const { activeTheme, themeMode, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const palette = activeTheme.layout

  // MODIFIED: المستخدم الحقيقي بدل الاسم الثابت "أحمد المشرف" — يُحدَّث فور نجاح جلب /auth/me
  const [user, setUser] = useState({ name: '', role: '', email: '', avatarUrl: '' })

  // ADDED: جلب بيانات المستخدم الحقيقي مرة واحدة عند تحميل الشريط العلوي
  useEffect(() => {
    let isMounted = true
    validateToken().then((result) => {
      if (isMounted && result.valid && result.user) {
        setUser({
          name: result.user.name || '',
          role: roleLabels[result.user.role] || result.user.role || '',
          email: result.user.email || '', // ADDED: يُعرض بقائمة معلومات الحساب المنبثقة
          avatarUrl: result.user.avatarUrl || '', // ADDED: صورة المستخدم الحقيقية إن وُجدت
        })
      }
    })
    return () => {
      isMounted = false // ADDED: تفادي تحديث state بعد فك تركيب المكوّن
    }
  }, [])

  // ADDED: رابط كامل لصورة المستخدم — avatarUrl المخزَّن نسبي (مثل /uploads/avatars/x.jpg) ويُخدَّم من أصل الباك اند مباشرة
  const avatarSrc = user.avatarUrl ? `${API_ORIGIN}${user.avatarUrl}` : undefined

  // ADDED: حالة قائمة معلومات الحساب المنبثقة (تظهر عند الضغط على أيقونة الحساب بالشريط العلوي)
  const [accountAnchor, setAccountAnchor] = useState(null)

  // ADDED: حالة البحث الحي بمربع البحث بالشريط العلوي
  const [searchQuery, setSearchQuery] = useState('')
  const [searchPool, setSearchPool] = useState({ mosques: [], preachers: [] })

  // ADDED: جلب قوائم المساجد/الأئمة مرة واحدة عند التحميل لاستخدامها بالبحث الفوري (فلترة محلية بدون طلب لكل حرف)
  useEffect(() => {
    Promise.all([getAllMosques(), getAllPreachers()])
      .then(([mosques, preachers]) => setSearchPool({ mosques, preachers }))
      .catch(() => setSearchPool({ mosques: [], preachers: [] }))
  }, [])

  // ADDED: نتائج البحث الحية المشتقة من نص البحث + القوائم المجلوبة
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return []

    const mosqueMatches = searchPool.mosques
      .filter((m) => m.name?.toLowerCase().includes(query))
      .slice(0, 5)
      .map((m) => ({ key: `mosque-${m.id}`, type: 'مسجد', label: m.name, path: '/mosques' }))

    const preacherMatches = searchPool.preachers
      .filter((p) => `${p.firstName} ${p.lastName}`.toLowerCase().includes(query))
      .slice(0, 5)
      .map((p) => ({
        key: `preacher-${p.id}`,
        type: 'إمام',
        label: `${p.firstName} ${p.lastName}`,
        path: '/preachers',
      }))

    return [...mosqueMatches, ...preacherMatches]
  }, [searchQuery, searchPool])

  // ADDED: الانتقال لصفحة النتيجة المختارة ومسح مربع البحث
  const handleSelectResult = (path) => {
    setSearchQuery('')
    navigate(path)
  }

  // معالجة تسجيل الخروج
  const handleSignOut = async () => {
    await signOut()
    navigate('/auth/signin')
  }

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
        mr: { xs: 0, md: `${drawerWidth}px` },
        boxShadow: 'none',
        borderBottom: `1px solid ${palette.sidebarBorder}`,
        backgroundColor: palette.sidebarBg,
        color: activeTheme.colors.text,
      }}
    >
      <Toolbar sx={{ px: { xs: 1.5, md: 2.5 }, minHeight: 72 }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, md: 2 },
          }}
        >
          <Box
            sx={{
              px: 1,
              py: 0.5,
              minWidth: { xs: 'auto', md: 300 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 30,
                  height: 30,
                  bgcolor: activeTheme.colors.primary,
                  fontSize: 14,
                }}
              >
                {/* MODIFIED: أول حرف من الاسم الحقيقي بدل حرف "أ" الثابت المرتبط بالاسم الوهمي السابق */}
                {user.name ? user.name.charAt(0) : ''}
              </Avatar>
              <Box sx={{ lineHeight: 1.2 }}>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  {user.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 11,
                    color: activeTheme.colors.mutedText,
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  {user.role}
                </Typography>
              </Box>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

            {/* MODIFIED: أعيد ترتيب الأيقونات — أيقونة الحساب/الإشعارات/الوضع الليلي معاً كأدوات روتينية،
                وفُصل زر تسجيل الخروج بفاصل بصري بآخر المجموعة لأنه إجراء حسّاس ولتفادي الضغط عليه بالخطأ */}
            <Box className="flex items-center gap-0.5 flex-col md:flex-row">
              {/* MODIFIED: أيقونة الحساب أصبحت تعرض صورة المستخدم الحقيقية إن وُجدت (أو الأيقونة الافتراضية)،
                  وتفتح عند الضغط قائمة معلومات الحساب بدل كونها زخرفية بلا وظيفة */}
              <IconButton
                size="small"
                onClick={(e) => setAccountAnchor(e.currentTarget)}
                sx={{ color: activeTheme.colors.mutedText, p: 0.5 }}
                title="حسابي"
              >
                {avatarSrc ? (
                  <Avatar src={avatarSrc} sx={{ width: 22, height: 22 }} />
                ) : (
                  <AccountCircle fontSize="small" />
                )}
              </IconButton>
              <IconButton size="small" sx={{ color: activeTheme.colors.mutedText }}>
                <NotificationsIcon fontSize="small" />
              </IconButton>
              <IconButton
                onClick={toggleTheme}
                size="small"
                sx={{ color: activeTheme.colors.mutedText }}
              >
                {themeMode === 'dark' ? (
                  <LightModeIcon fontSize="small" />
                ) : (
                  <DarkModeIcon fontSize="small" />
                )}
              </IconButton>
              {/* ADDED: فاصل بصري قبل زر تسجيل الخروج ليتميّز عن الأيقونات الروتينية أعلاه */}
              <Divider orientation="vertical" flexItem sx={{ mx: 0.25, display: { xs: 'none', md: 'block' } }} />
              <IconButton
                onClick={handleSignOut}
                size="small"
                sx={{ color: '#D64040' }}
                title="تسجيل الخروج"
              >
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* ADDED: قائمة معلومات الحساب المنبثقة — تظهر عند الضغط على أيقونة الحساب أعلاه */}
          <Popover
            open={Boolean(accountAnchor)}
            anchorEl={accountAnchor}
            onClose={() => setAccountAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Box sx={{ p: 2.5, minWidth: 220, textAlign: 'center', bgcolor: activeTheme.colors.surface }} dir="rtl">
              <Avatar
                src={avatarSrc}
                sx={{ width: 56, height: 56, mx: 'auto', mb: 1.5, bgcolor: activeTheme.colors.primary }}
              >
                {!avatarSrc && (user.name ? user.name.charAt(0) : <AccountCircle />)}
              </Avatar>
              <Typography sx={{ fontSize: 15, fontWeight: 700, color: activeTheme.colors.text }}>
                {user.name || '...'}
              </Typography>
              <Typography sx={{ fontSize: 12, color: activeTheme.colors.mutedText, mb: 0.5 }}>
                {user.email || '...'}
              </Typography>
              <Typography sx={{ fontSize: 12, color: activeTheme.colors.primary, fontWeight: 600 }}>
                {user.role}
              </Typography>
            </Box>
          </Popover>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            {/* MODIFIED: البحث أصبح فعلياً — مربع مُتحكَّم به + قائمة نتائج حية بدل حقل زخرفي بلا وظيفة */}
            <ClickAwayListener onClickAway={() => setSearchQuery('')}>
              <Search
                sx={{
                  border: `1px solid ${palette.searchBorder}`,
                  backgroundColor: palette.searchBaseBg,
                  borderRadius: 4,
                  width: { xs: '100%', sm: '60%', md: 'auto' },
                  maxWidth: { xs: '100%', sm: 430 },
                  '&:hover': {
                    backgroundColor: palette.searchHoverBg,
                  },
                }}
              >
                <SearchIconWrapper>
                  <SearchIcon fontSize="small" />
                </SearchIconWrapper>
                <StyledInputBase
                  dir="rtl"
                  placeholder="بحث عن مسجد أو إمام..."
                  inputProps={{ 'aria-label': 'search' }}
                  value={searchQuery} // ADDED: تحويل الحقل لمربع مُتحكَّم به
                  onChange={(event) => setSearchQuery(event.target.value)} // ADDED: تحديث نص البحث أثناء الكتابة
                />

                {/* ADDED: قائمة نتائج البحث المنسدلة — تظهر فقط عند وجود نص ونتائج مطابقة */}
                {searchQuery.trim() && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      left: 0,
                      right: 0,
                      zIndex: 20,
                      borderRadius: 2,
                      border: `1px solid ${palette.searchBorder}`,
                      backgroundColor: activeTheme.colors.surface,
                      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                      overflow: 'hidden',
                    }}
                  >
                    {searchResults.length === 0 ? (
                      <Typography sx={{ fontSize: 13, color: activeTheme.colors.mutedText, p: 1.5 }}>
                        لا توجد نتائج
                      </Typography>
                    ) : (
                      searchResults.map((result) => (
                        <Box
                          key={result.key}
                          onClick={() => handleSelectResult(result.path)}
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            px: 1.5,
                            py: 1,
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: palette.navHoverBg },
                          }}
                        >
                          <Typography sx={{ fontSize: 12, color: activeTheme.colors.mutedText }}>
                            {result.type}
                          </Typography>
                          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
                            {result.label}
                          </Typography>
                        </Box>
                      ))
                    )}
                  </Box>
                )}
              </Search>
            </ClickAwayListener>
          </Box>

          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              minWidth: 'fit-content',
            }}
          >
            <Box className="group" sx={{ cursor: 'pointer' }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: activeTheme.colors.primary,
                }}
              >
                مديرية الأوقاف
              </Typography>
              <Typography
                sx={{
                  fontSize: 12,
                  lineHeight: 1.3,
                  color: activeTheme.colors.secondary,
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                  display: { xs: 'block' },
                  '@media (min-width:768px)': {
                    opacity: 0,
                    transform: 'translateY(-4px)',
                    '.group:hover &': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                }}
              >
                نظام إدارة الأصول
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar
