import { Role } from '@prisma/client';

// ثلاثة الأدوار الإدارية العليا وترتيب قوتها من الأقوى للأضعف: مسؤول النظام > مدير > مشرف
// تُستخدم فقط لتحديد من يملك صلاحية تعديل/حذف/تغيير كلمة سر حساب إداري آخر — بقية الصلاحيات متساوية بين الثلاثة
const ADMIN_TIER_RANK: Partial<Record<Role, number>> = {
  [Role.SUPER_ADMIN]: 3,
  [Role.MANAGER]: 2,
  [Role.ADMIN]: 1,
};

export function isAdminTierRole(role: Role): boolean {
  return role in ADMIN_TIER_RANK;
}

// يسمح فقط إن كانت رتبة الفاعل أعلى صراحةً من رتبة الهدف — نفس الرتبة (بما فيها حساب الفاعل نفسه) ممنوعة عمداً
export function canActOnAdminTier(actingRole: Role, targetRole: Role): boolean {
  return (ADMIN_TIER_RANK[actingRole] ?? 0) > (ADMIN_TIER_RANK[targetRole] ?? 0);
}
