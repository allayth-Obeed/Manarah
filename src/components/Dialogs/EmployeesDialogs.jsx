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

const jobTitles = [
  { value: 'إمام وخطيب', label: 'إمام وخطيب' },
  { value: 'مؤذن', label: 'مؤذن' },
  { value: 'خطيب معتمد', label: 'خطيب معتمد' },
  { value: 'إمام جامع', label: 'إمام جامع' },
  { value: 'خطيب جمعة', label: 'خطيب جمعة' },
]

export default function EmployeesDialogs({ addOpen, setAddOpen, employeeForm, setEmployeeForm, handleAddSubmit }) {
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
            <Stack spacing={0.5}>
              <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>
                الاسم الكامل
              </Typography>
              <TextField value={employeeForm.name} onChange={(e) => setEmployeeForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="أدخل اسم الموظف" fullWidth sx={inputSx} />
            </Stack>
            <Stack spacing={0.5}>
              <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>
                الرقم الوطني
              </Typography>
              <TextField value={employeeForm.nationalId} onChange={(e) => setEmployeeForm((prev) => ({ ...prev, nationalId: e.target.value }))} placeholder="0000000000" fullWidth sx={inputSx} />
            </Stack>
          </Stack>
          <Stack spacing={3}>
            <Stack spacing={0.5}>
              <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>
                المسمى الوظيفي
              </Typography>
              <TextField
                select value={employeeForm.jobTitle} onChange={(e) => setEmployeeForm((prev) => ({ ...prev, jobTitle: e.target.value }))} fullWidth
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
  )
}
