import React, { useState, useEffect } from 'react' // ADDED: React hooks for state and lifecycle management
import { Box } from '@mui/material' // ADDED: MUI Box for layout structure
import Header1 from './Header1' // ADDED: Header component for the mosques page
import FilterSearch from './FilterSearch' // ADDED: Filter and search component
import MyTable from './MyTable' // ADDED: Reusable table component
import ReportsAndValid from './ReportsAndValid' // ADDED: Reports and validation section
import MosqueDialogs from '../../components/Dialogs/MosqueDialogs' // ADDED: Dialogs for add/edit/assign/delete

// ============= استيراد خدمات API =============
// ✅ تم الربط مع الـ API الحقيقي للمساجد والخطباء
import { getAllMosques, createMosque, updateMosque, deleteMosque } from '../../services/mosqueService' // MODIFIED: أضيف updateMosque لتفعيل تعديل حالة المسجد
import { getAllPreachers } from '../../services/preacherService' // ADDED: Preacher API to fetch preacher list for assignment dropdown
import { createAssignment } from '../../services/preacherAssignmentService' // ADDED: Preacher assignment API to assign a preacher to a mosque

// ============= تعريف أعمدة جدول المساجد =============
const mosqueColumns = [
  { key: 'name', label: 'اسم المسجد', type: 'avatar' },
  { key: 'imam', label: 'الإمام', align: 'right' },
  { key: 'location', label: 'الموقع', align: 'right' },
  { key: 'capacity', label: 'السعة', align: 'center' },
  { key: 'status', label: 'الحالة', type: 'chip', align: 'center' },
]

// ============= دالة تحويل بيانات المساجد من Backend إلى تنسيق الجدول =============
const transformMosquesToRows = (mosques) => {
  return mosques.map((mosque) => ({
    id: mosque.id,
    // اسم المسجد
    name: mosque.name,
    // الإمام: نأخذ أول خطيب مرتبط بالمسجد من التعيينات النشطة
    imam: mosque.preachers?.length > 0
      ? mosque.preachers
          .filter(a => a.isActive)
          .map(a => a.preacher?.firstName && a.preacher?.lastName
            ? `${a.preacher.firstName} ${a.preacher.lastName}`
            : '')
          .filter(Boolean)
          .join(', ') || 'غير معين'
      : 'غير معين',
    // الموقع: city + address
    location: mosque.city ? `${mosque.city} - ${mosque.address || ''}` : mosque.address || '',
    // السعة (نص للعرض بالجدول)
    capacity: mosque.capacity ? `${mosque.capacity} مصلٍ` : 'غير محدد',
    // ADDED: القيمة الرقمية الخام لتعبئة نموذج التعديل (capacity أعلاه نص عرض وليس رقماً)
    capacityRaw: mosque.capacity ?? '',
    // MODIFIED: الحالة الحقيقية القادمة من الباك اند بدل "نشط" الثابتة دائماً
    status: mosque.status === 'MAINTENANCE' ? 'قيد الصيانة' : 'نشط',
    // ADDED: القيمة الخام (ACTIVE/MAINTENANCE) لتعبئة نموذج التعديل بشكل صحيح
    statusRaw: mosque.status || 'ACTIVE',
    // بيانات إضافية للـ Dialogs
    address: mosque.address,
    city: mosque.city,
    phone: mosque.phone,
    latitude: mosque.latitude,
    longitude: mosque.longitude,
  }))
}

// ============= دالة تحويل بيانات الخطباء من Backend إلى تنسيق القائمة المنسدلة =============
const transformPreachersToOptions = (preachers) => {
  return preachers.map((preacher) => ({
    id: preacher.id,
    name: preacher.firstName && preacher.lastName
      ? `${preacher.firstName} ${preacher.lastName}`
      : preacher.user?.name || 'خطيب',
    // التخصص
    role: preacher.specialization || 'خطيب معتمد',
    // المسجد الحالي (من التعيينات النشطة)
    mosque: preacher.assignments?.find(a => a.isActive)?.mosque?.name || 'غير معين',
    // حالة الخطيب
    badge: preacher.assignments?.find(a => a.isActive) ? 'مُعيَّن' : 'جاهز للتعيين',
  }))
}

export default function Mosque() {
  // ============= State Management =============
  const [addOpen, setAddOpen] = useState(false) // ADDED: State for add mosque dialog
  const [editOpen, setEditOpen] = useState(false) // ADDED: حالة فتح ديالوج تعديل بيانات/حالة المسجد
  const [assignOpen, setAssignOpen] = useState(false) // ADDED: State for assign preacher dialog
  const [deleteOpen, setDeleteOpen] = useState(false) // ADDED: State for delete confirmation dialog
  const [snackbarOpen, setSnackbarOpen] = useState(false) // ADDED: State for toast notification visibility
  const [snackbarMessage, setSnackbarMessage] = useState('') // ADDED: State for toast notification message
  const [selectedRow, setSelectedRow] = useState(null) // ADDED: State for the currently selected mosque row
  const [selectedPreacherId, setSelectedPreacherId] = useState('') // ADDED: State for selected preacher in assignment dropdown
  const [searchTerm, setSearchTerm] = useState('') // ADDED: State for search/filter input
  const [cityFilter, setCityFilter] = useState('') // ADDED: حالة فلتر المدينة الحقيقي في FilterSearch (فارغ = كل المناطق)
  const [mosqueForm, setMosqueForm] = useState({ // ADDED: State for add mosque form fields
    name: '',
    address: '',
    city: '',
    phone: '',
    capacity: '',
    status: 'ACTIVE', // ADDED: حالة افتراضية عند الإضافة
  })

  // ✅ حالة البيانات من الـ API
  const [mosques, setMosques] = useState([]) // ADDED: State for mosques list from API
  const [preachers, setPreachers] = useState([]) // ADDED: State for preachers list from API
  const [error, setError] = useState(null) // ADDED: State for error messages
  const [loading, setLoading] = useState(false) // ADDED: State for loading indicator during API calls

  // ============= جلب البيانات من الـ API عند تحميل الصفحة =============
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true) // ADDED: Set loading state to true when starting data fetch
      try {
        // جلب المساجد والخطباء معاً
        const [mosquesData, preachersData] = await Promise.all([
          getAllMosques(),
          getAllPreachers(),
        ])
        setMosques(transformMosquesToRows(mosquesData)) // ADDED: Transform and store mosques data
        setPreachers(transformPreachersToOptions(preachersData)) // ADDED: Transform and store preachers data
        setError(null) // ADDED: Clear any previous errors
      } catch (err) {
        console.error('خطأ في جلب البيانات:', err)
        setError('فشل في جلب البيانات') // ADDED: Set error message for display
      } finally {
        setLoading(false) // ADDED: Set loading state to false when data fetch completes (success or error)
      }
    }

    fetchData()
  }, []) // المصفوفة الفارغة تعني تنفيذها مرة واحدة عند التحميل

  // ============= تطبيق فلتر المدينة على قائمة المساجد المعروضة =============
  const filteredMosques = cityFilter // ADDED: تصفية فعلية بدل زر "تطبيق الفلترة" الذي كان بلا أثر
    ? mosques.filter((row) => row.city === cityFilter)
    : mosques

  // ============= تصفية الخطباء حسب البحث =============
  const filteredPreachers = preachers.filter((item) => {
    const query = searchTerm.trim().toLowerCase()
    if (!query) return true
    return [item.name, item.role, item.mosque, item.badge].some((field) =>
      String(field).toLowerCase().includes(query)
    )
  })

  // ============= دوال مساعدة =============
  const openToast = (message) => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }

  const handleAddMosque = () => {
    setMosqueForm({ name: '', address: '', city: '', phone: '', capacity: '', status: 'ACTIVE' })
    setAddOpen(true)
  }

  // ADDED: فتح ديالوج التعديل مع تعبئة النموذج ببيانات المسجد المختار (بما فيها الحالة الحقيقية)
  const handleRowEditClick = (row) => {
    setSelectedRow(row)
    setMosqueForm({
      name: row.name || '',
      address: row.address || '',
      city: row.city || '',
      phone: row.phone || '',
      capacity: row.capacityRaw !== '' && row.capacityRaw != null ? String(row.capacityRaw) : '',
      status: row.statusRaw || 'ACTIVE',
    })
    setEditOpen(true)
  }

  const handleApplyFilter = () => {
    // الفلترة نفسها فورية عبر filteredMosques أعلاه؛ هذا الزر يبقى فقط لتأكيد بصري للمستخدم
    openToast(cityFilter ? `تم عرض مساجد ${cityFilter} فقط` : 'تم عرض كل المساجد')
  }

  const handleRowMoreClick = (row) => {
    setSelectedRow(row)
    setSearchTerm('')
    setSelectedPreacherId(preachers[0]?.id || '')
    setAssignOpen(true)
  }

  const handleRowDeleteClick = (row) => {
    setSelectedRow(row)
    setDeleteOpen(true)
  }

  // ============= إضافة مسجد جديد (API) =============
  const handleAddSubmit = async (event) => {
    event.preventDefault()
    try {
      // إرسال البيانات للـ API
      await createMosque({
        name: mosqueForm.name,
        address: mosqueForm.address || mosqueForm.city,
        city: mosqueForm.city,
        phone: mosqueForm.phone || undefined,
        capacity: mosqueForm.capacity ? Number(mosqueForm.capacity) : undefined,
        status: mosqueForm.status || 'ACTIVE', // ADDED: إرسال حالة المسجد الحقيقية عند الإنشاء
      })

      // إعادة جلب القائمة المحدثة
      const updatedData = await getAllMosques()
      setMosques(transformMosquesToRows(updatedData))

      setAddOpen(false)
      openToast('تم حفظ المسجد الجديد بنجاح')
    } catch (err) {
      console.error('خطأ في إضافة المسجد:', err)
      // MODIFIED: عرض رسالة الباك اند الفعلية (مثل رفض الصلاحية) بدل رسالة عامة
      const msg = err?.response?.data?.message || 'فشل في إضافة المسجد'
      openToast(Array.isArray(msg) ? msg.join('، ') : msg)
    }
  }

  // ============= تعديل بيانات/حالة مسجد (API) =============
  // ADDED: يستدعي updateMosque الحقيقي — أول مكان يمكن فيه تعديل حالة المسجد (نشط/قيد الصيانة) فعلياً
  const handleEditSubmit = async (event) => {
    event.preventDefault()
    try {
      await updateMosque(selectedRow.id, {
        name: mosqueForm.name,
        address: mosqueForm.address || mosqueForm.city,
        city: mosqueForm.city,
        phone: mosqueForm.phone || undefined,
        capacity: mosqueForm.capacity ? Number(mosqueForm.capacity) : undefined,
        status: mosqueForm.status || 'ACTIVE',
      })

      const updatedData = await getAllMosques()
      setMosques(transformMosquesToRows(updatedData))

      setEditOpen(false)
      openToast('تم تحديث بيانات المسجد بنجاح')
    } catch (err) {
      console.error('خطأ في تحديث المسجد:', err)
      // MODIFIED: عرض رسالة الباك اند الفعلية بدل رسالة عامة
      const msg = err?.response?.data?.message || 'فشل في تحديث المسجد'
      openToast(Array.isArray(msg) ? msg.join('، ') : msg)
    }
  }

  // ============= تعيين خطيب لمسجد (API) =============
  // ✅ تم التعديل: استبدال TODO باستدعاء API حقيقي لتعيين الخطيب عبر preacherAssignmentService
  const handleConfirmAssign = async () => {
    try {
      // ADDED: استدعاء API لإنشاء تعيين جديد بين الخطيب والمسجد
      // يرسل preacherId و mosqueId إلى الـ endpoint POST /api/preacher-assignments
      await createAssignment({
        preacherId: Number(selectedPreacherId), // ADDED: Convert selected preacher ID to number for API
        mosqueId: selectedRow.id, // ADDED: Use selected mosque row ID as the mosque for assignment
        isActive: true, // ADDED: Set the assignment as active by default
      })

      // ADDED: إعادة جلب قائمة المساجد المحدثة بعد التعيين الناجح
      const updatedData = await getAllMosques()
      setMosques(transformMosquesToRows(updatedData))

      const selectedPreacher = preachers.find((item) => item.id === selectedPreacherId) // ADDED: Find the selected preacher object for the toast message
      setAssignOpen(false)
      openToast(
        `تم تعيين ${selectedPreacher?.name || 'الخطيب'} إلى ${selectedRow?.name || 'المسجد'}`
      )
    } catch (err) {
      console.error('خطأ في تعيين الخطيب:', err)
      openToast('فشل في تعيين الخطيب')
    }
  }

  // ============= حذف مسجد (API) =============
  const handleConfirmDelete = async () => {
    try {
      await deleteMosque(selectedRow.id)

      // إعادة جلب القائمة المحدثة
      const updatedData = await getAllMosques()
      setMosques(transformMosquesToRows(updatedData))

      setDeleteOpen(false)
      openToast(`تم حذف سجل ${selectedRow?.name || 'المسجد'} بنجاح`)
    } catch (err) {
      console.error('خطأ في حذف المسجد:', err)
      // MODIFIED: عرض رسالة الباك اند الفعلية (مثل "لا يمكن الحذف لارتباطه بـ..." أو "ليس لديك صلاحية")
      // بدل رسالة عامة كانت تُخفي السبب الحقيقي دائماً
      const msg = err?.response?.data?.message || 'فشل في حذف المسجد'
      openToast(Array.isArray(msg) ? msg.join('، ') : msg)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Header1 onAddMosque={handleAddMosque} />
      {/* تمرير المساجد الحقيقية + حالة فلتر المدينة بدل الأرقام الثابتة والفلاتر المعطّلة سابقاً */}
      <FilterSearch
        mosques={mosques}
        cityFilter={cityFilter}
        onCityFilterChange={setCityFilter}
        onApplyFilter={handleApplyFilter}
      />

      {/* ADDED: عرض حالة التحميل أثناء جلب البيانات من الـ API */}
      {loading && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>
          جارٍ تحميل البيانات...
        </div>
      )}

      {/* عرض رسالة الخطأ أو التحميل */}
      {error && !loading && (
        <div style={{ color: 'red', padding: '10px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* ADDED: إخفاء الجدول أثناء التحميل الأولي */}
      {!loading && (
        <MyTable
          rows={filteredMosques} // MODIFIED: القائمة المُصفَّاة حسب المدينة بدل القائمة الكاملة دائماً
          columns={mosqueColumns}
          totalRows={filteredMosques.length} // MODIFIED: العدد يعكس نتيجة الفلترة الفعلية
          totalPages={1}
          entityLabel="مسجد"
          onRowMoreClick={handleRowMoreClick}
          onRowEditClick={handleRowEditClick} // ADDED: زر تعديل جديد يفتح ديالوج تعديل بيانات/حالة المسجد
          onRowDeleteClick={handleRowDeleteClick}
        />
      )}
      {/* تمرير المساجد الحقيقية لحساب ملخص فعلي بدل النص التسويقي الثابت */}
      <ReportsAndValid mosques={mosques} />

      <MosqueDialogs
        addOpen={addOpen}
        setAddOpen={setAddOpen}
        mosqueForm={mosqueForm}
        setMosqueForm={setMosqueForm}
        handleAddSubmit={handleAddSubmit}
        editOpen={editOpen} // ADDED
        setEditOpen={setEditOpen} // ADDED
        handleEditSubmit={handleEditSubmit} // ADDED
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
