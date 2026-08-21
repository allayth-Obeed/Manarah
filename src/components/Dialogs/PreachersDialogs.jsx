import React from 'react'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import AppButton from '../common/AppButton'
import { useTheme } from '../../theme/themeContext'

/**
 * Dialog لإضافة خطيب جديد
 * ✅ الحقول تتوافق مع CreatePreacherDto في الباك إند: firstName, lastName, phone?, email?, specialization?, userId?
 * ✅ البيانات تأتي من المكون الأب Preachers.jsx إلى preacherForm
 */
export default function PreachersDialogs({ addOpen, setAddOpen, preacherForm, setPreacherForm, handleAddSubmit, linkableUsers = [], deleteOpen, setDeleteOpen, selectedRow, handleConfirmDelete }) {
  const { activeTheme } = useTheme()
  const { colors, mode } = activeTheme
  const isDark = mode === 'dark'

  const inputSx = {
    '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } },
    '& input': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, '&::placeholder': { color: colors.mutedText, opacity: 1 } },
  }

  return (
    <>
      {/* ============= Dialog إضافة خطيب جديد ============= */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: colors.surface, color: colors.text, maxWidth: 672, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: `1px solid ${colors.border}` } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, pt: 4, pb: 0, mb: 3 }}>
          <IconButton onClick={() => setAddOpen(false)} sx={{ color: colors.mutedText, p: 0, '& svg': { fontSize: 22 } }}><CloseIcon /></IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', borderRight: `4px solid ${colors.secondary}`, pr: 1.5 }}>
            <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 700, fontSize: 20, color: isDark ? colors.secondary : colors.primary, lineHeight: '28px' }}>إضافة خطيب جديد</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 4, pt: 3, pb: 0, overflow: 'visible' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, direction: 'rtl' }}>
            <Stack spacing={3}>
              {/* الاسم الأول - يتوافق مع firstName في الباك إند */}
              <Stack spacing={0.5}>
                <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>الاسم الأول</Typography>
                <TextField value={preacherForm.firstName} onChange={(e) => setPreacherForm((p) => ({ ...p, firstName: e.target.value }))} placeholder="أدخل الاسم الأول" fullWidth sx={inputSx} />
              </Stack>
              {/* البريد الإلكتروني - اختياري */}
              <Stack spacing={0.5}>
                <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>البريد الإلكتروني</Typography>
                <TextField type="email" value={preacherForm.email} onChange={(e) => setPreacherForm((p) => ({ ...p, email: e.target.value }))} placeholder="example@email.com" fullWidth sx={inputSx} />
              </Stack>
            </Stack>
            <Stack spacing={3}>
              {/* الاسم الأخير - يتوافق مع lastName في الباك إند */}
              <Stack spacing={0.5}>
                <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>الاسم الأخير</Typography>
                <TextField value={preacherForm.lastName} onChange={(e) => setPreacherForm((p) => ({ ...p, lastName: e.target.value }))} placeholder="أدخل الاسم الأخير" fullWidth sx={inputSx} />
              </Stack>
              {/* الهاتف - اختياري */}
              <Stack spacing={0.5}>
                <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>رقم الهاتف</Typography>
                <TextField value={preacherForm.phone} onChange={(e) => setPreacherForm((p) => ({ ...p, phone: e.target.value }))} placeholder="05xxxxxxxx" fullWidth sx={inputSx} />
              </Stack>
            </Stack>
          </Box>
          {/* التخصص - حقل كامل العرض */}
          <Box sx={{ mt: 3 }}>
            <Stack spacing={0.5}>
              <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>التخصص</Typography>
              <TextField value={preacherForm.specialization} onChange={(e) => setPreacherForm((p) => ({ ...p, specialization: e.target.value }))} placeholder="مثال: تخصص في الفقه الإسلامي" fullWidth sx={inputSx} />
            </Stack>
          </Box>
          {/* ADDED: ربط اختياري بحساب دخول موجود — يفعّل استلام هذا الخطيب لإشعاراته الشخصية (تكليف خطبة...) */}
          <Box sx={{ mt: 3 }}>
            <Stack spacing={0.5}>
              <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>ربط بحساب دخول (اختياري)</Typography>
              <Select
                value={preacherForm.userId || ''}
                onChange={(e) => setPreacherForm((p) => ({ ...p, userId: e.target.value }))}
                displayEmpty
                fullWidth
                sx={{ ...inputSx, '& .MuiSelect-select': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif' } }}
                MenuProps={{ sx: { '& .MuiMenu-paper': { direction: 'rtl', bgcolor: colors.surface }, '& .MuiMenuItem-root': { justifyContent: 'flex-end', fontFamily: '"IBM Plex Sans Arabic", sans-serif', color: colors.text } } }}
              >
                <MenuItem value="" sx={{ justifyContent: 'flex-end' }}>بلا ربط (يمكن ربطه لاحقاً)</MenuItem>
                {linkableUsers.map((u) => (
                  <MenuItem key={u.id} value={u.id} sx={{ justifyContent: 'flex-end' }}>{u.name} — {u.email}</MenuItem>
                ))}
              </Select>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pt: 1, pb: 4, gap: 1.5, justifyContent: 'flex-start', flexDirection: 'row-reverse' }}>
          <AppButton variant="contained" backgroundColor="linear-gradient(135deg, #C5A059 0%, #9E7E43 100%)" textColor="#FFFFFF" borderColor="transparent" onClick={handleAddSubmit} sx={{ background: 'linear-gradient(135deg, #C5A059 0%, #9E7E43 100%) !important', borderRadius: 2, height: 48, px: 4 }}>تأكيد الإضافة</AppButton>
          <AppButton variant="contained" backgroundColor={colors.btn} textColor={colors.text} borderColor="transparent" onClick={() => setAddOpen(false)} sx={{ borderRadius: 2, height: 48, px: 3, '&:hover': { backgroundColor: colors.border } }}>إلغاء</AppButton>
        </DialogActions>
      </Dialog>

      {/* ============= Dialog حذف خطيب ============= */}

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, bgcolor: colors.surface, color: colors.text, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } }}>
        <DialogContent sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
          <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: colors.danger100, color: colors.danger500 }}><DeleteIcon sx={{ fontSize: 32 }} /></Box>
          <Typography sx={{ fontWeight: 900, fontSize: 22, mb: 1, color: colors.text }}>تأكيد حذف السجل</Typography>
          <Typography sx={{ color: colors.mutedText, fontSize: 14, lineHeight: 1.8 }}>هل أنت متأكد من رغبتك في حذف ملف {selectedRow?.name || 'هذا الخطيب'}؟ هذا الإجراء نهائي ولا يمكن التراجع عنه بعد التنفيذ.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 3, gap: 1, justifyContent: 'center' }}>
          <AppButton variant="contained" backgroundColor={colors.danger500} textColor="#FFFFFF" borderColor={colors.danger500} onClick={handleConfirmDelete} sx={{ borderRadius: 2, height: 44, px: 3 }}>نعم، حذف السجل</AppButton>
          <AppButton variant="outlined" backgroundColor="transparent" textColor={colors.text} borderColor={colors.border} onClick={() => setDeleteOpen(false)} sx={{ borderRadius: 2, height: 44, px: 3 }}>تراجع عن الإجراء</AppButton>
        </DialogActions>
      </Dialog>
    </>
  )
}
