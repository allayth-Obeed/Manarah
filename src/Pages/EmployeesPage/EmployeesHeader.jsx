import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

function StaffCard({ icon, label, value }) {
  return (
    <div className="flex flex-col items-end justify-between px-6 py-4 min-h-[100px] bg-white rounded-xl shadow-sm">
      <div className="self-end">{icon}</div>
      <div className="text-right mt-3">
        <p className="text-[12.5px] text-gray-400 mb-1">{label}</p>
        <p className="text-[28px] font-bold text-gray-800 leading-none">{value}</p>
      </div>
    </div>
  );
}

function TotalCard({ title, total, badges }) {
  return (
    <div className="bg-[#1a4a33] rounded-xl flex flex-col items-end justify-between px-5 py-4 min-h-[100px]">
      <p className="text-[12px] text-[#a8cbb5] text-right leading-snug">{title}</p>
      <p className="text-[34px] sm:text-[38px] font-extrabold text-white leading-none text-right my-1">{total}</p>
      <div className="flex gap-1.5 flex-wrap justify-end">
        {badges.map((badge, i) => (
          <span key={i} className="bg-white/[.13] text-[#cce8d8] text-[11px] px-2.5 py-0.5 rounded-full whitespace-nowrap">
            {badge}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function EmployeesHeader({ employees = [] }) {
  // حساب الإحصائيات من البيانات الحقيقية
  const totalEmployees = employees.length
  const onDuty = employees.filter((e) => e.status !== 'إجازة').length
  const onLeave = employees.length - onDuty

  return (
    <div className="px-4 py-3 font-sans">

      {/* Mobile: single column */}
      <div className="flex flex-col gap-3 sm:hidden">
        <StaffCard
          icon={<CalendarMonthOutlinedIcon sx={{ fontSize: 22, color: '#c0392b' }} />}
          label="في إجازة"
          value={String(onLeave)}
        />
        <StaffCard
          icon={<CheckCircleOutlinedIcon sx={{ fontSize: 22, color: '#27ae60' }} />}
          label="على رأس العمل"
          value={String(onDuty)}
        />
        <TotalCard
          title="إجمالي الكادر الديني"
          total={String(totalEmployees)}
          badges={[`${onDuty} على رأس العمل`, `${onLeave} في إجازة`]}
        />
      </div>

      {/* Desktop: 25% / 25% / 50% */}
      <div className="hidden sm:flex gap-3">
        <div className="w-1/4">
          <StaffCard
            icon={<CalendarMonthOutlinedIcon sx={{ fontSize: 22, color: '#c0392b' }} />}
            label="في إجازة"
            value={String(onLeave)}
          />
        </div>
        <div className="w-1/4">
          <StaffCard
            icon={<CheckCircleOutlinedIcon sx={{ fontSize: 22, color: '#27ae60' }} />}
            label="على رأس العمل"
            value={String(onDuty)}
          />
        </div>
        <div className="w-1/2">
          <TotalCard
            title="إجمالي الكادر الديني"
            total={String(totalEmployees)}
            badges={[`${onDuty} على رأس العمل`, `${onLeave} في إجازة`]}
          />
        </div>
      </div>

    </div>
  );
}
