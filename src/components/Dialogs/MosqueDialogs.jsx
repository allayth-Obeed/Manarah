import React from 'react'
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import PersonIcon from '@mui/icons-material/Person'
import AppButton from '../common/AppButton'
import { useTheme } from '../../theme/themeContext'

const PREACHERS = [
  {
    id: 1,
    name: 'الشيخ عمر الرواف',
    role: 'إمام وخطيب',
    mosque: 'جامع الهدى',
    badge: 'متميز',
  },
  {
    id: 2,
    name: 'الشيخ إبراهيم الماجد',
    role: 'خطيب معتمد',
    mosque: 'مسجد التقوى',
    badge: 'جاهز للتعيين',
  },
  {
    id: 3,
    name: 'الشيخ يوسف عبدالباري',
    role: 'إمام جامع',
    mosque: 'جامع النور',
    badge: 'احتياطي',
  },
  {
    id: 4,
    name: 'الشيخ أحمد عبدالرزاق',
    role: 'خطيب جمعة',
    mosque: 'جامع الرحمة',
    badge: 'متاح الآن',
  },
]

export default function MosqueDialogs({
  addOpen,
  setAddOpen,
  mosqueForm,
  setMosqueForm,
  handleAddSubmit,
  assignOpen,
  setAssignOpen,
  searchTerm,
  setSearchTerm,
  selectedRow,
  selectedPreacherId,
  setSelectedPreacherId,
  filteredPreachers: externalFilteredPreachers,
  handleConfirmAssign,
  deleteOpen,
  setDeleteOpen,
  handleConfirmDelete,
  snackbarOpen,
  setSnackbarOpen,
  snackbarMessage,
}) {
  const { activeTheme } = useTheme()

  const filteredPreachers = externalFilteredPreachers ?? PREACHERS.filter((item) => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return true
    return [item.name, item.role, item.mosque, item.badge].some((field) =>
      String(field).toLowerCase().includes(query)
    )
  })

  return (
    <>
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 1,
            bgcolor: activeTheme.colors.surface,
            color: activeTheme.colors.text,
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: 800, color: activeTheme.colors.primary, pr: 6, textAlign: 'right' }}
        >
          تسجيل مسجد جديد
          <IconButton
            onClick={() => setAddOpen(false)}
            sx={{ position: 'absolute', left: 12, top: 12, color: activeTheme.colors.mutedText }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: activeTheme.colors.border }}>
          <Box component="form" onSubmit={handleAddSubmit} sx={{ display: 'grid', gap: 2 }}>
            <TextField
              label="اسم المسجد"
              value={mosqueForm.name}
              onChange={(event) => setMosqueForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="مثال: جامع الفاروق"
              fullWidth
            />
            <TextField
              label="الموقع"
              value={mosqueForm.location}
              onChange={(event) =>
                setMosqueForm((prev) => ({ ...prev, location: event.target.value }))
              }
              placeholder="مثال: حي الزهراء"
              fullWidth
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="اسم المسجد/الإمام"
                value={mosqueForm.imam}
                onChange={(event) =>
                  setMosqueForm((prev) => ({ ...prev, imam: event.target.value }))
                }
                placeholder="مثال: الشيخ ..."
                fullWidth
              />
              <TextField
                label="السعة"
                type="number"
                value={mosqueForm.capacity}
                onChange={(event) =>
                  setMosqueForm((prev) => ({ ...prev, capacity: event.target.value }))
                }
                placeholder="0"
                fullWidth
              />
            </Stack>
            <TextField
              select
              label="الحالة"
              value={mosqueForm.status}
              onChange={(event) =>
                setMosqueForm((prev) => ({ ...prev, status: event.target.value }))
              }
              fullWidth
            >
              <MenuItem value="نشط">نشط</MenuItem>
              <MenuItem value="تحت الصيانة">تحت الصيانة</MenuItem>
              <MenuItem value="إجازة">إجازة</MenuItem>
            </TextField>
            <TextField
              label="ملاحظات إضافية (اختياري)"
              value={mosqueForm.notes}
              onChange={(event) =>
                setMosqueForm((prev) => ({ ...prev, notes: event.target.value }))
              }
              placeholder="أدخل أي ملاحظات حول المسجد أو موقعه"
              multiline
              minRows={4}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1, justifyContent: 'space-between' }}>
          <AppButton
            variant="outlined"
            backgroundColor={activeTheme.colors.border}
            textColor={activeTheme.colors.text}
            borderColor={activeTheme.colors.border}
            onClick={() => setAddOpen(false)}
          >
            إلغاء
          </AppButton>
          <AppButton
            variant="contained"
            backgroundColor={activeTheme.colors.primary}
            textColor={activeTheme.colors.onPrimary}
            borderColor={activeTheme.colors.primary}
            onClick={handleAddSubmit}
          >
            حفظ البيانات
          </AppButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            bgcolor: activeTheme.colors.surface,
            color: activeTheme.colors.text,
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: 800, color: activeTheme.colors.primary, pr: 6, textAlign: 'right' }}
        >
          تعيين خطيب للجمعة
          <IconButton
            onClick={() => setAssignOpen(false)}
            sx={{ position: 'absolute', left: 12, top: 12, color: activeTheme.colors.mutedText }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: activeTheme.colors.border }}>
          <Stack spacing={2}>
            <TextField
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="بحث عن موظف..."
              fullWidth
            />
            <Typography sx={{ color: activeTheme.colors.mutedText, fontSize: 13 }}>
              اختر من القائمة لتعيين الخطيب للمسجد {selectedRow?.mosque || ''}
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 1.5,
              }}
            >
              {filteredPreachers.map((item) => {
                const isSelected = item.id === selectedPreacherId

                return (
                  <Card
                    key={item.id}
                    onClick={() => setSelectedPreacherId(item.id)}
                    sx={{
                      cursor: 'pointer',
                      borderRadius: 3,
                      border: `1px solid ${isSelected ? activeTheme.colors.primary : activeTheme.colors.border}`,
                      boxShadow: isSelected ? '0 10px 24px rgba(0,0,0,0.08)' : 'none',
                      bgcolor: isSelected ? 'rgba(6,95,70,0.04)' : activeTheme.colors.surface,
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" spacing={1.4} alignItems="center">
                          <Avatar
                            sx={{
                              bgcolor: activeTheme.colors.bgelem,
                              color: activeTheme.colors.primary,
                            }}
                          >
                            <PersonIcon />
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 800 }}>{item.name}</Typography>
                            <Typography sx={{ fontSize: 12, color: activeTheme.colors.mutedText }}>
                              {item.role}
                            </Typography>
                            <Typography sx={{ fontSize: 11, color: activeTheme.colors.mutedText }}>
                              {item.mosque}
                            </Typography>
                          </Box>
                        </Stack>
                        <Stack spacing={0.5} alignItems="flex-start">
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              borderRadius: '50%',
                              border: `2px solid ${isSelected ? activeTheme.colors.primary : activeTheme.colors.border}`,
                              bgcolor: isSelected ? activeTheme.colors.primary : 'transparent',
                            }}
                          />
                          <Typography sx={{ fontSize: 11, color: activeTheme.colors.primary }}>
                            {item.badge}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                )
              })}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1 }}>
          <AppButton
            variant="outlined"
            backgroundColor={activeTheme.colors.border}
            textColor={activeTheme.colors.text}
            borderColor={activeTheme.colors.border}
            onClick={() => setAssignOpen(false)}
          >
            إغلاق القائمة
          </AppButton>
          <AppButton
            variant="contained"
            backgroundColor={activeTheme.colors.primary}
            textColor={activeTheme.colors.onPrimary}
            borderColor={activeTheme.colors.primary}
            onClick={handleConfirmAssign}
          >
            تأكيد التعيين
          </AppButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            bgcolor: activeTheme.colors.surface,
            color: activeTheme.colors.text,
          },
        }}
      >
        <DialogContent sx={{ pt: 4, pb: 2, textAlign: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 2,
              borderRadius: 3,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'rgba(220, 38, 38, 0.08)',
              color: '#C81E1E',
            }}
          >
            <DeleteIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography sx={{ fontWeight: 900, fontSize: 22, mb: 1 }}>تأكيد حذف السجل</Typography>
          <Typography sx={{ color: activeTheme.colors.mutedText, fontSize: 14, lineHeight: 1.8 }}>
            هل أنت متأكد من رغبتك في حذف ملف {selectedRow?.mosque || 'هذا المسجد'}؟ هذا الإجراء
            نهائي ولا يمكن التراجع عنه بعد التنفيذ.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 2.5, pb: 3, gap: 1, justifyContent: 'center' }}>
          <AppButton
            variant="contained"
            backgroundColor="#C81E1E"
            textColor="#FFFFFF"
            borderColor="#C81E1E"
            onClick={handleConfirmDelete}
          >
            نعم، حذف السجل
          </AppButton>
          <AppButton
            variant="outlined"
            backgroundColor={activeTheme.colors.surface}
            textColor={activeTheme.colors.text}
            borderColor={activeTheme.colors.border}
            onClick={() => setDeleteOpen(false)}
          >
            تراجع عن الإجراء
          </AppButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2800}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ alignItems: 'center', minWidth: 280, boxShadow: 3 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
