import React from 'react' // ADDED: React import for JSX rendering
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material' // ADDED: MUI components for dialog layout and form fields
import CloseIcon from '@mui/icons-material/Close' // ADDED: Close icon for dialog header
import DeleteIcon from '@mui/icons-material/Delete' // ADDED: Delete icon for delete confirmation dialog
import AppButton from '../common/AppButton' // ADDED: Reusable custom button component
import SearchableSelect from '../common/SearchableSelect' // ADDED: اختيار حساب الربط بالبحث عن الاسم بدل قائمة منسدلة طويلة
import { useTheme } from '../../theme/themeContext' // ADDED: Theme context for dynamic styling
import { EMPLOYEE_JOB_TITLES as jobTitles } from '../../constants/jobTitles' // MODIFIED: مصدر مشترك مع صفحة إدارة المستخدمين بدل نسخة محلية منفصلة

// ADDED: New props for delete functionality: deleteOpen, setDeleteOpen, selectedRow, handleConfirmDelete
export default function EmployeesDialogs({
  addOpen, setAddOpen, employeeForm, setEmployeeForm, handleAddSubmit,
  deleteOpen, setDeleteOpen, selectedRow, handleConfirmDelete, // ADDED: Destructure new delete props
  detailsOpen, setDetailsOpen, // ADDED: ديالوج "عرض التفاصيل" — كان الرابط بالجدول يظهر بلا أي وظيفة
  mosques = [], // ADDED: قائمة المساجد لاختيار المسجد الذي يعمل به الموظف
  linkableUsers = [], // ADDED: حسابات الدخول غير المرتبطة — لربط الموظف الجديد بحسابه
}) {
  const { activeTheme } = useTheme()
  const { colors, mode } = activeTheme
  const isDark = mode === 'dark'

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: colors.bgelem,
      borderRadius: 2,
      height: 48,
      '& fieldset': { border: 'none' },
      '&:hover fieldset': { border: 'none' },
      '&.Mui-focused fieldset': { border: 'none' },
    },
    '& input': {
      textAlign: 'right',
      fontFamily: '"IBM Plex Sans Arabic", sans-serif',
      fontWeight: 400,
      fontSize: 16,
      color: colors.text,
      '&::placeholder': { color: colors.mutedText, opacity: 1 },
    },
  }

  return (
    <>
      {/* ============= Dialog إضافة موظف جديد ============= */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: colors.surface,
            color: colors.text,
            maxWidth: 672,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: `1px solid ${colors.border}`,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, pt: 4, pb: 0, mb: 3 }}>
          <IconButton onClick={() => setAddOpen(false)} sx={{ color: colors.mutedText, p: 0, '& svg': { fontSize: 22 } }}>
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', borderRight: `4px solid ${colors.secondary}`, pr: 1.5 }}>
            <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 700, fontSize: 20, color: isDark ? colors.secondary : colors.primary, lineHeight: '28px' }}>
              إضافة كادر جديد
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 4, pt: 3, pb: 0, overflow: 'visible' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, direction: 'rtl' }}>
            <Stack spacing={3}>
              {/* تم تعديل الحقول لتتوافق مع Backend API (firstName, lastName, position) */}
              <Stack spacing={0.5}>
                <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>
                  الاسم الأول
                </Typography>
                <TextField value={employeeForm.firstName} onChange={(e) => setEmployeeForm((prev) => ({ ...prev, firstName: e.target.value }))} placeholder="أدخل الاسم الأول" fullWidth sx={inputSx} />
              </Stack>
              <Stack spacing={0.5}>
                <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>
                  الاسم الأخير
                </Typography>
                <TextField value={employeeForm.lastName} onChange={(e) => setEmployeeForm((prev) => ({ ...prev, lastName: e.target.value }))} placeholder="أدخل الاسم الأخير" fullWidth sx={inputSx} />
              </Stack>
            </Stack>
            <Stack spacing={3}>
              <Stack spacing={0.5}>
                <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>
                  المسمى الوظيفي
                </Typography>
                <TextField
                  select value={employeeForm.position} onChange={(e) => setEmployeeForm((prev) => ({ ...prev, position: e.target.value }))} fullWidth
                  SelectProps={{ IconComponent: () => <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 8 }}><path d="M1 1.5L6 6.5L11 1.5" stroke={colors.mutedText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> }}
                  sx={{
                    '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } },
                    '& .MuiSelect-select': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, py: 1.5 },
                  }}
                  SelectDisplayProps={{ style: { direction: 'rtl' } }}
                  MenuProps={{ sx: { '& .MuiMenu-paper': { direction: 'rtl', bgcolor: colors.surface }, '& .MuiMenuItem-root': { justifyContent: 'flex-end', fontFamily: '"IBM Plex Sans Arabic", sans-serif', color: colors.text } } }}
                >
                  {jobTitles.map((option) => (<MenuItem key={option.value} value={option.value} sx={{ justifyContent: 'flex-end' }}>{option.label}</MenuItem>))}
                </TextField>
              </Stack>
              {/* ADDED: المسجد الذي يعمل به الموظف — تُستخدم لتوجيه إشعارات المسجد (إعلانات/صيانة) لموظفيه */}
              <Stack spacing={0.5}>
                <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>
                  المسجد
                </Typography>
                <TextField
                  select value={employeeForm.mosqueId} onChange={(e) => setEmployeeForm((prev) => ({ ...prev, mosqueId: e.target.value }))} fullWidth
                  SelectProps={{ IconComponent: () => <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 8 }}><path d="M1 1.5L6 6.5L11 1.5" stroke={colors.mutedText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> }}
                  sx={{
                    '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } },
                    '& .MuiSelect-select': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, py: 1.5 },
                  }}
                  SelectDisplayProps={{ style: { direction: 'rtl' } }}
                  MenuProps={{ sx: { '& .MuiMenu-paper': { direction: 'rtl', bgcolor: colors.surface }, '& .MuiMenuItem-root': { justifyContent: 'flex-end', fontFamily: '"IBM Plex Sans Arabic", sans-serif', color: colors.text } } }}
                >
                  <MenuItem value="" sx={{ justifyContent: 'flex-end' }}>بدون مسجد</MenuItem>
                  {mosques.map((mosque) => (<MenuItem key={mosque.id} value={mosque.id} sx={{ justifyContent: 'flex-end' }}>{mosque.name}</MenuItem>))}
                </TextField>
              </Stack>
              <Stack spacing={0.5}>
                <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>
                  تاريخ التعيين
                </Typography>
                <TextField
                  type="date" value={employeeForm.hireDate} onChange={(e) => setEmployeeForm((prev) => ({ ...prev, hireDate: e.target.value }))} fullWidth InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } },
                    '& input': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, '&::-webkit-calendar-picker-indicator': { marginLeft: 0, marginRight: 'auto', filter: isDark ? 'invert(0.8)' : 'none' } },
                  }}
                />
              </Stack>
              {/* ADDED: ربط اختياري بحساب دخول موجود — يفعّل إشعاراته الشخصية عند إسناد تذكرة صيانة له */}
              <Stack spacing={0.5}>
                <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>
                  ربط بحساب دخول (اختياري)
                </Typography>
                <SearchableSelect
                  options={linkableUsers}
                  value={employeeForm.userId}
                  onChange={(id) => setEmployeeForm((prev) => ({ ...prev, userId: id }))}
                  getOptionSecondary={(u) => u.email}
                  placeholder="ابحث عن حساب بالاسم... (اختياري)"
                  noOptionsText="لا يوجد حساب مطابق"
                />
              </Stack>
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 4, pt: 1, pb: 4, gap: 1.5, justifyContent: 'flex-start', flexDirection: 'row-reverse' }}>
          <AppButton variant="contained" backgroundColor="linear-gradient(135deg, #C5A059 0%, #9E7E43 100%)" textColor="#FFFFFF" borderColor="transparent" onClick={handleAddSubmit}
            sx={{ background: 'linear-gradient(135deg, #C5A059 0%, #9E7E43 100%) !important', borderRadius: 2, height: 48, px: 4 }}>
            تأكيد الإضافة
          </AppButton>
          <AppButton variant="contained" backgroundColor={colors.btn} textColor={colors.text} borderColor="transparent" onClick={() => setAddOpen(false)}
            sx={{ borderRadius: 2, height: 48, px: 3, '&:hover': { backgroundColor: colors.border } }}>
            إلغاء
          </AppButton>
        </DialogActions>
      </Dialog>

      {/* ============= ADDED: Dialog عرض تفاصيل الموظف ============= */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: colors.surface, color: colors.text, maxWidth: 560, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, pt: 4, pb: 0, mb: 2 }}>
          <IconButton onClick={() => setDetailsOpen(false)} sx={{ color: colors.mutedText, p: 0, '& svg': { fontSize: 22 } }}><CloseIcon /></IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', borderRight: `4px solid ${colors.secondary}`, pr: 1.5 }}>
            <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 700, fontSize: 20, color: isDark ? colors.secondary : colors.primary, lineHeight: '28px' }}>تفاصيل الموظف</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 4, pt: 2, pb: 3 }}>
          {selectedRow ? (
            <Stack spacing={2.5} sx={{ direction: 'rtl' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, p: 2.5, borderRadius: 2, bgcolor: colors.bgelem }}>
                <Box><Typography sx={{ fontSize: 12, color: colors.mutedText, mb: 0.5 }}>الاسم</Typography><Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.text }}>{selectedRow.name || '—'}</Typography></Box>
                <Box><Typography sx={{ fontSize: 12, color: colors.mutedText, mb: 0.5 }}>الوظيفة</Typography><Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.primary }}>{selectedRow.job || '—'}</Typography></Box>
                <Box><Typography sx={{ fontSize: 12, color: colors.mutedText, mb: 0.5 }}>المسجد المرتبط</Typography><Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{selectedRow.mosque || '—'}</Typography></Box>
                <Box><Typography sx={{ fontSize: 12, color: colors.mutedText, mb: 0.5 }}>الحالة</Typography><Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{selectedRow.status || '—'}</Typography></Box>
                <Box><Typography sx={{ fontSize: 12, color: colors.mutedText, mb: 0.5 }}>تاريخ التعيين</Typography><Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{selectedRow.hiredDate || '—'}</Typography></Box>
              </Box>
            </Stack>
          ) : <Typography sx={{ textAlign: 'center', color: colors.mutedText, py: 4 }}>لا توجد تفاصيل متاحة</Typography>}
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4, justifyContent: 'center' }}>
          <AppButton variant="outlined" backgroundColor="transparent" textColor={colors.text} borderColor={colors.border} onClick={() => setDetailsOpen(false)} sx={{ borderRadius: 2, height: 44, px: 4 }}>إغلاق</AppButton>
        </DialogActions>
      </Dialog>

      {/* ============= ADDED: Dialog حذف موظف ============= */}
      {/* ADDED: Delete confirmation dialog that appears when user clicks delete on an employee row */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, bgcolor: colors.surface, color: colors.text, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } }}>
        <DialogContent sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
          <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: colors.danger100, color: colors.danger500 }}>
            <DeleteIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: 22, mb: 1, color: colors.text }}>تأكيد حذف السجل</Typography>
          <Typography sx={{ color: colors.mutedText, fontSize: 14, lineHeight: 1.8 }}>
            هل أنت متأكد من رغبتك في حذف ملف {selectedRow?.name || 'هذا الموظف'}؟ هذا الإجراء نهائي ولا يمكن التراجع عنه بعد التنفيذ.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 3, gap: 1, justifyContent: 'center' }}>
          <AppButton variant="contained" backgroundColor={colors.danger500} textColor="#FFFFFF" borderColor={colors.danger500} onClick={handleConfirmDelete}
            sx={{ borderRadius: 2, height: 44, px: 3 }}>نعم، حذف السجل</AppButton>
          <AppButton variant="outlined" backgroundColor="transparent" textColor={colors.text} borderColor={colors.border} onClick={() => setDeleteOpen(false)}
            sx={{ borderRadius: 2, height: 44, px: 3 }}>تراجع عن الإجراء</AppButton>
        </DialogActions>
      </Dialog>
    </>
  )
}
