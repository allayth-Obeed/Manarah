import { useMemo } from 'react' // ADDED: لحساب المدن المميزة بدون إعادة حساب كل رندر
import { Box, Typography, Card, MenuItem, Select } from '@mui/material' // ADDED: Select/MenuItem لفلتر المدينة الحقيقي
import AppButton from '../../components/common/AppButton'
import { useTheme } from '../../theme/themeContext'

// mosques: القائمة الحقيقية القادمة من الـ API (بدل الأرقام الثابتة السابقة)
// cityFilter/onCityFilterChange: تحكّم بالمدينة المختارة من الصفحة الأم لتفعيل الفلتر فعلياً
export default function FilterSearch({ mosques = [], cityFilter, onCityFilterChange, onApplyFilter }) {
  const { activeTheme } = useTheme()

  // قائمة المدن الفريدة المستخرجة من بيانات المساجد الحقيقية (لا يوجد حقل "حالة/صيانة" بالـ schema أصلاً)
  const cities = useMemo(
    () => Array.from(new Set(mosques.map((m) => m.city).filter(Boolean))),
    [mosques],
  )

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
          {/* فلتر المدينة الحقيقي: قيمة "" تعني كل المناطق، وإلا يُطبَّق فعلياً على الجدول بالصفحة الأم */}
          <Select
            size="small"
            value={cityFilter || ''}
            onChange={(event) => onCityFilterChange?.(event.target.value)}
            displayEmpty
            sx={{
              minWidth: 140,
              fontSize: 13,
              bgcolor: activeTheme.colors.btn,
              color: activeTheme.colors.mutedText,
              '.MuiOutlinedInput-notchedOutline': { borderColor: activeTheme.colors.border },
            }}
          >
            <MenuItem value="">كل المناطق</MenuItem>
            {cities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
          {/* تم حذف فلتر "كل الحالات": لا يوجد حقل حالة/صيانة حقيقي بنموذج المسجد بالباك اند */}
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
            {/* العدد الحقيقي لعدد المساجد بدل "1,240" الثابتة */}
            {mosques.length.toLocaleString('en-US')}
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
            {/* استبدال "قيد الصيانة" (حقل غير موجود بالباك اند) بعدد المدن المغطاة الحقيقي */}
            {cities.length.toLocaleString('en-US')}
          </Typography>
          <Typography
            sx={{
              color: activeTheme.colors.mutedText,
              fontSize: 11,
            }}
          >
            مدينة مغطاة
          </Typography>
        </Card>
      </Box>
    </Box>
  )
}
