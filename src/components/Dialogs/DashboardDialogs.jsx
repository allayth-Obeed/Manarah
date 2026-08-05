import React from 'react'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AppButton from '../common/AppButton'
import { useTheme } from '../../theme/themeContext'

const mosqueStatusOptions = [
  { value: 'نشط', label: 'نشط' },
  { value: 'تحت الصيانة', label: 'تحت الصيانة' },
]

export function AddMosqueDialog({ open, setOpen, form, setForm, onSubmit }) {
  const { activeTheme } = useTheme()
  const { colors, mode } = activeTheme
  const isDark = mode === 'dark'

  const inputSx = {
    '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } },
    '& input': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, '&::placeholder': { color: colors.mutedText, opacity: 1 } },
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3, bgcolor: colors.surface, color: colors.text, maxWidth: 672, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: `1px solid ${colors.border}` } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, pt: 4, pb: 0, mb: 3 }}>
        <IconButton onClick={() => setOpen(false)} sx={{ color: colors.mutedText, p: 0, '& svg': { fontSize: 22 } }}><CloseIcon /></IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', borderRight: `4px solid ${colors.secondary}`, pr: 1.5 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 700, fontSize: 20, color: isDark ? colors.secondary : colors.primary, lineHeight: '28px' }}>إضافة مسجد جديد</Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 4, pt: 3, pb: 0, overflow: 'visible' }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, direction: 'rtl' }}>
          <Stack spacing={3}>
            <Stack spacing={0.5}>
              <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>اسم المسجد</Typography>
              <TextField value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="أدخل اسم المسجد" fullWidth sx={inputSx} />
            </Stack>
            <Stack spacing={0.5}>
              <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>الحي / المنطقة</Typography>
              <TextField value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="مثال: حي النور" fullWidth sx={inputSx} />
            </Stack>
          </Stack>
          <Stack spacing={3}>
            <Stack spacing={0.5}>
              <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>السعة</Typography>
              <TextField value={form.capacity} onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))} placeholder="0" type="number" fullWidth sx={inputSx} />
            </Stack>
            <Stack spacing={0.5}>
              <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>الحالة</Typography>
              <TextField select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} fullWidth
                SelectProps={{ IconComponent: () => <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 8 }}><path d="M1 1.5L6 6.5L11 1.5" stroke={colors.mutedText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> }}
                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } }, '& .MuiSelect-select': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, py: 1.5 } }}
                SelectDisplayProps={{ style: { direction: 'rtl' } }}
                MenuProps={{ sx: { '& .MuiMenu-paper': { direction: 'rtl', bgcolor: colors.surface }, '& .MuiMenuItem-root': { justifyContent: 'flex-end', fontFamily: '"IBM Plex Sans Arabic", sans-serif', color: colors.text } } }}>
                {mosqueStatusOptions.map((o) => <MenuItem key={o.value} value={o.value} sx={{ justifyContent: 'flex-end' }}>{o.label}</MenuItem>)}
              </TextField>
            </Stack>
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 4, pt: 1, pb: 4, gap: 1.5, justifyContent: 'flex-start', flexDirection: 'row-reverse' }}>
        <AppButton variant="contained" backgroundColor="linear-gradient(135deg, #C5A059 0%, #9E7E43 100%)" textColor="#FFFFFF" borderColor="transparent" onClick={(e) => { e?.preventDefault(); onSubmit?.(form); setOpen(false); }} sx={{ background: 'linear-gradient(135deg, #C5A059 0%, #9E7E43 100%) !important', borderRadius: 2, height: 48, px: 4 }}>حفظ البيانات</AppButton>
        <AppButton variant="contained" backgroundColor={colors.btn} textColor={colors.text} borderColor="transparent" onClick={() => setOpen(false)} sx={{ borderRadius: 2, height: 48, px: 3, '&:hover': { backgroundColor: colors.border } }}>إلغاء</AppButton>
      </DialogActions>
    </Dialog>
  )
}

export function AddAnnouncementDialog({ open, setOpen, form, setForm, onSubmit, mosques = [] }) {
  const { activeTheme } = useTheme()
  const { colors, mode } = activeTheme
  const isDark = mode === 'dark'

  const inputSx = {
    '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } },
    '& input': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, '&::placeholder': { color: colors.mutedText, opacity: 1 } },
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3, bgcolor: colors.surface, color: colors.text, maxWidth: 672, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: `1px solid ${colors.border}` } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, pt: 4, pb: 0, mb: 3 }}>
        <IconButton onClick={() => setOpen(false)} sx={{ color: colors.mutedText, p: 0, '& svg': { fontSize: 22 } }}><CloseIcon /></IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', borderRight: `4px solid ${colors.secondary}`, pr: 1.5 }}>
          <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 700, fontSize: 20, color: isDark ? colors.secondary : colors.primary, lineHeight: '28px' }}>إعلان جديد</Typography>
        </Box>
      </DialogTitle>
        <DialogContent sx={{ px: 4, pt: 3, pb: 0, overflow: 'visible' }}>
          <Stack spacing={3} sx={{ direction: 'rtl' }}>
            <Stack spacing={0.5}>
              <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>عنوان الإعلان</Typography>
              <TextField value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="أدخل عنوان الإعلان" fullWidth sx={inputSx} />
            </Stack>
            <Stack spacing={0.5}>
              <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>محتوى الإعلان</Typography>
              <TextField value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} placeholder="أدخل نص الإعلان..." multiline minRows={4} fullWidth sx={{ '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } }, '& textarea': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, '&::placeholder': { color: colors.mutedText, opacity: 1 } } }} />
            </Stack>
            {/* اختيار المسجد - مهم للربط مع الـ API */}
            <Stack spacing={0.5}>
              <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>المسجد</Typography>
              <TextField select value={form.mosqueId} onChange={(e) => setForm((p) => ({ ...p, mosqueId: e.target.value }))} fullWidth
                SelectProps={{ IconComponent: () => <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 8 }}><path d="M1 1.5L6 6.5L11 1.5" stroke={colors.mutedText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> }}
                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } }, '& .MuiSelect-select': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, py: 1.5 } }}
                SelectDisplayProps={{ style: { direction: 'rtl' } }}
                MenuProps={{ sx: { '& .MuiMenu-paper': { direction: 'rtl', bgcolor: colors.surface }, '& .MuiMenuItem-root': { justifyContent: 'flex-end', fontFamily: '"IBM Plex Sans Arabic", sans-serif', color: colors.text } } }}>
                {mosques.map((mosque) => <MenuItem key={mosque.id} value={mosque.id} sx={{ justifyContent: 'flex-end' }}>{mosque.name}</MenuItem>)}
              </TextField>
            </Stack>
            {/* الأولوية */}
            <Stack spacing={0.5}>
              <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>الأولوية</Typography>
              <TextField select value={form.priority} onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))} fullWidth
                SelectProps={{ IconComponent: () => <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 8 }}><path d="M1 1.5L6 6.5L11 1.5" stroke={colors.mutedText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> }}
                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } }, '& .MuiSelect-select': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, py: 1.5 } }}
                SelectDisplayProps={{ style: { direction: 'rtl' } }}
                MenuProps={{ sx: { '& .MuiMenu-paper': { direction: 'rtl', bgcolor: colors.surface }, '& .MuiMenuItem-root': { justifyContent: 'flex-end', fontFamily: '"IBM Plex Sans Arabic", sans-serif', color: colors.text } } }}>
                <MenuItem value="LOW" sx={{ justifyContent: 'flex-end' }}>منخفضة</MenuItem>
                <MenuItem value="MEDIUM" sx={{ justifyContent: 'flex-end' }}>متوسطة</MenuItem>
                <MenuItem value="HIGH" sx={{ justifyContent: 'flex-end' }}>عالية</MenuItem>
              </TextField>
            </Stack>
          </Stack>
        </DialogContent>
      <DialogActions sx={{ px: 4, pt: 1, pb: 4, gap: 1.5, justifyContent: 'flex-start', flexDirection: 'row-reverse' }}>
        <AppButton variant="contained" backgroundColor="linear-gradient(135deg, #C5A059 0%, #9E7E43 100%)" textColor="#FFFFFF" borderColor="transparent" onClick={(e) => { e?.preventDefault(); onSubmit?.(form); setOpen(false); }} sx={{ background: 'linear-gradient(135deg, #C5A059 0%, #9E7E43 100%) !important', borderRadius: 2, height: 48, px: 4 }}>نشر الإعلان</AppButton>
        <AppButton variant="contained" backgroundColor={colors.btn} textColor={colors.text} borderColor="transparent" onClick={() => setOpen(false)} sx={{ borderRadius: 2, height: 48, px: 3, '&:hover': { backgroundColor: colors.border } }}>إلغاء</AppButton>
      </DialogActions>
    </Dialog>
  )
}

export function ConfirmAssignDialog({ open, setOpen, preacherName, mosqueName, onConfirm }) {
  const { activeTheme } = useTheme()
  const { colors, mode } = activeTheme
  const isDark = mode === 'dark'

  const handleConfirm = () => { onConfirm?.(); setOpen(false) }

  return (
    <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 4, bgcolor: colors.surface, color: colors.text, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } }}>
      <DialogContent sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
        <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: colors.bgelem, color: isDark ? colors.secondary : colors.primary }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </Box>
        <Typography sx={{ fontWeight: 900, fontSize: 22, mb: 1, color: colors.text }}>تأكيد التكليف</Typography>
        <Typography sx={{ color: colors.mutedText, fontSize: 14, lineHeight: 1.8 }}>هل أنت متأكد من تعيين <strong>{preacherName || 'الخطيب'}</strong> في <strong>{mosqueName || 'المسجد'}</strong> ليوم الجمعة القادمة؟</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 2.5, pb: 3, gap: 1, justifyContent: 'center' }}>
        <AppButton variant="contained" backgroundColor="linear-gradient(135deg, #C5A059 0%, #9E7E43 100%)" textColor="#FFFFFF" borderColor="transparent" onClick={handleConfirm} sx={{ background: 'linear-gradient(135deg, #C5A059 0%, #9E7E43 100%) !important', borderRadius: 2, height: 44, px: 3 }}>تأكيد التكليف</AppButton>
        <AppButton variant="outlined" backgroundColor="transparent" textColor={colors.text} borderColor={colors.border} onClick={() => setOpen(false)} sx={{ borderRadius: 2, height: 44, px: 3 }}>تراجع</AppButton>
      </DialogActions>
    </Dialog>
  )
}
