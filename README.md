# 🖐️ AI Finger FX Vision (دوربین هوشمند تشخیص انگشتان و افکت‌های آنی)

<div align="center">

![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)
![MediaPipe](https://img.shields.io/badge/Google-MediaPipe_Hands-0097A7.svg?style=for-the-badge&logo=google&logoColor=white)
![WebAudio](https://img.shields.io/badge/Web_Audio_API-Synthesizer-FF5722.svg?style=for-the-badge)
![NodeJS](https://img.shields.io/badge/Node.js-Express_Server-339933.svg?style=for-the-badge&logo=node.js&logoColor=white)

<p align="center">
  <b>A real-time, in-browser AI hand and finger tracking vision system with dynamic interactive VFX and synthetic audio.</b>
  <br />
  سیستم پردازش بلادرنگ تصویر و تشخیص هوشمند انگشتان دست با هوش مصنوعی و اعمال آنی افکت‌های سینمایی و صوتی.
</p>

[English Overview](#-english-overview) • [راهنمای فارسی](#-توضیحات-فارسی) • [نصب و اجرا](#-installation--run-نحوه-اجرا) • [افکت‌ها](#-gesture-effects-افکت‌ها)

</div>

---

## 🇬🇧 English Overview

**AI Finger FX Vision** is a modern, high-performance web application that leverages **Google MediaPipe Hands** (21 3D landmarks) to track finger gestures in real time directly from your webcam. Based on the number of extended fingers (from 0 to 5), the engine automatically triggers dynamic GPU-accelerated canvas visual effects, custom shaders, and real-time synthesized cybernetic sound effects using the **Web Audio API**.

### ✨ Highlights
- **0–5 Finger Gesture Detection:** High-accuracy 3D vector-based finger curl/extension calculation that works at any angle (tilted, upside down, fist, or stretched).
- **Hysteresis & Anti-Jitter Filtering:** Smooth transition states without flickering between frames.
- **Dynamic Particle & FX Canvas Engine:** Hand-crafted canvas visual effects for every gesture count.
- **Zero-Dependency Synthesizer Audio:** Web Audio API procedural sound generation with zero external audio assets or latency.
- **Mirroring & HD Snapshots:** Instant snapshot capture with active filters saved directly as high-resolution PNG.

---

## 🇮🇷 توضیحات فارسی

پروژه‌ای وب، مدرن و سبک جهت تشخیص بلادرنگ (Real-Time) انگشتان دست با هوش مصنوعی و اعمال آنی افکت‌های نئونی، سایبرپانک و کیهانی روی تصویر دوربین به همراه سینت سایزر صوتی آنی.

### ⌨️ Keyboard Shortcuts (میانبرهای صفحه‌کلید)

| Key | Action |
| :---: | :--- |
| `S` | Capture a snapshot / ثبت عکس از تصویر فعلی |
| `F` | Toggle camera fullscreen / تمام‌صفحه کردن دوربین |
| `M` | Mirror the camera / آینه‌ای کردن تصویر |
| `T` | Switch light/dark theme / تغییر تم روشن و تاریک |
| `1` | Open Hand FX / ورود به افکت دست |
| `2` | Open Face FX / ورود به افکت صورت |
| `3` | Open Air Drawing / ورود به نقاشی هوایی |

Shortcuts are disabled while typing in input fields, text areas, or other editable controls.

### 🌟 ویژگی‌های برجسته
- **تشخیص بی‌نقص ۰ تا ۵ انگشت:** محاسبه هندسی و سه‌بعدی ۲۱ مفصل دست توسط مدل هوش مصنوعی Google MediaPipe Hands بدون خطا در زوایای مختلف.
- **تثبیت فریم و حذف لرزش (Debounce & Hysteresis):** تعویض روان و بدون پرش افکت‌ها.
- **موتور تولید صدای سنتز شده:** ساخت فرکانس‌های صوتی فضایی و سایبرپانک بدون نیاز به فایل‌های صوتی خارجی و بدون هیچ‌گونه تأخیر.
- **عکاسی با افکت (HD Snapshot):** ذخیره‌سازی تصویر همراه با جلوه‌ها با کیفیت بالا روی سیستم.
- **کنترل دوگانه:** قابلیت جابجایی دستی بین افکت‌ها یا حالت تشخیص خودکار با دست.

---

## 🎭 Gesture Effects (افکت‌ها)

| انگشتان / Fingers | حالت / Mode | افکت بصری / Visual FX | طراحی صوتی / Audio FX |
| :---: | :--- | :--- | :--- |
| **✊ 0** | **Matrix Void** | باران کدهای باینری سبز، نویز راداری و اسکن دیجیتال | پالس بیس عمیق و ساب ووفر دیجیتال |
| **☝️ 1** | **Cyber Laser** | شلیک پرتو لیزر نئونی از نوک انگشت با پلاسما و HUD تاکتیکال | فرکانس لیزری تیز با رزونانس بالا |
| **✌️ 2** | **Holo Arc** | جهش صاعقه‌های الکتریکی بین دو انگشت و هاله منشوری هولوگرام | آرک الکتریکی و وزوز جریان برق تسلا |
| **🤟 3** | **Inferno Blaze** | زبانه‌های آتش شعله‌ور، گدازه و ذرات دود متحرک | صدای غرش شعله و نویز انفجاری ملایم |
| **🖖 4** | **Retro VHS 1984** | تفکیک رنگی کاتدی (RGB Chromatic Aberration)، گلیچ نواری و لایه‌های CRT | صدای نویز رترو و کلیک سوئیچینگ |
| **🖐️ 5** | **Cosmic Supernova** | چرخش صدها ستاره در کهکشان کف دست و پرتوهای ستاره‌ای | آکورد فضایی استریو و محو شونده |

---

## 🚀 Installation & Run (نحوه اجرا)

### پیش‌نیازها / Prerequisites
- [Node.js](https://nodejs.org/) (نسخه ۱۶ یا بالاتر)
- مرورگر وب مدرن با پشتیبانی از وبکم (Google Chrome, Microsoft Edge, Firefox, Brave)

### مراحل اجرا / Steps

1. **کلون کردن ریپازیتوری / Clone the repository:**
   ```bash
   git clone https://github.com/mohammadqeshm/fingers.git
   cd fingers
   ```

2. **اجرای سرور / Run the server:**
   ```bash
   npm start
   ```
   *یا مستقیماً با نود:*
   ```bash
   node server.js
   ```

3. **مشاهده در مرورگر / Open in Browser:**
   آدرس زیر را باز کنید و به دوربین اجازه دسترسی (Allow Camera) بدهید:
   ```
   http://localhost:3000
   ```

---

## 🛠️ ساختار پروژه / Project Architecture

```plaintext
fingers/
├── index.html       # رابط کاربری و لایه‌های Canvas و اسکلت دست
├── style.css        # استایل‌های تم سایبرپانک، شیشه‌ای (Glassmorphism) و واکنش‌گرا
├── app.js           # منطق ردیابی هوش مصنوعی، فیلتر لرزش، رندرر افکت‌ها و سینث صوتی
├── server.js        # وب‌سرور سبک Node.js بر پایه ماژول استاندارد HTTP
├── package.json     # مشخصات پروژه و اسکریپت‌ها
├── LICENSE          # گواهینامه معتبر متن‌باز MIT
└── README.md        # مستندات دوزبانه جامع پروژه
```

---

## 📄 License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
توسعه یافته توسط [mohammadqeshm](https://github.com/mohammadqeshm/fingers).
