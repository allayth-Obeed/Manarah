import React from 'react'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import AppButton from '../common/AppButton'
import { useTheme } from '../../theme/themeContext'

/**
 * Dialog لتسجيل تبرع جديد
 * ✅ الحقول تتوافق مع CreateDonationDto في الباك إند: donorName, amount, mosqueId, purpose?, notes?
 * ✅ البيانات تأتي من المكون الأب Donations.jsx إلى donationForm
 */
export default function DonationsDialogs({ addOpen, setAddOpen, donationForm, setDonationForm, handleAddSubmit, detailsOpen, setDetailsOpen, selectedRow, deleteOpen, setDeleteOpen, handleConfirmDelete, mosques = [] }) {
  const { activeTheme } = useTheme()
  const { colors, mode } = activeTheme
  const isDark = mode === 'dark'

  const inputSx = {
    '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } },
    '& input': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, '&::placeholder': { color: colors.mutedText, opacity: 1 } },
  }

  return (
    <>
      {/* ============= Dialog تسجيل تبرع جديد ============= */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: colors.surface, color: colors.text, maxWidth: 672, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: `1px solid ${colors.border}` } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, pt: 4, pb: 0, mb: 3 }}>
          <IconButton onClick={() => setAddOpen(false)} sx={{ color: colors.mutedText, p: 0, '& svg': { fontSize: 22 } }}><CloseIcon /></IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', borderRight: `4px solid ${colors.secondary}`, pr: 1.5 }}>
            <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 700, fontSize: 20, color: isDark ? colors.secondary : colors.primary, lineHeight: '28px' }}>تسجيل تبرع جديد</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 4, pt: 3, pb: 0, overflow: 'visible' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, direction: 'rtl' }}>
            <Stack spacing={3}>
              {/* اسم المتبرع - يتوافق مع donorName في الباك إند */}
              <Stack spacing={0.5}>
                <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>اسم المتبرع</Typography>
                <TextField value={donationForm.donorName} onChange={(e) => setDonationForm((p) => ({ ...p, donorName: e.target.value }))} placeholder="أدخل اسم المتبرع" fullWidth sx={inputSx} />
              </Stack>
              {/* المبلغ - يتوافق مع amount في الباك إند */}
              <Stack spacing={0.5}>
                <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>المبلغ (ر.س)</Typography>
                <TextField value={donationForm.amount} onChange={(e) => setDonationForm((p) => ({ ...p, amount: e.target.value }))} placeholder="0.00" type="number" fullWidth sx={inputSx} />
              </Stack>
            </Stack>
            <Stack spacing={3}>
              {/* اختيار المسجد - يتوافق مع mosqueId في الباك إند */}
              <Stack spacing={0.5}>
                <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>المسجد المستفيد</Typography>
                <TextField select value={donationForm.mosqueId} onChange={(e) => setDonationForm((p) => ({ ...p, mosqueId: e.target.value }))} fullWidth
                  SelectProps={{ IconComponent: () => <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 8 }}><path d="M1 1.5L6 6.5L11 1.5" stroke={colors.mutedText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> }}
                  sx={{ '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } }, '& .MuiSelect-select': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, py: 1.5 } }}
                  SelectDisplayProps={{ style: { direction: 'rtl' } }}
                  MenuProps={{ sx: { '& .MuiMenu-paper': { direction: 'rtl', bgcolor: colors.surface }, '& .MuiMenuItem-root': { justifyContent: 'flex-end', fontFamily: '"IBM Plex Sans Arabic", sans-serif', color: colors.text } } }}>
                  {mosques.map((mosque) => <MenuItem key={mosque.id} value={mosque.id} sx={{ justifyContent: 'flex-end' }}>{mosque.name}</MenuItem>)}
                </TextField>
              </Stack>
              {/* الغرض من التبرع - اختياري */}
              <Stack spacing={0.5}>
                <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>الغرض من التبرع</Typography>
                <TextField value={donationForm.purpose} onChange={(e) => setDonationForm((p) => ({ ...p, purpose: e.target.value }))} placeholder="مثال: صيانة المسجد" fullWidth sx={inputSx} />
              </Stack>
            </Stack>
          </Box>

          {/* ملاحظات إضافية - حقل كامل العرض */}
          <Box sx={{ mt: 3 }}>
            <Stack spacing={0.5}>
              <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>ملاحظات (اختياري)</Typography>
              <TextField value={donationForm.notes} onChange={(e) => setDonationForm((p) => ({ ...p, notes: e.target.value }))} placeholder="أدخل أي ملاحظات إضافية..." multiline minRows={3} fullWidth sx={{ '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } }, '& textarea': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, '&::placeholder': { color: colors.mutedText, opacity: 1 } } }} />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 4, pt: 1, pb: 4, gap: 1.5, justifyContent: 'flex-start', flexDirection: 'row-reverse' }}>
          <AppButton variant="contained" backgroundColor="linear-gradient(135deg, #C5A059 0%, #9E7E43 100%)" textColor="#FFFFFF" borderColor="transparent" onClick={handleAddSubmit} sx={{ background: 'linear-gradient(135deg, #C5A059 0%, #9E7E43 100%) !important', borderRadius: 2, height: 48, px: 4 }}>تسجيل التبرع</AppButton>
          <AppButton variant="contained" backgroundColor={colors.btn} textColor={colors.text} borderColor="transparent" onClick={() => setAddOpen(false)} sx={{ borderRadius: 2, height: 48, px: 3, '&:hover': { backgroundColor: colors.border } }}>إلغاء</AppButton>
        </DialogActions>
      </Dialog>

      {/* ============= Dialog تفاصيل التبرع ============= */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: colors.surface, color: colors.text, maxWidth: 560, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, pt: 4, pb: 0, mb: 2 }}>
          <IconButton onClick={() => setDetailsOpen(false)} sx={{ color: colors.mutedText, p: 0, '& svg': { fontSize: 22 } }}><CloseIcon /></IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', borderRight: `4px solid ${colors.secondary}`, pr: 1.5 }}>
            <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 700, fontSize: 20, color: isDark ? colors.secondary : colors.primary, lineHeight: '28px' }}>تفاصيل التبرع</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 4, pt: 2, pb: 3 }}>
          {selectedRow ? (
            <Stack spacing={2.5} sx={{ direction: 'rtl' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, p: 2.5, borderRadius: 2, bgcolor: colors.bgelem }}>
                <Box><Typography sx={{ fontSize: 12, color: colors.mutedText, mb: 0.5 }}>اسم المتبرع</Typography><Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.text }}>{selectedRow.donorName || '—'}</Typography></Box>
                <Box><Typography sx={{ fontSize: 12, color: colors.mutedText, mb: 0.5 }}>المبلغ</Typography><Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.primary }}>{selectedRow.amount || '—'}</Typography></Box>
                <Box><Typography sx={{ fontSize: 12, color: colors.mutedText, mb: 0.5 }}>المسجد</Typography><Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{selectedRow.mosque?.name || '—'}</Typography></Box>
                <Box><Typography sx={{ fontSize: 12, color: colors.mutedText, mb: 0.5 }}>الغرض</Typography><Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{selectedRow.purpose || '—'}</Typography></Box>
                {selectedRow.notes && <Box sx={{ gridColumn: '1 / -1' }}><Typography sx={{ fontSize: 12, color: colors.mutedText, mb: 0.5 }}>ملاحظات</Typography><Typography sx={{ fontSize: 14, color: colors.text }}>{selectedRow.notes}</Typography></Box>}
              </Box>
            </Stack>
          ) : <Typography sx={{ textAlign: 'center', color: colors.mutedText, py: 4 }}>لا توجد تفاصيل متاحة</Typography>}
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4, justifyContent: 'center' }}>
          <AppButton variant="outlined" backgroundColor="transparent" textColor={colors.text} borderColor={colors.border} onClick={() => setDetailsOpen(false)} sx={{ borderRadius: 2, height: 44, px: 4 }}>إغلاق</AppButton>
        </DialogActions>
      </Dialog>

      {/* ============= Dialog حذف تبرع ============= */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, bgcolor: colors.surface, color: colors.text, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } }}>
        <DialogContent sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
          <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: colors.danger100, color: colors.danger500 }}><DeleteIcon sx={{ fontSize: 32 }} /></Box>
          <Typography sx={{ fontWeight: 900, fontSize: 22, mb: 1, color: colors.text }}>تأكيد حذف التبرع</Typography>
          <Typography sx={{ color: colors.mutedText, fontSize: 14, lineHeight: 1.8 }}>هل أنت متأكد من رغبتك في حذف سجل التبرع هذا؟ هذا الإجراء نهائي ولا يمكن التراجع عنه بعد التنفيذ.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 3, gap: 1, justifyContent: 'center' }}>
          <AppButton variant="contained" backgroundColor={colors.danger500} textColor="#FFFFFF" borderColor={colors.danger500} onClick={handleConfirmDelete} sx={{ borderRadius: 2, height: 44, px: 3 }}>نعم، حذف السجل</AppButton>
          <AppButton variant="outlined" backgroundColor="transparent" textColor={colors.text} borderColor={colors.border} onClick={() => setDeleteOpen(false)} sx={{ borderRadius: 2, height: 44, px: 3 }}>تراجع عن الإجراء</AppButton>
        </DialogActions>
      </Dialog>
    </>
  )
}
