import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined'
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined'
import { useTheme } from '../../theme/themeContext'

function StatCard({ icon, label, value, colors }) {
  return (
    <div
      className="flex flex-col items-end justify-between px-6 py-4 min-h-[100px] rounded-xl shadow-sm"
      style={{ backgroundColor: colors.surface }}
    >
      <div className="self-end">{icon}</div>
      <div className="text-right mt-3">
        <p className="text-[12.5px] mb-1" style={{ color: colors.mutedText }}>{label}</p>
        <p className="text-[28px] font-bold leading-none" style={{ color: colors.text }}>{value}</p>
      </div>
    </div>
  )
}

function TotalCard({ title, total, badges, colors }) {
  return (
    <div
      className="rounded-xl flex flex-col items-end justify-between px-5 py-4 min-h-[100px]"
      style={{ backgroundColor: colors.primaryDark }}
    >
      <p className="text-[12px] text-right leading-snug" style={{ color: colors.onPrimaryMuted }}>{title}</p>
      <p className="text-[34px] sm:text-[38px] font-extrabold leading-none text-right my-1" style={{ color: colors.onPrimary }}>
        {total}
      </p>
      <div className="flex gap-1.5 flex-wrap justify-end">
        {badges.map((badge, i) => (
          <span key={i} className="bg-white/[.13] text-[11px] px-2.5 py-0.5 rounded-full whitespace-nowrap" style={{ color: colors.onPrimaryMuted }}>
            {badge}
          </span>
        ))}
      </div>
    </div>
  )
}

// إحصائيات تذاكر الصيانة والشكاوى — مفتوحة/قيد المعالجة كأولوية اهتمام، والإجمالي مع نسبة الإنجاز
export default function MaintenanceHeader({ tickets = [] }) {
  const { activeTheme } = useTheme()
  const { colors } = activeTheme

  const openCount = tickets.filter((t) => t.status === 'OPEN').length
  const inProgressCount = tickets.filter((t) => t.status === 'IN_PROGRESS').length
  const closedCount = tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length
  const total = tickets.length

  return (
    <div className="px-4 py-3 font-sans">
      <div className="flex flex-col gap-3 sm:hidden">
        <StatCard icon={<WarningAmberOutlinedIcon sx={{ fontSize: 22, color: colors.danger500 }} />} label="مفتوحة" value={String(openCount)} colors={colors} />
        <StatCard icon={<BuildOutlinedIcon sx={{ fontSize: 22, color: colors.secondary }} />} label="قيد المعالجة" value={String(inProgressCount)} colors={colors} />
        <TotalCard title="إجمالي تذاكر الصيانة" total={String(total)} badges={[`${closedCount} تم حلها`, `${openCount} مفتوحة`]} colors={colors} />
      </div>

      <div className="hidden sm:flex gap-3">
        <div className="w-1/4">
          <StatCard icon={<WarningAmberOutlinedIcon sx={{ fontSize: 22, color: colors.danger500 }} />} label="مفتوحة" value={String(openCount)} colors={colors} />
        </div>
        <div className="w-1/4">
          <StatCard icon={<BuildOutlinedIcon sx={{ fontSize: 22, color: colors.secondary }} />} label="قيد المعالجة" value={String(inProgressCount)} colors={colors} />
        </div>
        <div className="w-1/2">
          <TotalCard title="إجمالي تذاكر الصيانة" total={String(total)} badges={[`${closedCount} تم حلها`, `${openCount} مفتوحة`]} colors={colors} />
        </div>
      </div>
    </div>
  )
}
