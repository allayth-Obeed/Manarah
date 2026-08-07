import React, { useState, useEffect } from 'react' // ADDED: React hooks for state and lifecycle management
import MainFun from '../DashboardPage/MainFun' // ADDED: Reusable header component with action buttons
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined' // ADDED: Icon for the report download button
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined' // ADDED: Icon for the add employee button
import EmployeesHeader from './EmployeesHeader' // ADDED: Header stats cards component
import MyTable from '../MosquesPage/MyTable' // ADDED: Reusable table component for displaying employee data
import EmployeesDialogs from '../../components/Dialogs/EmployeesDialogs' // ADDED: Dialog component for add/edit/delete employee

// ============= الاستيرادات من ملف الخدمة =============
// نستورد دوال الاتصال بالـ API من ملف الخدمة التي أنشأناه
import { getAllEmployees, createEmployee, deleteEmployee } from '../../services/employeeService' // ADDED: Added deleteEmployee import for delete CRUD operation
import { useCurrentUser } from '../../context/userContext' // ADDED: لإخفاء أزرار الكتابة عن المستخدمين ذوي صلاحية القراءة فقط

// ============= تعريف أعمدة الجدول =============
// تم غير تعريفها كخارجية لأنها لا تتغير
const employeeColumns = [
  {
    key: 'name',
    label: 'اسم الموظف',
    type: 'avatar',
  },
  {
    key: 'job',
    label: 'الوظيفة',
    align: 'right',
  },
  {
    key: 'mosque',
    label: 'المسجد المرتبط',
    align: 'right',
  },
  {
    key: 'status',
    label: 'الحالة',
    type: 'chip',
    align: 'center',
  },
  {
    key: 'hiredDate',
    label: 'تاريخ التعيين',
    align: 'center',
  },
]

// ============= نموذج إضافة موظف جديد =============
// تم تعديل المفتاح من jobTitle إلى position لتتوافق مع Backend
const initialEmployeeForm = {
  firstName: '',
  lastName: '',
  position: '',
  department: '',
  phone: '',
  salary: '',
  hireDate: '',
}

// ============= دالة تحويل البيانات من Backend إلى تنسيق الجدول =============
/**
 * تحويل بيانات الموظف من قاعدة البيانات إلى تنسيق الجدول
 * @param {Array} employees - قائمة الموظفين من الـ API
 * @returns {Array} - بيانات الموظفين بصيغة مُحوّلة للجدول
 */
const transformEmployeesToRows = (employees) => {
  return employees.map((emp) => ({
    // تحويل البيانات من تنسيق Backend إلى تنسيق Frontend
    id: emp.id,
    // الاسم الكامل من الـ firstName و lastName
    name: emp.firstName && emp.lastName ? `${emp.firstName} ${emp.lastName}` : emp.name || '',
    // المنصب من الحقل position
    job: emp.position || emp.job || '',
    subtitle: emp.subtitle || '',
    // الصورة الشخصية (يمكن استخدام avatar افتراضي إذا لم تُرسل من الخادم)
    avatar: emp.avatar || `https://i.pravatar.cc/40?img=${emp.id}`,
    // المسجد (من العلاقة user إذا كان موجودًا، أو من mosque)
    mosque: emp.user?.mosque?.name || emp.mosque || '',
    // تاريخ التوظيع
    hiredDate: emp.hireDate || emp.hiredDate || '',
    // الحالة
    status: emp.status || 'على رأس العمل',
  }))
}

export default function Employees() {
  const { canWrite } = useCurrentUser() // ADDED: ADMIN/MANAGER فقط يقدرون يضيفون/يحذفون

  // ============= State Management =============
  // حالة فتح/إغلاق نافذة إضافة موظف
  const [addOpen, setAddOpen] = useState(false)
  // ADDED: State for delete confirmation dialog
  const [deleteOpen, setDeleteOpen] = useState(false)
  // ADDED: حالة ديالوج "عرض التفاصيل" — كان الرابط بالجدول بلا أي وظيفة
  const [detailsOpen, setDetailsOpen] = useState(false)
  // ADDED: State for the selected employee row to delete
  const [selectedRow, setSelectedRow] = useState(null)

  // حالة نموذج إضافة الموظف
  const [employeeForm, setEmployeeForm] = useState(initialEmployeeForm)

  // حالة الموظفين (ستُخزن البيانات الحقيقية من الـ API هنا)
  const [employees, setEmployees] = useState([])

  // حالة الخطأ (error state)
  const [error, setError] = useState(null)
  // ADDED: State for loading indicator during API calls
  const [loading, setLoading] = useState(false)

  // ============= جلب البيانات من الـ API عند تحميل الصفحة =============
  // useEffect تُنفذ مرة واحدة عند تحميل المكون (component mount)
  useEffect(() => {
    // دالة داخلية لجلب البيانات
    const fetchEmployees = async () => {
      setLoading(true) // ADDED: Set loading state to true when starting data fetch
      try {
        const data = await getAllEmployees() // استدعاء الـ API
        setEmployees(transformEmployeesToRows(data)) // تحويل وتخزين البيانات
        setError(null) // إعادة تعيين الخطأ
      } catch (err) {
        console.error('خطأ في جلب الموظفين:', err)
        setError('فشل في جلب بيانات الموظفين') // ADDED: Set error message for display
      } finally {
        setLoading(false) // ADDED: Set loading state to false when data fetch completes
      }
    }

    fetchEmployees()
  }, []) // المصفوفة الفارغة تعني تنفيذها مرة واحدة عند التحميل

  // ============= معالجة إرسال النموذج =============
  /**
   * عندما يضيف المستخدم موظف جديد:
   * 1. يتم إرسال البيانات للـ API
   * 2. يتم إعادة جلب القائمة من الخادم
   * 3. يتم إغلاق النافذة وإعادة تعيين النموذج
   */
  const handleAddSubmit = async (e) => {
    e?.preventDefault()

    try {
      // إرسال البيانات للـ API
      await createEmployee(employeeForm)

      // إعادة جلب القائمة المحدثة
      const updatedData = await getAllEmployees()
      setEmployees(transformEmployeesToRows(updatedData))

      // إغلاق النافذة وإعادة تعيين النموذج
      setAddOpen(false)
      setEmployeeForm(initialEmployeeForm)
    } catch (err) {
      console.error('خطأ في إضافة الموظف:', err)
      setError('فشل في إضافة الموظف')
    }
  }

  // ADDED: معالجة حذف موظف - يرسل طلب DELETE إلى الـ API ويعيد تحديث القائمة
  const handleConfirmDelete = async () => {
    try {
      // ADDED: استدعاء API لحذف الموظف المحدد
      await deleteEmployee(selectedRow.id)

      // ADDED: إعادة جلب القائمة المحدثة بعد الحذف
      const updatedData = await getAllEmployees()
      setEmployees(transformEmployeesToRows(updatedData))

      setDeleteOpen(false)
      setSelectedRow(null)
      setError(null)
    } catch (err) {
      console.error('خطأ في حذف الموظف:', err)
      setError('فشل في حذف الموظف')
    }
  }

  // ============= معالجة تصدير التقرير =============
  /**
   * تنزيل تقرير الموظفين بصيغة CSV
   */
  const handleReportDownload = async () => {
    try {
      // ADDED: استيراد ديناميكي لتجنب circular dependency
      const { downloadEmployeesReport } = await import('../../services/employeeService')
      await downloadEmployeesReport()
    } catch (err) {
      console.error('خطأ في تنزيل التقرير:', err)
      setError('فشل في تنزيل التقرير')
    }
  }

  return (
    <div>
      <MainFun
        title="إدارة شؤون الموظفين"
        description="إدارة السجلات الوظيفية للأئمة والخطباء والمؤذنين التابعين لمديرية الأوقاف ومتابعة حالاتهم الوظيفية وتوزيعهم الجغرافي."
        announcementButton="تصدير التقارير"
        addButton="إضافة موظف جديد"
        announcementIcon={<FileDownloadOutlinedIcon />}
        addIcon={<PersonAddAlt1OutlinedIcon />}
        onAddClick={() => setAddOpen(true)}
        onAnnouncementClick={handleReportDownload}
        showAddButton={canWrite} // ADDED: إخفاء زر الإضافة عن المستخدمين ذوي صلاحية القراءة فقط
        showAnnouncementButton={canWrite} // ADDED: تقرير الموظفين يحوي الرواتب — الباك اند يرفضه لغير ADMIN/MANAGER أصلاً
      />

      <EmployeesHeader employees={employees} />

      {/* ADDED: عرض حالة التحميل أثناء جلب البيانات من الـ API */}
      {loading && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>
          جارٍ تحميل بيانات الموظفين...
        </div>
      )}

      {/* عرض رسالة الخطأ إن وجدت */}
      {error && !loading && (
        <div style={{ color: 'red', padding: '10px', textAlign: 'center' }}>
          {error}
        </div>
      )}

      {/* ADDED: إخفاء الجدول أثناء التحميل الأولي */}
      {!loading && (
        <MyTable
          rows={employees}
          columns={employeeColumns}
          totalRows={employees.length}
          totalPages={1}
          entityLabel="موظف"
          onRowViewClick={(row) => { // ADDED: يفعّل رابط "عرض التفاصيل" الذي كان يظهر بلا أي وظيفة
            setSelectedRow(row)
            setDetailsOpen(true)
          }}
          onRowDeleteClick={
            canWrite // ADDED: إخفاء زر الحذف عن المستخدمين ذوي صلاحية القراءة فقط
              ? (row) => {
                  setSelectedRow(row)
                  setDeleteOpen(true)
                }
              : undefined
          }
        />
      )}

      <EmployeesDialogs
        addOpen={addOpen}
        setAddOpen={setAddOpen}
        employeeForm={employeeForm}
        setEmployeeForm={setEmployeeForm}
        handleAddSubmit={handleAddSubmit}
        deleteOpen={deleteOpen} // ADDED: Pass delete dialog state to the dialog component
        setDeleteOpen={setDeleteOpen} // ADDED: Pass delete dialog setter to the dialog component
        selectedRow={selectedRow} // ADDED: Pass selected employee row to the dialog component
        handleConfirmDelete={handleConfirmDelete} // ADDED: Pass delete handler to the dialog component
        detailsOpen={detailsOpen} // ADDED: ديالوج عرض التفاصيل الجديد
        setDetailsOpen={setDetailsOpen} // ADDED
      />
    </div>
  )
}
