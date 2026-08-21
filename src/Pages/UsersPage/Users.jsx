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
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import MainFun from '../DashboardPage/MainFun'
import AppButton from '../../components/common/AppButton'
import { useTheme } from '../../theme/themeContext'
import { useCurrentUser } from '../../context/userContext'
import { getAllUsers, updateUserRole, deleteUser } from '../../services/userService'

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

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

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

  return (
    <div>
      <MainFun
        title="إدارة المستخدمين"
        description="تحديد دور كل حساب (خطيب/موظف/مستخدم عادي) وحذف الحسابات — لا يشمل حسابات مسؤولي النظام."
        showAnnouncementButton={false}
        showAddButton={false}
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
                <TableCell align="right" sx={{ color: colors.mutedText, fontWeight: 700 }}>الاسم</TableCell>
                <TableCell align="right" sx={{ color: colors.mutedText, fontWeight: 700 }}>البريد الإلكتروني</TableCell>
                <TableCell align="right" sx={{ color: colors.mutedText, fontWeight: 700 }}>الدور</TableCell>
                <TableCell align="center" sx={{ color: colors.mutedText, fontWeight: 700 }}>إجراءات</TableCell>
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
                      {/* حذف الحساب: ADMIN فقط بالباك اند، ولا يظهر لحسابات مسؤولي النظام أو لحسابك الخاص */}
                      {myRole === 'ADMIN' && !isProtected && !isSelf ? (
                        <IconButton size="small" aria-label="delete" onClick={() => setDeleteTarget(u)}>
                          <DeleteIcon fontSize="small" sx={{ color: colors.mutedText }} />
                        </IconButton>
                      ) : (
                        <Typography sx={{ fontSize: 12, color: colors.mutedText }}>—</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

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
    </div>
  )
}
