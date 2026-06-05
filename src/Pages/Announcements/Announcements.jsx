import React, { useEffect, useState } from 'react'
import MainFun from '../DashboardPage/MainFun'
import AnnouncementsStats from '../../components/Announcements/AnnouncementsStats'
import AnnouncementCard from '../../components/Announcements/AnnouncementCard'
import mosqueImg from '../../assets/images/Mosque.png'

const MOCK = [
  {
    id: 1,
    image: mosqueImg,
    title: 'ندوة الفكر الإسلامي المعاصر في ظل التحديات',
    excerpt:
      'تتشرف مديرية الأوقاف بدعوتكم لحضور الندوة الكبرى لمناقشة دور المؤسسات الدينية في تعزيز السلم المجتمعي، بحضور نخبة من كبار العلماء والمفكرين في القاعة الرئيسية للمركز الثقافي.',
    dateLabel: '15 رمضان 1445 هـ',
    views: '2.4k',
    comments: '15',
    status: 'منشور',
  },
  {
    id: 2,
    image: null,
    title: 'مسابقة تعيين أئمة وخطباء بمديرية الأوقاف',
    excerpt:
      'تعلن المديرية عن فتح باب التقديم للمسابقة السنوية لتعيين الأئمة والخطباء وفقاً للشروط والمعايير المرفقة في دليل التقديم الإلكتروني، الأولوية لخريجي  الدراسات العليا ',
    dateLabel: '12 رمضان 1445',
    views: '2.4k',
    comments: '15',
    status: 'منشور',
  },
]

export default function Announcements() {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  useEffect(() => {
    const t = setTimeout(() => {
      setItems(MOCK)
      setLoading(false)
    }, 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="space-y-6">
      <MainFun
        title="مركز الإعلانات"
        description="إدارة وتنسيق التعميمات الرسمية، إعلانات الوظائف، والفعاليات الدينية للمديرية."
        showAnnouncementButton={false}
        addButton="إعلان جديد"
      />

      <AnnouncementsStats
        mainNumber="15,240+"
        mainLabel="أحدث وصول للجمهور"
        activeAds={12}
        totalAds={128}
      />

      <section className="mt-4 grid gap-4">
        {loading
          ? [1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-full border-2 border-dashed border-blue-200 rounded-lg p-4 flex gap-4 items-start animate-pulse"
              >
                <div className="w-24 h-20 bg-gray-200 rounded-md flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))
          : items.map((it) => (
              <AnnouncementCard
                key={it.id}
                image={it.image}
                title={it.title}
                excerpt={it.excerpt}
                dateLabel={it.dateLabel}
                views={it.views}
                comments={it.comments}
                status={it.status}
                onClick={() => console.log('open', it.id)}
              />
            ))}
      </section>
    </div>
  )
}
