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
import { getRegionsTree } from '../../services/regionService' // ADDED: شجرة التقسيم الجغرافي لمنتقي الموقع بنموذج الإضافة السريع
import { findSelectedLocationName } from '../../utils/regionUtils' // ADDED
import { useCurrentUser } from '../../context/userContext' // ADDED: لإخفاء أزرار الكتابة عن المستخدمين ذوي صلاحية القراءة فقط

// MODIFIED: أُضيفت حقول التصنيف الجغرافي الأربعة لنموذج الإضافة السريع
const initialMosqueForm = { name: '', address: '', city: '', phone: '', capacity: '', provinceId: '', regionId: '', subRegionId: '', locationId: '' }
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
  const [regionsTree, setRegionsTree] = useState([]) // ADDED: شجرة التقسيم الجغرافي
  const [error, setError] = useState(null)

  // ============= جلب جميع البيانات عند تحميل الصفحة =============
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [mosquesData, announcementsData, donationsData, preachersData, employeesData, regionsTreeData] =
          await Promise.all([
            getAllMosques(),
            getAllAnnouncements(),
            getAllDonations(),
            getAllPreachers(),
            getAllEmployees(),
            getRegionsTree(),
          ])

        setMosques(mosquesData)
        setAnnouncements(announcementsData)
        setDonations(donationsData)
        setPreachers(preachersData)
        setEmployees(employeesData)
        setRegionsTree(regionsTreeData) // ADDED
        setError(null)
      } catch (err) {
        console.error('خطأ في جلب البيانات:', err)
        setError('فشل في جلب بيانات لوحة التحكم')
      }
    }

    fetchAllData()
  }, [])

  // ============= إضافة مسجد جديد (API) =============
  // ملاحظة: التحقق من وجود locationId يتم داخل AddMosqueDialog نفسه قبل استدعاء onSubmit
  const handleAddMosque = async (form) => {
    try {
      const locationName = findSelectedLocationName(regionsTree, form) // ADDED: اسم الموقع المختار يُستخدم كـ "المدينة" تلقائياً
      await createMosque({
        name: form.name,
        address: form.address || locationName,
        city: locationName,
        locationId: Number(form.locationId), // ADDED: ربط المسجد بالتراتبية الجغرافية
        capacity: form.capacity ? Number(form.capacity) : undefined,
      })

      // إعادة جلب القائمة المحدثة
      const updatedData = await getAllMosques()
      setMosques(updatedData)

      setMosqueForm(initialMosqueForm)
      setMosqueOpen(false) // MODIFIED: الإغلاق يتم هنا عند النجاح فقط بدل الإغلاق الفوري بالديالوج (كان يُخفي رسالة التحقق)
      setError(null)
    } catch (err) {
      console.error('خطأ في إضافة المسجد:', err)
      const msg = err?.response?.data?.message // MODIFIED: عرض رسالة الباك اند الفعلية بدل رسالة عامة دائماً
      setError(Array.isArray(msg) ? msg.join('، ') : (msg || 'فشل في إضافة المسجد'))
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
        regionsTree={regionsTree} // ADDED
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
