import { createContext, useContext } from 'react';

// نفس نمط theme/themeContext.js — Context منفصل عن الـ Provider لتفادي مشاكل Fast Refresh
export const UserContext = createContext(null);

// hook مشترك لقراءة المستخدم الحالي ودوره في أي مكوّن بالتطبيق دون تكرار جلب /auth/me في كل صفحة
export function useCurrentUser() {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useCurrentUser must be used within a UserProvider');
  }

  return context;
}
