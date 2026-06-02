import React from "react";
import MainFun from '../DashboardPage/MainFun';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
export default function Employees() {
  return (
    <div>
      <MainFun
        title={'إدارة شؤون الموظفين'}
        description={
          'إدارة السجلات الوظيفية للأئمة والخطباء والمؤذنين التابعين لمديرية الأوقاف ومتابعة حالاتهم الوظيفية وتوزيعهم الجغرافي.'
        }
        announcementButton={'تصدير التقارير'}
        addButton={'إضافة موظف جديد'}
        announcementIcon={<FileDownloadOutlinedIcon />}
        addIcon={<PersonAddAlt1OutlinedIcon />}
      />
    </div>
  )
}
