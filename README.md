# 🌟 Nefertari (نفرتاري) - Integrated Egyptian Tourism, Heritage, & Craft Trade Platform

[English](#english) | [العربية](#العربية)

---

## العربية

**نفرتاري (Nefertari)** هي منصة إلكترونية متكاملة تهدف إلى الترويج للسياحة المصرية وتجارة التراث الثقافي يدوياً. توفر تجربة رقمية تجمع بين استكشاف المعالم الأثرية، حجز الرحلات السياحية، وشراء المصوغات والتحف التقليدية عبر متجر تراثي متكامل، إلى جانب لوحة تحكم إدارية شاملة للتحكم في كافة محتويات المنصة.

### 🚀 خطوات الرفع والتشغيل على GitHub و Vercel

المنصة مجهزة بالكامل لتعمل بنظام **Full-Stack (Vite React + Node Express)** وتعمل كـ Serverless Functions على Vercel أو كحاوية متكاملة على أي خادم سحابي.

#### 1. رفع المشروع على GitHub
قم بفتح سطر الأوامر في مجلد المشروع ونفذ الخطوات التالية:
```bash
# تهيئة مستودع جيت المحلي
git init

# إضافة جميع الملفات
git add .

# تسجيل الالتزام الأول
git commit -m "feat: Nefertari platform release v1.0.0"

# ربط المستودع المحلي بمستودع جيت هاب الخاص بك
# (استبدل الرابط أدناه برابط مستودعك الجديد على GitHub)
git remote add origin https://github.com/your-username/nefertari-egyptology.git

# تسمية الفرع الرئيسي ورفع الأكواد
git branch -M main
git push -u origin main
```

#### 2. تهيئة وتفعيل قاعدة بيانات سوبابيز (Supabase)
لقد قمنا بتوفير ملف `supabase_schema.sql` في جذر المشروع جاهزاً بالكامل لإنشاء جميع الجداول المطلوبة مع العلاقات والمفاتيح الفرعية:
1. اذهب لموقع [Supabase Dashboard](https://supabase.com).
2. أنشئ مشروعاً جديداً.
3. اذهب إلى تبويب **SQL Editor** ثم أنشئ استعلاماً جديداً (**New query**).
4. انسخ محتويات ملف `supabase_schema.sql` بالكامل والصقها في المحرر ثم اضغط **Run**.
5. سيتم إنشاء جداول: `profiles`, `monuments`, `tours`, `products`, `bookings`, `order_items`, `orders` فوراً مع البيانات التجريبية الأولية.

#### 3. الرفع والتشغيل على Vercel ⚡
المنصة تحتوي على ملف تهيئة مخصص لـ Vercel وهو `vercel.json` الذي يقوم تلقائياً ببناء الواجهة الأمامية وتوجيه مسارات الـ API إلى الدالة اللاسلكية:
1. اذهب إلى حسابك في [Vercel](https://vercel.com) واضغط على **Add New Project**.
2. قم باستيراد مستودع الأكواد الخاص بك من GitHub.
3. في نافذة الإعدادات وقبل الضغط على Deploy، أضف متغيرات البيئة التالية (**Environment Variables**):
   * `SUPABASE_URL`: رابط مشروع Supabase الخاص بك.
   * `SUPABASE_ANON_KEY`: مفتاح Anon العام.
   * `SUPABASE_SERVICE_ROLE_KEY`: مفتاح الـ Service Role لتمكين الإضافات والتعديلات الخاصة بالمدير بشكل آمن من الخلفية.
4. اذهب واضغط على **Deploy** وسيصبح موقعك نشطاً بالكامل بمجرد اكتمال البناء الإيجابي!

#### 🔑 بيانات تسجيل دخول المدير (Admin Panel)

الواجهة الإدارية نشطة وتسمح بتعديل، حذف، وإضافة معالم سياحية، رحلات، ومنتجات، ومراقبة الحجوزات والطلبيات:
* **البريد الإلكتروني:** `admin@gmail.com`
* **كلمة المرور:** `ADMIN1234`

---

## English

**Nefertari** is a premium, full-stack digital platform designed to promote Egyptian tourism, heritage exploration, and historical boutique trade. It beautifully combines landmark discovery, tour package bookings, and authentic Pharaonic craftsman goods acquisitions with an interactive admin suite for total storage control.

### 🚀 Direct GitHub and Vercel Deployment Instructions

Nefertari is structured to run as a full-stack **Vite React + Node.js Express** app, with support for serverless executions on Vercel.

#### 1. Push to GitHub
Open your local terminal in the project directory and run the following commands:
```bash
# Initialize localgit repo
git init

# Add files
git add .

# Commit changes
git commit -m "feat: Nefertari platform release v1.0.0"

# Link to your personal remote repository
# (Replace the URL below with your actual GitHub repository URL)
git remote add origin https://github.com/your-username/nefertari-egyptology.git

# Set branch name and push code
git branch -M main
git push -u origin main
```

#### 2. Provision Supabase Database Schemas
We have prepared a complete `supabase_schema.sql` query file in the workspace root representing the full operational structure of the database:
1. Head over to [Supabase Console](https://supabase.com) and create a project.
2. Under the **SQL Editor** tab of your Supabase project, click **New query**.
3. Copy and paste the entire contents of the `supabase_schema.sql` file and click **Run**.
4. This instantly spawns tables for `profiles`, `monuments`, `tours`, `products`, `bookings`, `orders`, and `order_items` with relationships and initial seed data.

#### 3. Connect & Host on Vercel ⚡
The repository features an integrated `vercel.json` router. It tells Vercel to host the build static assets on its global CDN while compiling the Express server dynamically as a secure serverless function:
1. Sign in to your [Vercel Workspace](https://vercel.com) and select **Add New Project**.
2. Connect and import your GitHub repository.
3. Under **Environment Variables**, configure the connection keys:
   * `SUPABASE_URL`: Your Supabase API connection base URL.
   * `SUPABASE_ANON_KEY`: Your Supabase Anonymous Key.
   * `SUPABASE_SERVICE_ROLE_KEY`: Your master Supabase Service Role Key (this secures administrative updates safely from the server).
4. Click **Deploy**. Your applet is ready and live globally in seconds!

#### 🔑 Administrator Bureau Credentials
* **Email ID:** `admin@gmail.com`
* **Password:** `ADMIN1234`
