import React, { useState, useEffect } from 'react' // ADDED: React hooks for state and lifecycle management
import DonationsHeader from './DonationsHeader' // ADDED: Header component with action buttons for donations page
import DonationsOverview from './DonationsOverview' // ADDED: Overview component showing donation list/table
import DonationsDialogs from '../../components/Dialogs/DonationsDialogs' // ADDED: Dialog component for add/details/delete donation

// ============= استيراد خدمات API =============
// ✅ تم الربط مع الـ API الحقيقي للتبرعات والمساجد
import { getAllDonations, createDonation, deleteDonation } from '../../services/donationService' // ADDED: Donation CRUD API functions
import { getAllMosques } from '../../services/mosqueService' // ADDED: Mosque API to fetch mosque list for dropdown

export default function Donations() {
  // ============= State Management =============
  const [addOpen, setAddOpen] = useState(false) // ADDED: State for add donation dialog
  const [detailsOpen, setDetailsOpen] = useState(false) // ADDED: State for donation details dialog
  const [deleteOpen, setDeleteOpen] = useState(false) // ADDED: State for delete confirmation dialog
  const [selectedRow, setSelectedRow] = useState(null) // ADDED: State for the currently selected donation row
  const [donationForm, setDonationForm] = useState({ // ADDED: State for add donation form fields
    donorName: '',
    amount: '',
    mosqueId: '',
    purpose: '',
    notes: '',
  })

  // ✅ حالة البيانات من الـ API
  const [donations, setDonations] = useState([]) // ADDED: State for donations list from API
  const [mosques, setMosques] = useState([]) // ADDED: State for mosques list from API
  const [error, setError] = useState(null) // ADDED: State for error messages
  const [loading, setLoading] = useState(false) // ADDED: State for loading indicator during API calls

  // ============= جلب البيانات من الـ API عند تحميل الصفحة =============
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true) // ADDED: Set loading state to true when starting data fetch
      try {
        const [donationsData, mosquesData] = await Promise.all([
          getAllDonations(),
          getAllMosques(),
        ])
        setDonations(donationsData) // ADDED: Store donations data from API
        setMosques(mosquesData) // ADDED: Store mosques data from API
        setError(null) // ADDED: Clear any previous errors
      } catch (err) {
        console.error('خطأ في جلب البيانات:', err)
        setError('فشل في جلب البيانات') // ADDED: Set error message for display
      } finally {
        setLoading(false) // ADDED: Set loading state to false when data fetch completes
      }
    }

    fetchData()
  }, [])

  // ============= إضافة تبرع جديد (API) =============
  const handleAddSubmit = async (e) => {
    e?.preventDefault()
    try {
      await createDonation({
        donorName: donationForm.donorName,
        amount: Number(donationForm.amount),
        mosqueId: Number(donationForm.mosqueId),
        purpose: donationForm.purpose || undefined,
        notes: donationForm.notes || undefined,
      })

      // إعادة جلب القائمة المحدثة
      const updatedData = await getAllDonations()
      setDonations(updatedData)

      setAddOpen(false)
      setDonationForm({ donorName: '', amount: '', mosqueId: '', purpose: '', notes: '' })
    } catch (err) {
      console.error('خطأ في إضافة التبرع:', err)
      setError('فشل في إضافة التبرع')
    }
  }

  // ============= حذف تبرع (API) =============
  const handleConfirmDelete = async () => {
    try {
      await deleteDonation(selectedRow.id)

      // إعادة جلب القائمة المحدثة
      const updatedData = await getAllDonations()
      setDonations(updatedData)

      setDeleteOpen(false)
      setSelectedRow(null)
      setError(null)
    } catch (err) {
      console.error('خطأ في حذف التبرع:', err)
      const msg = err?.response?.data?.message || err?.message || 'فشل في حذف التبرع'
      setError(`فشل في حذف التبرع: ${msg}`)
    }
  }

  return (
    <div>
      <DonationsHeader
        onAddClick={() => setAddOpen(true)}
        donations={donations}
        mosques={mosques}
      />

      {/* ADDED: عرض حالة التحميل أثناء جلب البيانات من الـ API */}
      {loading && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>
          جارٍ تحميل بيانات التبرعات...
        </div>
      )}

      {/* عرض رسالة الخطأ إن وجدت */}
      {error && !loading && (
        <div style={{ color: 'red', padding: '10px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* ADDED: إخفاء المحتوى أثناء التحميل الأولي */}
      {!loading && (
        <DonationsOverview
          donations={donations}
          onRowClick={(row) => {
            setSelectedRow(row)
            setDetailsOpen(true)
          }}
          onDeleteClick={(row) => {
            setSelectedRow(row)
            setDeleteOpen(true)
          }}
        />
      )}

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
        mosques={mosques}
      />
    </div>
  )
}
