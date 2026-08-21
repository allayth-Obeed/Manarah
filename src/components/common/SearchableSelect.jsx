import React from 'react'
import { Autocomplete, Box, TextField, Typography, createFilterOptions } from '@mui/material'
import { useTheme } from '../../theme/themeContext'

// اقتراح تلقائي + بحث بكتابة الاسم بدل قائمة منسدلة ثابتة — يُستخدم لاختيار شخص (خطيب/موظف/حساب مستخدم)
// من قائمة قد تطول، كحقل "تعيين خطيب" و"الخطيب المختار"
const defaultGetOptionLabel = (option) =>
  option?.name || [option?.firstName, option?.lastName].filter(Boolean).join(' ') || ''

export default function SearchableSelect({
  options = [],
  value, // معرف العنصر المختار حالياً (id) أو '' / null لعدم الاختيار
  onChange, // (id) => void — يُستدعى بمعرف العنصر المختار، أو '' عند المسح
  getOptionId = (option) => option.id,
  getOptionLabel = defaultGetOptionLabel,
  getOptionSecondary, // نص ثانوي اختياري يُعرض تحت الاسم في القائمة (تخصص/بريد/دور) ويدخل ضمن نطاق البحث
  placeholder = 'ابحث بالاسم...',
  noOptionsText = 'لا توجد نتائج مطابقة',
  disabled = false,
  clearable = true,
  fullWidth = true,
}) {
  const { activeTheme } = useTheme()
  const { colors } = activeTheme

  const selectedOption =
    options.find((opt) => String(getOptionId(opt)) === String(value)) || null

  const filterOptions = createFilterOptions({
    stringify: (option) =>
      `${getOptionLabel(option)} ${getOptionSecondary ? getOptionSecondary(option) : ''}`,
  })

  const chevron = (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1.5L6 6.5L11 1.5" stroke={colors.mutedText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  return (
    <Autocomplete
      options={options}
      value={selectedOption}
      onChange={(event, newValue) => onChange(newValue ? getOptionId(newValue) : '')}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(option, val) => getOptionId(option) === getOptionId(val)}
      filterOptions={filterOptions}
      disabled={disabled}
      disableClearable={!clearable}
      noOptionsText={noOptionsText}
      fullWidth={fullWidth}
      popupIcon={chevron}
      slotProps={{
        paper: { sx: { bgcolor: colors.surface, direction: 'rtl' } },
        listbox: { sx: { direction: 'rtl' } },
        clearIndicator: { sx: { color: colors.mutedText } },
        popupIndicator: { sx: { color: colors.mutedText, marginLeft: '4px' } },
      }}
      renderOption={(props, option) => {
        const { key, ...rest } = props
        return (
          <Box
            component="li"
            key={key}
            {...rest}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', textAlign: 'right', gap: 0.2 }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.text, fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}>
              {getOptionLabel(option)}
            </Typography>
            {getOptionSecondary && (
              <Typography sx={{ fontSize: 12, color: colors.mutedText, fontFamily: '"IBM Plex Sans Arabic", sans-serif' }}>
                {getOptionSecondary(option)}
              </Typography>
            )}
          </Box>
        )
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          sx={{
            '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, minHeight: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } },
            '& input': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, '&::placeholder': { color: colors.mutedText, opacity: 1 } },
          }}
        />
      )}
      sx={{ direction: 'rtl' }}
    />
  )
}
