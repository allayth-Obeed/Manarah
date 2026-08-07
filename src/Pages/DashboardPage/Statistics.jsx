import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { useTheme } from '../../theme/themeContext'
import { useNavigate } from 'react-router-dom' // ADDED: لتفعيل رابط "عرض الكل" الذي كان بلا أي وظيفة

const tableHeaders = ['اسم المسجد', 'اسم الخطيب', 'التاريخ']

// Card shell used to keep dashboard sections visually consistent.
function SectionCard({ cardSx, titleSx, title, action, children }) {
  return (
    <>
      <Card sx={cardSx}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" sx={titleSx}>
              {title}
            </Typography>
            {action}
          </Box>
          {children}
        </CardContent>
      </Card>
    </>
  )
}

// Dashboard statistics view that shows assignments and weekly donations.
// ✅ تم التعديل: يقبل props من Dashboard (mosques, announcements, donations, preachers, employees)
export default function Statistics({ mosques = [], donations = [], preachers = [], employees = [] }) {
  const { activeTheme } = useTheme()
  const { colors, layout } = activeTheme
  const navigate = useNavigate() // ADDED: لتفعيل رابط "عرض الكل" الذي كان بلا أي وظيفة

  const cardSx = {
    borderRadius: 4,
    height: '100%',
    width: '100%',
    bgcolor: colors.surface,
    color: colors.text,
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    border: `1px solid ${colors.border}`,
  }

  const titleSx = { fontWeight: 'bold', color: colors.primary }
  const tableCellSx = { color: colors.text, borderColor: colors.border }
  const headerCellSx = { color: colors.mutedText, borderColor: colors.border }

  // ============= تحويل بيانات الخطباء والتعيينات إلى تنسيق الجدول =============
  // نأخذ أحدث 4 تعيينات نشطة من الخطباء
  const speakers = preachers
    .flatMap((preacher) =>
      (preacher.assignments || [])
        .filter((a) => a.isActive)
        .map((a) => ({
          mosque: a.mosque?.name || 'مسجد',
          speaker: preacher.firstName && preacher.lastName
            ? `${preacher.firstName} ${preacher.lastName}`
            : preacher.user?.name || 'خطيب',
          date: a.startDate
            ? new Date(a.startDate).toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' })
            : 'تاريخ غير محدد',
        }))
    )
    .slice(0, 4) // أحدث 4 فقط

  // ============= إحصائيات سريعة =============
  const totalMosques = mosques.length
  const totalPreachers = preachers.length
  const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0)
  const totalEmployees = employees.length

  // ============= بيانات الرسم البياني للتبرعات (من الـ API) =============
  // نأخذ آخر 7 أيام من التبرعات
  const daysOfWeek = ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة']
  const chartData = daysOfWeek.map((day, idx) => {
    // تجميع التبرعات حسب اليوم
    const dayDonations = donations.filter((d) => {
      if (!d.donationDate && !d.createdAt) return false
      const date = new Date(d.donationDate || d.createdAt)
      return date.getDay() === (idx + 6) % 7 // تحويل الأيام ليبدأ من السبت
    })
    const total = dayDonations.reduce((sum, d) => sum + (d.amount || 0), 0)
    return { day, value: total }
  })

  // ============= كثافة المساجد في المناطق (من الـ API) =============
  // تجميع المساجد حسب المدينة
  const cityCounts = mosques.reduce((acc, mosque) => {
    const city = mosque.city || 'غير محدد'
    acc[city] = (acc[city] || 0) + 1
    return acc
  }, {})

  const maxCityCount = Math.max(...Object.values(cityCounts), 1)
  const regionDensity = Object.entries(cityCounts)
    .map(([region, count]) => ({
      region,
      count,
      percentage: Math.round((count / maxCityCount) * 100),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4)

  return (
    <>
      <Box
        sx={{
          p: 3,
          bgcolor: colors.background,
          color: colors.text,
          minHeight: '100vh',
          width: '100%',
        }}
      >
        {/* ============= بطاقات الإحصائيات السريعة ============= */}
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            mb: 3,
            gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
          }}
        >
          <Card sx={{ ...cardSx, p: 2, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.primary }}>{totalMosques}</Typography>
            <Typography variant="body2" sx={{ color: colors.mutedText }}>المساجد</Typography>
          </Card>
          <Card sx={{ ...cardSx, p: 2, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.primary }}>{totalPreachers}</Typography>
            <Typography variant="body2" sx={{ color: colors.mutedText }}>الخطباء</Typography>
          </Card>
          <Card sx={{ ...cardSx, p: 2, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.primary }}>{totalDonations.toLocaleString('ar-SA')} ر.س</Typography>
            <Typography variant="body2" sx={{ color: colors.mutedText }}>إجمالي التبرعات</Typography>
          </Card>
          <Card sx={{ ...cardSx, p: 2, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: colors.primary }}>{totalEmployees}</Typography>
            <Typography variant="body2" sx={{ color: colors.mutedText }}>الموظفون</Typography>
          </Card>
        </Box>

        {/* ============= قسمين رئيسيين: التكليفات + الرسم البياني ============= */}
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            width: '100%',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, minmax(0, 1fr))',
            },
          }}
        >
          {/* Left card: latest speaker assignments table. */}
          <Box sx={{ gridColumn: { md: 'span 1' } }}>
            <SectionCard
              cardSx={cardSx}
              titleSx={titleSx}
              title="أحدث تكليفات الخطباء"
              action={
                // MODIFIED: كان بلا onClick إطلاقاً — الآن ينتقل فعلياً لصفحة توزيع الخطباء الكاملة
                <Typography
                  variant="body2"
                  onClick={() => navigate('/preachers')}
                  sx={{ color: colors.secondary, cursor: 'pointer' }}
                >
                  عرض الكل
                </Typography>
              }
            >
              <TableContainer>
                <Table sx={{ '& .MuiTableCell-root': { color: colors.text } }}>
                  <TableHead>
                    <TableRow>
                      {tableHeaders.map((header) => (
                        <TableCell key={header} align="right" sx={headerCellSx}>
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {speakers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align="center" sx={tableCellSx}>
                          لا توجد تكليفات حالياً
                        </TableCell>
                      </TableRow>
                    ) : (
                      speakers.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell align="right" sx={tableCellSx}>{row.mosque}</TableCell>
                          <TableCell align="right" sx={tableCellSx}>{row.speaker}</TableCell>
                          <TableCell align="right" sx={tableCellSx}>
                            <Chip label={row.date} size="small" sx={{ bgcolor: colors.accent, color: colors.primary, fontWeight: 'bold' }} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </SectionCard>
          </Box>

          {/* Right card: weekly donation trend chart. */}
          <Box sx={{ gridColumn: { md: 'span 2' } }}>
            <SectionCard
              cardSx={cardSx}
              titleSx={titleSx}
              title="تحليل التبرعات (أسبوعي)"
              action={
                <Chip label="آخر 7 أيام" sx={{ bgcolor: layout.searchBaseBg, color: colors.text }} />
              }
            >
              <Box sx={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                    <XAxis dataKey="day" stroke={layout.subTitle} tick={{ fill: layout.subTitle }} />
                    <YAxis stroke={layout.subTitle} tick={{ fill: layout.subTitle }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: colors.surface,
                        border: `1px solid ${colors.border}`,
                        borderRadius: 12,
                        color: colors.text,
                      }}
                      labelStyle={{ color: colors.text }}
                      itemStyle={{ color: colors.primary }}
                    />
                    <Line type="monotone" dataKey="value" stroke={colors.primary} strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </SectionCard>
          </Box>
        </Box>

        {/* Mosque Density by Region Section */}
        <Box sx={{ mt: 4 }}>
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              width: '100%',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
            }}
          >
            <Box sx={{ gridColumn: { md: 'span 2' } }}>
              <SectionCard
                cardSx={cardSx}
                titleSx={titleSx}
                title="كثافة المساجد في المناطق"
                action={
                  <Typography variant="caption" sx={{ color: colors.mutedText, fontSize: '0.8rem' }}>
                    التوزيع الجغرافي
                  </Typography>
                }
              >
                <Box sx={{ display: 'grid', gap: 2.5 }}>
                  {regionDensity.map((item) => (
                    <Box key={item.region} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 600, color: colors.text, fontSize: '0.95rem' }}>
                          {item.region}
                        </Typography>
                        <Typography sx={{ fontWeight: 'bold', color: colors.primary, fontSize: '1rem' }}>
                          {item.count}
                        </Typography>
                      </Box>
                      <Box sx={{ width: '100%', height: 8, borderRadius: 4, bgcolor: colors.border, overflow: 'hidden' }}>
                        <Box sx={{ height: '100%', width: `${item.percentage}%`, bgcolor: colors.primary, borderRadius: 4, transition: 'width 0.3s ease' }} />
                      </Box>
                    </Box>
                  ))}
                </Box>
              </SectionCard>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}
