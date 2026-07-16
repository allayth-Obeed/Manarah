import React from 'react'
import {
  Alert, Avatar, Box, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, MenuItem, Snackbar, Stack, TextField, Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonIcon from '@mui/icons-material/Person'
import AppButton from '../common/AppButton'
import { useTheme } from '../../theme/themeContext'

const PREACHERS = [
  { id: 1, name: 'الشيخ عمر الرواف', role: 'إمام وخطيب', mosque: 'جامع الهدى', badge: 'متميز' },
  { id: 2, name: 'الشيخ إبراهيم الماجد', role: 'خطيب معتمد', mosque: 'مسجد التقوى', badge: 'جاهز للتعيين' },
  { id: 3, name: 'الشيخ يوسف عبدالباري', role: 'إمام جامع', mosque: 'جامع النور', badge: 'احتياطي' },
  { id: 4, name: 'الشيخ أحمد عبدالرزاق', role: 'خطيب جمعة', mosque: 'جامع الرحمة', badge: 'متاح الآن' },
]

export default function MosqueDialogs({
  addOpen, setAddOpen, mosqueForm, setMosqueForm, handleAddSubmit,
  assignOpen, setAssignOpen, searchTerm, setSearchTerm, selectedRow,
  selectedPreacherId, setSelectedPreacherId, filteredPreachers: externalFilteredPreachers,
  handleConfirmAssign, deleteOpen, setDeleteOpen, handleConfirmDelete,
  snackbarOpen, setSnackbarOpen, snackbarMessage,
}) {
  const { activeTheme } = useTheme()
  const { colors, mode } = activeTheme
  const isDark = mode === 'dark'

  const filteredPreachers = externalFilteredPreachers ?? PREACHERS.filter((item) => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return true
    return [item.name, item.role, item.mosque, item.badge].some((f) => String(f).toLowerCase().includes(query))
  })

  const inputSx = {
    '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } },
    '& input': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, '&::placeholder': { color: colors.mutedText, opacity: 1 } },
  }

  return (
    <>
      {/* ── Add Mosque ── */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1, bgcolor: colors.surface, color: colors.text } }}>
        <DialogTitle sx={{ fontWeight: 800, color: isDark ? colors.secondary : colors.primary, pr: 6, textAlign: 'right' }}>
          تسجيل مسجد جديد
          <IconButton onClick={() => setAddOpen(false)} sx={{ position: 'absolute', left: 12, top: 12, color: colors.mutedText }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: colors.border }}>
          <Box component="form" onSubmit={handleAddSubmit} sx={{ display: 'grid', gap: 2 }}>
            <TextField label="اسم المسجد" value={mosqueForm.name} onChange={(e) => setMosqueForm((p) => ({ ...p, name: e.target.value }))} placeholder="مثال: جامع الفاروق" fullWidth InputLabelProps={{ sx: { color: colors.mutedText } }} sx={inputSx} />
            <TextField label="الموقع" value={mosqueForm.location} onChange={(e) => setMosqueForm((p) => ({ ...p, location: e.target.value }))} placeholder="مثال: حي الزهراء" fullWidth InputLabelProps={{ sx: { color: colors.mutedText } }} sx={inputSx} />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField label="اسم المسجد/الإمام" value={mosqueForm.imam} onChange={(e) => setMosqueForm((p) => ({ ...p, imam: e.target.value }))} placeholder="مثال: الشيخ ..." fullWidth InputLabelProps={{ sx: { color: colors.mutedText } }} sx={inputSx} />
              <TextField label="السعة" type="number" value={mosqueForm.capacity} onChange={(e) => setMosqueForm((p) => ({ ...p, capacity: e.target.value }))} placeholder="0" fullWidth InputLabelProps={{ sx: { color: colors.mutedText } }} sx={inputSx} />
            </Stack>
            <TextField
              select label="الحالة" value={mosqueForm.status} onChange={(e) => setMosqueForm((p) => ({ ...p, status: e.target.value }))} fullWidth InputLabelProps={{ sx: { color: colors.mutedText } }}
              SelectProps={{ IconComponent: () => <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 8 }}><path d="M1 1.5L6 6.5L11 1.5" stroke={colors.mutedText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } }, '& .MuiSelect-select': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, py: 1.5 } }}
              SelectDisplayProps={{ style: { direction: 'rtl' } }}
              MenuProps={{ sx: { '& .MuiMenu-paper': { direction: 'rtl', bgcolor: colors.surface }, '& .MuiMenuItem-root': { justifyContent: 'flex-end', fontFamily: '"IBM Plex Sans Arabic", sans-serif', color: colors.text } } }}
            >
              <MenuItem value="نشط">نشط</MenuItem>
              <MenuItem value="تحت الصيانة">تحت الصيانة</MenuItem>
              <MenuItem value="إجازة">إجازة</MenuItem>
            </TextField>
            <TextField
              label="ملاحظات إضافية (اختياري)" value={mosqueForm.notes} onChange={(e) => setMosqueForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="أدخل أي ملاحظات" multiline minRows={4} fullWidth InputLabelProps={{ sx: { color: colors.mutedText } }}
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } }, '& textarea': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, '&::placeholder': { color: colors.mutedText, opacity: 1 } } }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1, justifyContent: 'space-between' }}>
          <AppButton variant="outlined" backgroundColor="transparent" textColor={colors.text} borderColor={colors.border} onClick={() => setAddOpen(false)}>إلغاء</AppButton>
          <AppButton variant="contained" backgroundColor={colors.primary} textColor={colors.onPrimary} borderColor={colors.primary} onClick={handleAddSubmit}>حفظ البيانات</AppButton>
        </DialogActions>
      </Dialog>

      {/* ── Assign Preacher ── */}
      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} maxWidth="md" fullWidth
        PaperProps={{ sx: { borderRadius: 4, bgcolor: colors.surface, color: colors.text } }}>
        <DialogTitle sx={{ fontWeight: 800, color: isDark ? colors.secondary : colors.primary, pr: 6, textAlign: 'right' }}>
          تعيين خطيب للجمعة
          <IconButton onClick={() => setAssignOpen(false)} sx={{ position: 'absolute', left: 12, top: 12, color: colors.mutedText }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: colors.border }}>
          <Stack spacing={2}>
            <TextField value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="بحث عن موظف..." fullWidth
              sx={{ '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } }, '& input': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', color: colors.text, '&::placeholder': { color: colors.mutedText, opacity: 1 } } }} />
            <Typography sx={{ color: colors.mutedText, fontSize: 13 }}>اختر من القائمة لتعيين الخطيب للمسجد {selectedRow?.mosque || ''}</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 1.5 }}>
              {filteredPreachers.map((item) => {
                const sel = item.id === selectedPreacherId
                return (
                  <Card key={item.id} onClick={() => setSelectedPreacherId(item.id)} sx={{ cursor: 'pointer', borderRadius: 3, border: `1px solid ${sel ? colors.primary : colors.border}`, boxShadow: sel ? '0 10px 24px rgba(0,0,0,0.08)' : 'none', bgcolor: sel ? (isDark ? 'rgba(6,95,70,0.15)' : 'rgba(6,95,70,0.04)') : colors.surface }}>
                    <CardContent sx={{ p: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1.4} alignItems="center">
                          <Avatar sx={{ bgcolor: colors.bgelem, color: colors.primary }}><PersonIcon /></Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 800, color: colors.text }}>{item.name}</Typography>
                            <Typography sx={{ fontSize: 12, color: colors.mutedText }}>{item.role}</Typography>
                            <Typography sx={{ fontSize: 11, color: colors.mutedText }}>{item.mosque}</Typography>
                          </Box>
                        </Stack>
                        <Stack spacing={0.5} alignItems="flex-start">
                          <Box sx={{ width: 18, height: 18, borderRadius: '50%', border: `2px solid ${sel ? colors.primary : colors.border}`, bgcolor: sel ? colors.primary : 'transparent' }} />
                          <Typography sx={{ fontSize: 11, color: colors.primary }}>{item.badge}</Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                )
              })}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <AppButton variant="outlined" backgroundColor="transparent" textColor={colors.text} borderColor={colors.border} onClick={() => setAssignOpen(false)}>إغلاق القائمة</AppButton>
          <AppButton variant="contained" backgroundColor={colors.primary} textColor={colors.onPrimary} borderColor={colors.primary} onClick={handleConfirmAssign}>تأكيد التعيين</AppButton>
        </DialogActions>
      </Dialog>

      {/* ── Delete ── */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, bgcolor: colors.surface, color: colors.text } }}>
        <DialogContent sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
          <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: colors.danger100, color: colors.danger500 }}><DeleteIcon sx={{ fontSize: 32 }} /></Box>
          <Typography sx={{ fontWeight: 900, fontSize: 22, mb: 1, color: colors.text }}>تأكيد حذف السجل</Typography>
          <Typography sx={{ color: colors.mutedText, fontSize: 14, lineHeight: 1.8 }}>هل أنت متأكد من رغبتك في حذف ملف {selectedRow?.mosque || 'هذا المسجد'}؟ هذا الإجراء نهائي ولا يمكن التراجع عنه بعد التنفيذ.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 3, gap: 1, justifyContent: 'center' }}>
          <AppButton variant="contained" backgroundColor={colors.danger500} textColor="#FFFFFF" borderColor={colors.danger500} onClick={handleConfirmDelete}>نعم، حذف السجل</AppButton>
          <AppButton variant="outlined" backgroundColor="transparent" textColor={colors.text} borderColor={colors.border} onClick={() => setDeleteOpen(false)}>تراجع عن الإجراء</AppButton>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={2800} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" variant="filled" sx={{ alignItems: 'center', minWidth: 280, boxShadow: 3 }}>{snackbarMessage}</Alert>
      </Snackbar>
    </>
  )
}
