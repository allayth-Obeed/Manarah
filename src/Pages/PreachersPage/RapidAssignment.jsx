import React from 'react'

import { Avatar, Box, Card, CardContent, Typography } from '@mui/material'

import { useTheme } from '../../theme/themeContext'
import { CalendarToday, HomeWorkOutlined, WarningAmber, Settings } from '@mui/icons-material'
import AppButton from '../../components/common/AppButton'

export default function RapidAssignment() {
  const { activeTheme } = useTheme()

  return (
    <Box sx={{ direction: 'rtl' }}>
      {/* Form Card */}
      <Card sx={{ borderRadius: 2, p: 2, background: activeTheme.colors.surface }}>
        <CardContent sx={{ p: 0 }}>
          {/* Date Box */}
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                background: activeTheme.colors.panelBg,
                px: 2,
                py: 1,
                borderRadius: 1.5,
              }}
            >
              <CalendarToday fontSize="small" color="action" />
              <Typography fontWeight={700} fontSize={13}>
                27 أكتوبر 2023
              </Typography>
            </Box>
          </Box>

          {/* Mosque */}
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <HomeWorkOutlined fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              المسجد المستهدف
            </Typography>
          </Box>

          <Box
            sx={{
              p: 1.5,
              background: activeTheme.colors.panelBg,
              borderRadius: 1.5,
              mb: 2,
            }}
          >
            <Typography variant="body2" fontWeight={600} color={activeTheme.colors.text}>
              مسجد الملك عبدالله الأول
            </Typography>
          </Box>

          {/* Imam */}
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Typography variant="body2" color="text.secondary">
              المحطوب المختار
            </Typography>
          </Box>

          <Box
            display="flex"
            gap={1}
            sx={{
              p: 1.5,
              background: activeTheme.colors.panelBg,
              borderRadius: 1.5,
              mb: 2,
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                background: activeTheme.colors.primaryDark,
                fontSize: 12,
              }}
            >
              م
            </Avatar>
            <Typography variant="body2" fontWeight={600} color={activeTheme.colors.text}>
              د. محمد راتب النابلسي
            </Typography>
          </Box>

          {/* Warning Box */}
          <Box
            sx={{
              background: activeTheme.colors.danger100,
              border: `1px solid ${activeTheme.colors.danger300}`,
              color: activeTheme.colors.danger700,
              p: 2,
              borderRadius: 1.5,
              mb: 2,
              display: 'flex',
              gap: 1,
              alignItems: 'flex-start',
            }}
          >
            <WarningAmber sx={{ flexShrink: 0, mt: 0.5 }} />
            <Typography variant="body2" fontSize={12}>
              تحذير من تدخل الخطيب المختار في تكليف مسبق في مسجد آخر لنفس اليوم.
            </Typography>
          </Box>

          {/* Confirm Button */}
          <AppButton
            variant="contained"
            fullWidth
            icon={<Settings />}
            iconPosition="start"
            iconColor="#fff"
            backgroundColor={activeTheme.colors.primaryDark}
            textColor={activeTheme.colors.onPrimary}
            borderColor={activeTheme.colors.primaryDark}
            hoverBackgroundColor={activeTheme.colors.primaryDark}
            py={1.5}
            borderRadius={2}
          >
            تثبيت التكليف
          </AppButton>
        </CardContent>
      </Card>
    </Box>
  )
}
