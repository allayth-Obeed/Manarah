import React, { useMemo, useState } from 'react' // ADDED: useMemo/useState لحساب الملخص الحقيقي وحالة تحميل التقرير
import { Box, Typography } from '@mui/material'
import { Shield, BarChart } from '@mui/icons-material'
import AppButton from '../../components/common/AppButton'
import { useTheme } from '../../theme/themeContext'
import { downloadMosquesReport } from '../../services/reportService' // ADDED: استدعاء تنزيل تقرير المساجد الحقيقي

// mosques: القائمة الحقيقية القادمة من الـ API لحساب ملخص فعلي بدل النص التسويقي الثابت
export default function ReportsAndValid({ mosques = [] }) {
  const { activeTheme } = useTheme()
  const [downloading, setDownloading] = useState(false) // ADDED: تعطيل الزر أثناء التنزيل لمنع نقرات متكررة

  // ملخص حقيقي محسوب من بيانات المساجد بدل نسبة "85%" المُلفَّقة (لا يوجد مفهوم "خطة صيانة" بالـ schema)
  const summary = useMemo(() => {
    // MODIFIED: parseInt بدل Number — Mosque.jsx يحوّل capacity مسبقاً لنص عرض مثل "500 مصلٍ" لجدول المساجد،
    // و Number("500 مصلٍ") يساوي NaN فيصير المجموع صفراً دائماً؛ parseInt يقرأ الرقم من بداية النص بأمان
    const totalCapacity = mosques.reduce((sum, m) => sum + (parseInt(m.capacity, 10) || 0), 0)
    const missingPhone = mosques.filter((m) => !m.phone).length
    return { totalCapacity, missingPhone }
  }, [mosques])

  // تنزيل تقرير CSV حقيقي من الباك اند بدل زر بلا أي وظيفة
  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadMosquesReport()
    } catch {
      // الخطأ مسجَّل بالفعل داخل reportService؛ لا حاجة لإجراء إضافي هنا
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Box className="flex flex-row gap-4 p-4">
      {/* بطاقة توثيق الأوقاف — MODIFIED: ألوان Tailwind الثابتة (bg-gray-100/text-gray-800...) استُبدلت برموز الثيم */}
      <Box
        className="flex-none w-1/3 rounded-xl p-6 flex flex-col items-start gap-4 h-[234px]"
        dir="rtl"
        style={{ backgroundColor: activeTheme.colors.bgelem }}
      >
        <Box
          className="w-14 h-14 flex items-center justify-center rounded-full"
          style={{ backgroundColor: activeTheme.colors.accent }}
        >
          <Shield className="w-7 h-7" style={{ color: activeTheme.colors.primary }} />
        </Box>
        <Typography variant="h6" className="font-semibold" style={{ color: activeTheme.colors.text }}>
          توثيق الأوقاف
        </Typography>
        <Typography className="text-sm" style={{ color: activeTheme.colors.mutedText }}>
          تأكد من تحديث كافة الصكوك القانونية والخرائط المساحية للمساجد الحديثة في النظام لضمان
          الحماية القانونية للأصول.
        </Typography>
      </Box>

      {/* بطاقة ملخص المساجد الحقيقي (كانت نسبة صيانة ثابتة 85% بلا مصدر بيانات حقيقي) */}
      <Box
        className="flex-1 bg-gradient-to-br from-emerald-900 to-green-800 rounded-xl p-6 flex flex-col justify-between gap-4 text-white h-[234px] relative"
        dir="rtl"
      >
        <Box className="absolute left-8 top-1/2 -translate-y-1/2 opacity-10 w-28 h-28 bg-emerald-900 rounded-lg flex items-center justify-center z-0">
          <BarChart className="w-10 h-10 text-emerald-700/50" />
        </Box>

        <Box className="absolute right-6 top-6 z-20 w-12 h-12 bg-emerald-700/90 rounded-full flex items-center justify-center shadow-sm">
          <BarChart className="w-6 h-6 text-emerald-200" />
        </Box>

        <Box className="w-2/3 ml-auto z-30">
          <Box className="flex items-center gap-4">
            <Box className="bg-emerald-800 p-3 rounded-full flex items-center justify-center">
              <BarChart className="w-6 h-6 text-green-300" />
            </Box>
            <Typography variant="h5" className="font-semibold text-white">
              ملخص المساجد
            </Typography>
          </Box>
          <Typography className="text-emerald-200 mt-3 pr-6">
            {/* رقمان حقيقيان مشتقان من بيانات المساجد الفعلية بدل نص "85% من خطة الصيانة" الوهمي */}
            إجمالي السعة الاستيعابية لكل المساجد: {summary.totalCapacity.toLocaleString('en-US')} مصلٍ.{' '}
            {summary.missingPhone > 0
              ? `${summary.missingPhone} مسجد بلا رقم هاتف مسجَّل.`
              : 'جميع المساجد لديها رقم هاتف مسجَّل.'}{' '}
            يمكنك تنزيل تقرير كامل بصيغة CSV لمراجعة كل التفاصيل.
          </Typography>
        </Box>

        <AppButton
          variant="contained"
          sx={{
            position: 'absolute',
            right: 36,
            bottom: 20,
            height: 44,
            boxShadow: 2,
            zIndex: 30,
          }}
          backgroundColor={activeTheme.colors.secondary}
          textColor={activeTheme.colors.onSecondary}
          borderColor={activeTheme.colors.secondary}
          borderRadius={1.5}
          minWidth={140}
          px={2}
          py={0.5}
          onClick={handleDownload} // ADDED: تفعيل الزر فعلياً بدل عدم فعل أي شيء
          disabled={downloading} // ADDED: منع نقرات متكررة أثناء التنزيل
        >
          {downloading ? 'جارٍ التنزيل...' : 'تحميل التقرير الكامل'}
        </AppButton>
      </Box>
    </Box>
  )
}
