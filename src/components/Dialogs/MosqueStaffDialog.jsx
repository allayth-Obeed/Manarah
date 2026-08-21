import React from 'react'
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography, Chip, Avatar } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import PersonIcon from '@mui/icons-material/Person'
import MosqueOutlinedIcon from '@mui/icons-material/MosqueOutlined'
import { useTheme } from '../../theme/themeContext'

const assignmentRoleLabels = { IMAM: 'إمام دائم', KHATIB: 'خطيب جمعة' }

// خارج المكوّن عمداً: إنشاء مكوّن داخل الـ render يفقد حالته ويكسر تحسينات React Compiler بهذا المشروع
function StaffRow({ icon, title, subtitle, badge, colors }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: colors.bgelem }}>
      <Avatar sx={{ width: 36, height: 36 }}>{icon || <PersonIcon fontSize="small" />}</Avatar>
      <Box sx={{ flex: 1, textAlign: 'right' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{title}</Typography>
        {subtitle && <Typography sx={{ fontSize: 12, color: colors.mutedText }}>{subtitle}</Typography>}
      </Box>
      {badge && <Chip label={badge} size="small" sx={{ bgcolor: colors.accent, color: colors.primary, fontWeight: 700 }} />}
    </Box>
  )
}

// بطاقة "من يعمل بهذا المسجد": الأئمة/الخطباء المُكلَّفون حالياً + الكادر الوظيفي (مؤذن/إداري...)
// تُبنى من بيانات المسجد الخام القادمة أصلاً مع GET /mosques (preachers + employees) دون أي طلب إضافي
export default function MosqueStaffDialog({ open, onClose, mosque }) {
  const { activeTheme } = useTheme()
  const { colors } = activeTheme

  const activePreachers = (mosque?.preachers || []).filter((a) => a.isActive)
  const employees = mosque?.employees || []

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { borderRadius: 3, bgcolor: colors.surface, color: colors.text, maxWidth: 560, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 4, pt: 4, pb: 0, mb: 2 }}>
        <IconButton onClick={onClose} sx={{ color: colors.mutedText, p: 0, '& svg': { fontSize: 22 } }}><CloseIcon /></IconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderRight: `4px solid ${colors.secondary}`, pr: 1.5 }}>
          <MosqueOutlinedIcon sx={{ fontSize: 20, color: colors.primary }} />
          <Typography sx={{ fontFamily: '"IBM Plex Sans Arabic", sans-serif', fontWeight: 700, fontSize: 20, color: colors.primary, lineHeight: '28px' }}>
            {mosque?.name || 'المسجد'}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ px: 4, pt: 2, pb: 4 }}>
        <Stack spacing={2.5} sx={{ direction: 'rtl' }}>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 800, color: colors.primary, mb: 1 }}>الإمامة والخطابة</Typography>
            {activePreachers.length === 0 ? (
              <Typography sx={{ fontSize: 13, color: colors.mutedText }}>لا يوجد خطيب أو إمام مُكلَّف حالياً</Typography>
            ) : (
              <Stack spacing={1}>
                {activePreachers.map((a) => (
                  <StaffRow
                    key={a.id}
                    title={a.preacher ? `${a.preacher.firstName} ${a.preacher.lastName}` : 'خطيب'}
                    subtitle={a.preacher?.specialization}
                    badge={assignmentRoleLabels[a.role] || a.role}
                    colors={colors}
                  />
                ))}
              </Stack>
            )}
          </Box>

          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 800, color: colors.primary, mb: 1 }}>الكادر الوظيفي</Typography>
            {employees.length === 0 ? (
              <Typography sx={{ fontSize: 13, color: colors.mutedText }}>لا يوجد موظفون مرتبطون بهذا المسجد حالياً</Typography>
            ) : (
              <Stack spacing={1}>
                {employees.map((emp) => (
                  <StaffRow key={emp.id} title={`${emp.firstName} ${emp.lastName}`} badge={emp.position} colors={colors} />
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
