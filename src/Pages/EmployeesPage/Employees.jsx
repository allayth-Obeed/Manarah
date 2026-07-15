import React, { useState } from 'react'
import MainFun from '../DashboardPage/MainFun'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import EmployeesHeader from './EmployeesHeader'
import MyTable from '../MosquesPage/MyTable'
import EmployeesDialogs from '../../components/Dialogs/EmployeesDialogs'

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

const employeeRows = [
  {
    id: 1,
    name: 'محمد عبدالله العامري',
    job: 'إمام وخطيب',
    subtitle: 'المنطقة: حي النور • WAQF: 8902',
    avatar: 'https://i.pravatar.cc/40?img=12',
    mosque: 'جامع السلطان قابوس الكبير',
    hiredDate: '12/05/2012',
    status: 'على رأس العمل',
  },
  {
    id: 2,
    name: 'أحمد محمود الصالح',
    job: 'مؤذن',
    subtitle: 'المنطقة: حي الغدير • WAQF: 4412',
    avatar: 'https://i.pravatar.cc/40?img=47',
    mosque: 'مسجد التقوى',
    hiredDate: '15/09/2018',
    status: 'إجازة',
  },
  {
    id: 3,
    name: 'سالم بن حامد',
    job: 'إمام وخطيب',
    subtitle: 'المنطقة: المدينة القديمة • 3291',
    avatar: 'https://i.pravatar.cc/40?img=5',
    mosque: 'جامع الرحمة',
    hiredDate: '03/01/2021',
    status: 'على رأس العمل',
  },
]

const initialEmployeeForm = {
  name: '',
  nationalId: '',
  jobTitle: '',
  hireDate: '',
}

export default function Employees() {
  const [addOpen, setAddOpen] = useState(false)
  const [employeeForm, setEmployeeForm] = useState(initialEmployeeForm)

  const handleAddSubmit = (e) => {
    e?.preventDefault()
    console.log('Employee form submitted:', employeeForm)
    setAddOpen(false)
    setEmployeeForm(initialEmployeeForm)
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
      />

      <EmployeesHeader />

      <MyTable
        rows={employeeRows}
        columns={employeeColumns}
        totalRows={employeeRows.length}
        totalPages={1}
        entityLabel="موظف"
      />

      <EmployeesDialogs
        addOpen={addOpen}
        setAddOpen={setAddOpen}
        employeeForm={employeeForm}
        setEmployeeForm={setEmployeeForm}
        handleAddSubmit={handleAddSubmit}
      />
    </div>
  )
}
