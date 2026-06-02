import React from 'react'
import MainFun from '../DashboardPage/MainFun'
import AnnouncementsStats from '../../components/Announcements/AnnouncementsStats'

export default function Announcements() {
  return (
    <div>
      <MainFun
        title="مركز الإعلانات"
        description="إدارة وتنسيق التعميمات الرسمية، إعلانات الوظائف، والفعاليات الدينية للمديرية."
        showAnnouncementButton={false}
        addButton="إعلان جديد"
      />
      <AnnouncementsStats mainNumber="15,240+" mainLabel="أحدث وصول للجمهور" activeAds={12} totalAds={128} />
    </div>
  )
}
