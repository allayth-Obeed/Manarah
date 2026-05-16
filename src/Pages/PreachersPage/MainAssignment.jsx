import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material'
import {
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
  conflict: 'تنبيه تعارض في الدول',
}

const STATUS_LABELS = {
  normal: 'متبقية',
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
    city: 'الميدان حمص',
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
    mosque: 'مسجد أبو قورة',
    imam: '',
    city: 'عمان الأردن',
    status: STATUS_LABELS.normal,
    warning: false,
    disabled: true,
  },
  {
    id: 3,
    title: 'جمعة الصيانة الدورية',
    date: '03',
    month: 'NOV',
    mosque: 'مسجد الزبيري',
    imam: 'الخطيب مخصص لمسجدين',
    status: STATUS_LABELS.conflict,
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

// معاملات المكوّن `MainAssignment`:
// - events: مصفوفة كائنات الأحداث التي سيتم عرضها (الافتراضي `DEFAULT_EVENTS`).
// - monthLabel: نص لعرض تسمية الشهر في رأس الصفحة (الافتراضي `DEFAULT_MONTH_LABEL`).
// - viewMode: سلسلة تحدد وضع العرض، مثلاً 'list' أو 'calendar'.
// - onViewChange: دالة اختيارية تُستدعى عند تغيير وضع العرض وتستقبل القيمة الجديدة.
export default function MainAssignment({
  events = DEFAULT_EVENTS,
  monthLabel = DEFAULT_MONTH_LABEL,
  viewMode,
  onViewChange,
}) {
  // Read the current theme object from the app context.
  const { activeTheme } = useTheme()
  // Decide whether the list view is selected.
  const isListView = viewMode === 'list'
  // Call the parent view handler only when it exists.
  const handleViewChange = (nextView) =>
    typeof onViewChange === 'function' && onViewChange(nextView)

  // This card holds the main assignment content.
  const listCard = (
    // Outer card wrapper for the assignment list.
    <Card
      // Card spacing, border, and background are theme-based.
      sx={{
        // Internal padding around the card content.
        p: 2,
        // Rounded corners for the card.
        borderRadius: '20px',
        // Use the panel background from the theme.
        background: activeTheme.colors.panelBg,
        // Use the light border from the theme.
        border: `1px solid ${activeTheme.colors.borderLight}`,
        // Remove the default shadow.
        boxShadow: 'none',
        // Keep the layout RTL for Arabic content.
        direction: 'rtl',
      }}
    >
      {/* Header row with month label and view buttons. */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        {/* Month navigation area. */}
        <Box display="flex" alignItems="center" gap={1}>
          {/* Right arrow icon. */}
          <ChevronRight sx={{ color: activeTheme.colors.primaryDark, fontSize: 18 }} />
          {/* Current month label. */}
          <Typography fontWeight={700} fontSize={26} color={activeTheme.colors.text}>
            {monthLabel}
          </Typography>
          {/* Left arrow icon. */}
          <ChevronLeft sx={{ color: activeTheme.colors.primaryDark, fontSize: 18 }} />
        </Box>

        {/* Buttons that switch between list and calendar views. */}
        <Box display="flex" gap={0.8}>
          {/* List button. */}
          <AppButton
            size="small"
            variant={isListView ? 'contained' : 'outlined'}
            onClick={() => handleViewChange('list')}
            backgroundColor={isListView ? activeTheme.colors.primaryDark : 'transparent'}
            textColor={isListView ? '#fff' : activeTheme.colors.mutedText}
            borderColor={isListView ? activeTheme.colors.primaryDark : activeTheme.colors.border}
            hoverBackgroundColor={isListView ? '#0A4A33' : activeTheme.colors.background}
            borderRadius={9}
            px={2}
            py={0.8}
            fontSize={11}
          >
            قائمة
          </AppButton>
          {/* Calendar button. */}
          <AppButton
            size="small"
            variant={isListView ? 'outlined' : 'contained'}
            onClick={() => handleViewChange('calendar')}
            backgroundColor={isListView ? 'transparent' : activeTheme.colors.primaryDark}
            textColor={isListView ? activeTheme.colors.mutedText : '#fff'}
            borderColor={isListView ? activeTheme.colors.border : activeTheme.colors.primaryDark}
            hoverBackgroundColor={isListView ? activeTheme.colors.background : '#0A4A33'}
            borderRadius={9}
            px={2}
            py={0.8}
            fontSize={11}
          >
            تقويم
          </AppButton>
        </Box>
      </Box>

      {/* If there are events, render them, otherwise show the empty state. */}
      {events.length > 0 ? (
        // Render each event as an event card.
        events.map((event) => <EventCard key={event.id} event={event} activeTheme={activeTheme} />)
      ) : (
        // Empty state when no events exist.
        <Box
          sx={{
            // Dashed border to indicate empty data.
            border: `1px dashed ${activeTheme.colors.border}`,
            // Rounded corners for the empty state box.
            borderRadius: 2,
            // Inner spacing.
            p: 3,
            // Center the empty-state text.
            textAlign: 'center',
          }}
        >
          {/* Empty title. */}
          <Typography fontWeight={700} color={activeTheme.colors.text}>
            لا توجد بيانات حالياً
          </Typography>
          {/* Empty description. */}
          <Typography variant="body2" color={activeTheme.colors.mutedText}>
            سيتم ربط هذه الشاشة بالـ API لاحقاً.
          </Typography>
        </Box>
      )}
    </Card>
  )

  // This card holds the weekly summary section.
  const weeklySummary = (
    // Weekly summary wrapper card.
    <Card sx={{ borderRadius: 2, p: 2 }}>
      {/* Remove default padding so the layout is tighter. */}
      <CardContent sx={{ p: 0 }}>
        {/* Summary header row. */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          {/* Summary title. */}
          <Typography fontWeight={700} fontSize={14} color={activeTheme.colors.text}>
            نظرة عامة للأسبوع
          </Typography>
          {/* Summary percentage. */}
          <Typography variant="caption" color={activeTheme.colors.mutedText}>
            مكتمل 48%
          </Typography>
        </Box>

        {/* Progress indicator for the week. */}
        <LinearProgress
          variant="determinate"
          value={48}
          sx={{
            // Bar height.
            height: 8,
            // Rounded ends.
            borderRadius: 5,
            // Space below the bar.
            mb: 2,
            // Track color.
            background: activeTheme.colors.border,
            // Filled bar color.
            '& .MuiLinearProgress-bar': { background: activeTheme.colors.secondary },
          }}
        />

        {/* Statistics grid. */}
        <Grid container spacing={2}>
          {/* Render each statistic tile. */}
          {DEFAULT_WEEKLY_STATS.map((item) => (
            <Grid item xs={6} key={item.label}>
              {/* Statistic tile container. */}
              <Paper
                elevation={0}
                sx={{
                  // Tile padding.
                  p: 1.5,
                  // Center the content.
                  textAlign: 'center',
                  // Soft rounded corners.
                  borderRadius: 1.5,
                  // Accent background.
                  background: activeTheme.colors.accent,
                }}
              >
                {/* Statistic value. */}
                <Typography fontWeight={700} fontSize={18} color={activeTheme.colors.text}>
                  {item.value}
                </Typography>
                {/* Statistic label. */}
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

  // Return the full page layout.
  return (
    // Page background and spacing wrapper.
    <Box sx={{ background: activeTheme.colors.pageBg, minHeight: '100vh', p: 2.5 }}>
      {/* Two-column grid for the main content and sidebar. */}
      <Box
        sx={{
          // Create the grid.
          display: 'grid',
          // Main column plus fixed-width sidebar.
          gridTemplateColumns: 'minmax(0, 1fr) 360px',
          // Gap between columns.
          gap: 2.5,
          // Align items to the top.
          alignItems: 'start',
        }}
      >
        {/* Left column container. */}
        <Box>{listCard}</Box>

        {/* Right column container. */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Rapid assignment shortcut. */}
          <RapidAssignment />
          {/* Weekly summary card. */}
          {weeklySummary}
        </Box>
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
        p: 2,
        borderRadius: '18px',
        border: `1px solid ${isWarning ? activeTheme.colors.danger300 : activeTheme.colors.border}`,
        background: isWarning ? activeTheme.colors.danger100 : activeTheme.colors.surface,
        opacity: isDisabled ? 0.45 : 1,
        direction: 'rtl',
        mb: 1.5,
      }}
    >
      <Box display="flex" gap={2}>
        <Box flex={1}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.1}>
            {event.status && (
              <Chip
                label={event.status}
                size="small"
                sx={{
                  height: 24,
                  borderRadius: '999px',
                  background: isWarning ? activeTheme.colors.danger300 : activeTheme.colors.accent,
                  color: isWarning ? activeTheme.colors.danger700 : activeTheme.colors.secondary,
                  border: isWarning
                    ? `1px solid ${activeTheme.colors.danger300}`
                    : `1px solid ${activeTheme.colors.secondary}`,
                  fontSize: 11,
                  fontWeight: 700,
                }}
              />
            )}

            <Box textAlign="right">
              <Typography
                fontWeight={700}
                fontSize={isWarning ? 30 : 32}
                color={isWarning ? activeTheme.colors.danger700 : activeTheme.colors.text}
              >
                {event.title}
              </Typography>

              {isInteractive && (
                <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                  <LocationOnOutlined sx={{ color: activeTheme.colors.mutedText, fontSize: 14 }} />
                  <Typography color={activeTheme.colors.mutedText} fontSize={13}>
                    {event.city}
                  </Typography>
                  <Typography color={activeTheme.colors.mutedText} fontSize={13}>
                    {event.time}
                  </Typography>
                </Box>
              )}

              {isDisabled && (
                <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                  <LocationOnOutlined sx={{ color: activeTheme.colors.mutedText, fontSize: 14 }} />
                  <Typography color={activeTheme.colors.mutedText} fontSize={13}>
                    {event.city}
                  </Typography>
                </Box>
              )}

              {isWarning && (
                <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                  <WarningAmber sx={{ color: activeTheme.colors.danger500, fontSize: 14 }} />
                  <Typography color={activeTheme.colors.danger700} fontSize={13} fontWeight={600}>
                    {event.status}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>

          {!isDisabled && (
            <Box
              sx={{
                background: activeTheme.colors.surface,
                borderRadius: 2,
                border: isWarning
                  ? `1px solid ${activeTheme.colors.danger300}`
                  : '1px solid transparent',
                p: 1.1,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
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
                  <Avatar
                    sx={{ width: 22, height: 22, fontSize: 10, bgcolor: activeTheme.colors.bgelem }}
                  >
                    د
                  </Avatar>
                  <Typography fontSize={12.5} fontWeight={600} color={activeTheme.colors.text}>
                    {event.imam}
                  </Typography>
                  <EditOutlined sx={{ color: '#98A2AE', fontSize: 16 }} />
                </Box>
              )}

              <Box display="flex" alignItems="center" gap={0.7}>
                <Typography
                  fontWeight={700}
                  color={isWarning ? activeTheme.colors.danger700 : activeTheme.colors.text}
                  fontSize={15}
                >
                  {event.mosque}
                </Typography>
                <HomeWorkOutlined
                  sx={{
                    color: isWarning ? activeTheme.colors.danger500 : activeTheme.colors.secondary,
                    fontSize: 18,
                  }}
                />
              </Box>
            </Box>
          )}

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
              <Typography color={activeTheme.colors.mutedText} fontSize={14}>
                {event.draftMosque}
              </Typography>
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
        </Box>

        <Box
          sx={{
            width: 70,
            height: 84,
            borderRadius: '16px',
            background: isWarning ? activeTheme.colors.danger500 : activeTheme.colors.dateBg,
            color: isWarning ? '#fff' : activeTheme.colors.secondary,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography fontSize={36} fontWeight={700} lineHeight={1}>
            {event.date}
          </Typography>
          <Typography fontSize={13} fontWeight={700} letterSpacing={0.6}>
            {event.month}
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
