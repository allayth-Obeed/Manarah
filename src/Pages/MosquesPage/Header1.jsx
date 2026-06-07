import { Box, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useTheme } from '../../theme/themeContext'
import AppButton from '../../components/common/AppButton'

export default function Header1({ onAddMosque }) {
  const { activeTheme } = useTheme()
  return (
    <Box style={{ display: 'flex', justifyContent: 'space-between'}}>
      <AppButton
        variant="contained"
        dir="ltr"
        icon={<AddIcon sx={{ border: '2px solid', borderRadius: '50%', fontSize: 14 }} />}
        iconPosition="end"
        backgroundColor={activeTheme.colors.primary}
        textColor={activeTheme.colors.onPrimary}
        borderColor={activeTheme.colors.primary}
        hoverBackgroundColor={activeTheme.colors.primary}
        width={198.28}
        height={48}
        minWidth={198.28}
        borderRadius={1.5}
        fontSize={16}
        sx={{ justifyContent: 'flex-end', boxShadow: '2px 2px 7px rgba(0,0,0,0.7)' }}
        onClick={onAddMosque}
      >
        <Box component="span" dir="rtl">
          إضافة مسجد جديد
        </Box>
      </AppButton>
      <Box dir="rtl">
        <Typography
          variant="h5"
          sx={{
            textShadow: '2px 2px 2px rgba(0 , 0 , 0 , 0.3)',
            color: activeTheme.colors.primary,
            fontWeight: 700,
          }}
        >
          إدارة المساجد
        </Typography>
        <Typography sx={{ color: activeTheme.colors.mutedText, fontSize: 14, mt: 0.5 }}>
          عرض وتحديث بيانات المساجد المسجلة في المديرية
        </Typography>
      </Box>
    </Box>
  )
}
