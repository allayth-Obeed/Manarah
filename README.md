# منارة (Manarah)

نظام ذكي لإدارة شؤون المساجد ومديرية الأوقاف — مشروع تخرج، جامعة حمص، كلية الهندسة المعلوماتية، قسم هندسة الشبكات والنظم الحاسوبية.

المشروع عبارة عن تطبيق ويب (Full-Stack) مقسّم إلى مجلدين داخل نفس المستودع:

```
Manarah/
├── src/                # الواجهة الأمامية (React + Vite)
├── public/              # ملفات ثابتة للواجهة الأمامية
├── manarah-backend/     # الواجهة الخلفية (NestJS + Prisma + PostgreSQL)
│   ├── src/
│   ├── prisma/          # مخطط قاعدة البيانات والـ migrations وبيانات البذر
│   └── uploads/         # صور المستخدمين المرفوعة
└── docs/                # تقرير المشروع
```

## التقنيات المستخدمة

| الطبقة | التقنيات |
|---|---|
| الواجهة الأمامية | React 19, Vite, MUI, Tailwind CSS, React Router, Axios, Socket.io-client, Recharts |
| الواجهة الخلفية | NestJS 10, Prisma ORM, PostgreSQL, JWT (Passport), Socket.io, bcrypt |

## المتطلبات الأساسية

قبل البدء تأكد من توفر:

- **Node.js** إصدار `20.19+` أو `22.12+` (يفضّل أحدث إصدار LTS) و **npm**
- **PostgreSQL** (نسخة محلية تعمل على جهازك، أو خادم تصل إليه عبر الشبكة)

> بما أن المشروع مرفوع **بدون** مجلدات `node_modules`، يجب تثبيت الحزم في كل من المجلد الجذري و`manarah-backend` كخطوة أولى — كما هو موضح أدناه.

---

## 1) تشغيل الواجهة الخلفية (Backend)

```bash
cd manarah-backend
npm install
```

انسخ ملف البيئة النموذجي وعدّل عليه:

```bash
cp .env.example .env
```

ثم افتح `manarah-backend/.env` وعدّل القيم التالية بما يناسب قاعدة بياناتك:

| المتغير | الوصف | مثال |
|---|---|---|
| `DATABASE_URL` | رابط الاتصال بقاعدة PostgreSQL | `postgresql://postgres:PASSWORD@localhost:5432/manarah_db?schema=public` |
| `JWT_SECRET` | مفتاح سري لتوقيع رموز JWT — غيّره لأي قيمة عشوائية خاصة بك | — |
| `JWT_EXPIRES_IN` | مدة صلاحية رمز الدخول | `7d` |
| `PORT` | منفذ تشغيل الخادم | `3001` |
| `FRONTEND_URL` | عنوان الواجهة الأمامية (لأغراض CORS في وضع الإنتاج) | `http://localhost:5173` |
| `NODE_ENV` | بيئة التشغيل | `development` |

تأكد من وجود قاعدة بيانات فارغة بالاسم الذي حددته في `DATABASE_URL` (مثلاً `manarah_db`)، ثم طبّق مخطط قاعدة البيانات:

```bash
npm run prisma:migrate
```

هذا الأمر ينشئ كل الجداول اللازمة تلقائياً بحسب `prisma/schema.prisma`.

**(اختياري لكن موصى به)** بذر التقسيم الجغرافي السوري (محافظة → منطقة → منطقة فرعية → موقع) المستخدم في قوائم اختيار الموقع بالتطبيق:

```bash
npm run prisma:seed
```

الآن شغّل الخادم:

```bash
npm run start:dev
```

سيعمل على: **http://localhost:3001/api**

---

## 2) تشغيل الواجهة الأمامية (Frontend)

من **المجلد الجذري** للمشروع (وليس `manarah-backend`):

```bash
npm install
```

انسخ ملف البيئة النموذجي (القيمة الافتراضية متوافقة مباشرة مع الباك اند أعلاه):

```bash
cp .env.example .env
```

`VITE_API_URL` يجب أن يشير إلى نفس المنفذ الذي يعمل عليه الباك اند، مثلاً:

```
VITE_API_URL=http://localhost:3001/api
```

شغّل خادم التطوير:

```bash
npm run dev
```

سيعمل على: **http://localhost:5173**

> شغّل الباك اند والفرونت اند **معاً في نافذتي طرفية منفصلتين** — كلاهما يجب أن يعملا في الوقت نفسه حتى يعمل التطبيق.

---

## 3) إنشاء أول حساب مدير (Admin)

لأسباب أمنية، أي تسجيل جديد عبر صفحة "إنشاء حساب" في الواجهة يُنشأ تلقائياً بدور `USER` فقط — لا توجد طريقة لمنح الصلاحيات الإدارية لنفسك عبر التسجيل العام. لإنشاء أول حساب مدير في قاعدة بيانات جديدة اتبع الخطوات التالية:

1. سجّل حساباً عادياً من صفحة "إنشاء حساب" في الواجهة.
2. افتح Prisma Studio (أداة رسومية لتصفح قاعدة البيانات):
   ```bash
   cd manarah-backend
   npm run prisma:studio
   ```
3. من جدول `User`، ابحث عن الحساب الذي أنشأته وغيّر قيمة الحقل `role` من `USER` إلى `ADMIN`، ثم احفظ.
4. سجّل الدخول من جديد بنفس الحساب — سيظهر الآن بكامل صلاحيات المدير.

بديل عبر `psql` مباشرة لمن يفضّله:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

الأدوار المتاحة في النظام: `ADMIN`, `MANAGER`, `USER`, `PREACHER`, `EMPLOYEE`.

---

## البناء للإنتاج (Production Build)

**الواجهة الأمامية:**

```bash
npm run build     # الناتج في dist/
npm run preview   # معاينة الناتج محلياً
```

**الواجهة الخلفية:**

```bash
cd manarah-backend
npm run build
npm run start:prod
```

---

## أوامر مفيدة أخرى

**المجلد الجذري (Frontend):**

| الأمر | الوصف |
|---|---|
| `npm run dev` | تشغيل خادم التطوير |
| `npm run build` | بناء نسخة الإنتاج |
| `npm run preview` | معاينة نسخة الإنتاج محلياً |
| `npm run lint` | فحص الكود |
| `npm run format` | تهيئة تنسيق الكود |

**`manarah-backend/` (Backend):**

| الأمر | الوصف |
|---|---|
| `npm run start:dev` | تشغيل الخادم في وضع التطوير (إعادة تشغيل تلقائية) |
| `npm run build` | بناء المشروع |
| `npm run start:prod` | تشغيل النسخة المبنية |
| `npm run prisma:studio` | فتح واجهة Prisma Studio لتصفح/تعديل قاعدة البيانات |
| `npm run prisma:migrate` | تطبيق/إنشاء migrations على قاعدة البيانات |
| `npm run prisma:generate` | إعادة توليد Prisma Client (نادراً ما يلزم يدوياً — يتم تلقائياً بعد `npm install`) |
| `npm run prisma:seed` | بذر التقسيم الجغرافي السوري |
| `npm run test` | تشغيل اختبارات Jest |

---

## استكشاف الأخطاء الشائعة

- **الواجهة الأمامية تعرض أنها لا تستطيع الوصول للخادم:** تأكد أن الباك اند يعمل فعلياً على المنفذ المحدد في `VITE_API_URL`.
- **خطأ اتصال بقاعدة البيانات عند تشغيل الباك اند:** تأكد أن خدمة PostgreSQL تعمل، وأن `DATABASE_URL` في `manarah-backend/.env` صحيح (اسم المستخدم/كلمة المرور/اسم القاعدة).
- **خطأ متعلق بـ Prisma Client غير موجود:** نفّذ `npm run prisma:generate` داخل `manarah-backend`.
