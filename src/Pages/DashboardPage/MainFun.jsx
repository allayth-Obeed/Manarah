import { Box, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined'
import AppButton from '../../components/common/AppButton'
import { useTheme } from '../../theme/themeContext'

const defaultLabels = {
  title: 'لوحة التحكم',
  description: 'نظرة عامة على نشاط المديرية والأصول الوقفية لهذا اليوم.',
  announcementButton: 'إعلان جديد',
  addButton: 'إضافة مسجد',
}

export default function MainFun({
  title = defaultLabels.title,
  description = defaultLabels.description,
  announcementButton = defaultLabels.announcementButton,
  addButton = defaultLabels.addButton,
}) {
  const { activeTheme } = useTheme()
  return (
    <div>
      <Box
        dir="rtl"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography
            variant="h4"
            sx={{
              color: activeTheme.colors.primary,
              fontWeight: 700,
              fontSize: 24,
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ color: activeTheme.colors.mutedText }}>{description}</Typography>
        </Box>
        <Box>
          <AppButton
            variant="contained"
            icon={<CampaignOutlinedIcon />}
            iconPosition="end"
            iconColor={activeTheme.colors.primary}
            backgroundColor={activeTheme.colors.btn}
            textColor={activeTheme.colors.text}
            borderColor={activeTheme.colors.border}
            borderRadius={3}
            px={0}
            py={0.8}
            fontSize={14}
            minWidth={140}
            sx={{ mr: 2, boxShadow: '0 6px 12px rgba(0,0,0,0.08)', flexDirection: 'row-reverse' }}
          >
            {announcementButton}
          </AppButton>
          <AppButton
            variant="contained"
            backgroundColor={activeTheme.colors.primary}
            textColor={activeTheme.colors.onPrimary}
            borderColor={activeTheme.colors.primary}
            hoverBackgroundColor={activeTheme.colors.primary}
            borderRadius={3}
            px={0}
            py={0.8}
            fontSize={14}
            minWidth={140}
            sx={{ mr: 2, boxShadow: '0 6px 12px rgba(0,0,0,0.08)', flexDirection: 'row-reverse' }}
          >
            {addButton}
          </AppButton>
        </Box>
      </Box>
    </div>
  )
}
