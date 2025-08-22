<div align="center">

# 🌙 تقویم جلالی - Persian Calendar

### A Beautiful & Powerful Persian (Jalali) Calendar Web Application

[![Made with Node.js](https://img.shields.io/badge/Made%20with-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Built with Fastify](https://img.shields.io/badge/Built%20with-Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)](https://fastify.io/)
[![Database](https://img.shields.io/badge/Database-MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com/)
[![ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

*یک تقویم جلالی قدرتمند و زیبا ساخته شده با تکنولوژی‌های مدرن وب*

[🎯 **Live Demo**](#) · [📚 **Documentation**](#-api-documentation) · [🐛 **Report Bug**](../../issues) · [✨ **Request Feature**](../../issues)

</div>

---

## 🚀 Features | ویژگی‌ها

<table>
<tr>
<td width="50%">

### 🎯 Core Features | ویژگی‌های اصلی
- 📅 **Multi-View Calendar** | نمایش ماهانه، هفتگی، روزانه
- ✅ **Task Management** | مدیریت کامل تسک‌ها
- 🎨 **Priority Colors** | رنگ‌بندی بر اساس اولویت
- 🔐 **Authentication** | سیستم احراز هویت امن
- 🌙 **Dark/Light Theme** | تم تاریک و روشن
- 📱 **Responsive Design** | طراحی واکنش‌گرا
- 🌍 **RTL Support** | پشتیبانی کامل از راست به چپ

</td>
<td width="50%">

### 🛠️ Technical Features | ویژگی‌های فنی
- ⚡ **Fast Performance** | عملکرد بالا با Fastify
- 🗄️ **Modern Database** | پایگاه داده مدرن با Prisma
- 🔒 **JWT Security** | امنیت بالا با JWT
- 📊 **Persian Calendar** | تقویم جلالی دقیق
- 🎨 **Beautiful UI** | رابط کاربری زیبا
- 📱 **Mobile Friendly** | سازگار با موبایل
- 🔧 **Easy Setup** | راه‌اندازی آسان

</td>
</tr>
</table>

---

## 🎬 Screenshots | تصاویر

<div align="center">

### 🌙 Dark Theme | تم تاریک
![Dark Theme](https://via.placeholder.com/800x450/2D3748/E2E8F0?text=Persian+Calendar+-+Dark+Theme)

### ☀️ Light Theme | تم روشن  
![Light Theme](https://via.placeholder.com/800x450/F7FAFC/2D3748?text=Persian+Calendar+-+Light+Theme)

### 📱 Mobile View | نمایش موبایل
<img src="https://via.placeholder.com/300x600/4A5568/E2E8F0?text=Mobile+View" width="300" alt="Mobile View">

</div>

---

## 🛠️ Tech Stack | فناوری‌های استفاده شده

<div align="center">

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=flat-square&logo=fastify&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

### Frontend
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![EJS](https://img.shields.io/badge/EJS-8BC34A?style=flat-square&logo=ejs&logoColor=white)

### Libraries & Tools
![Moment.js](https://img.shields.io/badge/Moment.js-40E0D0?style=flat-square)
![SweetAlert2](https://img.shields.io/badge/SweetAlert2-FA8072?style=flat-square)
![Bcrypt](https://img.shields.io/badge/Bcrypt-F39C12?style=flat-square)

</div>

---

## 🚀 Quick Start | شروع سریع

### 📋 Prerequisites | پیش‌نیازها

```bash
Node.js >= 16.0.0
MySQL >= 8.0
npm >= 7.0.0
```

### ⚡ Installation | نصب

1️⃣ **Clone the repository | کلون پروژه**
```bash
git clone https://github.com/Al4AMD/web-calendar.git
cd web-calendar
```

2️⃣ **Install dependencies | نصب وابستگی‌ها**
```bash
npm install
```

3️⃣ **Environment setup | تنظیم متغیرهای محیطی**
```bash
# Copy environment file
cp .env.example .env

# Edit .env file with your configuration
DATABASE_URL="mysql://username:password@localhost:3306/Jalali_calendar"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3000
NODE_ENV=development
```

4️⃣ **Database setup | راه‌اندازی پایگاه داده**
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE Jalali_calendar;"

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push
```

5️⃣ **Run the application | اجرای برنامه**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

🎉 **Open your browser and visit `http://localhost:3000`**

---

## 📁 Project Structure | ساختار پروژه

```
🌙 web-calendar/
├── 📂 controllers/          # API Controllers | کنترلرهای API
│   ├── 🔐 authController.js  # Authentication | احراز هویت
│   └── 📋 taskController.js  # Task Management | مدیریت تسک‌ها
├── 📂 models/               # Database Models | مدل‌های پایگاه داده
│   ├── 👤 User.js           # User Model | مدل کاربر
│   └── ✅ Task.js           # Task Model | مدل تسک
├── 📂 middleware/           # Middleware | میدل‌ویرها
│   └── 🛡️ auth.js           # Auth Middleware | میدل‌ویر احراز هویت
├── 📂 views/                # Templates | قالب‌ها
│   ├── 🏠 index.ejs         # Main Calendar | صفحه اصلی
│   └── 📂 auth/             # Auth Pages | صفحات احراز هویت
├── 📂 dist/                 # Static Assets | فایل‌های استاتیک
│   ├── 🎨 css/              # Stylesheets | استایل‌ها
│   ├── ⚡ js/               # JavaScript | اسکریپت‌ها
│   ├── 🔤 font/             # Persian Fonts | فونت‌های فارسی
│   └── 🖼️ img/              # Images | تصاویر
├── 📂 prisma/               # Prisma Configuration | تنظیمات Prisma
│   └── 📊 schema.prisma     # Database Schema | اسکیمای پایگاه داده
├── 🚀 server.js             # Main Server | سرور اصلی
├── 📦 package.json          # Dependencies | وابستگی‌ها
└── ⚙️ .env                  # Environment Variables | متغیرهای محیطی
```

---

## 🎯 Usage Guide | راهنمای استفاده

<details>
<summary><b>👤 User Authentication | احراز هویت کاربر</b></summary>

### Registration | ثبت نام
1. Navigate to `/register`
2. Fill in your details
3. Click "ثبت نام" to create account

### Login | ورود
1. Go to `/login`
2. Enter credentials
3. Click "ورود" to sign in

</details>

<details>
<summary><b>📅 Calendar Views | نماهای تقویم</b></summary>

- **📆 Monthly View | نمایش ماهانه**: Full month overview
- **📅 Weekly View | نمایش هفتگی**: 7-day detailed view  
- **📋 Daily View | نمایش روزانه**: Single day focus

</details>

<details>
<summary><b>✅ Task Management | مدیریت تسک‌ها</b></summary>

### Adding Tasks | افزودن تسک
1. Click on desired date
2. Click "افزودن تسک"  
3. Fill task details
4. Select priority level
5. Save task

### Priority Levels | سطوح اولویت
- 🟢 **Low | کم**: Green color
- 🟡 **Medium | متوسط**: Yellow color  
- 🔴 **High | زیاد**: Red color

</details>

<details>
<summary><b>🌙 Theme Toggle | تغییر تم</b></summary>

Use the theme switch in the top navigation to toggle between:
- ☀️ **Light Theme | تم روشن**
- 🌙 **Dark Theme | تم تاریک**

Preference is automatically saved to localStorage.

</details>

---

## 📚 API Documentation | مستندات API

<details>
<summary><b>🔐 Authentication Endpoints</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | User registration |
| `POST` | `/api/auth/login` | User login |
| `POST` | `/api/auth/logout` | User logout |
| `GET` | `/api/auth/me` | Get user info |
| `PUT` | `/api/auth/profile` | Update profile |
| `PUT` | `/api/auth/change-password` | Change password |

</details>

<details>
<summary><b>✅ Task Endpoints</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all user tasks |
| `POST` | `/api/tasks` | Create new task |
| `GET` | `/api/tasks/:id` | Get specific task |
| `PUT` | `/api/tasks/:id` | Update task |
| `DELETE` | `/api/tasks/:id` | Delete task |
| `PATCH` | `/api/tasks/:id/toggle` | Toggle completion |
| `GET` | `/api/tasks/date/:date` | Tasks for specific date |
| `GET` | `/api/tasks/week/:weekStart` | Tasks for week |
| `GET` | `/api/tasks/month/:year/:month` | Tasks for month |

</details>

---

## 🤝 Contributing | مشارکت

<div align="center">

**We love contributions! Here's how you can help:**

[![Contributors](https://img.shields.io/github/contributors/Al4AMD/web-calendar?style=for-the-badge)](https://github.com/Al4AMD/web-calendar/graphs/contributors)
[![Forks](https://img.shields.io/github/forks/Al4AMD/web-calendar?style=for-the-badge)](https://github.com/Al4AMD/web-calendar/network/members)
[![Stars](https://img.shields.io/github/stars/Al4AMD/web-calendar?style=for-the-badge)](https://github.com/Al4AMD/web-calendar/stargazers)
[![Issues](https://img.shields.io/github/issues/Al4AMD/web-calendar?style=for-the-badge)](https://github.com/Al4AMD/web-calendar/issues)

</div>

### 🛠️ Development Setup

```bash
# Fork the repository
# Clone your fork
git clone https://github.com/Al4AMD/web-calendar.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make your changes
# Commit your changes
git commit -m 'Add some amazing feature'

# Push to branch
git push origin feature/amazing-feature

# Open a Pull Request
```

### 📝 Development Guidelines

- Follow existing code style
- Add comments for Persian speakers
- Test your changes thoroughly
- Update documentation if needed
- Be respectful and constructive

---

## 🔧 Troubleshooting | رفع مشکلات

<details>
<summary><b>🗄️ Database Connection Issues</b></summary>

```bash
# Check MySQL service
sudo systemctl status mysql

# Verify credentials in .env
DATABASE_URL="mysql://username:password@localhost:3306/Jalali_calendar"

# Test connection
npx prisma db pull
```

</details>

<details>
<summary><b>🔐 JWT Issues</b></summary>

```bash
# Generate new secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Clear browser cookies
# Update JWT_SECRET in .env
```

</details>

<details>
<summary><b>📅 Persian Date Issues</b></summary>

- Ensure moment-jalaali is properly loaded
- Check browser console for JavaScript errors
- Verify Persian locale is set correctly

</details>

---

## 🏆 Achievements | دستاورد‌ها

<div align="center">

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/Al4AMD/web-calendar?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/Al4AMD/web-calendar?style=for-the-badge)
![Code size](https://img.shields.io/github/languages/code-size/Al4AMD/web-calendar?style=for-the-badge)

### 🌟 Why Choose Persian Calendar?

✅ **100% Persian Support** | پشتیبانی کامل فارسی  
✅ **Modern Tech Stack** | فناوری‌های مدرن  
✅ **Responsive Design** | طراحی واکنش‌گرا  
✅ **Open Source** | متن‌باز و رایگان  
✅ **Active Development** | توسعه فعال  
✅ **Easy Setup** | راه‌اندازی آسان  

</div>

---

## 📄 License | مجوز

<div align="center">

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

![MIT License](https://img.shields.io/badge/License-MIT-success?style=for-the-badge)

**Free to use, modify, and distribute** ✨

</div>

---

## 👨‍💻 Author | سازنده

<div align="center">

### **علی‌اکبر علی‌محمدی**
**AliAkbar Alimohammadi**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Al4AMD)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/YourProfile)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:your.email@example.com)

*Full Stack Developer passionate about Persian web applications*

</div>

---

<div align="center">

### 🌟 If you found this project helpful, please consider giving it a star!

[![Star this repo](https://img.shields.io/github/stars/Al4AMD/web-calendar?style=social)](https://github.com/Al4AMD/web-calendar/stargazers)

**Made with ❤️ for the Persian community**

---

### 📞 Support | پشتیبانی

**Found a bug?** [Create an Issue](../../issues/new)  
**Have a question?** [Start a Discussion](../../discussions)  
**Want to contribute?** [Read our Contributing Guide](#-contributing--مشارکت)

</div>