import { Box, Typography, Card, Stack } from '@mui/material'
import AppButton from '../../components/common/AppButton'
import { useTheme } from '../../theme/themeContext'

export default function FilterSearch({ onApplyFilter }) {
  const { activeTheme } = useTheme()

  return (
    <Box dir="rtl" sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="body1">تصفية بـ:</Typography>
        {/* filtering */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 3,
            bgcolor: activeTheme.colors.bgelem,
            px: 2.5,
            py: 1.5,
            borderRadius: 1.5,
          }}
        >
          <AppButton
            variant="outlined"
            backgroundColor={activeTheme.colors.btn}
            textColor={activeTheme.colors.mutedText}
            borderColor={activeTheme.colors.border}
            borderRadius={1.5}
            px={5}
            py={0.8}
            fontSize={13}
          >
            كل المناطق
          </AppButton>

          <AppButton
            variant="outlined"
            backgroundColor={activeTheme.colors.btn}
            textColor={activeTheme.colors.mutedText}
            borderColor={activeTheme.colors.border}
            borderRadius={1.5}
            px={5}
            py={0.8}
            fontSize={13}
          >
            كل الحالات
          </AppButton>
          <Box sx={{ flexGrow: 1 }} />

          {/* Apply button */}
          <AppButton
            variant="contained"
            backgroundColor={activeTheme.colors.primary}
            textColor={activeTheme.colors.onPrimary}
            borderColor={activeTheme.colors.primary}
            borderRadius={1.5}
            px={7}
            py={0.8}
            fontWeight={600}
            onClick={onApplyFilter}
          >
            تطبيق الفلترة
          </AppButton>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        {/* Stats cards */}
        <Card
          sx={{
            px: 2.5,
            py: 1,
            minWidth: 140,
            textAlign: 'center',
            borderRadius: 1.5,
            bgcolor: activeTheme.colors.primary,
            color: activeTheme.colors.onPrimary,
            boxShadow: '0 3px 8px rgba(0,102,71,0.25)',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 900, fontSize: 18 }}>
            1,240
          </Typography>
          <Typography sx={{ fontSize: 12 }}>مسجد كلي</Typography>
        </Card>

        <Card
          sx={{
            px: 2.5,
            py: 1,
            minWidth: 140,
            textAlign: 'center',
            borderRadius: 1.5,
            boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
            bgcolor: activeTheme.colors.surface,
            border: `1px solid ${activeTheme.colors.danger300}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 800, fontSize: 18, color: activeTheme.colors.danger700 }}
          >
            12
          </Typography>
          <Typography
            sx={{
              color: activeTheme.colors.mutedText,
              fontSize: 11,
            }}
          >
            قيد الصيانة
          </Typography>
        </Card>
      </Box>
    </Box>
  )
}
