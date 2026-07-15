import React from 'react'
import { Box } from '@mui/material'
import Header1 from './Header1'
import FilterSearch from './FilterSearch'
import MyTable from './MyTable'
import ReportsAndValid from './ReportsAndValid'
import MosqueDialogs from '../../components/Dialogs/MosqueDialogs'

const initialMosqueForm = {
  name: '',
  location: '',
  imam: '',
  capacity: '',
  status: 'نشط',
  notes: '',
}

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

export default function Mosque() {
  const [addOpen, setAddOpen] = React.useState(false)
  const [assignOpen, setAssignOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [snackbarOpen, setSnackbarOpen] = React.useState(false)
  const [snackbarMessage, setSnackbarMessage] = React.useState('')
  const [selectedRow, setSelectedRow] = React.useState(null)
  const [selectedPreacherId, setSelectedPreacherId] = React.useState(PREACHERS[0].id)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [mosqueForm, setMosqueForm] = React.useState(initialMosqueForm)

  const filteredPreachers = PREACHERS.filter((item) => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return true
    return [item.name, item.role, item.mosque, item.badge].some((field) =>
      String(field).toLowerCase().includes(query)
    )
  })

  const openToast = (message) => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }

  const handleAddMosque = () => {
    setMosqueForm(initialMosqueForm)
    setAddOpen(true)
  }

  const handleApplyFilter = () => {
    openToast('تم تطبيق الفلترة بنجاح')
  }

  const handleRowMoreClick = (row) => {
    setSelectedRow(row)
    setSearchTerm('')
    setSelectedPreacherId(PREACHERS[0].id)
    setAssignOpen(true)
  }

  const handleRowDeleteClick = (row) => {
    setSelectedRow(row)
    setDeleteOpen(true)
  }

  const handleAddSubmit = (event) => {
    event.preventDefault()
    setAddOpen(false)
    openToast('تم حفظ المسجد الجديد بنجاح')
  }

  const handleConfirmAssign = () => {
    const selectedPreacher = PREACHERS.find((item) => item.id === selectedPreacherId)
    setAssignOpen(false)
    openToast(
      `تم تعيين ${selectedPreacher?.name || 'الخطيب'} إلى ${selectedRow?.mosque || 'المسجد'}`
    )
  }

  const handleConfirmDelete = () => {
    setDeleteOpen(false)
    openToast(`تم حذف سجل ${selectedRow?.mosque || 'المسجد'} بنجاح`)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Header1 onAddMosque={handleAddMosque} />
      <FilterSearch onApplyFilter={handleApplyFilter} />
      <MyTable onRowMoreClick={handleRowMoreClick} onRowDeleteClick={handleRowDeleteClick} />
      <ReportsAndValid />

      <MosqueDialogs
        addOpen={addOpen}
        setAddOpen={setAddOpen}
        mosqueForm={mosqueForm}
        setMosqueForm={setMosqueForm}
        handleAddSubmit={handleAddSubmit}
        assignOpen={assignOpen}
        setAssignOpen={setAssignOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRow={selectedRow}
        selectedPreacherId={selectedPreacherId}
        setSelectedPreacherId={setSelectedPreacherId}
        filteredPreachers={filteredPreachers}
        handleConfirmAssign={handleConfirmAssign}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        handleConfirmDelete={handleConfirmDelete}
        snackbarOpen={snackbarOpen}
        setSnackbarOpen={setSnackbarOpen}
        snackbarMessage={snackbarMessage}
      />
    </Box>
  )
}

