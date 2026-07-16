import {
  Avatar,
  Box,
  Card,
  CardContent,
  IconButton,
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material'
import {
  AccessTime,
  ChevronLeft,
  ChevronRight,
  EditOutlined,
  HomeWorkOutlined,
  LocationOnOutlined,
  WarningAmber,
} from '@mui/icons-material'
import AppButton from '../../components/common/AppButton'
import RapidAssignment from './RapidAssignment'
import { useTheme } from '../../theme/themeContext'

const DEFAULT_MONTH_LABEL = 'أكتوبر 2023'

const STAT_LABELS = {
  assigned: 'مساجد مكلفة',
  remaining: 'خطب متبقي',
  conflict: 'تنبيه تعارض في الخطب',
}

const STATUS_LABELS = {
  normal: 'منتهية',
  progress: 'مكتمل جزئياً',
  conflict: STAT_LABELS.conflict,
}

const DEFAULT_EVENTS = [
  {
    id: 1,
    title: 'جمعة الإسراء والمعراج',
    date: '27',
    month: 'OCT',
    mosque: 'مسجد الملك عبدالله الأول',
    draftMosque: 'مسجد أبو قورة',
    imam: 'د. محمد راتب النابلسي',
    time: '12:15 م',
    city: 'عمان، الأردن',
    status: STATUS_LABELS.progress,
    secondaryAction: 'تعيين خطيب',
    warning: false,
    disabled: false,
  },
  {
    id: 2,
    title: 'الجمعة العادية',
    date: '20',
    month: 'OCT',
    mosque: 'المسجد الحسيني الكبير',
    imam: 'الشيخ عمر الكسواني',
    city: 'عمان، الأردن',
    status: STATUS_LABELS.normal,
    warning: false,
    disabled: true,
  },
  {
    id: 3,
    title: 'جمعة الصيانة الدورية',
    date: '03',
    month: 'NOV',
    mosque: 'مسجد الزميلي',
    imam: 'الخطيب مخصص لمسجدين',
    status: STATUS_LABELS.conflict,
    city: 'المدينة القديمة، حمص',
    secondaryAction: 'حل النزاع',
    warning: true,
    disabled: false,
  },
]

const DEFAULT_WEEKLY_STATS = [
  { value: '15', label: STAT_LABELS.remaining },
  { value: '12', label: STAT_LABELS.assigned },
  { value: '1', label: STAT_LABELS.conflict },
]

export default function MainAssignment({
  events = DEFAULT_EVENTS,
  monthLabel = DEFAULT_MONTH_LABEL,
  onPreviousMonth,
  onNextMonth,
  onConfirmAssign,
}) {
  const { activeTheme } = useTheme()

  const listCard = (
    <Card
      sx={{
        p: 2,
        borderRadius: '20px',
        background: activeTheme.colors.panelBg,
        border: `1px solid ${activeTheme.colors.borderLight}`,
        boxShadow: 'none',
        direction: 'rtl',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 1,
            marginBottom: '7px',
          }}
        >
          <IconButton
            type="button"
            onClick={onNextMonth}
            aria-label="الشهر التالي"
            sx={{
              border: `2px solid`,
              borderRadius: `25% 25% 25% 25% / 50% 50% 50% 50%`,
              color: activeTheme.colors.primary,
              width: 34,
              height: 34,
              p: 0,
              '&:hover': { backgroundColor: activeTheme.colors.background },
            }}
          >
            <ChevronRight sx={{ fontSize: 22 }} />
          </IconButton>
          <Typography
            sx={{ lineHeight: 1, display: 'inline-flex', alignItems: 'center' }}
            fontWeight={700}
            fontSize={26}
            color={activeTheme.colors.text}
          >
            {monthLabel}
          </Typography>
          <IconButton
            type="button"
            onClick={onPreviousMonth}
            aria-label="الشهر السابق"
            sx={{
              border: `2px solid`,
              borderRadius: `25% 25% 25% 25% / 50% 50% 50% 50%`,
              color: activeTheme.colors.primary,
              width: 34,
              height: 34,
              p: 0,
              '&:hover': { backgroundColor: activeTheme.colors.background },
            }}
          >
            <ChevronLeft sx={{ fontSize: 22 }} />
          </IconButton>
        </Box>
      </Box>

      {events.length > 0 ? (
        events.map((event) => <EventCard key={event.id} event={event} activeTheme={activeTheme} />)
      ) : (
        <Box
          sx={{
            border: `1px dashed ${activeTheme.colors.border}`,
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
          }}
        >
          <Typography fontWeight={700} color={activeTheme.colors.text}>
            لا توجد بيانات حالياً
          </Typography>
          <Typography variant="body2" color={activeTheme.colors.mutedText}>
            سيتم ربط هذه الشاشة بالـ API لاحقاً.
          </Typography>
        </Box>
      )}
    </Card>
  )

  const weeklySummary = (
    <Card sx={{ borderRadius: 2, p: 2 }}>
      <CardContent sx={{ p: 0 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} dir="rtl">
          <Typography fontWeight={700} fontSize={14} color={activeTheme.colors.text}>
            نظرة عامة للأسبوع
          </Typography>
          <Typography variant="caption" color={activeTheme.colors.mutedText}>
            مكتمل 48%
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={48}
          sx={{
            height: 8,
            borderRadius: 5,
            mb: 2,
            background: activeTheme.colors.border,
            '& .MuiLinearProgress-bar': { background: activeTheme.colors.secondary },
          }}
        />

        <Grid container spacing={2}>
          {DEFAULT_WEEKLY_STATS.map((item) => (
            <Grid item xs={6} key={item.label}>
              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  textAlign: 'center',
                  borderRadius: 1.5,
                  background: activeTheme.colors.accent,
                }}
              >
                <Typography fontWeight={700} fontSize={18} color={activeTheme.colors.text}>
                  {item.value}
                </Typography>
                <Typography variant="caption" color={activeTheme.colors.mutedText}>
                  {item.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )

  return (
    <Box sx={{ background: activeTheme.colors.pageBg, minHeight: '100vh', p: 2.5 }} dir="rtl">
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '360px minmax(0, 1fr)',
          gap: 2.5,
          alignItems: 'start',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <RapidAssignment onConfirmAssign={onConfirmAssign} />
          {weeklySummary}
        </Box>
        <Box>{listCard}</Box>
      </Box>
    </Box>
  )
}

function EventCard({ event, activeTheme }) {
  const isWarning = event.warning
  const isDisabled = event.disabled
  const isInteractive = !isWarning && !isDisabled

  return (
    <Box
      sx={{
        borderRadius: '18px',
        border: `1px solid ${isWarning ? activeTheme.colors.danger300 : activeTheme.colors.border}`,
        background: isWarning ? activeTheme.colors.danger100 : activeTheme.colors.surface,
        opacity: isDisabled ? 0.45 : 1,
        direction: 'rtl',
        mb: 1.5,
        overflow: 'hidden',
      }}
    >
      {/* شريط الحالة - كامل العرض في الأعلى */}
      {event.status && (
        <Box
          sx={{
            width: '100%',
            textAlign: 'center',
            py: 0.6,
            background: isWarning ? activeTheme.colors.danger300 : activeTheme.colors.accent,
            borderBottom: isWarning
              ? `1px solid ${activeTheme.colors.danger300}`
              : `1px solid ${activeTheme.colors.secondary}`,
          }}
        >
          <Typography
            fontSize={12}
            fontWeight={700}
            color={isWarning ? activeTheme.colors.danger700 : activeTheme.colors.secondary}
          >
            {event.status}
          </Typography>
        </Box>
      )}

      {/* الصف الرئيسي: التاريخ على اليمين، العنوان والمعلومات على اليسار */}
      <Box
        mb={1.5}
        sx={{
          direction: 'rtl',
          display: 'grid',
          gridTemplateColumns: '68px minmax(0, 1fr)',
          gap: 2,
          alignItems: 'center',
        }}
      >
        {/* اليمين: صندوق التاريخ */}
        <Box
          sx={{
            width: 68,
            minHeight: 84,
            borderRadius: '14px',
            background: isWarning ? activeTheme.colors.danger500 : activeTheme.colors.dateBg,
            color: isWarning ? '#fff' : activeTheme.colors.secondary,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            py: 1,
          }}
        >
          <Typography fontSize={32} fontWeight={700} lineHeight={1}>
            {event.date}
          </Typography>
          <Typography fontSize={12} fontWeight={700} letterSpacing={0.6}>
            {event.month}
          </Typography>
        </Box>

        {/* اليسار: العنوان + المدينة والوقت */}
        <Box
          sx={{
            textAlign: 'right',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 0.5,
          }}
        >
          <Typography
            fontWeight={700}
            fontSize={22}
            color={isWarning ? activeTheme.colors.danger700 : activeTheme.colors.text}
            mb={0.5}
          >
            {event.title}
          </Typography>

          {/* المدينة والوقت */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mt: 0.5,
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            {event.city && (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4 }}>
                <LocationOnOutlined sx={{ color: activeTheme.colors.mutedText, fontSize: 14 }} />
                <Typography color={activeTheme.colors.mutedText} fontSize={13}>
                  {event.city}
                </Typography>
              </Box>
            )}
            {event.time && !isDisabled && (
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.4 }}>
                <AccessTime sx={{ color: activeTheme.colors.mutedText, fontSize: 14 }} />
                <Typography color={activeTheme.colors.mutedText} fontSize={13}>
                  {event.time}
                </Typography>
              </Box>
            )}
          </Box>

          {isWarning && (
            <Box sx={{ display: 'flex', flexDirection: 'row' }} gap={1} mt={1}>
              <WarningAmber
                sx={{ color: activeTheme.colors.danger500, fontSize: 16, margin: '5px 0 0 3px' }}
              />
              <Typography color={activeTheme.colors.danger700} fontSize={13} fontWeight={600}>
                تنبيه: تعارض في الجداول
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* صف المسجد والإمام */}
      {!isDisabled && (
        <Box
          sx={{
            borderRadius: 2,
            border: isWarning
              ? `1px solid ${activeTheme.colors.danger300}`
              : `1px solid ${activeTheme.colors.border}`,
            p: 1.1,
            mb: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: activeTheme.colors.surface,
          }}
        >
          {/* اليمين: اسم المسجد */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <HomeWorkOutlined
              sx={{
                color: isWarning ? activeTheme.colors.danger500 : activeTheme.colors.mutedText,
                fontSize: 16,
              }}
            />
            <Typography
              fontWeight={700}
              color={isWarning ? activeTheme.colors.danger700 : activeTheme.colors.text}
              fontSize={14}
            >
              {event.mosque}
            </Typography>
          </Box>

          {/* اليسار: الإمام أو زر حل النزاع */}
          {isWarning ? (
            <AppButton
              variant="contained"
              size="small"
              backgroundColor={activeTheme.colors.danger500}
              textColor="#fff"
              borderColor={activeTheme.colors.danger500}
              hoverBackgroundColor={activeTheme.colors.danger700}
              borderRadius={1.7}
              px={1.8}
              py={0.7}
              fontSize={11}
              minWidth={0}
            >
              {event.secondaryAction}
            </AppButton>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                py: 0.4,
                px: 1,
                borderRadius: '999px',
                background: activeTheme.colors.surface,
                border: `1px solid ${activeTheme.colors.border}`,
              }}
            >
              <EditOutlined sx={{ color: '#98A2AE', fontSize: 16 }} />
              <Typography fontSize={12.5} fontWeight={600} color={activeTheme.colors.text}>
                {event.imam}
              </Typography>
              <Avatar
                sx={{
                  width: 22,
                  height: 22,
                  fontSize: 10,
                  bgcolor: activeTheme.colors.bgelem,
                }}
              >
                د
              </Avatar>
            </Box>
          )}
        </Box>
      )}

      {/* صف المسجد المقترح - للبطاقات التفاعلية */}
      {isInteractive && (
        <Box
          sx={{
            background: activeTheme.colors.background,
            borderRadius: 2,
            border: `1px dashed ${activeTheme.colors.border}`,
            py: 0.9,
            px: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* اليمين: المسجد المقترح */}
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
            <HomeWorkOutlined sx={{ color: activeTheme.colors.mutedText, fontSize: 14 }} />
            <Typography color={activeTheme.colors.mutedText} fontSize={14}>
              {event.draftMosque}
            </Typography>
          </Box>

          {/* اليسار: زر تعيين خطيب */}
          <AppButton
            variant="outlined"
            size="small"
            backgroundColor="transparent"
            textColor={activeTheme.colors.secondary}
            borderColor={activeTheme.colors.secondary}
            hoverBackgroundColor={activeTheme.colors.background}
            borderRadius={1.6}
            px={1.8}
            py={0.7}
            fontSize={12}
            minWidth={0}
          >
            {event.secondaryAction}
          </AppButton>
        </Box>
      )}

      {/* صف المسجد للبطاقات المعطّلة */}
      {isDisabled && (
        <Box
          sx={{
            p: 1.1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
            <HomeWorkOutlined sx={{ color: activeTheme.colors.mutedText, fontSize: 14 }} />
            <Typography color={activeTheme.colors.text} fontSize={14} fontWeight={600}>
              {event.mosque}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  )
}
