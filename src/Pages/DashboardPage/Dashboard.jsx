import React, { useState, useEffect } from 'react'
import MainFun from "./MainFun";
import Statistics from "./Statistics";
import { AddMosqueDialog, AddAnnouncementDialog } from '../../components/Dialogs/DashboardDialogs'

// ============= استيراد خدمات API =============
// ✅ تم الربط مع الـ API الحقيقي للحصول على إحصائيات لوحة التحكم
import { getAllMosques, createMosque } from '../../services/mosqueService'
import { getAllAnnouncements, createAnnouncement } from '../../services/announcementService'
import { getAllDonations } from '../../services/donationService'
import { getAllPreachers } from '../../services/preacherService'
import { getAllEmployees } from '../../services/employeeService'
import { useCurrentUser } from '../../context/userContext' // ADDED: لإخفاء أزرار الكتابة عن المستخدمين ذوي صلاحية القراءة فقط

const initialMosqueForm = { name: '', address: '', city: '', phone: '', capacity: '' }
const initialAnnouncementForm = { title: '', content: '', mosqueId: '', priority: 'MEDIUM' }

export default function Dashboard() {
  const { canWrite } = useCurrentUser() // ADDED
  const [mosqueOpen, setMosqueOpen] = useState(false)
  const [announcementOpen, setAnnouncementOpen] = useState(false)
  const [mosqueForm, setMosqueForm] = useState(initialMosqueForm)
  const [announcementForm, setAnnouncementForm] = useState(initialAnnouncementForm)

  // ✅ حالة البيانات من الـ API
  const [mosques, setMosques] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [donations, setDonations] = useState([])
  const [preachers, setPreachers] = useState([])
  const [employees, setEmployees] = useState([])
  const [error, setError] = useState(null)

  // ============= جلب جميع البيانات عند تحميل الصفحة =============
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [mosquesData, announcementsData, donationsData, preachersData, employeesData] =
          await Promise.all([
            getAllMosques(),
            getAllAnnouncements(),
            getAllDonations(),
            getAllPreachers(),
            getAllEmployees(),
          ])

        setMosques(mosquesData)
        setAnnouncements(announcementsData)
        setDonations(donationsData)
        setPreachers(preachersData)
        setEmployees(employeesData)
        setError(null)
      } catch (err) {
        console.error('خطأ في جلب البيانات:', err)
        setError('فشل في جلب بيانات لوحة التحكم')
      }
    }

    fetchAllData()
  }, [])

  // ============= إضافة مسجد جديد (API) =============
  const handleAddMosque = async (form) => {
    try {
      await createMosque({
        name: form.name,
        address: form.address || form.city || form.location,
        city: form.city || form.location || '',
        capacity: form.capacity ? Number(form.capacity) : undefined,
      })

      // إعادة جلب القائمة المحدثة
      const updatedData = await getAllMosques()
      setMosques(updatedData)

      setMosqueForm(initialMosqueForm)
    } catch (err) {
      console.error('خطأ في إضافة المسجد:', err)
      setError('فشل في إضافة المسجد')
    }
  }

  // ============= إضافة إعلان جديد (API) =============
  const handleAddAnnouncement = async (form) => {
    try {
      await createAnnouncement({
        title: form.title,
        content: form.content,
        mosqueId: form.mosqueId ? Number(form.mosqueId) : mosques[0]?.id || 1,
        priority: form.priority || 'MEDIUM',
      })

      // إعادة جلب القائمة المحدثة
      const updatedData = await getAllAnnouncements()
      setAnnouncements(updatedData)

      setAnnouncementForm(initialAnnouncementForm)
    } catch (err) {
      console.error('خطأ في إضافة الإعلان:', err)
      setError('فشل في إضافة الإعلان')
    }
  }

  return (
    <div>
      {/* عرض رسالة الخطأ إن وجدت */}
      {error && (
        <div style={{ color: 'red', padding: '10px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <MainFun
        onAddClick={() => setMosqueOpen(true)}
        onAnnouncementClick={() => setAnnouncementOpen(true)}
        showAddButton={canWrite} // ADDED: إخفاء أزرار الإضافة عن المستخدمين ذوي صلاحية القراءة فقط
        showAnnouncementButton={canWrite} // ADDED
      />

      {/* ✅ تمرير البيانات الحقيقية من الـ API إلى Statistics */}
      <Statistics
        mosques={mosques}
        announcements={announcements}
        donations={donations}
        preachers={preachers}
        employees={employees}
      />

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
        mosques={mosques}
      />
    </div>
  )
}
