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

export default function EmployeesDialogs({
  addOpen,
  setAddOpen,
  employeeForm,
  setEmployeeForm,
  handleAddSubmit,
}) {
  const { activeTheme } = useTheme()

  return (
    <Dialog
      open={addOpen}
      onClose={() => setAddOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: '#FFFFFF',
          color: activeTheme.colors.text,
          maxWidth: 672,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          border: '1px solid rgba(190, 201, 193, 0.1)',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 4,
          pt: 4,
          pb: 0,
          mb: 3,
        }}
      >
        <IconButton
          onClick={() => setAddOpen(false)}
          sx={{
            color: '#6F7A72',
            p: 0,
            '& svg': { fontSize: 22 },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRight: '4px solid #9E7E43',
            pr: 1.5,
          }}
        >
          <Typography
            sx={{
              fontFamily: '"IBM Plex Sans Arabic", sans-serif',
              fontWeight: 700,
              fontSize: 20,
              color: '#004D34',
              lineHeight: '28px',
            }}
          >
            إضافة كادر جديد
          </Typography>
        </Box>
      </DialogTitle>

      {/* Form Body */}
      <DialogContent sx={{ px: 4, pt: 3, pb: 0, overflow: 'visible' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 3,
            direction: 'rtl',
          }}
        >
          {/* Column 1: الاسم الكامل + الرقم الوطني */}
          <Stack spacing={3}>
            {/* الاسم الكامل */}
            <Stack spacing={0.5}>
              <Typography
                sx={{
                  fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#3F493F',
                  lineHeight: '20px',
                  textAlign: 'right',
                }}
              >
                الاسم الكامل
              </Typography>
              <TextField
                value={employeeForm.name}
                onChange={(e) => setEmployeeForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="أدخل اسم الموظف"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#E0E3E1',
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
                    color: '#181C1B',
                    '&::placeholder': {
                      color: '#6B7280',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Stack>

            {/* الرقم الوطني */}
            <Stack spacing={0.5}>
              <Typography
                sx={{
                  fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#3F493F',
                  lineHeight: '20px',
                  textAlign: 'right',
                }}
              >
                الرقم الوطني
              </Typography>
              <TextField
                value={employeeForm.nationalId}
                onChange={(e) =>
                  setEmployeeForm((prev) => ({ ...prev, nationalId: e.target.value }))
                }
                placeholder="0000000000"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#E0E3E1',
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
                    color: '#181C1B',
                    '&::placeholder': {
                      color: '#6B7280',
                      opacity: 1,
                    },
                  },
                }}
              />
            </Stack>
          </Stack>

          {/* Left Column: المسمى الوظيفي + تاريخ التعيين */}
          <Stack spacing={3}>
            {/* المسمى الوظيفي */}
            <Stack spacing={0.5}>
              <Typography
                sx={{
                  fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#3F493F',
                  lineHeight: '20px',
                  textAlign: 'right',
                }}
              >
                المسمى الوظيفي
              </Typography>
              <TextField
                select
                value={employeeForm.jobTitle}
                onChange={(e) => setEmployeeForm((prev) => ({ ...prev, jobTitle: e.target.value }))}
                fullWidth
                SelectProps={{
                  IconComponent: () => (
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ marginLeft: 8 }}
                    >
                      <path
                        d="M1 1.5L6 6.5L11 1.5"
                        stroke="#6B7280"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#E0E3E1',
                    borderRadius: 2,
                    height: 48,
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: 'none' },
                  },
                  '& .MuiSelect-select': {
                    textAlign: 'right',
                    fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                    fontWeight: 400,
                    fontSize: 16,
                    color: '#181C1B',
                    py: 1.5,
                  },
                }}
                SelectDisplayProps={{
                  style: { direction: 'rtl' },
                }}
                MenuProps={{
                  sx: {
                    '& .MuiMenu-paper': { direction: 'rtl' },
                    '& .MuiMenuItem-root': {
                      justifyContent: 'flex-end',
                      fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                    },
                  },
                }}
              >
                {jobTitles.map((option) => (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    sx={{ justifyContent: 'flex-end' }}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            {/* تاريخ التعيين */}
            <Stack spacing={0.5}>
              <Typography
                sx={{
                  fontFamily: '"IBM Plex Sans Arabic", sans-serif',
                  fontWeight: 500,
                  fontSize: 14,
                  color: '#3F493F',
                  lineHeight: '20px',
                  textAlign: 'right',
                }}
              >
                تاريخ التعيين
              </Typography>
              <TextField
                type="date"
                value={employeeForm.hireDate}
                onChange={(e) => setEmployeeForm((prev) => ({ ...prev, hireDate: e.target.value }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#E0E3E1',
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
                    color: '#181C1B',
                    '&::-webkit-calendar-picker-indicator': {
                      marginLeft: 0,
                      marginRight: 'auto',
                    },
                  },
                }}
              />
            </Stack>
          </Stack>
        </Box>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        sx={{
          px: 4,
          pt: 1,
          pb: 4,
          gap: 1.5,
          justifyContent: 'flex-start',
          flexDirection: 'row-reverse',
        }}
      >
        <AppButton
          variant="contained"
          backgroundColor="linear-gradient(135deg, #C5A059 0%, #9E7E43 100%)"
          textColor="#FFFFFF"
          borderColor="transparent"
          onClick={handleAddSubmit}
          sx={{
            background: 'linear-gradient(135deg, #C5A059 0%, #9E7E43 100%) !important',
            borderRadius: 2,
            height: 48,
            px: 4,
            boxShadow: '0 4px 6px -4px rgba(158,126,67,0.2), 0 10px 15px -3px rgba(158,126,67,0.2)',
            '&:hover': {
              background: 'linear-gradient(135deg, #B8913E 0%, #8D6E33 100%) !important',
              boxShadow:
                '0 4px 6px -4px rgba(158,126,67,0.3), 0 10px 15px -3px rgba(158,126,67,0.3)',
            },
          }}
        >
          تأكيد الإضافة
        </AppButton>

        <AppButton
          variant="contained"
          backgroundColor="#EBEFEC"
          textColor="#181C1B"
          borderColor="transparent"
          onClick={() => setAddOpen(false)}
          sx={{
            borderRadius: 2,
            height: 48,
            px: 3,
            '&:hover': {
              backgroundColor: '#DDE3DF !important',
            },
          }}
        >
          إلغاء
        </AppButton>
      </DialogActions>
    </Dialog>
  )
}
