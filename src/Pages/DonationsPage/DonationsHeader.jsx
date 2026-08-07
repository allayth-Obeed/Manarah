import React, { useState } from 'react' // MODIFIED: أضيف useState لحالة تحميل زر التقرير
import { Box, Typography } from '@mui/material'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined' // MODIFIED: بدل FilterAltOutlinedIcon — يطابق زر "تسجيل تبرع جديد" الحقيقي الآن
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded'
import CurrencyExchangeRoundedIcon from '@mui/icons-material/CurrencyExchangeRounded'
import { useTheme } from '../../theme/themeContext'
import MainFun from '../DashboardPage/MainFun.jsx'
import { downloadDonationsReport } from '../../services/reportService' // ADDED: يفعّل زر التقرير الذي كان يفتح ديالوج إضافة تبرع بالخطأ
import { useCurrentUser } from '../../context/userContext' // ADDED: لإخفاء أزرار الكتابة عن المستخدمين ذوي صلاحية القراءة فقط

const summaryCards = [
  {
    title: 'متوسط التبرع الشهري',
    value: '5,200',
    currency: 'د.ا',
    icon: VolunteerActivismRoundedIcon,
    iconBg: 'accent',
    iconColor: 'primary',
  },
  {
    title: 'المتبرعون الجدد',
    value: '284',
    // extra يُحسب لاحقاً من بيانات حقيقية بدل "18%" الثابتة (انظر donorGrowthLabel أدناه)
    icon: CurrencyExchangeRoundedIcon,
    iconBg: 'dateBg',
    iconColor: 'secondary',
  },
  {
    title: 'إجمالي التبرعات السنوي',
    value: '1,450,280',
    currency: 'د.ا',
    // تم حذف progress (نسبة هدف 75%) نهائياً: لا يوجد مفهوم "هدف/target" بنموذج التبرعات بالباك اند
    // growth يُحسب لاحقاً من بيانات حقيقية بدل "+12.5%" الثابتة
    dark: true,
  },
]

function StatCard({ card, colors }) {
  if (card.dark) {
    return (
      <Box
        sx={{
          flex: '1 1 0',
          minWidth: 0,
          height: 158,
          borderRadius: 4,
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%)`,
          color: colors.onPrimary,
          boxShadow: '0 18px 30px rgba(6, 84, 55, 0.16)',
          px: 4,
          py: 2.5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              lineHeight: 1,
              color: colors.onPrimaryMuted,
              backgroundColor: 'rgba(255,255,255,0.08)',
              borderRadius: 999,
              px: 2,
              py: 0.8,
            }}
          >
            {card.growth}
          </Typography>
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              sx={{ fontSize: 15, fontWeight: 600, color: colors.onPrimaryMuted, mb: 0.8 }}
            >
              {card.title}
            </Typography>
            <Box
              sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 1 }}
            >
              <Typography sx={{ fontSize: 22, fontWeight: 700, color: colors.onPrimary }}>
                {card.currency}
              </Typography>
              <Typography
                sx={{
                  fontSize: 31,
                  fontWeight: 800,
                  lineHeight: 1,
                  color: colors.onPrimary,
                  letterSpacing: '-0.03em',
                }}
              >
                {card.value}
              </Typography>
            </Box>
          </Box>
        </Box>
        {/* تم حذف شريط تقدّم "75% من المستهدف" بالكامل: لا يوجد حقل "هدف" حقيقي بالباك اند لعرضه */}
      </Box>
    )
  }

  return (
    <Box
      sx={{
        flex: '0 0 208px',
        height: 158,
        borderRadius: 4,
        backgroundColor: colors.surface,
        boxShadow: '0 10px 26px rgba(15, 23, 42, 0.06)',
        px: 3,
        py: 2.6,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          alignSelf: 'flex-end',
          width: 40,
          height: 40,
          borderRadius: 3,
          backgroundColor: colors[card.iconBg] ?? colors.accent,
          opacity: 0.92,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {card.icon ? (
          <card.icon sx={{ fontSize: 22, color: colors[card.iconColor] ?? colors.primary }} />
        ) : null}
      </Box>
      <Box sx={{ textAlign: 'right' }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.mutedText, mb: 0.8 }}>
          {card.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 1 }}>
          {card.currency ? (
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>
              {card.currency}
            </Typography>
          ) : null}
          <Typography
            sx={{
              fontSize: 29,
              fontWeight: 800,
              lineHeight: 1,
              color: colors.text,
              letterSpacing: '-0.02em',
            }}
          >
            {card.value}
          </Typography>
        </Box>
      </Box>
      {card.extra ? (
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: colors.primary,
            alignSelf: 'flex-start',
          }}
        >
          {card.extra}
        </Typography>
      ) : null}
    </Box>
  )
}

export default function DonationsHeader({ onAddClick, donations = [] }) {
  const { activeTheme } = useTheme()
  const { colors } = activeTheme
  const { canWrite } = useCurrentUser() // ADDED: ADMIN/MANAGER فقط يقدرون يسجّلون تبرعات جديدة
  const [downloadingReport, setDownloadingReport] = useState(false) // ADDED: تعطيل الزر أثناء التنزيل

  // ADDED: يفعّل زر تنزيل تقرير التبرعات الحقيقي
  const handleDownloadReport = async () => {
    setDownloadingReport(true)
    try {
      await downloadDonationsReport()
    } catch {
      // الخطأ مسجَّل بالفعل داخل reportService
    } finally {
      setDownloadingReport(false)
    }
  }

  // حساب الإحصائيات من البيانات الحقيقية
  const totalDonations = donations.reduce((sum, d) => sum + (d.amount || 0), 0)
  const avgMonthly = donations.length > 0 ? Math.round(totalDonations / Math.max(donations.length, 1)) : 0
  const uniqueDonors = new Set(donations.map((d) => d.donorName)).size

  // ADDED: حساب نمو حقيقي (الشهر الحالي مقابل الشهر السابق) من donationDate الفعلي بدل الأرقام الثابتة "18%" و"+12.5%"
  const now = new Date()
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const isInMonth = (dateValue, month, year) => {
    if (!dateValue) return false
    const d = new Date(dateValue)
    return d.getMonth() === month && d.getFullYear() === year
  }
  const currentMonthDonations = donations.filter((d) =>
    isInMonth(d.donationDate || d.createdAt, now.getMonth(), now.getFullYear()),
  )
  const prevMonthDonations = donations.filter((d) =>
    isInMonth(d.donationDate || d.createdAt, prevMonthDate.getMonth(), prevMonthDate.getFullYear()),
  )
  // نسبة نمو إجمالي المبلغ المتبرَّع به هذا الشهر مقابل الشهر السابق
  const currentMonthTotal = currentMonthDonations.reduce((s, d) => s + (d.amount || 0), 0)
  const prevMonthTotal = prevMonthDonations.reduce((s, d) => s + (d.amount || 0), 0)
  const totalGrowthPct =
    prevMonthTotal > 0 ? Math.round(((currentMonthTotal - prevMonthTotal) / prevMonthTotal) * 100) : null
  const growthLabel = totalGrowthPct === null ? 'لا يوجد شهر سابق للمقارنة' : `${totalGrowthPct >= 0 ? '+' : ''}${totalGrowthPct}%`
  // نسبة نمو عدد المتبرعين الفريدين هذا الشهر مقابل الشهر السابق
  const currentMonthDonors = new Set(currentMonthDonations.map((d) => d.donorName)).size
  const prevMonthDonors = new Set(prevMonthDonations.map((d) => d.donorName)).size
  const donorGrowthPct =
    prevMonthDonors > 0 ? Math.round(((currentMonthDonors - prevMonthDonors) / prevMonthDonors) * 100) : null
  const donorGrowthLabel =
    donorGrowthPct === null ? undefined : `${donorGrowthPct >= 0 ? '+' : ''}${donorGrowthPct}%`

  // تحديث البطاقات بالبيانات الحقيقية
  const dynamicCards = summaryCards.map((card) => {
    if (card.title === 'متوسط التبرع الشهري') {
      return { ...card, value: avgMonthly.toLocaleString('en-US') }
    }
    if (card.title === 'المتبرعون الجدد') {
      // extra حقيقي محسوب بدل "18%" الثابتة؛ يختفي تلقائياً لو لا يوجد شهر سابق للمقارنة
      return { ...card, value: String(uniqueDonors), extra: donorGrowthLabel }
    }
    if (card.title === 'إجمالي التبرعات السنوي') {
      // growth حقيقي محسوب بدل "+12.5%" الثابتة
      return { ...card, value: totalDonations.toLocaleString('en-US'), growth: growthLabel }
    }
    return card
  })

  return (
    <Box dir="rtl" sx={{ width: '100%' }}>
      {/* MODIFIED: كانت التسميات معكوسة عن وظيفتها الفعلية — addButton="إصدار تقرير" لكنه يفتح ديالوج تسجيل تبرع،
          وannouncementButton="تصفية البيانات" بلا onAnnouncementClick إطلاقاً. أُصلحت التسميات وفُعِّل تنزيل تقرير حقيقي */}
      <MainFun
        title="إدارة التبرعات"
        description="متابعة التبرعات المالية والمساهمات الوقفية الجارية"
        announcementButton={downloadingReport ? 'جارٍ التنزيل...' : 'تحميل تقرير التبرعات'}
        addButton="تسجيل تبرع جديد"
        announcementIcon={<DescriptionOutlinedIcon />}
        addIcon={<AddCircleOutlineIcon />}
        onAddClick={onAddClick}
        onAnnouncementClick={handleDownloadReport}
        showAddButton={canWrite} // ADDED: إخفاء زر تسجيل التبرع عن المستخدمين ذوي صلاحية القراءة فقط
        showAnnouncementButton={canWrite} // ADDED: تقرير التبرعات بيانات مالية — الباك اند يرفضه لغير ADMIN/MANAGER أصلاً
      />

      <Box sx={{ display: 'flex', gap: 2, alignItems: 'stretch' }}>
        {dynamicCards.map((card) => (
          <StatCard key={card.title} card={card} colors={colors} />
        ))}
      </Box>
    </Box>
  )
}
