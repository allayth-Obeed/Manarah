import React, { useMemo } from 'react' // ADDED: useMemo لحساب التوزيع وأحدث تبرع بدون إعادة حساب كل رندر
import { Box, Typography } from '@mui/material'
import MosquePhoto from '../../assets/images/Mosque.png'
import { useTheme } from '../../theme/themeContext'

// تم حذف allocationRows الثابتة (45%/30%/25%): تُحسب الآن داخل المكوّن من حقل purpose الحقيقي

function AllocationBar({ label, value, fill, colors }) {
  return (
    <Box sx={{ mb: 1.25 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.text, textAlign: 'right' }}>
          {label}
        </Typography>
        <Typography sx={{ fontSize: 13, fontWeight: 800, color: colors.primary }}>
          {value}
        </Typography>
      </Box>
      <Box
        sx={{ height: 8, borderRadius: 999, backgroundColor: colors.bgelem, overflow: 'hidden' }}
      >
        <Box sx={{ width: fill, height: '100%', background: colors.accent }} />
      </Box>
    </Box>
  )
}

function ActivityRow({ row, colors }) {
  const pillColors = {
    blue: { backgroundColor: colors.accent, color: colors.primary },
    green: { backgroundColor: colors.dateBg, color: colors.secondary },
    gray: { backgroundColor: colors.bgelem, color: colors.mutedText },
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'minmax(180px, 1.1fr) 130px 120px 170px',
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: 1.4,
        borderRadius: 2,
        backgroundColor: colors.surface,
      }}
    >
      {/* المساهم */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 1 }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: colors.accent,
            color: colors.primary,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {row.initial}
        </Box>

        <Typography
          sx={{
            fontSize: 15,
            fontWeight: 700,
            color: colors.text,
            textAlign: 'right',
          }}
        >
          {row.name}
        </Typography>
      </Box>

      {/* التاريخ */}
      <Typography
        sx={{
          fontSize: 13,
          color: colors.mutedText,
          textAlign: 'right',
          direction: 'rtl', // <-- EDITED
          unicodeBidi: 'plaintext', // <-- EDITED
        }}
      >
        {row.date}
      </Typography>

      {/* النوع */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Box
          sx={{
            px: 1.6,
            py: 0.6,
            borderRadius: 999,
            ...(pillColors[row.tone] || pillColors.gray),
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          {row.type}
        </Box>
      </Box>

      {/* القيمة */}
      <Typography
        sx={{
          fontSize: 15,
          fontWeight: 800,
          color: colors.primaryDark,
          textAlign: 'right',
        }}
      >
        {row.value}
      </Typography>
    </Box>
  )
}

export default function DonationsOverview({ donations = [], onRowClick, onDeleteClick }) {
  const { activeTheme } = useTheme()
  const { colors } = activeTheme

  // ADDED: توزيع حقيقي محسوب بتجميع مبالغ التبرعات حسب حقل purpose الفعلي بدل النسب الثابتة (45%/30%/25%)
  const allocationRows = useMemo(() => {
    const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0)
    if (totalAmount === 0) return []
    const grouped = donations.reduce((acc, d) => {
      const key = d.purpose || 'غير محدد'
      acc[key] = (acc[key] || 0) + (d.amount || 0)
      return acc
    }, {})
    return Object.entries(grouped)
      .map(([label, amount]) => ({ label, pct: Math.round((amount / totalAmount) * 100) }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 5) // أعلى 5 أغراض تبرع فقط للحفاظ على وضوح الواجهة
  }, [donations])

  // ADDED: أحدث تبرع فعلي بدل نص "قصة نجاح" الثابت غير المرتبط بأي بيانات
  const latestDonation = useMemo(() => {
    if (donations.length === 0) return null
    return [...donations].sort(
      (a, b) => new Date(b.donationDate || b.createdAt) - new Date(a.donationDate || a.createdAt),
    )[0]
  }, [donations])

  // تحويل التبرعات من الـ API إلى صفوف النشاط مع الاحتفاظ بالكائن الأصلي
  const activityRows = donations.slice(0, 5).map((donation) => {
    const initial = (donation.donorName || '؟').charAt(0)
    const date = donation.donationDate || donation.createdAt
      ? new Date(donation.donationDate || donation.createdAt).toLocaleDateString('ar-SA', { year: 'numeric', month: 'numeric', day: 'numeric' })
      : 'تاريخ غير محدد'
    const type = donation.purpose || 'تبرع عام'
    const tone = donation.purpose === 'وقف' ? 'green' : donation.purpose ? 'blue' : 'gray'

    return {
      // الكائن الأصلي الكامل من الـ API ليمرر إلى dialogs التفاصيل بشكل صحيح
      ...donation,
      name: donation.donorName || 'متبرع',
      donorName: donation.donorName || 'متبرع',
      initial,
      date,
      type,
      tone,
      value: `${donation.amount || 0} ر.س`,
    }
  })

  return (
    <Box dir="rtl" sx={{ width: '100%', mt: 2.5 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row-reverse' },
          gap: 2,
          alignItems: 'stretch',
        }}
      >
        {/* Left narrow column: allocations + success story */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: '0 0 250px' }}>
          <Box
            sx={{
              backgroundColor: colors.surface,
              borderRadius: 3,
              px: 2.25,
              py: 2.25,
              boxShadow: `inset 0 0 0 1px ${colors.borderLight}`,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2.25,
              }}
            >
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.primary }}>
                توزيع الأوقاف
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.primary }}>
                عرض الكل
              </Typography>
            </Box>

            {/* MODIFIED: نسبة row.pct الحقيقية بدل fill الثابت (92%/64%/46%) المرتبط سابقاً بترتيب وهمي */}
            {allocationRows.length === 0 ? (
              <Typography sx={{ fontSize: 13, color: colors.mutedText, textAlign: 'center', py: 2 }}>
                لا توجد بيانات تبرعات بعد
              </Typography>
            ) : (
              allocationRows.map((row) => (
                <AllocationBar
                  key={row.label}
                  label={row.label}
                  value={`${row.pct}%`}
                  fill={`${row.pct}%`}
                  colors={colors}
                />
              ))
            )}
          </Box>

          {/* MODIFIED: بطاقة "أحدث تبرع" ببيانات حقيقية بدل نص "قصص النجاح" الثابت غير المرتبط بأي بيانات */}
          <Box>
            <Box
              sx={{
                position: 'relative',
                height: 175,
                borderRadius: 3,
                overflow: 'hidden',
                boxShadow: '0 12px 28px rgba(15, 23, 42, 0.08)',
              }}
            >
              <Box
                component="img"
                src={MosquePhoto}
                alt="أحدث تبرع"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)',
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  p: 3,
                }}
              >
                <Box sx={{ maxWidth: 185, alignSelf: 'flex-end', textAlign: 'right' }}>
                  <Typography
                    sx={{ fontSize: 11, fontWeight: 800, color: colors.secondary, mb: 0.5 }}
                  >
                    أحدث تبرع
                  </Typography>
                  {/* MODIFIED: اسم المتبرع الحقيقي والمسجد بدل "اكتمال ترميم مسجد الصحابة" الثابت */}
                  <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.onPrimary }}>
                    {latestDonation
                      ? `${latestDonation.donorName || 'متبرع'} — ${(latestDonation.amount || 0).toLocaleString('en-US')} إلى ${latestDonation.mosque?.name || 'مسجد'}`
                      : 'لا توجد تبرعات بعد'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right main column: recent activity */}
        <Box
          sx={{
            backgroundColor: colors.surface,
            borderRadius: 3,
            px: 2.4,
            py: 2.25,
            flex: '1 1 0',
            minWidth: 0,
          }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.1 }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.primary }}>
              أحدث العمليات
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'minmax(180px, 1.1fr) 130px 120px 170px',
              gap: 2,
              px: 2,
              py: 1.25,
              borderRadius: 2,
              backgroundColor: colors.bgelem,
              mb: 1.25,
            }}
          >
            <Typography
              sx={{ fontSize: 13, fontWeight: 800, color: colors.mutedText, textAlign: 'right' }}
            >
              المساهم
            </Typography>
            <Typography
              sx={{ fontSize: 13, fontWeight: 800, color: colors.mutedText, textAlign: 'right' }}
            >
              التاريخ
            </Typography>
            <Typography
              sx={{ fontSize: 13, fontWeight: 800, color: colors.mutedText, textAlign: 'right' }}
            >
              النوع
            </Typography>
            <Typography
              sx={{ fontSize: 13, fontWeight: 800, color: colors.mutedText, textAlign: 'right' }}
            >
              القيمة
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.1 }}>
            {activityRows.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4, color: colors.mutedText }}>
                لا توجد تبرعات حالياً
              </Box>
            ) : (
              activityRows.map((row) => (
                <Box key={row.id || row.name} onClick={() => onRowClick?.(row)} sx={{ cursor: 'pointer' }}>
                  <ActivityRow row={row} colors={colors} />
                  {onDeleteClick && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
                      <Typography
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteClick(row)
                        }}
                        sx={{ fontSize: 12, color: colors.danger500, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                      >
                        حذف
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
