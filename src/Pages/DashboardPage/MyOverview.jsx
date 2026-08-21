import React, { useEffect, useState } from 'react'
import { Box, Typography, Chip } from '@mui/material'
import MosqueOutlinedIcon from '@mui/icons-material/MosqueOutlined'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined'
import MainFun from './MainFun'
import { useTheme } from '../../theme/themeContext'
import { useCurrentUser } from '../../context/userContext'
import { useNotifications } from '../../context/notificationsContext'
import { getMyOverview } from '../../services/userService'
import { getAllAnnouncements } from '../../services/announcementService'

const assignmentRoleLabels = { IMAM: 'إمام دائم', KHATIB: 'خطيب جمعة' }
const ticketPriorityLabels = { LOW: 'منخفضة', MEDIUM: 'متوسطة', HIGH: 'عالية' }
const ticketStatusLabels = { OPEN: 'مفتوحة', IN_PROGRESS: 'قيد المعالجة' }

const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'

// خارج المكوّن عمداً: إنشاء مكوّن داخل الـ render يفقد حالته ويكسر تحسينات React Compiler بهذا المشروع
function SectionCard({ icon, title, colors, children }) {
  return (
    <Box sx={{ bgcolor: colors.surface, borderRadius: 3, border: `1px solid ${colors.border}`, p: 3, mb: 2.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        {icon}
        <Typography sx={{ fontWeight: 700, fontSize: 15, color: colors.text }}>{title}</Typography>
      </Box>
      {children}
    </Box>
  )
}

// صفحة رئيسية بديلة لمن ليس لديه صلاحية كتابة (خطيب/موظف/مستخدم عادي) — تعرض ما يخصه فعلياً
// (تكليفاته، تذاكر الصيانة المسندة له، إشعاراته، أحدث الإعلانات) بدل لوحة الإدارة الكاملة غير المعنية به
export default function MyOverview() {
  const { activeTheme } = useTheme()
  const { colors } = activeTheme
  const { user } = useCurrentUser()
  const { notifications } = useNotifications()

  const [overview, setOverview] = useState({ preacher: null, employee: null })
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  // إعادة جلب لوحتك الشخصية عند وصول إشعار جديد — بدونها يصل الإشعار حياً لكن يبقى قسم "تكليفاتك الحالية"
  // بالبيانات القديمة حتى تُعاد تحميل الصفحة يدوياً
  useEffect(() => {
    let isMounted = true
    getMyOverview().then((overviewData) => {
      if (isMounted) {
        setOverview(overviewData)
        setLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [notifications.length])

  useEffect(() => {
    let isMounted = true
    getAllAnnouncements()
      .catch(() => [])
      .then((announcementsData) => {
        if (isMounted) setAnnouncements(announcementsData)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const { preacher, employee } = overview
  // ADDED: مساجده كخطيب (كل تكليفاته النشطة) + مسجده كموظف — وليس مسجد الموظف فقط كما كان سابقاً
  const myMosqueIds = new Set([
    ...(preacher?.assignments || []).map((a) => a.mosqueId),
    ...(employee?.mosqueId != null ? [employee.mosqueId] : []),
  ])
  // إعلانات مساجده تحديداً إن كان مرتبطاً بمسجد أو أكثر، وإلا أحدث 5 إعلانات عموماً
  const relevantAnnouncements = (myMosqueIds.size > 0 ? announcements.filter((a) => myMosqueIds.has(a.mosqueId)) : announcements)
    .slice(0, 5)

  return (
    <div>
      <MainFun
        title={`أهلاً ${user?.name || ''}`}
        description="نظرة سريعة على ما يخصك: تكليفاتك، المهام المسندة إليك، وآخر الإشعارات."
        showAnnouncementButton={false}
        showAddButton={false}
      />

      <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2.5 }}>
        <Box>
          {/* تكليفات الخطيب النشطة */}
          {preacher && (
            <SectionCard icon={<MosqueOutlinedIcon sx={{ fontSize: 20, color: colors.primary }} />} title="تكليفاتك الحالية" colors={colors}>
              {preacher.assignments.length === 0 ? (
                <Typography sx={{ fontSize: 13, color: colors.mutedText }}>لا يوجد تكليف نشط حالياً</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {preacher.assignments.map((a) => (
                    <Box
                      key={a.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: colors.bgelem,
                      }}
                    >
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 14, color: colors.text }}>
                          {a.mosque.name}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: colors.mutedText }}>
                          {a.mosque.city} — {formatDate(a.startDate)}
                        </Typography>
                      </Box>
                      <Chip
                        label={assignmentRoleLabels[a.role] || a.role}
                        size="small"
                        sx={{ bgcolor: colors.accent, color: colors.primary, fontWeight: 700 }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </SectionCard>
          )}

          {/* بيانات الموظف + تذاكر الصيانة المسندة له */}
          {employee && (
            <SectionCard icon={<BadgeOutlinedIcon sx={{ fontSize: 20, color: colors.primary }} />} title="مكان عملك" colors={colors}>
              <Typography sx={{ fontWeight: 700, fontSize: 14, color: colors.text, mb: 0.5 }}>
                {employee.position} {employee.department ? `— ${employee.department}` : ''}
              </Typography>
              <Typography sx={{ fontSize: 13, color: colors.mutedText }}>
                {employee.mosque ? `مسجد ${employee.mosque.name} — ${employee.mosque.city}` : 'غير مرتبط بمسجد بعد'}
              </Typography>
            </SectionCard>
          )}

          {employee && (
            <SectionCard icon={<BuildOutlinedIcon sx={{ fontSize: 20, color: colors.primary }} />} title="تذاكر الصيانة المسندة إليك" colors={colors}>
              {employee.assignedTickets.length === 0 ? (
                <Typography sx={{ fontSize: 13, color: colors.mutedText }}>لا توجد تذاكر مفتوحة مسندة إليك</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {employee.assignedTickets.map((t) => (
                    <Box
                      key={t.id}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        bgcolor: colors.bgelem,
                      }}
                    >
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 14, color: colors.text }}>{t.title}</Typography>
                        <Typography sx={{ fontSize: 12, color: colors.mutedText }}>
                          {t.mosque?.name} — {ticketPriorityLabels[t.priority] || t.priority}
                        </Typography>
                      </Box>
                      <Chip
                        label={ticketStatusLabels[t.status] || t.status}
                        size="small"
                        sx={{ bgcolor: colors.dateBg, color: colors.secondary, fontWeight: 700 }}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </SectionCard>
          )}

          {!loading && !preacher && !employee && (
            <SectionCard icon={<MosqueOutlinedIcon sx={{ fontSize: 20, color: colors.primary }} />} title="حسابك" colors={colors}>
              <Typography sx={{ fontSize: 13, color: colors.mutedText }}>
                لا توجد بيانات خطيب أو موظف مرتبطة بحسابك بعد. تواصل مع إدارة المديرية لربط حسابك ببياناتك الوظيفية.
              </Typography>
            </SectionCard>
          )}
        </Box>

        <Box>
          {/* آخر الإشعارات */}
          <SectionCard icon={<NotificationsNoneOutlinedIcon sx={{ fontSize: 20, color: colors.primary }} />} title="آخر إشعاراتك" colors={colors}>
            {notifications.length === 0 ? (
              <Typography sx={{ fontSize: 13, color: colors.mutedText }}>لا توجد إشعارات بعد</Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {notifications.slice(0, 6).map((n) => (
                  <Box key={n.id} sx={{ pb: 1.25, borderBottom: `1px solid ${colors.border}` }}>
                    <Typography sx={{ fontSize: 13, color: colors.text, fontWeight: n.read ? 400 : 700 }}>
                      {n.message}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </SectionCard>

          {/* أحدث الإعلانات */}
          <SectionCard icon={<CampaignOutlinedIcon sx={{ fontSize: 20, color: colors.primary }} />} title="أحدث الإعلانات" colors={colors}>
            {relevantAnnouncements.length === 0 ? (
              <Typography sx={{ fontSize: 13, color: colors.mutedText }}>لا توجد إعلانات حالياً</Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                {relevantAnnouncements.map((a) => (
                  <Box key={a.id} sx={{ pb: 1.25, borderBottom: `1px solid ${colors.border}` }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.text }}>{a.title}</Typography>
                    <Typography sx={{ fontSize: 12, color: colors.mutedText }}>{formatDate(a.startDate)}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </SectionCard>
        </Box>
      </Box>
    </div>
  )
}
