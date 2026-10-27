# مشغل C# المعزول

المشغل منفصل عن خادم Next.js. كل إرسال ينشئ حاوية مؤقتة بلا شبكة، بذاكرة 384 MB ونصف CPU وحد أقصى للعمليات و10 ثوانٍ، ثم يحذفها. حاوية المشغل نفسها تحتاج Docker socket؛ شغّلها على جهاز موثوق، واترك المنفذ مربوطًا على localhost أو شبكة داخلية فقط، ولا تنشره مباشرة للإنترنت.

## التشغيل محليًا

1. ثبّت Docker Desktop أو Docker Engine وشغّله.
2. أنشئ رمزًا عشوائيًا بطول 32 حرفًا أو أكثر، وضعه باسم `CODE_RUNNER_TOKEN` في البيئة التي تشغّل Compose، وأضف الرمز نفسه إلى `.env` الخاص بتطبيق Next.js.
3. ابنِ صورة بيئة الطلاب مرة واحدة: `docker build -f code-runner/Runtime.Dockerfile -t nabta-csharp-sandbox:8.0 code-runner`.
4. شغّل الخدمة: `docker compose -f docker-compose.sandbox.yml up --build -d`.
5. أضف `CODE_RUNNER_URL=http://localhost:8787/execute` إلى `.env` وأعد تشغيل Next.js.

في الاستضافة، شغّل المشغل على مضيف داخلي مع Docker، واجعل `CODE_RUNNER_URL` عنوانًا خاصًا لا عامًا. أضف حماية الشبكة ودوّر الرمز عند تغييره. لا يرسل المشغل حالات الاختبار أو الإجابات المتوقعة للطالب.

## النشر مع GitHub Actions على Ubuntu

ملف `.github/workflows/deploy.yml` يبني صورة .NET، ثم يشغّل أو يحدّث خدمة المشغّل قبل إعادة تشغيل Next.js. أضف هذه القيم في **GitHub → Settings → Secrets and variables → Actions → New repository secret**:

- `DATABASE_URL`: رابط قاعدة الإنتاج التي يستخدمها تطبيق T3500 وقت التشغيل.
- `DIRECT_URL`: رابط الاتصال المباشر بقاعدة T3500 الذي يستخدمه Prisma لتطبيق migrations. يمكن أن يساوي `DATABASE_URL` إذا لم تستخدم قاعدة مجمّعة.
- `AUTH_SECRET`: سر عشوائي طويل لجلسات تسجيل الدخول.
- `ADMIN_EMAIL`: البريد المسجل في الموقع والمسموح له بلوحة الإدارة.
- `CODE_RUNNER_TOKEN`: سر عشوائي بطول 32 حرفًا على الأقل.

يجب أن يكون Docker Engine وDocker Compose متاحين لمستخدم الـ self-hosted runner. بعد تعديل الـ workflow، كل push إلى `main` يثبت الحزم، يطبّق migrations، يبني الموقع وصورة C#، ثم يشغّل الخدمتين. تحقق أن `DATABASE_URL` يشير لقاعدة الإنتاج قبل أول نشر. منفذ المشغّل مربوط محليًا على `127.0.0.1:8787`، ولا يحتاج فتحه في الجدار الناري.

قاعدة Prisma Postgres الموصولة بـVercel مخصصة لمعاينات Vercel وليست بديلًا عن قاعدة الإنتاج على T3500. استخدم بيانات اعتماد منفصلة لكل بيئة.
