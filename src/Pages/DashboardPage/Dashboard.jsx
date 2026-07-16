import React, { useState } from 'react'
import MainFun from "./MainFun";
import Statistics from "./Statistics";
import { AddMosqueDialog, AddAnnouncementDialog } from '../../components/Dialogs/DashboardDialogs'

const initialMosqueForm = { name: '', location: '', capacity: '', status: 'نشط' }
const initialAnnouncementForm = { title: '', content: '' }

export default function Dashboard() {
  const [mosqueOpen, setMosqueOpen] = useState(false)
  const [announcementOpen, setAnnouncementOpen] = useState(false)
  const [mosqueForm, setMosqueForm] = useState(initialMosqueForm)
  const [announcementForm, setAnnouncementForm] = useState(initialAnnouncementForm)

  const handleAddMosque = (form) => {
    console.log('New mosque:', form)
    setMosqueForm(initialMosqueForm)
  }

  const handleAddAnnouncement = (form) => {
    console.log('New announcement:', form)
    setAnnouncementForm(initialAnnouncementForm)
  }

  return (
    <div>
      <MainFun
        onAddClick={() => setMosqueOpen(true)}
        onAnnouncementClick={() => setAnnouncementOpen(true)}
      />
      <Statistics />

      <AddMosqueDialog
        open={mosqueOpen}
        setOpen={setMosqueOpen}
        form={mosqueForm}
        setForm={setMosqueForm}
        onSubmit={handleAddMosque}
      />
      <AddAnnouncementDialog
        open={announcementOpen}
        setOpen={setAnnouncementOpen}
        form={announcementForm}
        setForm={setAnnouncementForm}
        onSubmit={handleAddAnnouncement}
      />
    </div>
  )
}
