import React from 'react' // ADDED: استيراد React لإنشاء مكوّن الواجهة.
import {
  Avatar,
  Box,
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from '@mui/material' // ADDED: استيراد عناصر MUI لبناء بطاقة تكليف تفاعلية.
import { useTheme } from '../../theme/themeContext' // ADDED: استيراد الثيم الحالي لتناسق الألوان مع بقية التطبيق.
import {
  CalendarToday,
  HomeWorkOutlined,
  WarningAmber,
  Settings,
  Person2Outlined,
} from '@mui/icons-material' // ADDED: استيراد الأيقونات المستخدمة في الحقول والتنبيه.
import AppButton from '../../components/common/AppButton' // ADDED: استيراد زر التطبيق الموحد للاستخدام في التثبيت.
import SearchableSelect from '../../components/common/SearchableSelect' // ADDED: اختيار الخطيب بالبحث عن اسمه بدل قائمة منسدلة طويلة

export default function RapidAssignment({
  // ADDED: تعريف مكوّن التكليف السريع مع الخصائص القادمة من الصفحة الأب.
  mosques = [], // ADDED: قائمة المساجد المتاحة للاختيار.
  preachers = [], // ADDED: قائمة الخطباء المتاحين للاختيار.
  assignmentDateLabel, // ADDED: نص تاريخ الجمعة القادمة بصيغة جاهزة للعرض.
  selectedMosqueId, // ADDED: معرف المسجد المختار حاليًا.
  selectedPreacherId, // ADDED: معرف الخطيب المختار حاليًا.
  onSelectMosque, // ADDED: دالة تحديث المسجد المختار في الصفحة الأب.
  onSelectPreacher, // ADDED: دالة تحديث الخطيب المختار في الصفحة الأب.
  conflictState, // ADDED: كائن حالة فحص التعارض من الـ API.
  onConfirmAssign, // ADDED: دالة تنفيذ تثبيت التكليف في الخلفية.
  canSubmit, // ADDED: علم يحدد إمكانية الضغط على زر التثبيت.
  loading, // ADDED: علم يحدد وجود عملية حفظ جارية.
}) {
  const { activeTheme } = useTheme() // ADDED: الحصول على ألوان الثيم النشط.

  // ADDED: استبعاد الخطباء الذين تغيّر دور حسابهم بعيداً عن "خطيب" (رُقّي لموظف أو أُعيد لمستخدم عادي مثلاً) —
  // سجل الخطيب قد يبقى موجوداً بقاعدة البيانات، لكن لا يجوز عرضه كخيار جديد للتعيين ما دام صاحبه لم يعد خطيباً فعلياً.
  // الخطباء بلا حساب دخول مرتبط (userId فارغ) يبقون مؤهَّلين دائماً — لا "دور" حساب يقيّدهم أصلاً
  const assignablePreachers = preachers.filter((p) => !p.userId || p.user?.role === 'PREACHER')

  const selectedPreacher =
    preachers.find((preacher) => preacher.id === Number(selectedPreacherId)) || null // ADDED: استخراج الخطيب المختار كاملًا لعرض اسمه.
  const preacherName = selectedPreacher
    ? `${selectedPreacher.firstName} ${selectedPreacher.lastName}`
    : 'اختر خطيبًا' // ADDED: تجهيز اسم الخطيب المعروض أو نص افتراضي.
  const preacherAvatar = selectedPreacher?.firstName?.charAt(0) || 'م' // ADDED: تجهيز حرف أولي لعرضه داخل الصورة الرمزية.

  return (
    <Box sx={{ direction: 'rtl' }}>
      {' '}
      {/* ADDED: ضبط اتجاه البطاقة إلى RTL للغة العربية. */}
      <Card sx={{ borderRadius: 2, p: 2, background: activeTheme.colors.surface }}>
        {' '}
        {/* ADDED: بطاقة رئيسية للتكليف السريع. */}
        <Typography variant="h6" fontWeight={700} mb={2} color={activeTheme.colors.text}>
          {' '}
          {/* ADDED: عنوان القسم داخل البطاقة. */}
          الجمعة القادمة {/* ADDED: نص عنوان المهمة. */}
        </Typography>{' '}
        {/* ADDED: نهاية عنوان القسم. */}
        <CardContent sx={{ p: 0 }}>
          {' '}
          {/* ADDED: حاوية المحتوى التفصيلي داخل البطاقة. */}
          <Box display="flex" justifyContent="flex-end" mb={2}>
            {' '}
            {/* ADDED: حاوية تاريخ الجمعة القادمة. */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                background: activeTheme.colors.panelBg,
                px: 2,
                py: 1,
                borderRadius: 1.5,
              }}
            >
              {' '}
              {/* ADDED: تصميم صندوق التاريخ. */}
              <CalendarToday fontSize="small" color="action" />{' '}
              {/* ADDED: أيقونة التاريخ بجانب النص. */}
              <Typography fontWeight={700} fontSize={13}>
                {' '}
                {/* ADDED: تنسيق نص التاريخ. */}
                {assignmentDateLabel} {/* ADDED: عرض تاريخ الجمعة القادمة القادم من الصفحة الأب. */}
              </Typography>{' '}
              {/* ADDED: نهاية عنصر النص الخاص بالتاريخ. */}
            </Box>{' '}
            {/* ADDED: نهاية صندوق التاريخ. */}
          </Box>{' '}
          {/* ADDED: نهاية حاوية التاريخ. */}
          <Box mb={1} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            {' '}
            {/* ADDED: صف عنوان حقل المسجد. */}
            <HomeWorkOutlined fontSize="small" color="action" sx={{ marginLeft: 1 }} />{' '}
            {/* ADDED: أيقونة المسجد. */}
            <Typography variant="body2" color="text.secondary">
              {' '}
              {/* ADDED: تنسيق عنوان حقل المسجد. */}
              المسجد المستهدف {/* ADDED: نص عنوان حقل المسجد. */}
            </Typography>{' '}
            {/* ADDED: نهاية نص حقل المسجد. */}
          </Box>{' '}
          {/* ADDED: نهاية صف عنوان المسجد. */}
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            {' '}
            {/* ADDED: حاوية اختيار المسجد. */}
            <Select
              value={selectedMosqueId ? String(selectedMosqueId) : ''}
              displayEmpty
              onChange={(event) => onSelectMosque(Number(event.target.value))}
              sx={{ background: activeTheme.colors.panelBg, borderRadius: 1.5 }}
            >
              {' '}
              {/* ADDED: قائمة منسدلة لاختيار المسجد مع تحديث الحالة في الصفحة الأب. */}
              <MenuItem value="">اختر مسجدًا</MenuItem>{' '}
              {/* ADDED: خيار افتراضي قبل تحديد أي مسجد. */}
              {mosques.map(
                (
                  mosque // ADDED: التكرار على المساجد القادمة من الـ API.
                ) => (
                  <MenuItem key={mosque.id} value={String(mosque.id)}>
                    {' '}
                    {/* ADDED: عنصر قائمة يمثل مسجدًا واحدًا. */}
                    {mosque.name} {/* ADDED: عرض اسم المسجد داخل القائمة. */}
                  </MenuItem> // ADDED: نهاية عنصر المسجد في القائمة.
                )
              )}{' '}
              {/* ADDED: نهاية تكرار خيارات المساجد. */}
            </Select>{' '}
            {/* ADDED: نهاية قائمة اختيار المسجد. */}
          </FormControl>{' '}
          {/* ADDED: نهاية حاوية اختيار المسجد. */}
          <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }} mb={1}>
            {' '}
            {/* ADDED: صف عنوان حقل الخطيب. */}
            <Person2Outlined fontSize="small" color="action" sx={{ marginLeft: 1 }} />{' '}
            {/* ADDED: أيقونة الخطيب. */}
            <Typography variant="body2" color="text.secondary">
              {' '}
              {/* ADDED: تنسيق عنوان حقل الخطيب. */}
              الخطيب المختار {/* ADDED: نص عنوان حقل الخطيب. */}
            </Typography>{' '}
            {/* ADDED: نهاية نص عنوان الخطيب. */}
          </Box>{' '}
          {/* ADDED: نهاية صف عنوان الخطيب. */}
          <Box sx={{ mb: 2 }}>
            {' '}
            {/* MODIFIED: بحث عن الخطيب بكتابة اسمه بدل قائمة منسدلة طويلة. */}
            <SearchableSelect
              options={assignablePreachers}
              value={selectedPreacherId}
              onChange={onSelectPreacher}
              getOptionLabel={(preacher) => `${preacher.firstName} ${preacher.lastName}`}
              getOptionSecondary={(preacher) => preacher.specialization}
              placeholder="ابحث عن خطيب بالاسم..."
              noOptionsText="لا يوجد خطيب مطابق"
            />
          </Box>{' '}
          {/* ADDED: نهاية حاوية اختيار الخطيب. */}
          <Box
            sx={{
              p: 1.5,
              background: activeTheme.colors.panelBg,
              borderRadius: 1.5,
              mb: 2,
              display: 'flex',
              gap: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            {' '}
            {/* ADDED: صندوق عرض ملخص الخطيب المختار. */}
            <Avatar
              sx={{
                width: 32,
                height: 32,
                background: activeTheme.colors.primaryDark,
                fontSize: 12,
              }}
            >
              {' '}
              {/* ADDED: صورة رمزية بالخرف الأول للخطيب. */}
              {preacherAvatar} {/* ADDED: عرض الحرف الأول داخل الصورة الرمزية. */}
            </Avatar>{' '}
            {/* ADDED: نهاية عنصر الصورة الرمزية. */}
            <Typography variant="body2" fontWeight={600} color={activeTheme.colors.text}>
              {' '}
              {/* ADDED: تنسيق نص اسم الخطيب المختار. */}
              {preacherName} {/* ADDED: عرض الاسم الكامل للخطيب أو النص الافتراضي. */}
            </Typography>{' '}
            {/* ADDED: نهاية نص اسم الخطيب. */}
          </Box>{' '}
          {/* ADDED: نهاية صندوق ملخص الخطيب. */}
          {conflictState?.hasConflict && ( // ADDED: عرض صندوق التنبيه فقط عند وجود تعارض حسب نتيجة الـ API.
            <Box
              sx={{
                background: activeTheme.colors.danger100,
                border: `1px solid ${activeTheme.colors.danger300}`,
                color: activeTheme.colors.danger700,
                p: 2,
                borderRadius: 1.5,
                mb: 2,
                display: 'flex',
                gap: 1,
                alignItems: 'flex-start',
              }}
            >
              {' '}
              {/* ADDED: تصميم صندوق التحذير من التعارض. */}
              <WarningAmber sx={{ flexShrink: 0, mt: 0.5 }} />{' '}
              {/* ADDED: أيقونة التحذير داخل الصندوق. */}
              <Typography variant="body2" fontSize={12}>
                {' '}
                {/* ADDED: تنسيق نص رسالة التحذير. */}
                {`تحذير: الخطيب المختار لديه ${conflictState.conflictCount} تكليف/تكليفات نشطة في نفس التاريخ.`}{' '}
                {/* ADDED: رسالة تعارض ديناميكية مبنية على نتيجة الفحص. */}
              </Typography>{' '}
              {/* ADDED: نهاية نص التحذير. */}
            </Box> // ADDED: نهاية صندوق التحذير.
          )}{' '}
          {/* ADDED: نهاية شرط عرض التحذير. */}
          {!!conflictState?.error && ( // ADDED: عرض رسالة عند فشل فحص التعارض من الخلفية.
            <Box
              sx={{
                background: activeTheme.colors.danger100,
                border: `1px solid ${activeTheme.colors.danger300}`,
                color: activeTheme.colors.danger700,
                p: 1.5,
                borderRadius: 1.5,
                mb: 2,
              }}
            >
              {' '}
              {/* ADDED: صندوق خطأ خفيف لفحص التعارض. */}
              <Typography variant="body2" fontSize={12}>
                {' '}
                {/* ADDED: تنسيق نص رسالة الخطأ. */}
                {conflictState.error} {/* ADDED: عرض نص خطأ الفحص القادم من الصفحة الأب. */}
              </Typography>{' '}
              {/* ADDED: نهاية نص رسالة الخطأ. */}
            </Box> // ADDED: نهاية صندوق رسالة الخطأ.
          )}{' '}
          {/* ADDED: نهاية شرط عرض رسالة الخطأ. */}
          <AppButton
            variant="contained"
            fullWidth
            icon={<Settings />}
            iconPosition="start"
            iconColor="#fff"
            backgroundColor={activeTheme.colors.primaryDark}
            textColor={activeTheme.colors.onPrimary}
            borderColor={activeTheme.colors.primaryDark}
            hoverBackgroundColor={activeTheme.colors.primaryDark}
            py={1.5}
            borderRadius={2}
            onClick={onConfirmAssign}
            disabled={!canSubmit || loading}
          >
            {' '}
            {/* ADDED: زر تثبيت التكليف مع تعطيل عند نقص البيانات أو أثناء الحفظ. */}
            {loading ? 'جارٍ التثبيت...' : 'تثبيت التكليف'}{' '}
            {/* ADDED: نص ديناميكي للزر حسب حالة التنفيذ. */}
          </AppButton>{' '}
          {/* ADDED: نهاية زر تثبيت التكليف. */}
        </CardContent>{' '}
        {/* ADDED: نهاية محتوى البطاقة. */}
      </Card>{' '}
      {/* ADDED: نهاية البطاقة الرئيسية. */}
    </Box> // ADDED: نهاية حاوية الاتجاه RTL.
  ) // ADDED: نهاية الإرجاع JSX.
} // ADDED: نهاية مكوّن التكليف السريع.
