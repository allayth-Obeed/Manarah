import React from 'react'
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import AppButton from '../common/AppButton'
import { useTheme } from '../../theme/themeContext'

const priorityOptions = [
  { value: 'LOW', label: 'منخفضة' },
  { value: 'MEDIUM', label: 'متوسطة' },
  { value: 'HIGH', label: 'عالية' },
]

const statusOptions = [
  { value: 'OPEN', label: 'مفتوحة' },
  { value: 'IN_PROGRESS', label: 'قيد المعالجة' },
  { value: 'RESOLVED', label: 'تم الحل' },
  { value: 'CLOSED', label: 'مغلقة' },
]

/**
 * ديالوجات تذاكر الصيانة والشكاوى: إضافة تذكرة، عرض/تعديل التفاصيل (حالة + إسناد لموظف)، وتأكيد الحذف
 */
export default function MaintenanceDialogs({
  addOpen, setAddOpen, ticketForm, setTicketForm, handleAddSubmit, mosques = [],
  detailsOpen, setDetailsOpen, selectedRow, editForm, setEditForm, handleUpdateSubmit,
  deleteOpen, setDeleteOpen, handleConfirmDelete, employees = [], canWrite, isMyTicket = false,
}) {
  const { activeTheme } = useTheme()
  const { colors, mode } = activeTheme
  const isDark = mode === 'dark'

  const inputSx = {
    '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } },
    '& input': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, '&::placeholder': { color: colors.mutedText, opacity: 1 } },
  }

  const selectSx = {
    '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } },
    '& .MuiSelect-select': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, py: 1.5 },
  }

  const fieldLabelSx = { fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }

  return (
    <>
      {/* ============= Dialog فتح تذكرة صيانة/شكوى جديدة ============= */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: colors.surface, color: colors.text, maxWidth: 672, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: `1px solid ${colors.border}` } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, pt: 4, pb: 0, mb: 3 }}>
          <IconButton onClick={() => setAddOpen(false)} sx={{ color: colors.mutedText, p: 0, '& svg': { fontSize: 22 } }}><CloseIcon /></IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', borderRight: `4px solid ${colors.secondary}`, pr: 1.5 }}>
            <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 700, fontSize: 20, color: isDark ? colors.secondary : colors.primary, lineHeight: '28px' }}>فتح تذكرة صيانة/شكوى</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 4, pt: 3, pb: 0, overflow: 'visible' }}>
          <Stack spacing={3} sx={{ direction: 'rtl' }}>
            <Stack spacing={0.5}>
              <Typography sx={fieldLabelSx}>عنوان المشكلة</Typography>
              <TextField value={ticketForm.title} onChange={(e) => setTicketForm((p) => ({ ...p, title: e.target.value }))} placeholder="مثال: عطل في التكييف" fullWidth sx={inputSx} />
            </Stack>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
              <Stack spacing={0.5}>
                <Typography sx={fieldLabelSx}>المسجد</Typography>
                <TextField select value={ticketForm.mosqueId} onChange={(e) => setTicketForm((p) => ({ ...p, mosqueId: e.target.value }))} fullWidth
                  SelectProps={{ IconComponent: () => <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 8 }}><path d="M1 1.5L6 6.5L11 1.5" stroke={colors.mutedText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> }}
                  sx={selectSx}
                  SelectDisplayProps={{ style: { direction: 'rtl' } }}
                  MenuProps={{ sx: { '& .MuiMenu-paper': { direction: 'rtl', bgcolor: colors.surface }, '& .MuiMenuItem-root': { justifyContent: 'flex-end', fontFamily: '"IBM Plex Sans Arabic", sans-serif', color: colors.text } } }}>
                  {mosques.map((mosque) => <MenuItem key={mosque.id} value={mosque.id} sx={{ justifyContent: 'flex-end' }}>{mosque.name}</MenuItem>)}
                </TextField>
              </Stack>
              <Stack spacing={0.5}>
                <Typography sx={fieldLabelSx}>الأولوية</Typography>
                <TextField select value={ticketForm.priority} onChange={(e) => setTicketForm((p) => ({ ...p, priority: e.target.value }))} fullWidth
                  SelectProps={{ IconComponent: () => <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 8 }}><path d="M1 1.5L6 6.5L11 1.5" stroke={colors.mutedText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> }}
                  sx={selectSx}
                  SelectDisplayProps={{ style: { direction: 'rtl' } }}
                  MenuProps={{ sx: { '& .MuiMenu-paper': { direction: 'rtl', bgcolor: colors.surface }, '& .MuiMenuItem-root': { justifyContent: 'flex-end', fontFamily: '"IBM Plex Sans Arabic", sans-serif', color: colors.text } } }}>
                  {priorityOptions.map((option) => <MenuItem key={option.value} value={option.value} sx={{ justifyContent: 'flex-end' }}>{option.label}</MenuItem>)}
                </TextField>
              </Stack>
            </Box>

            <Stack spacing={0.5}>
              <Typography sx={fieldLabelSx}>اسم المُبلِّغ (اختياري)</Typography>
              <TextField value={ticketForm.reportedBy} onChange={(e) => setTicketForm((p) => ({ ...p, reportedBy: e.target.value }))} placeholder="أدخل اسم من أبلغ عن المشكلة" fullWidth sx={inputSx} />
            </Stack>

            <Stack spacing={0.5}>
              <Typography sx={fieldLabelSx}>وصف المشكلة (اختياري)</Typography>
              <TextField value={ticketForm.description} onChange={(e) => setTicketForm((p) => ({ ...p, description: e.target.value }))} placeholder="تفاصيل إضافية عن المشكلة..." multiline minRows={3} fullWidth
                sx={{ '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } }, '& textarea': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, '&::placeholder': { color: colors.mutedText, opacity: 1 } } }} />
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 4, pt: 3, pb: 4, gap: 1.5, justifyContent: 'flex-start', flexDirection: 'row-reverse' }}>
          <AppButton variant="contained" backgroundColor="linear-gradient(135deg, #C5A059 0%, #9E7E43 100%)" textColor="#FFFFFF" borderColor="transparent" onClick={handleAddSubmit} sx={{ background: 'linear-gradient(135deg, #C5A059 0%, #9E7E43 100%) !important', borderRadius: 2, height: 48, px: 4 }}>فتح التذكرة</AppButton>
          <AppButton variant="contained" backgroundColor={colors.btn} textColor={colors.text} borderColor="transparent" onClick={() => setAddOpen(false)} sx={{ borderRadius: 2, height: 48, px: 3, '&:hover': { backgroundColor: colors.border } }}>إلغاء</AppButton>
        </DialogActions>
      </Dialog>

      {/* ============= Dialog تفاصيل التذكرة + تعديل الحالة/الإسناد ============= */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { borderRadius: 3, bgcolor: colors.surface, color: colors.text, maxWidth: 600, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, pt: 4, pb: 0, mb: 2 }}>
          <IconButton onClick={() => setDetailsOpen(false)} sx={{ color: colors.mutedText, p: 0, '& svg': { fontSize: 22 } }}><CloseIcon /></IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', borderRight: `4px solid ${colors.secondary}`, pr: 1.5 }}>
            <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 700, fontSize: 20, color: isDark ? colors.secondary : colors.primary, lineHeight: '28px' }}>تفاصيل التذكرة</Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ px: 4, pt: 2, pb: 3 }}>
          {selectedRow ? (
            <Stack spacing={2.5} sx={{ direction: 'rtl' }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, p: 2.5, borderRadius: 2, bgcolor: colors.bgelem }}>
                <Box sx={{ gridColumn: '1 / -1' }}><Typography sx={{ fontSize: 12, color: colors.mutedText, mb: 0.5 }}>العنوان</Typography><Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.text }}>{selectedRow.title || '—'}</Typography></Box>
                <Box><Typography sx={{ fontSize: 12, color: colors.mutedText, mb: 0.5 }}>المسجد</Typography><Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{selectedRow.mosque?.name || '—'}</Typography></Box>
                <Box><Typography sx={{ fontSize: 12, color: colors.mutedText, mb: 0.5 }}>المُبلِّغ</Typography><Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{selectedRow.reportedBy || '—'}</Typography></Box>
                {selectedRow.description && <Box sx={{ gridColumn: '1 / -1' }}><Typography sx={{ fontSize: 12, color: colors.mutedText, mb: 0.5 }}>الوصف</Typography><Typography sx={{ fontSize: 14, color: colors.text }}>{selectedRow.description}</Typography></Box>}
              </Box>

              {canWrite && editForm ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Stack spacing={0.5}>
                    <Typography sx={fieldLabelSx}>الحالة</Typography>
                    <TextField select value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))} fullWidth
                      sx={selectSx} SelectDisplayProps={{ style: { direction: 'rtl' } }}
                      MenuProps={{ sx: { '& .MuiMenu-paper': { direction: 'rtl', bgcolor: colors.surface }, '& .MuiMenuItem-root': { justifyContent: 'flex-end', fontFamily: '"IBM Plex Sans Arabic", sans-serif', color: colors.text } } }}>
                      {statusOptions.map((option) => <MenuItem key={option.value} value={option.value} sx={{ justifyContent: 'flex-end' }}>{option.label}</MenuItem>)}
                    </TextField>
                  </Stack>
                  <Stack spacing={0.5}>
                    <Typography sx={fieldLabelSx}>إسناد إلى موظف</Typography>
                    <TextField select value={editForm.assignedToId} onChange={(e) => setEditForm((p) => ({ ...p, assignedToId: e.target.value }))} fullWidth
                      sx={selectSx} SelectDisplayProps={{ style: { direction: 'rtl' } }}
                      MenuProps={{ sx: { '& .MuiMenu-paper': { direction: 'rtl', bgcolor: colors.surface }, '& .MuiMenuItem-root': { justifyContent: 'flex-end', fontFamily: '"IBM Plex Sans Arabic", sans-serif', color: colors.text } } }}>
                      <MenuItem value="" sx={{ justifyContent: 'flex-end' }}>غير مُسند</MenuItem>
                      {employees.map((emp) => <MenuItem key={emp.id} value={emp.id} sx={{ justifyContent: 'flex-end' }}>{emp.firstName} {emp.lastName}</MenuItem>)}
                    </TextField>
                  </Stack>
                </Box>
              ) : isMyTicket && editForm ? (
                // ADDED: الموظف المُسنَدة إليه هذه التذكرة تحديداً يقدر يحدّث حالتها هو بنفسه (بلا إسناد/تعديل آخر)
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  <Stack spacing={0.5}>
                    <Typography sx={fieldLabelSx}>الحالة</Typography>
                    <TextField select value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))} fullWidth
                      sx={selectSx} SelectDisplayProps={{ style: { direction: 'rtl' } }}
                      MenuProps={{ sx: { '& .MuiMenu-paper': { direction: 'rtl', bgcolor: colors.surface }, '& .MuiMenuItem-root': { justifyContent: 'flex-end', fontFamily: '"IBM Plex Sans Arabic", sans-serif', color: colors.text } } }}>
                      {statusOptions.map((option) => <MenuItem key={option.value} value={option.value} sx={{ justifyContent: 'flex-end' }}>{option.label}</MenuItem>)}
                    </TextField>
                  </Stack>
                  <Box><Typography sx={{ fontSize: 12, color: colors.mutedText, mb: 0.5 }}>المسؤول</Typography><Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>أنت</Typography></Box>
                </Box>
              ) : (
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box><Typography sx={{ fontSize: 12, color: colors.mutedText, mb: 0.5 }}>الحالة</Typography><Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{statusOptions.find((s) => s.value === selectedRow.status)?.label || selectedRow.status}</Typography></Box>
                  <Box><Typography sx={{ fontSize: 12, color: colors.mutedText, mb: 0.5 }}>المسؤول</Typography><Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{selectedRow.assignedTo ? `${selectedRow.assignedTo.firstName} ${selectedRow.assignedTo.lastName}` : 'غير مُسند'}</Typography></Box>
                </Box>
              )}
            </Stack>
          ) : <Typography sx={{ textAlign: 'center', color: colors.mutedText, py: 4 }}>لا توجد تفاصيل متاحة</Typography>}
        </DialogContent>
        <DialogActions sx={{ px: 4, pb: 4, gap: 1.5, justifyContent: (canWrite || isMyTicket) ? 'flex-start' : 'center', flexDirection: (canWrite || isMyTicket) ? 'row-reverse' : 'row' }}>
          {(canWrite || isMyTicket) && (
            <AppButton variant="contained" backgroundColor="linear-gradient(135deg, #C5A059 0%, #9E7E43 100%)" textColor="#FFFFFF" borderColor="transparent" onClick={handleUpdateSubmit} sx={{ background: 'linear-gradient(135deg, #C5A059 0%, #9E7E43 100%) !important', borderRadius: 2, height: 44, px: 4 }}>حفظ التغييرات</AppButton>
          )}
          <AppButton variant="outlined" backgroundColor="transparent" textColor={colors.text} borderColor={colors.border} onClick={() => setDetailsOpen(false)} sx={{ borderRadius: 2, height: 44, px: 4 }}>إغلاق</AppButton>
        </DialogActions>
      </Dialog>

      {/* ============= Dialog حذف تذكرة ============= */}
      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth
        PaperProps={{ sx: { borderRadius: 4, bgcolor: colors.surface, color: colors.text, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } }}>
        <DialogContent sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
          <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: colors.danger100, color: colors.danger500 }}><DeleteIcon sx={{ fontSize: 32 }} /></Box>
          <Typography sx={{ fontWeight: 900, fontSize: 22, mb: 1, color: colors.text }}>تأكيد حذف التذكرة</Typography>
          <Typography sx={{ color: colors.mutedText, fontSize: 14, lineHeight: 1.8 }}>هل أنت متأكد من رغبتك في حذف هذه التذكرة؟ هذا الإجراء نهائي ولا يمكن التراجع عنه بعد التنفيذ.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 3, gap: 1, justifyContent: 'center' }}>
          <AppButton variant="contained" backgroundColor={colors.danger500} textColor="#FFFFFF" borderColor={colors.danger500} onClick={handleConfirmDelete} sx={{ borderRadius: 2, height: 44, px: 3 }}>نعم، حذف السجل</AppButton>
          <AppButton variant="outlined" backgroundColor="transparent" textColor={colors.text} borderColor={colors.border} onClick={() => setDeleteOpen(false)} sx={{ borderRadius: 2, height: 44, px: 3 }}>تراجع عن الإجراء</AppButton>
        </DialogActions>
      </Dialog>
    </>
  )
}
