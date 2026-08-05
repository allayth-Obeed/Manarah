import React, { useState, useEffect } from 'react' // ADDED: React hooks for state and lifecycle management
import MainFun from './../DashboardPage/MainFun' // ADDED: Reusable header component with action buttons
import MainAssignment from './MainAssignment' // ADDED: Main assignment display component showing preacher-mosque assignments
import PreachersDialogs from '../../components/Dialogs/PreachersDialogs' // ADDED: Dialog component for add/delete preacher
import { ConfirmAssignDialog } from '../../components/Dialogs/DashboardDialogs' // ADDED: Confirmation dialog for assignment actions

// ============= استيراد خدمات API =============
// ✅ تم الربط مع الـ API الحقيقي للخطباء
import { getAllPreachers, createPreacher, deletePreacher } from '../../services/preacherService' // ADDED: Preacher CRUD API functions
import { getAllMosques } from '../../services/mosqueService' // ADDED: Mosque API to fetch mosque list for display
import { createAssignment, checkPreacherConflict } from '../../services/preacherAssignmentService' // ADDED: APIs إنشاء التكليف وفحص تعارض الخطيب لنفس اليوم

// ============= نموذج إضافة خطيب جديد =============
// ملاحظة: الحقول تتوافق مع CreatePreacherDto في الباك إند
const initialPreacherForm = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  specialization: '',
}

export default function Preachers() {
  // ============= State Management =============
  const [addOpen, setAddOpen] = useState(false) // ADDED: State for add preacher dialog
  const [deleteOpen, setDeleteOpen] = useState(false) // ADDED: State for delete confirmation dialog
  const [selectedRow, setSelectedRow] = useState(null) // ADDED: State for the currently selected preacher row
  const [preacherForm, setPreacherForm] = useState(initialPreacherForm) // ADDED: State for add preacher form fields
  const [assignConfirmOpen, setAssignConfirmOpen] = useState(false) // ADDED: State for assignment confirmation dialog

  // ✅ حالة البيانات من الـ API
  const [preachers, setPreachers] = useState([]) // ADDED: State for preachers list from API
  const [mosques, setMosques] = useState([]) // ADDED: State for mosques list from API
  const [error, setError] = useState(null) // ADDED: State for error messages
  const [loading, setLoading] = useState(false) // ADDED: State for loading indicator during API calls
  const [selectedMosqueId, setSelectedMosqueId] = useState('') // ADDED: حفظ معرف المسجد المختار في بطاقة الجمعة القادمة
  const [selectedPreacherId, setSelectedPreacherId] = useState('') // ADDED: حفظ معرف الخطيب المختار في بطاقة الجمعة القادمة
  const [conflictState, setConflictState] = useState({
    hasConflict: false,
    conflictCount: 0,
    conflicts: [],
    error: null,
  }) // ADDED: حفظ نتيجة فحص تعارض الخطيب من الخلفية
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false) // ADDED: حالة تحميل زر تثبيت التكليف أثناء طلب الإنشاء

  // ============= جلب البيانات من الـ API عند تحميل الصفحة =============
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true) // ADDED: Set loading state to true when starting data fetch
      try {
        const [preachersData, mosquesData] = await Promise.all([getAllPreachers(), getAllMosques()])
        setPreachers(preachersData) // ADDED: Store preachers data from API
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

  const getNextFridayDate = () => {
    // ADDED: حساب تاريخ الجمعة القادمة لاستخدامه في الفحص والتكليف
    const now = new Date() // ADDED: الحصول على التاريخ الحالي
    const currentDay = now.getDay() // ADDED: معرفة رقم يوم الأسبوع الحالي
    const daysUntilFriday = (5 - currentDay + 7) % 7 || 7 // ADDED: حساب الفرق بالأيام للوصول إلى الجمعة القادمة دائمًا
    const nextFriday = new Date(now) // ADDED: إنشاء نسخة قابلة للتعديل من التاريخ الحالي
    nextFriday.setDate(now.getDate() + daysUntilFriday) // ADDED: تحريك التاريخ إلى الجمعة القادمة
    nextFriday.setHours(12, 0, 0, 0) // ADDED: توحيد الوقت بالظهر لتفادي مشاكل الفروقات الزمنية
    return nextFriday // ADDED: إرجاع كائن تاريخ الجمعة القادمة
  } // ADDED: نهاية دالة حساب الجمعة القادمة

  const assignmentDate = getNextFridayDate() // ADDED: حفظ تاريخ الجمعة القادمة لاستخدامه في التكليف والفحص
  const assignmentDateLabel = assignmentDate.toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }) // ADDED: تجهيز نص عربي واضح لتاريخ الجمعة القادمة

  useEffect(() => {
    // ADDED: تشغيل فحص التعارض تلقائيًا عند تغيير الخطيب المختار
    const runConflictCheck = async () => {
      // ADDED: دالة داخلية لتنفيذ طلب فحص التعارض
      if (!selectedPreacherId) {
        // ADDED: إذا لم يتم اختيار خطيب فلا داعي للفحص
        setConflictState({ hasConflict: false, conflictCount: 0, conflicts: [], error: null }) // ADDED: إعادة حالة التعارض للوضع الافتراضي
        return // ADDED: إيقاف التنفيذ المبكر لعدم وجود خطيب
      } // ADDED: نهاية شرط عدم اختيار خطيب

      try {
        // ADDED: بدء محاولة استدعاء API لفحص التعارض
        const response = await checkPreacherConflict(
          Number(selectedPreacherId),
          assignmentDate.toISOString()
        ) // ADDED: استدعاء الـ endpoint الجديد مع الخطيب وتاريخ الجمعة القادمة
        setConflictState({ ...response, error: null }) // ADDED: تخزين نتيجة الفحص الناجحة وإزالة أي رسالة خطأ سابقة
      } catch (err) {
        // ADDED: التقاط أي خطأ أثناء فحص التعارض
        const msg = err?.response?.data?.message || err?.message || 'تعذر فحص تعارض الخطيب حالياً' // ADDED: استخراج رسالة خطأ واضحة للمستخدم
        setConflictState({ hasConflict: false, conflictCount: 0, conflicts: [], error: msg }) // ADDED: حفظ حالة خطأ منفصلة دون إيقاف الصفحة
      } // ADDED: نهاية معالجة خطأ فحص التعارض
    } // ADDED: نهاية تعريف دالة فحص التعارض

    runConflictCheck() // ADDED: تنفيذ فحص التعارض مباشرة بعد اختيار الخطيب
  }, [selectedPreacherId, assignmentDateLabel]) // ADDED: إعادة الفحص عند تغيير الخطيب أو التاريخ المعروض

  // ============= إضافة خطيب جديد (API) =============
  const handleAddSubmit = async (e) => {
    e?.preventDefault()
    try {
      console.log('📤 إرسال بيانات الخطيب للـ API:', preacherForm)

      // ✅ بناء بيانات الخطيب حسب CreatePreacherDto في الباك إند
      const preacherData = {
        firstName: preacherForm.firstName.trim(),
        lastName: preacherForm.lastName.trim(),
        phone: preacherForm.phone?.trim() || undefined,
        email: preacherForm.email?.trim() || undefined,
        specialization: preacherForm.specialization?.trim() || undefined,
      }

      console.log('📦 البيانات المرسلة:', preacherData)

      // إرسال البيانات للـ API
      const created = await createPreacher(preacherData)

      console.log('✅ تم إنشاء الخطيب بنجاح:', created)

      // إعادة جلب القائمة المحدثة
      const updatedData = await getAllPreachers()
      setPreachers(updatedData)

      setAddOpen(false)
      setPreacherForm(initialPreacherForm)
      setError(null)

      // عرض رسالة نجاح
      alert(`تم إضافة الخطيب: ${created.firstName} ${created.lastName}`)
    } catch (err) {
      console.error('❌ خطأ في إضافة الخطيب:', err)
      console.error('📋 تفاصيل الخطأ الكاملة:', err)

      // استخراج رسالة الخطأ من الاستجابة
      let errorMessage = 'فشل في إضافة الخطيب'
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err?.message) {
        errorMessage = err.message
      }

      setError(`فشل في إضافة الخطيب: ${errorMessage}`)
      alert(`خطأ: ${errorMessage}`)
    }
  }

  // ============= حذف خطيب (API) =============
  const handleConfirmDelete = async () => {
    try {
      // ADDED: استدعاء API لحذف الخطيب المحدد
      await deletePreacher(selectedRow.id)

      // إعادة جلب القائمة المحدثة
      const updatedData = await getAllPreachers()
      setPreachers(updatedData)

      setDeleteOpen(false)
      setSelectedRow(null)
      setError(null)
    } catch (err) {
      console.error('خطأ في حذف الخطيب:', err)
      const msg = err?.response?.data?.message || err?.message || 'فشل في حذف الخطيب'
      setError(`فشل في حذف الخطيب: ${msg}`)
    }
  }

  // ============= تأكيد التعيين =============
  // ✅ تم الربط مع الـ API الحقيقي لإنشاء تعيين خطيب لمسجد
  const handleConfirmAssign = async () => {
    try {
      if (!selectedPreacherId || !selectedMosqueId) {
        // ADDED: التحقق من اختيار مسجد وخطيب قبل إرسال الطلب
        setError('يرجى اختيار المسجد والخطيب أولاً') // ADDED: عرض رسالة توجيهية عند نقص البيانات
        setAssignConfirmOpen(false) // ADDED: إغلاق نافذة التأكيد عند نقص البيانات
        return // ADDED: إيقاف التنفيذ عند نقص بيانات الإدخال
      } // ADDED: نهاية شرط التحقق من المدخلات

      setIsSubmittingAssignment(true) // ADDED: تفعيل حالة التحميل على زر التثبيت

      // إنشاء التعيين عبر الـ API
      await createAssignment({
        preacherId: Number(selectedPreacherId), // ADDED: إرسال معرف الخطيب المختار كرقم صحيح
        mosqueId: Number(selectedMosqueId), // ADDED: إرسال معرف المسجد المختار كرقم صحيح
        startDate: assignmentDate.toISOString(), // ADDED: إرسال تاريخ الجمعة القادمة كبداية التكليف
        isActive: true,
      })

      // إعادة جلب البيانات المحدثة
      const [preachersData, mosquesData] = await Promise.all([getAllPreachers(), getAllMosques()])
      setPreachers(preachersData)
      setMosques(mosquesData)
      setSelectedPreacherId('') // ADDED: إعادة تعيين اختيار الخطيب بعد نجاح عملية التكليف
      setSelectedMosqueId('') // ADDED: إعادة تعيين اختيار المسجد بعد نجاح عملية التكليف
      setConflictState({ hasConflict: false, conflictCount: 0, conflicts: [], error: null }) // ADDED: تصفير حالة التعارض بعد الحفظ الناجح
      setError(null)

      console.log('✅ تم إنشاء التعيين بنجاح')
    } catch (err) {
      console.error('❌ خطأ في إنشاء التعيين:', err)
      const msg = err?.response?.data?.message || err?.message || 'فشل في إنشاء التعيين'
      setError(`فشل في إنشاء التعيين: ${msg}`)
    } finally {
      setIsSubmittingAssignment(false) // ADDED: إيقاف حالة التحميل مهما كانت نتيجة الطلب
      setAssignConfirmOpen(false)
    }
  }

  const canSubmitAssignment = Boolean(
    selectedPreacherId && selectedMosqueId && !isSubmittingAssignment
  ) // ADDED: تحديد قابلية تنفيذ التكليف عند اكتمال المدخلات وعدم وجود تحميل

  const selectedPreacher =
    preachers.find((preacher) => preacher.id === Number(selectedPreacherId)) || null // ADDED: استخراج كائن الخطيب المختار لعرضه في نافذة التأكيد
  const selectedMosque = mosques.find((mosque) => mosque.id === Number(selectedMosqueId)) || null // ADDED: استخراج كائن المسجد المختار لعرضه في نافذة التأكيد

  return (
    <div>
      <MainFun
        title="توزيع الخطباء"
        description="إدارة وتكليف خطباء الجمعة للمساجد التابعة للمديرية"
        announcementButton="إعلان تكليف"
        addButton="إضافة خطيب"
        onAddClick={() => setAddOpen(true)}
      />

      {/* ADDED: عرض حالة التحميل أثناء جلب البيانات من الـ API */}
      {loading && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>
          جارٍ تحميل بيانات الخطباء...
        </div>
      )}

      {/* عرض رسالة الخطأ إن وجدت */}
      {error && !loading && (
        <div style={{ color: 'red', padding: '10px', textAlign: 'center' }}>{error}</div>
      )}

      {/* ✅ تمرير البيانات الحقيقية من الـ API إلى MainAssignment */}
      {/* ADDED: إخفاء MainAssignment أثناء التحميل الأولي */}
      {!loading && (
        <MainAssignment
          preachers={preachers}
          mosques={mosques}
          assignmentDateLabel={assignmentDateLabel} // ADDED: تمرير تاريخ الجمعة القادمة إلى بطاقة التكليف
          selectedMosqueId={selectedMosqueId} // ADDED: تمرير المسجد المختار الحالي
          selectedPreacherId={selectedPreacherId} // ADDED: تمرير الخطيب المختار الحالي
          onSelectMosque={setSelectedMosqueId} // ADDED: تمرير دالة تحديث المسجد المختار
          onSelectPreacher={setSelectedPreacherId} // ADDED: تمرير دالة تحديث الخطيب المختار
          conflictState={conflictState} // ADDED: تمرير بيانات/نتيجة فحص التعارض لعرض التحذير
          isSubmittingAssignment={isSubmittingAssignment} // ADDED: تمرير حالة التحميل لزر التثبيت
          canSubmitAssignment={canSubmitAssignment} // ADDED: تمرير حالة تفعيل/تعطيل زر التثبيت
          onConfirmAssign={() => setAssignConfirmOpen(true)}
        />
      )}

      <PreachersDialogs
        addOpen={addOpen}
        setAddOpen={setAddOpen}
        preacherForm={preacherForm}
        setPreacherForm={setPreacherForm}
        handleAddSubmit={handleAddSubmit}
        deleteOpen={deleteOpen} // ADDED: Pass delete dialog state to the dialog component
        setDeleteOpen={setDeleteOpen} // ADDED: Pass delete dialog setter to the dialog component
        selectedRow={selectedRow} // ADDED: Pass selected preacher row to the dialog component
        handleConfirmDelete={handleConfirmDelete} // ADDED: Pass delete handler to the dialog component
      />

      {/* ADDED: استبدال البيانات الثابتة ببيانات ديناميكية من selectedRow أو preachers المختار */}
      <ConfirmAssignDialog
        open={assignConfirmOpen}
        setOpen={setAssignConfirmOpen}
        preacherName={
          selectedPreacher
            ? `${selectedPreacher.firstName} ${selectedPreacher.lastName}`
            : 'غير محدد'
        } // ADDED: عرض اسم الخطيب المختار فعليًا من بطاقة الجمعة القادمة
        mosqueName={selectedMosque?.name || 'غير محدد'} // ADDED: عرض اسم المسجد المختار فعليًا من بطاقة الجمعة القادمة
        onConfirm={handleConfirmAssign}
      />
    </div>
  )
}
