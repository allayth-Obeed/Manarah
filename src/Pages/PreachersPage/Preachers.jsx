import React from 'react'
import MainFun from './../DashboardPage/MainFun'
import MainAssignment from './MainAssignment'

export default function Preachers() {
  return (
    <div>
      <MainFun
        title="توزيع الخطباء"
        description="إدارة وتكليف خطباء الجمعة للمساجد التابعة للمديرية"
        announcementButton="إعلان تكليف"
        addButton="إضافة خطيب"
      />
      <MainAssignment />
    </div>
  )
}
