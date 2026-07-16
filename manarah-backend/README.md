# Manarah Backend API

Backend API لوحة تحكم العربية لإدارة مديرية الأوقاف مبني على NestJS و PostgreSQL و Prisma ORM.

## 🚀 طريقة التشغيل

### المتطلبات الأساسية
- Node.js (v18+)
- PostgreSQL
- npm أو yarn

### خطوات التشغيل

1. **نسخة المشروع وتثبيت الحزم**:
```bash
cd manarah-backend
npm install
```

2. **إعداد قاعدة البيانات**:
```bash
# تعديل ملف .env ببيانات قاعدة PostgreSQL الخاصة بك
# ثم تشغيل migration
npm run prisma:migrate
```

3. **تشغيل الخادم**:
```bash
# وضع التطوير (Development)
npm run start:dev

# وضع الإنتاج (Production)
npm run build
npm run start:prod
```

## 📋 هيكلية المشروع

```
manarah-backend/
├── src/
│   ├── auth/          # مصادقة JWT
│   │   ├── dto/       # كائنات نقل البيانات
│   │   └── strategies/ # استراتيجيات المصادقة
│   ├── users/         # إدارة المستخدمين
│   ├── mosques/       # إدارة المساجد
│   ├── preachers/     # إدارة الخطباء
│   ├── employees/     # إدارة الموظفين
│   ├── announcements/ # إدارة الإعلانات
│   └── prisma/        # خدمة Prisma
├── prisma/
│   └── schema.prisma   # نموذج قاعدة البيانات
└── .env               # متغيرات البيئة
```

## 🔗 مسارات API

| المسار | الطريقة | الوصف |
|--------|---------|-------|
| `/api/auth/login` | POST | تسجيل الدخول |
| `/api/auth/register` | POST | إنشاء حساب |
| `/api/mosques` | GET, POST | إدارة المساجد |
| `/api/preachers` | GET, POST | إدارة الخطباء |
| `/api/employees` | GET, POST | إدارة الموظفين |
| `/api/announcements` | GET, POST | إدارة الإعلانات |

## 🛠️ الأوامر المتاحة

```bash
npm run start:dev    # تشغيل الخادم في وضع التطوير
npm run build        # بناء المشروع
npm run start:prod   # تشغيل المشروع المبني
npm run lint         # فحص الكود
npm run prisma:studio # فتح Prisma Studio
npm run prisma:migrate  # تنفيذ migration
```

## 🔐 JWT Authentication

جميع طلبات API تتطلب توكن JWT في الـ Header:
```
Authorization: Bearer <token>
```

## 📊 نموذج قاعدة البيانات

يشمل النموذج النماذج التالية:
- User (المستخدمون)
- Mosque (المساجد)
- Preacher (الخطباء)
- Employee (الموظفون)
- PreacherAssignment (تعيينات الخطباء على المساجد)
- Announcement (الإعلانات)
- Donation (التبرعات)
