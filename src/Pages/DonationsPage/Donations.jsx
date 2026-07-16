import React, { useState } from 'react'
import DonationsHeader from './DonationsHeader.jsx'
import DonationsOverview from './DonationsOverview.jsx'
import DonationsDialogs from '../../components/Dialogs/DonationsDialogs'

const initialDonationForm = {
  donorName: '',
  amount: '',
  type: 'تبرع عام',
  date: '',
  allocation: 'عام',
  notes: '',
}

export default function Donations() {
  const [addOpen, setAddOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [donationForm, setDonationForm] = useState(initialDonationForm)

  const handleAddSubmit = (e) => {
    e?.preventDefault()
    console.log('Donation form submitted:', donationForm)
    setAddOpen(false)
    setDonationForm(initialDonationForm)
  }

  const handleConfirmDelete = () => {
    console.log('Donation deleted')
    setDeleteOpen(false)
    setSelectedRow(null)
  }

  return (
    <div className="min-h-screen bg-[#F7F8F6] px-4 py-4">
      <DonationsHeader onAddClick={() => setAddOpen(true)} />
      <DonationsOverview onRowClick={(row) => { setSelectedRow(row); setDetailsOpen(true); }} />

      <DonationsDialogs
        addOpen={addOpen}
        setAddOpen={setAddOpen}
        donationForm={donationForm}
        setDonationForm={setDonationForm}
        handleAddSubmit={handleAddSubmit}
        detailsOpen={detailsOpen}
        setDetailsOpen={setDetailsOpen}
        selectedRow={selectedRow}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        handleConfirmDelete={handleConfirmDelete}
      />
    </div>
  )
}
