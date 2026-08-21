import React, { useEffect, useState } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  IconButton,
  Chip,
  Typography,
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  TextField,
  InputAdornment,
  Snackbar,
  Alert,
  Tooltip,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import DeleteIcon from '@mui/icons-material/Delete'
import LockResetIcon from '@mui/icons-material/LockReset'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import MainFun from '../DashboardPage/MainFun'
import AppButton from '../../components/common/AppButton'
import { useTheme } from '../../theme/themeContext'
import { useCurrentUser } from '../../context/userContext'
import { getAllUsers, createUser, updateUserRole, deleteUser, resetUserPassword } from '../../services/userService'
import { EMPLOYEE_JOB_TITLES } from '../../constants/jobTitles' // ADDED: مسمّيات وظيفية حقيقية عند إنشاء حساب بدور "موظف" بدل مسمى عام ثابت

// نفس تسميات TopBar.jsx للاتساق
const roleLabels = { ADMIN: 'مشرف النظام', MANAGER: 'مدير', USER: 'مستخدم', PREACHER: 'داعية', EMPLOYEE: 'موظف' }
// الأدوار القابلة للإسناد من هذه الصفحة فقط — ADMIN/MANAGER محجوزان ولا يُسندان من هنا
const assignableRoles = [
  { value: 'USER', label: 'مستخدم عادي' },
  { value: 'PREACHER', label: 'خطيب' },
  { value: 'EMPLOYEE', label: 'موظف' },
]
const PROTECTED_ROLES = ['ADMIN', 'MANAGER']

// صفحة إدارة المستخدمين (ADMIN/MANAGER فقط): تحديد دور كل حساب (خطيب/موظف/مستخدم عادي) وحذف الحسابات —
// محمية بالكامل عن حسابات مسؤولي النظام (لا تُعرض لها خيارات تغيير/حذف) والباك اند يفرض نفس الحماية أيضاً
export default function Users() {
  const { activeTheme } = useTheme()
  const { colors } = activeTheme
  const { role: myRole, user: me } = useCurrentUser()
  // خلفية رأس الجدول: البيج الذهبي (الهوية البصرية السورية) بالوضع الفاتح، وتدرّج برونزي خفيف بالوضع الداكن
  const headerBg = activeTheme.mode === 'dark' ? alpha(colors.secondary, 0.14) : colors.accent

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  // ADDED: إضافة حساب جديد مباشرة (ADMIN/MANAGER): dialog + نموذج + حالة الإرسال
  const [addOpen, setAddOpen] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'USER', position: '' })
  const [addError, setAddError] = useState(null)
  const [addSubmitting, setAddSubmitting] = useState(false)

  // إعادة تعيين كلمة السر (ADMIN/MANAGER): dialog + حقول + حالة الإرسال
  const [passwordTarget, setPasswordTarget] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState(null)
  const [passwordSubmitting, setPasswordSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    getAllUsers()
      .then((data) => {
        setUsers(data)
        setError(null)
      })
      .catch(() => setError('فشل في جلب المستخدمين'))
      .finally(() => setLoading(false))
  }, [])

  const handleRoleChange = async (id, role) => {
    try {
      await updateUserRole(id, role)
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))
      setError(null)
    } catch (err) {
      setError(err?.response?.data?.message || 'فشل في تغيير الدور')
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(deleteTarget.id)
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id))
      setDeleteTarget(null)
      setError(null)
    } catch (err) {
      setError(err?.response?.data?.message || 'فشل في حذف الحساب')
      setDeleteTarget(null)
    }
  }

  const openAddDialog = () => {
    setAddForm({ name: '', email: '', password: '', role: 'USER', position: '' })
    setAddError(null)
    setAddOpen(true)
  }

  const closeAddDialog = () => {
    setAddOpen(false)
    setAddError(null)
  }

  const handleAddUser = async () => {
    if (!addForm.name.trim() || !addForm.email.trim()) {
      setAddError('الاسم والبريد الإلكتروني مطلوبان')
      return
    }
    if (addForm.password.length < 6) {
      setAddError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }
    // ADDED: عند اختيار دور "موظف" يجب تحديد مسمى وظيفي حقيقي (مؤذن، إمام وخطيب...) بدل مسمى عام لا معنى له
    if (addForm.role === 'EMPLOYEE' && !addForm.position) {
      setAddError('يرجى اختيار المسمى الوظيفي')
      return
    }
    setAddSubmitting(true)
    try {
      const created = await createUser(addForm)
      setUsers((prev) => [...prev, { ...created, isLinked: false }].sort((a, b) => a.name.localeCompare(b.name, 'ar')))
      setSuccessMessage(`تم إنشاء حساب ${created.name} بنجاح`)
      closeAddDialog()
    } catch (err) {
      const msg = err?.response?.data?.message
      setAddError(Array.isArray(msg) ? msg.join('، ') : msg || 'فشل في إنشاء الحساب')
    } finally {
      setAddSubmitting(false)
    }
  }

  const openPasswordDialog = (u) => {
    setPasswordTarget(u)
    setNewPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setPasswordError(null)
  }

  const closePasswordDialog = () => {
    setPasswordTarget(null)
    setPasswordError(null)
  }

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      setPasswordError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('كلمتا المرور غير متطابقتين')
      return
    }
    setPasswordSubmitting(true)
    try {
      await resetUserPassword(passwordTarget.id, newPassword)
      setSuccessMessage(`تم تغيير كلمة سر ${passwordTarget.name} بنجاح`)
      closePasswordDialog()
    } catch (err) {
      setPasswordError(err?.response?.data?.message || 'فشل في تغيير كلمة السر')
    } finally {
      setPasswordSubmitting(false)
    }
  }

  return (
    <div>
      <MainFun
        title="إدارة المستخدمين"
        description="تحديد دور كل حساب (خطيب/موظف/مستخدم عادي) وحذف الحسابات — لا يشمل حسابات مسؤولي النظام."
        addButton="إضافة مستخدم"
        onAddClick={openAddDialog}
        showAnnouncementButton={false}
        showAddButton={myRole === 'ADMIN' || myRole === 'MANAGER'}
      />

      {loading && (
        <Typography sx={{ p: 3, textAlign: 'center', color: colors.mutedText }}>جارٍ تحميل المستخدمين...</Typography>
      )}
      {error && !loading && (
        <Typography sx={{ p: 2, textAlign: 'center', color: colors.danger500 }}>{error}</Typography>
      )}

      {!loading && (
        <TableContainer component={Paper} sx={{ mt: 2.5, bgcolor: colors.surface, border: `1px solid ${colors.border}` }}>
          <Table dir="rtl">
            <TableHead>
              <TableRow>
                <TableCell align="right" sx={{ color: colors.mutedText, fontWeight: 700, bgcolor: headerBg }}>الاسم</TableCell>
                <TableCell align="right" sx={{ color: colors.mutedText, fontWeight: 700, bgcolor: headerBg }}>البريد الإلكتروني</TableCell>
                <TableCell align="right" sx={{ color: colors.mutedText, fontWeight: 700, bgcolor: headerBg }}>الدور</TableCell>
                <TableCell align="center" sx={{ color: colors.mutedText, fontWeight: 700, bgcolor: headerBg }}>إجراءات</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => {
                const isProtected = PROTECTED_ROLES.includes(u.role)
                const isSelf = u.id === me?.id
                return (
                  <TableRow key={u.id} hover>
                    <TableCell align="right" sx={{ color: colors.text, fontWeight: 600 }}>{u.name}</TableCell>
                    <TableCell align="right" sx={{ color: colors.mutedText }}>{u.email}</TableCell>
                    <TableCell align="right">
                      {isProtected ? (
                        <Chip label={roleLabels[u.role]} size="small" sx={{ bgcolor: colors.accent, color: colors.primary, fontWeight: 700 }} />
                      ) : (
                        <Select
                          size="small"
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          sx={{ minWidth: 140, fontSize: 13, bgcolor: colors.bgelem, color: colors.text }}
                          MenuProps={{ sx: { '& .MuiMenu-paper': { direction: 'rtl', bgcolor: colors.surface }, '& .MuiMenuItem-root': { justifyContent: 'flex-end', color: colors.text } } }}
                        >
                          {assignableRoles.map((r) => (
                            <MenuItem key={r.value} value={r.value} sx={{ justifyContent: 'flex-end' }}>{r.label}</MenuItem>
                          ))}
                        </Select>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      {isProtected ? (
                        <Typography sx={{ fontSize: 12, color: colors.mutedText }}>محمي</Typography>
                      ) : (
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          {/* تغيير كلمة السر: ADMIN/MANAGER، لا تظهر لحسابات مسؤولي النظام */}
                          {(myRole === 'ADMIN' || myRole === 'MANAGER') && (
                            <Tooltip title="تغيير كلمة السر">
                              <IconButton size="small" aria-label="reset-password" onClick={() => openPasswordDialog(u)}>
                                <LockResetIcon fontSize="small" sx={{ color: colors.secondary }} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {/* حذف الحساب: ADMIN فقط بالباك اند، ولا يظهر لحسابات مسؤولي النظام أو لحسابك الخاص */}
                          {myRole === 'ADMIN' && !isSelf && (
                            <Tooltip title="حذف الحساب">
                              <IconButton size="small" aria-label="delete" onClick={() => setDeleteTarget(u)}>
                                <DeleteIcon fontSize="small" sx={{ color: colors.danger500 }} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {!(myRole === 'ADMIN' || myRole === 'MANAGER') && (
                            <Typography sx={{ fontSize: 12, color: colors.mutedText }}>—</Typography>
                          )}
                        </Stack>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ============= Dialog إضافة مستخدم جديد ============= */}
      <Dialog open={addOpen} onClose={closeAddDialog} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, bgcolor: colors.surface, color: colors.text, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } }}>
        <DialogContent sx={{ pt: 4, pb: 2 }}>
          <Typography sx={{ fontWeight: 900, fontSize: 22, mb: 1, color: colors.text, textAlign: 'center' }}>إضافة مستخدم جديد</Typography>
          <Typography sx={{ color: colors.mutedText, fontSize: 14, lineHeight: 1.8, textAlign: 'center', mb: 3 }}>
            إنشاء حساب دخول جديد وتحديد دوره مباشرة (لا يشمل حسابات مسؤولي النظام).
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="الاسم"
              value={addForm.name}
              onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
              fullWidth
              dir="rtl"
            />
            <TextField
              label="البريد الإلكتروني"
              type="email"
              value={addForm.email}
              onChange={(e) => setAddForm((p) => ({ ...p, email: e.target.value }))}
              fullWidth
              dir="rtl"
            />
            <TextField
              label="كلمة السر"
              type="password"
              value={addForm.password}
              onChange={(e) => setAddForm((p) => ({ ...p, password: e.target.value }))}
              fullWidth
              dir="rtl"
            />
            <Select
              size="small"
              value={addForm.role}
              onChange={(e) => setAddForm((p) => ({ ...p, role: e.target.value, position: '' }))}
              fullWidth
              sx={{ bgcolor: colors.bgelem, color: colors.text }}
              MenuProps={{ sx: { '& .MuiMenu-paper': { direction: 'rtl', bgcolor: colors.surface }, '& .MuiMenuItem-root': { justifyContent: 'flex-end', color: colors.text } } }}
            >
              {assignableRoles.map((r) => (
                <MenuItem key={r.value} value={r.value} sx={{ justifyContent: 'flex-end' }}>{r.label}</MenuItem>
              ))}
            </Select>
            {/* ADDED: مسمى وظيفي حقيقي (مؤذن، إمام وخطيب...) عند اختيار دور "موظف" — بدونه كان يُنشأ سجل
                الموظف بمسمى عام ثابت "موظف" لا معنى له، بدل مسمى فعلي كأي موظف مُضاف من صفحة الموظفين مباشرة */}
            {addForm.role === 'EMPLOYEE' && (
              <Select
                size="small"
                displayEmpty
                value={addForm.position}
                onChange={(e) => setAddForm((p) => ({ ...p, position: e.target.value }))}
                fullWidth
                sx={{ bgcolor: colors.bgelem, color: colors.text }}
                MenuProps={{ sx: { '& .MuiMenu-paper': { direction: 'rtl', bgcolor: colors.surface }, '& .MuiMenuItem-root': { justifyContent: 'flex-end', color: colors.text } } }}
              >
                <MenuItem value="" disabled sx={{ justifyContent: 'flex-end' }}>اختر المسمى الوظيفي</MenuItem>
                {EMPLOYEE_JOB_TITLES.map((jt) => (
                  <MenuItem key={jt.value} value={jt.value} sx={{ justifyContent: 'flex-end' }}>{jt.label}</MenuItem>
                ))}
              </Select>
            )}
            {addError && (
              <Typography sx={{ color: colors.danger500, fontSize: 13, textAlign: 'center' }}>{addError}</Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 3, gap: 1, justifyContent: 'center' }}>
          <AppButton variant="contained" backgroundColor={colors.primary} textColor={colors.onPrimary} borderColor={colors.primary} onClick={handleAddUser} disabled={addSubmitting} sx={{ borderRadius: 2, height: 44, px: 3 }}>
            {addSubmitting ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
          </AppButton>
          <AppButton variant="outlined" backgroundColor="transparent" textColor={colors.text} borderColor={colors.border} onClick={closeAddDialog} sx={{ borderRadius: 2, height: 44, px: 3 }}>إلغاء</AppButton>
        </DialogActions>
      </Dialog>

      {/* ============= Dialog تأكيد حذف حساب ============= */}
      <Dialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, bgcolor: colors.surface, color: colors.text, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } }}>
        <DialogContent sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
          <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: colors.danger100, color: colors.danger500 }}>
            <DeleteIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: 22, mb: 1, color: colors.text }}>تأكيد حذف الحساب</Typography>
          <Typography sx={{ color: colors.mutedText, fontSize: 14, lineHeight: 1.8 }}>
            هل أنت متأكد من رغبتك في حذف حساب {deleteTarget?.name}؟ هذا الإجراء نهائي ولا يمكن التراجع عنه بعد التنفيذ.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 3, gap: 1, justifyContent: 'center' }}>
          <AppButton variant="contained" backgroundColor={colors.danger500} textColor="#FFFFFF" borderColor={colors.danger500} onClick={handleConfirmDelete} sx={{ borderRadius: 2, height: 44, px: 3 }}>نعم، حذف الحساب</AppButton>
          <AppButton variant="outlined" backgroundColor="transparent" textColor={colors.text} borderColor={colors.border} onClick={() => setDeleteTarget(null)} sx={{ borderRadius: 2, height: 44, px: 3 }}>تراجع عن الإجراء</AppButton>
        </DialogActions>
      </Dialog>

      {/* ============= Dialog تغيير كلمة السر ============= */}
      <Dialog open={Boolean(passwordTarget)} onClose={closePasswordDialog} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, bgcolor: colors.surface, color: colors.text, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } }}>
        <DialogContent sx={{ pt: 4, pb: 2 }}>
          <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: colors.accent, color: colors.secondary }}>
            <LockResetIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: 22, mb: 1, color: colors.text, textAlign: 'center' }}>تغيير كلمة السر</Typography>
          <Typography sx={{ color: colors.mutedText, fontSize: 14, lineHeight: 1.8, textAlign: 'center', mb: 3 }}>
            تعيين كلمة سر جديدة لحساب {passwordTarget?.name}. لن يُطلَب منك معرفة كلمة سره الحالية.
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="كلمة السر الجديدة"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              dir="rtl"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword((s) => !s)}>
                      {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="تأكيد كلمة السر"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              dir="rtl"
            />
            {passwordError && (
              <Typography sx={{ color: colors.danger500, fontSize: 13, textAlign: 'center' }}>{passwordError}</Typography>
            )}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 3, gap: 1, justifyContent: 'center' }}>
          <AppButton variant="contained" backgroundColor={colors.primary} textColor={colors.onPrimary} borderColor={colors.primary} onClick={handleResetPassword} disabled={passwordSubmitting} sx={{ borderRadius: 2, height: 44, px: 3 }}>
            {passwordSubmitting ? 'جارٍ الحفظ...' : 'حفظ كلمة السر'}
          </AppButton>
          <AppButton variant="outlined" backgroundColor="transparent" textColor={colors.text} borderColor={colors.border} onClick={closePasswordDialog} sx={{ borderRadius: 2, height: 44, px: 3 }}>إلغاء</AppButton>
        </DialogActions>
      </Dialog>

      <Snackbar open={Boolean(successMessage)} autoHideDuration={4000} onClose={() => setSuccessMessage(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSuccessMessage(null)} severity="success" variant="filled" sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}
