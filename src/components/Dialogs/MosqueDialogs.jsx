import React from 'react'
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
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AppButton from '../common/AppButton'
import { useTheme } from '../../theme/themeContext'

/**
 * Dialog لإضافة مسجد جديد
 * ✅ يتلقى بيانات النموذج و دوال الاستدعاء من الصفحة الأب (Mosque.jsx)
 * ✅ الصفحة الأب تتصل بـ API عبر createMosque() من mosqueService
 */
export default function MosqueDialogs({
  addOpen, setAddOpen, mosqueForm, setMosqueForm,
  handleAddSubmit, assignOpen, setAssignOpen,
  selectedRow, selectedPreacherId, setSelectedPreacherId, filteredPreachers,
  handleConfirmAssign, deleteOpen, setDeleteOpen, handleConfirmDelete,
  snackbarOpen, snackbarMessage
}) {
  const { activeTheme } = useTheme()
  const { colors, mode } = activeTheme
  const isDark = mode === 'dark'

  const inputSx = {
    '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } },
    '& input': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, '&::placeholder': { color: colors.mutedText, opacity: 1 } },
  }

  return (
    <>
      {/* ============= Dialog إضافة مسجد ============= */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: colors.surface, color: colors.text, maxWidth: 672, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: `1px solid ${colors.border}` } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, pt: 4, pb: 0, mb: 3 }}>
          <IconButton onClick={() => setAddOpen(false)} sx={{ color: colors.mutedText, p: 0, '& svg': { fontSize: 22 } }}><CloseIcon /></IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', borderRight: `4px solid ${colors.secondary}`, pr: 1.5 }}>
            <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 700, fontSize: 20, color: isDark ? colors.secondary : colors.primary, lineHeight: '28px' }}>إضافة مسجد جديد</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 4, pt: 3, pb: 0, overflow: 'visible' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, direction: 'rtl' }}>
            <Stack spacing={3}>
              <Stack spacing={0.5}>
                <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>اسم المسجد</Typography>
                <TextField value={mosqueForm.name} onChange={(e) => setMosqueForm((p) => ({ ...p, name: e.target.value }))} placeholder="أدخل اسم المسجد" fullWidth sx={inputSx} />
              </Stack>
              <Stack spacing={0.5}>
                <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>المدينة</Typography>
                <TextField value={mosqueForm.city} onChange={(e) => setMosqueForm((p) => ({ ...p, city: e.target.value }))} placeholder="مثال: الرياض" fullWidth sx={inputSx} />
              </Stack>
            </Stack>
            <Stack spacing={3}>
              <Stack spacing={0.5}>
                <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>العنوان</Typography>
                <TextField value={mosqueForm.address} onChange={(e) => setMosqueForm((p) => ({ ...p, address: e.target.value }))} placeholder="الحي / الشارع" fullWidth sx={inputSx} />
              </Stack>
              <Stack spacing={0.5}>
                <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>رقم الهاتف</Typography>
                <TextField value={mosqueForm.phone} onChange={(e) => setMosqueForm((p) => ({ ...p, phone: e.target.value }))} placeholder="05xxxxxxxx" fullWidth sx={inputSx} />
              </Stack>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pt: 1, pb: 4, gap: 1.5, justifyContent: 'flex-start', flexDirection: 'row-reverse' }}>
          <AppButton variant="contained" backgroundColor="linear-gradient(135deg, #C5A059 0%, #9E7E43 100%)" textColor="#FFFFFF" borderColor="transparent" onClick={(e) => { e?.preventDefault(); handleAddSubmit?.(e); setAddOpen(false); }} sx={{ background: 'linear-gradient(135deg, #C5A059 0%, #9E7E43 100%) !important', borderRadius: 2, height: 48, px: 4 }}>حفظ البيانات</AppButton>
          <AppButton variant="contained" backgroundColor={colors.btn} textColor={colors.text} borderColor="transparent" onClick={() => setAddOpen(false)} sx={{ borderRadius: 2, height: 48, px: 3, '&:hover': { backgroundColor: colors.border } }}>إلغاء</AppButton>
        </DialogActions>
      </Dialog>

      {/* ============= Dialog تعيين خطيب لمسجد ============= */}
      <Dialog open={assignOpen} onClose={() => setAssignOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, bgcolor: colors.surface, color: colors.text, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } }}>
        <DialogContent sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
          <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: colors.bgelem, color: isDark ? colors.secondary : colors.primary }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: 22, mb: 1, color: colors.text }}>تعيين خطيب</Typography>
          <Typography sx={{ color: colors.mutedText, fontSize: 14, lineHeight: 1.8 }}>اختر الخطيب من القائمة لتكليفه بالمسجد</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 3, gap: 1, justifyContent: 'center', flexDirection: 'column' }}>
          <TextField select value={selectedPreacherId} onChange={(e) => setSelectedPreacherId(e.target.value)} fullWidth
            SelectProps={{ IconComponent: () => <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 8 }}><path d="M1 1.5L6 6.5L11 1.5" stroke={colors.mutedText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> }}
            sx={{ '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } }, '& .MuiSelect-select': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, py: 1.5 } }}
            SelectDisplayProps={{ style: { direction: 'rtl' } }}
            MenuProps={{ sx: { '& .MuiMenu-paper': { direction: 'rtl', bgcolor: colors.surface }, '& .MuiMenuItem-root': { justifyContent: 'flex-end', fontFamily: '"IBM Plex Sans Arabic", sans-serif', color: colors.text } } }}>
            {filteredPreachers.map((preacher) => (<MenuItem key={preacher.id} value={preacher.id} sx={{ justifyContent: 'flex-end' }}>{preacher.name} - {preacher.role}</MenuItem>))}
          </TextField>
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            <AppButton variant="contained" backgroundColor="linear-gradient(135deg, #C5A059 0%, #9E7E43 100%)" textColor="#FFFFFF" borderColor="transparent" onClick={handleConfirmAssign} sx={{ background: 'linear-gradient(135deg, #C5A059 0%, #9E7E43 100%) !important', borderRadius: 2, height: 44, px: 3, flex: 1 }}>تأكيد التعيين</AppButton>
            <AppButton variant="outlined" backgroundColor="transparent" textColor={colors.text} borderColor={colors.border} onClick={() => setAssignOpen(false)} sx={{ borderRadius: 2, height: 44, px: 3 }}>تراجع</AppButton>
          </Box>
        </DialogActions>
      </Dialog>

      {/* ============= Dialog حذف مسجد ============= */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, bgcolor: colors.surface, color: colors.text, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } }}>
        <DialogContent sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
          <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: '#FFF3F3', color: '#DC2626' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: 22, mb: 1, color: colors.text }}>تأكيد الحذف</Typography>
          <Typography sx={{ color: colors.mutedText, fontSize: 14, lineHeight: 1.8 }}>هل أنت متأكد من حذف <strong>{selectedRow?.name || 'المسجد'}</strong>؟</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 3, gap: 1, justifyContent: 'center' }}>
          <AppButton variant="contained" backgroundColor="#DC2626" textColor="#FFFFFF" borderColor="transparent" onClick={handleConfirmDelete} sx={{ borderRadius: 2, height: 44, px: 3 }}>نعم، احذف</AppButton>
          <AppButton variant="outlined" backgroundColor="transparent" textColor={colors.text} borderColor={colors.border} onClick={() => setDeleteOpen(false)} sx={{ borderRadius: 2, height: 44, px: 3 }}>تراجع</AppButton>
        </DialogActions>
      </Dialog>

      {/* ============= Toast Notification ============= */}
      {snackbarOpen && (
        <Box sx={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', bgcolor: colors.primary, color: '#fff', px: 4, py: 2, borderRadius: 3, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 9999 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontSize: 14 }}>{snackbarMessage}</Typography>
        </Box>
      )}
    </>
  )
}
