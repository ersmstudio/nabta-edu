# دليل Storybook

Storybook مساحة منفصلة لعرض واجهات React وتطويرها ومراجعة الحالات المختلفة من غير تشغيل صفحات الموقع أو الاتصال بقاعدة البيانات. نستخدمه لمعاينة المكوّنات والتخطيطات باستخدام بيانات تجريبية واضحة.

## التشغيل

ثبّت اعتماديات المشروع من مجلده الرئيسي، ثم شغّل:

```powershell
npm install
npm run storybook
```

افتح `http://localhost:6006`. لا يحتاج Storybook إلى إعداد قاعدة البيانات أو ملف `.env` عند عرض القصص المستقلة. لإيقافه، أوقف الأمر في نافذة الطرفية.

لإنشاء نسخة ثابتة من Storybook:

```powershell
npm run build-storybook
```

تُكتب النتيجة في `storybook-static/`، وهذا المجلد مستثنى من Git.

## كيف جرى ربطه بالمشروع؟

- `.storybook/main.ts` يحدد إطار `@storybook/nextjs-vite`، وإضافات التوثيق وإمكانية الوصول والاختبار، وأنماط القصص الموجودة تحت `stories/`.
- `.storybook/preview.tsx` يستورد `app/globals.css` كي تظهر الأنماط العامة وTailwind في المعاينة.
- `stories/` يحتوي القصص. كل ملف `*.stories.tsx` يصف واجهة أو مكوّنًا واحدًا وحالات عرضه.
- `vitest.config.ts` يربط القصص بإضافة Storybook في Vitest ويشغّلها على Chromium عبر Playwright.

استخدام Vite هنا يخص بيئة المعاينة والاختبار. التطبيق نفسه يظل يعمل عبر Next.js من خلال `npm run dev`.

## إضافة قصة جديدة

ضع القصة بجوار المكوّن داخل `stories/`، وسمّها مثل `CourseCard.stories.tsx`. استورد الأنواع من إطار المشروع:

```tsx
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import CourseCard from '../components/CourseCard';

const meta = {
  title: 'Courses/CourseCard',
  component: CourseCard,
} satisfies Meta<typeof CourseCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // أضف هنا بيانات تجريبية تمثل حالة العرض الافتراضية.
  },
};
```

عدّل مسار الاستيراد والحقول بحسب المكوّن الفعلي. أضف قصصًا أخرى للحالات المهمة مثل التحميل والفراغ والخطأ، وللنصوص العربية والإنجليزية عندما يؤثر اتجاه الصفحة أو طول النص على التصميم.

## قواعد تساعدنا على مراجعة القصص

1. استخدم بيانات تجريبية، ولا تجعل القصة تعتمد على حساب حقيقي أو قاعدة بيانات أو أسرار البيئة.
2. فضّل استيراد مكوّن عرض مستقل. صفحات `app/` قد تعتمد على جلسة المستخدم أو قاعدة البيانات أو وظائف الخادم، وهذه التبعيات لا تعمل دائمًا داخل المتصفح الذي يعرض القصص.
3. اعرض المحتوى داخل المكوّن نفسه، ومرّر القيم والحالات كـprops أو استخدم بيانات ثابتة في القصة.
4. استخدم أسماء واضحة في `title` واسم القصة، وراجع القصة في Storybook قبل طلب المراجعة.
5. يمكن فحص قواعد المشروع بـ`npm run lint`، وإنشاء البناء بـ`npm run build-storybook`. لتشغيل اختبارات القصص الآلية استخدم `npm run test:storybook`؛ يتطلب ذلك تثبيت متصفح Chromium لـPlaywright عند عدم توفره محليًا.

## الملفات الحالية

القصة الموجودة حاليًا هي `stories/DashboardLayout.stories.tsx`، وتعرض تخطيط لوحة المعلومات في `app/Dashboardlayout.tsx`. التخطيط ما زال هيكلًا تجريبيًا أوليًا؛ الألوان والمساحات فيه مؤقتة وليست تصميمًا نهائيًا.

## مراجع

- [Storybook لإطار Next.js مع Vite](https://storybook.js.org/docs/get-started/frameworks/nextjs-vite)
- [كتابة القصص](https://storybook.js.org/docs/writing-stories)
