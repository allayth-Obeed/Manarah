import React, { useState } from 'react'
import MainFun from './../DashboardPage/MainFun'
import MainAssignment from './MainAssignment'
import PreachersDialogs from '../../components/Dialogs/PreachersDialogs'
import { ConfirmAssignDialog } from '../../components/Dialogs/DashboardDialogs'

const initialPreacherForm = {
  name: '',
  nationalId: '',
  jobTitle: '',
  hireDate: '',
  experience: '',
}

export default function Preachers() {
  const [addOpen, setAddOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [preacherForm, setPreacherForm] = useState(initialPreacherForm)
  const [assignConfirmOpen, setAssignConfirmOpen] = useState(false)

  const handleAddSubmit = (e) => {
    e?.preventDefault()
    console.log('Preacher form submitted:', preacherForm)
    setAddOpen(false)
    setPreacherForm(initialPreacherForm)
  }

  const handleConfirmDelete = () => {
    console.log('Preacher deleted:', selectedRow?.name)
    setDeleteOpen(false)
    setSelectedRow(null)
  }

  const handleConfirmAssign = () => {
    console.log('Assignment confirmed!')
    setAssignConfirmOpen(false)
  }

  return (
    <div>
      <MainFun
        title="توزيع الخطباء"
        description="إدارة وتكليف خطباء الجمعة للمساجد التابعة للمديرية"
        announcementButton="إعلان تكليف"
        addButton="إضافة خطيب"
        onAddClick={() => setAddOpen(true)}
      />

      <MainAssignment onConfirmAssign={() => setAssignConfirmOpen(true)} />

      <PreachersDialogs
        addOpen={addOpen}
        setAddOpen={setAddOpen}
        preacherForm={preacherForm}
        setPreacherForm={setPreacherForm}
        handleAddSubmit={handleAddSubmit}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        selectedRow={selectedRow}
        handleConfirmDelete={handleConfirmDelete}
      />

      <ConfirmAssignDialog
        open={assignConfirmOpen}
        setOpen={setAssignConfirmOpen}
        preacherName="د. محمد راتب النابلسي"
        mosqueName="مسجد الملك عبدالله الأول"
        onConfirm={handleConfirmAssign}
      />
    </div>
  )
}
