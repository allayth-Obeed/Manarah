import { useCallback, useEffect, useMemo, useState } from 'react'
import { UserContext } from './userContext'
import { validateToken } from '../services/authService'

// الأدوار المسموح لها بالإنشاء/التعديل/الحذف — الباقي (USER, PREACHER, EMPLOYEE) قراءة فقط
// MODIFIED: أُضيف SUPER_ADMIN (مسؤول النظام) — الرتبة الإدارية الثالثة، بنفس صلاحيات ADMIN/MANAGER الكاملة
// على كل شيء عدا التسلسل الهرمي بينها الثلاثة بصفحة إدارة المستخدمين (انظر Users.jsx)
const WRITE_ROLES = ['ADMIN', 'MANAGER', 'SUPER_ADMIN']

// Provider واحد على مستوى التطبيق كله — يجلب المستخدم الحقيقي مرة واحدة فقط بدل
// تكرار نفس استدعاء /auth/me في كل صفحة (TopBar, AppLayout, ...) بشكل منفصل ومنعزل عن بعضه
export function UserProvider({ children }) {
  const [user, setUser] = useState(null) // null = لا يوجد مستخدم مسجَّل دخوله بعد/جلسة غير صالحة
  const [loading, setLoading] = useState(true)

  // ADDED: يُستدعى بعد تسجيل الدخول/الخروج أو تحديث الصورة الشخصية لإعادة مزامنة بيانات المستخدم في كل مكان
  const refreshUser = useCallback(async () => {
    const result = await validateToken()
    setUser(result.valid && result.user ? result.user : null)
    return result
  }, [])

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    refreshUser().finally(() => {
      if (isMounted) setLoading(false)
    })
    return () => {
      isMounted = false
    }
  }, [refreshUser])

  const value = useMemo(
    () => ({
      user,
      setUser, // ADDED: تحديث فوري محلي (مثل بعد رفع صورة) بدون طلب شبكة إضافي
      loading,
      refreshUser,
      role: user?.role || null,
      // ADDED: ADMIN/MANAGER فقط لديهم صلاحيات كاملة؛ الباقي قراءة فقط بالواجهة (الباك اند يفرض هذا أصلاً، وهذا فقط لإخفاء أزرار لا فائدة منها لهم)
      canWrite: WRITE_ROLES.includes(user?.role),
    }),
    [user, loading, refreshUser],
  )

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
