import React, { useState } from 'react'
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined'
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined'
import AppButton from './AppButton'
import { useTheme } from '../../theme/themeContext'
import { exportRowsToExcel, exportRowsToPdf } from '../../utils/exportUtils'

// زر تصدير موحّد (Excel/PDF) يُستخدم بأي صفحة تعرض جدول بيانات — يُصدّر البيانات المعروضة حالياً كما هي بدون طلب إضافي للـ API
export default function ExportMenu({ rows = [], columns = [], title = 'تقرير', filename = 'تقرير' }) {
  const { activeTheme } = useTheme()
  const { colors } = activeTheme
  const [anchorEl, setAnchorEl] = useState(null)
  const [exporting, setExporting] = useState(false)

  const handleExcel = () => {
    exportRowsToExcel(rows, columns, filename)
    setAnchorEl(null)
  }

  const handlePdf = async () => {
    setAnchorEl(null)
    setExporting(true)
    try {
      await exportRowsToPdf(rows, columns, title, filename)
    } finally {
      setExporting(false)
    }
  }

  return (
    <>
      <AppButton
        variant="outlined"
        icon={<FileDownloadOutlinedIcon />}
        iconPosition="end"
        backgroundColor="transparent"
        textColor={colors.text}
        borderColor={colors.border}
        borderRadius={2}
        px={2.5}
        py={0.7}
        fontSize={14}
        disabled={exporting || rows.length === 0}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ flexDirection: 'row-reverse' }}
      >
        {exporting ? 'جارٍ التصدير...' : 'تصدير'}
      </AppButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{ sx: { bgcolor: colors.surface, direction: 'rtl', minWidth: 180 } }}
      >
        <MenuItem onClick={handleExcel} sx={{ justifyContent: 'flex-end', gap: 1 }}>
          <ListItemText primaryTypographyProps={{ sx: { color: colors.text, fontSize: 14 } }}>Excel تنزيل</ListItemText>
          <ListItemIcon sx={{ minWidth: 'auto', color: colors.primary }}><TableChartOutlinedIcon fontSize="small" /></ListItemIcon>
        </MenuItem>
        <MenuItem onClick={handlePdf} sx={{ justifyContent: 'flex-end', gap: 1 }}>
          <ListItemText primaryTypographyProps={{ sx: { color: colors.text, fontSize: 14 } }}>PDF تنزيل</ListItemText>
          <ListItemIcon sx={{ minWidth: 'auto', color: colors.danger500 }}><PictureAsPdfOutlinedIcon fontSize="small" /></ListItemIcon>
        </MenuItem>
      </Menu>
    </>
  )
}
