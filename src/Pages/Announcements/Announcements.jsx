import React, { useState, useEffect } from 'react' // ADDED: React hooks for state and lifecycle management
import MainFun from '../DashboardPage/MainFun' // ADDED: Reusable header component with action buttons
import AnnouncementsStats from '../../components/Announcements/AnnouncementsStats' // ADDED: Stats cards for announcements
import AnnouncementCard from '../../components/Announcements/AnnouncementCard' // ADDED: Individual announcement card component
import AnnouncementsDialogs from '../../components/Dialogs/AnnouncementsDialogs' // ADDED: Dialog component for add/delete announcement

// ============= استيراد خدمات API =============
// ✅ تم الربط مع الـ API الحقيقي للإعلانات والمساجد
import {
  getAllAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from '../../services/announcementService' // ADDED: Announcement CRUD API functions
import { getAllMosques } from '../../services/mosqueService' // ADDED: Mosque API to fetch mosque list for dropdown
import { useNavigate } from 'react-router-dom' // ADDED: للانتقال الفعلي عند الضغط على "إدارة المساجد"
import { useCurrentUser } from '../../context/userContext' // ADDED: لإخفاء أزرار الكتابة عن المستخدمين ذوي صلاحية القراءة فقط

export default function Announcements() {
  const navigate = useNavigate() // ADDED
  const { canWrite } = useCurrentUser() // ADDED: ADMIN/MANAGER فقط يقدرون يضيفون/يحذفون إعلانات
  // ============= State Management =============
  const [addOpen, setAddOpen] = useState(false) // ADDED: State for add announcement dialog
  const [deleteOpen, setDeleteOpen] = useState(false) // ADDED: State for delete confirmation dialog
  const [selectedRow, setSelectedRow] = useState(null) // ADDED: State for the currently selected announcement row
  const [announcementForm, setAnnouncementForm] = useState({ // ADDED: State for add announcement form fields
    title: '',
    content: '',
    mosqueId: '',
    priority: 'MEDIUM',
  })

  // ✅ حالة البيانات من الـ API
  const [announcements, setAnnouncements] = useState([]) // ADDED: State for announcements list from API
  const [mosques, setMosques] = useState([]) // ADDED: State for mosques list from API
  const [error, setError] = useState(null) // ADDED: State for error messages
  const [loading, setLoading] = useState(false) // ADDED: State for loading indicator during API calls

  // ============= جلب البيانات من الـ API عند تحميل الصفحة =============
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true) // ADDED: Set loading state to true when starting data fetch
      try {
        const [announcementsData, mosquesData] = await Promise.all([
          getAllAnnouncements(),
          getAllMosques(),
        ])
        setAnnouncements(announcementsData) // ADDED: Store announcements data from API
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

  // ============= إضافة إعلان جديد (API) =============
  const handleAddSubmit = async (e) => {
    e?.preventDefault()
    try {
      await createAnnouncement({
        title: announcementForm.title,
        content: announcementForm.content,
        mosqueId: Number(announcementForm.mosqueId),
        priority: announcementForm.priority || 'MEDIUM',
      })

      // إعادة جلب القائمة المحدثة
      const updatedData = await getAllAnnouncements()
      setAnnouncements(updatedData)

      setAddOpen(false)
      setAnnouncementForm({ title: '', content: '', mosqueId: '', priority: 'MEDIUM' })
    } catch (err) {
      console.error('خطأ في إضافة الإعلان:', err)
      setError('فشل في إضافة الإعلان')
    }
  }

  // ============= حذف إعلان (API) =============
  const handleConfirmDelete = async () => {
    try {
      await deleteAnnouncement(selectedRow.id)

      // إعادة جلب القائمة المحدثة
      const updatedData = await getAllAnnouncements()
      setAnnouncements(updatedData)

      setDeleteOpen(false)
      setSelectedRow(null)
    } catch (err) {
      console.error('خطأ في حذف الإعلان:', err)
      setError('فشل في حذف الإعلان')
    }
  }

  return (
    <div>
      {/* MODIFIED: كانت التسميات معكوسة — "إدارة المساجد" بخانة addButton لكنه كان يفتح ديالوج إضافة إعلان (كلا الزرين
          كانا ينفذان نفس onAddClick). أُصلحت التسميات وأصبح "إدارة المساجد" ينتقل فعلياً لصفحة المساجد */}
      <MainFun
        title="الإعلانات"
        description="إدارة الإعلانات والتنبيهات للمساجد التابعة للمديرية"
        announcementButton="إدارة المساجد"
        addButton="إضافة إعلان"
        onAddClick={() => setAddOpen(true)}
        onAnnouncementClick={() => navigate('/mosques')}
        showAddButton={canWrite} // ADDED: إخفاء زر الإضافة عن المستخدمين ذوي صلاحية القراءة فقط
      />

      {/* ADDED: عرض حالة التحميل أثناء جلب البيانات من الـ API */}
      {loading && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>
          جارٍ تحميل الإعلانات...
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
        <>
          <AnnouncementsStats announcements={announcements} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
            {announcements.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#64748B', padding: '40px' }}>
                لا توجد إعلانات حالياً
              </div>
            ) : (
              announcements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.id}
                  title={announcement.title}
                  excerpt={announcement.content}
                  dateLabel={announcement.startDate
                    ? new Date(announcement.startDate).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
                    : 'تاريخ غير محدد'}
                  views={announcement.mosque?.name || '—'}
                  comments={announcement.priority || 'MEDIUM'}
                  status={announcement.isActive ? 'نشط' : 'غير نشط'}
                  onDeleteClick={
                    canWrite // ADDED: إخفاء زر الحذف عن المستخدمين ذوي صلاحية القراءة فقط
                      ? () => {
                          setSelectedRow(announcement)
                          setDeleteOpen(true)
                        }
                      : undefined
                  }
                />
              ))
            )}
          </div>
        </>
      )}

      <AnnouncementsDialogs
        addOpen={addOpen}
        setAddOpen={setAddOpen}
        announcementForm={announcementForm}
        setAnnouncementForm={setAnnouncementForm}
        handleAddSubmit={handleAddSubmit}
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        selectedRow={selectedRow}
        handleConfirmDelete={handleConfirmDelete}
        mosques={mosques}
      />
    </div>
  )
}
