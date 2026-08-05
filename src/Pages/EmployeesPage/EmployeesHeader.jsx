import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { useTheme } from '../../theme/themeContext'; // ADDED: لاستبدال ألوان Tailwind الثابتة برموز الثيم المتوافقة مع الوضع الليلي

// MODIFIED: colors تُمرَّر كخاصية بدل كلاسات bg-white/text-gray-* الثابتة التي لا تتكيّف مع الوضع الليلي
function StaffCard({ icon, label, value, colors }) {
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
  );
}

// MODIFIED: colors تُمرَّر كخاصية بدل bg-[#1a4a33]/text-[#a8cbb5] الثابتة
function TotalCard({ title, total, badges, colors }) {
  return (
    <div
      className="rounded-xl flex flex-col items-end justify-between px-5 py-4 min-h-[100px]"
      style={{ backgroundColor: colors.primaryDark }}
    >
      <p className="text-[12px] text-right leading-snug" style={{ color: colors.onPrimaryMuted }}>{title}</p>
      <p
        className="text-[34px] sm:text-[38px] font-extrabold leading-none text-right my-1"
        style={{ color: colors.onPrimary }}
      >
        {total}
      </p>
      <div className="flex gap-1.5 flex-wrap justify-end">
        {badges.map((badge, i) => (
          <span
            key={i}
            className="bg-white/[.13] text-[11px] px-2.5 py-0.5 rounded-full whitespace-nowrap"
            style={{ color: colors.onPrimaryMuted }}
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function EmployeesHeader({ employees = [] }) {
  const { activeTheme } = useTheme(); // ADDED
  const { colors } = activeTheme;

  // حساب الإحصائيات من البيانات الحقيقية
  const totalEmployees = employees.length
  const onDuty = employees.filter((e) => e.status !== 'إجازة').length
  const onLeave = employees.length - onDuty

  return (
    <div className="px-4 py-3 font-sans">

      {/* Mobile: single column */}
      <div className="flex flex-col gap-3 sm:hidden">
        <StaffCard
          icon={<CalendarMonthOutlinedIcon sx={{ fontSize: 22, color: colors.danger500 }} />}
          label="في إجازة"
          value={String(onLeave)}
          colors={colors}
        />
        <StaffCard
          icon={<CheckCircleOutlinedIcon sx={{ fontSize: 22, color: colors.primary }} />}
          label="على رأس العمل"
          value={String(onDuty)}
          colors={colors}
        />
        <TotalCard
          title="إجمالي الكادر الديني"
          total={String(totalEmployees)}
          badges={[`${onDuty} على رأس العمل`, `${onLeave} في إجازة`]}
          colors={colors}
        />
      </div>

      {/* Desktop: 25% / 25% / 50% */}
      <div className="hidden sm:flex gap-3">
        <div className="w-1/4">
          <StaffCard
            icon={<CalendarMonthOutlinedIcon sx={{ fontSize: 22, color: colors.danger500 }} />}
            label="في إجازة"
            value={String(onLeave)}
            colors={colors}
          />
        </div>
        <div className="w-1/4">
          <StaffCard
            icon={<CheckCircleOutlinedIcon sx={{ fontSize: 22, color: colors.primary }} />}
            label="على رأس العمل"
            value={String(onDuty)}
            colors={colors}
          />
        </div>
        <div className="w-1/2">
          <TotalCard
            title="إجمالي الكادر الديني"
            total={String(totalEmployees)}
            badges={[`${onDuty} على رأس العمل`, `${onLeave} في إجازة`]}
            colors={colors}
          />
        </div>
      </div>

    </div>
  );
}
