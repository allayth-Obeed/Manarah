import React, { useEffect, useMemo } from 'react'
import { Box, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { useTheme } from '../../theme/themeContext'

/**
 * منتقي الموقع الجغرافي المتتالي (محافظة ← منطقة ← منطقة فرعية ← موقع)
 * ✅ يُستخدم بديالوجات إضافة/تعديل المسجد بدل حقل "المدينة" النصي الحر السابق
 *
 * @param {Array} tree - شجرة المحافظات القادمة من GET /regions/tree
 * @param {{provinceId, regionId, subRegionId, locationId}} value - الاختيار الحالي
 * @param {(patch: object) => void} onChange - يُستدعى بجزء من الحالة يجب دمجه (يصفّر المستويات الأدنى تلقائياً)
 */
export default function LocationPicker({ tree = [], value = {}, onChange }) {
  const { activeTheme } = useTheme()
  const { colors } = activeTheme

  const provinces = tree
  const selectedProvince = useMemo(
    () => provinces.find((p) => p.id === value.provinceId),
    [provinces, value.provinceId],
  )
  const regions = selectedProvince?.regions || []
  const selectedRegion = useMemo(
    () => regions.find((r) => r.id === value.regionId),
    [regions, value.regionId],
  )
  const subRegions = selectedRegion?.subRegions || []
  const selectedSubRegion = useMemo(
    () => subRegions.find((s) => s.id === value.subRegionId),
    [subRegions, value.subRegionId],
  )
  const locations = selectedSubRegion?.locations || []

  // محافظة واحدة فقط متوفرة حالياً (حمص) — تُختار تلقائياً بدون إظهار قائمة منسدلة لها
  useEffect(() => {
    if (!value.provinceId && provinces.length === 1) {
      onChange?.({ provinceId: provinces[0].id })
    }
  }, [provinces, value.provinceId, onChange])

  const selectSx = {
    '& .MuiOutlinedInput-root': { backgroundColor: colors.bgelem, borderRadius: 2, height: 48, '& fieldset': { border: 'none' }, '&:hover fieldset': { border: 'none' }, '&.Mui-focused fieldset': { border: 'none' } },
    '& .MuiSelect-select': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 400, fontSize: 16, color: colors.text, py: 1.5 },
  }

  const arrowIcon = () => (
    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 8 }}>
      <path d="M1 1.5L6 6.5L11 1.5" stroke={colors.mutedText} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )

  const menuProps = {
    sx: {
      '& .MuiMenu-paper': { direction: 'rtl', bgcolor: colors.surface, maxHeight: 320 },
      '& .MuiMenuItem-root': { justifyContent: 'flex-end', fontFamily: '"IBM Plex Sans Arabic", sans-serif', color: colors.text },
    },
  }

  const Field = ({ label, value: fieldValue, onChange: onFieldChange, options, placeholder, disabled }) => (
    <Stack spacing={0.5}>
      <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 500, fontSize: 14, color: colors.text, lineHeight: '20px', textAlign: 'right' }}>
        {label}
      </Typography>
      <TextField
        select
        value={fieldValue || ''}
        onChange={(e) => onFieldChange(e.target.value ? Number(e.target.value) : '')}
        disabled={disabled}
        placeholder={placeholder}
        fullWidth
        sx={selectSx}
        SelectProps={{ IconComponent: arrowIcon, displayEmpty: true }}
        SelectDisplayProps={{ style: { direction: 'rtl' } }}
        MenuProps={menuProps}
      >
        <MenuItem value="" sx={{ justifyContent: 'flex-end', color: colors.mutedText }}>
          {placeholder}
        </MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.id} value={opt.id} sx={{ justifyContent: 'flex-end' }}>
            {opt.name}
          </MenuItem>
        ))}
      </TextField>
    </Stack>
  )

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: provinces.length > 1 ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)' }, gap: 2, direction: 'rtl' }}>
      {provinces.length > 1 && (
        <Field
          label="المحافظة"
          value={value.provinceId}
          onChange={(id) => onChange?.({ provinceId: id, regionId: '', subRegionId: '', locationId: '' })}
          options={provinces}
          placeholder="اختر المحافظة"
        />
      )}
      <Field
        label="المنطقة"
        value={value.regionId}
        onChange={(id) => onChange?.({ regionId: id, subRegionId: '', locationId: '' })}
        options={regions}
        placeholder="اختر المنطقة"
        disabled={!value.provinceId}
      />
      <Field
        label="المنطقة الفرعية"
        value={value.subRegionId}
        onChange={(id) => onChange?.({ subRegionId: id, locationId: '' })}
        options={subRegions}
        placeholder="اختر المنطقة الفرعية"
        disabled={!value.regionId}
      />
      <Field
        label="الموقع"
        value={value.locationId}
        onChange={(id) => onChange?.({ locationId: id })}
        options={locations}
        placeholder="اختر الموقع"
        disabled={!value.subRegionId}
      />
    </Box>
  )
}
