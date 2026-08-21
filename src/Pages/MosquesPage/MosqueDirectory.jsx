import React, { useEffect, useState } from 'react'
import { Box, TextField, Typography, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import MosqueOutlinedIcon from '@mui/icons-material/MosqueOutlined'
import MainFun from '../DashboardPage/MainFun'
import MosqueStaffDialog from '../../components/Dialogs/MosqueStaffDialog'
import { useTheme } from '../../theme/themeContext'
import { getAllMosques } from '../../services/mosqueService'

// دليل مساجد للقراءة فقط (خطيب/موظف/مستخدم عادي): بحث بالاسم/الموقع، وعرض بطاقة "من يعمل بهذا المسجد"
// لكل نتيجة — بلا أي زر إضافة/تعديل/حذف (تلك إدارة كاملة تخص ADMIN/MANAGER بصفحة "المساجد")
export default function MosqueDirectory() {
  const { activeTheme } = useTheme()
  const { colors } = activeTheme

  const [mosques, setMosques] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [staffDialogOpen, setStaffDialogOpen] = useState(false)
  const [selectedMosque, setSelectedMosque] = useState(null)

  useEffect(() => {
    getAllMosques()
      .then(setMosques)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const query = search.trim().toLowerCase()
  const filtered = query
    ? mosques.filter((m) => `${m.name} ${m.city || ''} ${m.address || ''}`.toLowerCase().includes(query))
    : mosques

  return (
    <div>
      <MainFun
        title="دليل المساجد"
        description="ابحث عن مسجد لمعرفة الإمام والخطيب والكادر الوظيفي العامل فيه."
        showAnnouncementButton={false}
        showAddButton={false}
      />

      <Box sx={{ mt: 2.5, mb: 2 }}>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث باسم المسجد أو الموقع..."
          fullWidth
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: colors.mutedText }} /></InputAdornment> }}
          sx={{
            '& .MuiOutlinedInput-root': { bgcolor: colors.bgelem, borderRadius: 2, '& fieldset': { border: 'none' } },
            '& input': { textAlign: 'right', fontFamily: '"IBM Plex Sans Arabic", sans-serif', color: colors.text },
          }}
        />
      </Box>

      {loading ? (
        <Typography sx={{ p: 3, textAlign: 'center', color: colors.mutedText }}>جارٍ التحميل...</Typography>
      ) : filtered.length === 0 ? (
        <Typography sx={{ p: 3, textAlign: 'center', color: colors.mutedText }}>لا توجد نتائج مطابقة</Typography>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
          {filtered.map((m) => (
            <Box
              key={m.id}
              onClick={() => {
                setSelectedMosque(m)
                setStaffDialogOpen(true)
              }}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: colors.surface,
                border: `1px solid ${colors.border}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                '&:hover': { borderColor: colors.primary },
              }}
            >
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: colors.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MosqueOutlinedIcon sx={{ color: colors.primary, fontSize: 20 }} />
              </Box>
              <Box sx={{ textAlign: 'right', minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 14, color: colors.text }} noWrap>{m.name}</Typography>
                <Typography sx={{ fontSize: 12, color: colors.mutedText }} noWrap>{m.city || m.address || '—'}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      <MosqueStaffDialog open={staffDialogOpen} onClose={() => setStaffDialogOpen(false)} mosque={selectedMosque} />
    </div>
  )
}
