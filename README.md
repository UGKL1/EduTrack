# 📘 EduTrack

### Smart Attendance Management System using Facial Recognition

EduTrack is a **mobile-based smart attendance management system** designed for educational institutions. It leverages **facial recognition technology** to automate student attendance, reduce manual errors, prevent proxy attendance, and generate real-time attendance reports for teachers and administrators.

🎓 Developed as an academic project
🏫 Institution: _The Open University of Sri Lanka_

---

## ✨ Highlights

✅ Facial-recognition-based attendance  
✅ Role-based access (Teacher / Admin)  
✅ Real-time reports & summaries  
✅ Firebase-powered authentication & storage  
✅ Modern UI with Light / Dark / System themes  
✅ Integrated Node.js backend for AI processing

---

## 🧠 System Overview

EduTrack consists of **two tightly integrated components**:

### 📱 Frontend (Mobile Application)

- Built using **React Native (Expo)**
- Used by teachers and administrators
- Handles UI, authentication, camera access, and navigation

### 🧪 Backend (Facial Recognition API)

- Built using **Node.js + Express**
- Uses **face-api.js** for facial recognition
- Processes images sent from the mobile app
- Returns recognition results in real time

---

## 🛠 Technology Stack

### 📱 Frontend

- React Native (Expo)
- React Navigation (Stack Navigation)
- Firebase Authentication
- Firebase Firestore
- Firebase Storage
- Expo Image Picker & Camera
- AsyncStorage (theme persistence)

### 🧠 Backend

- Node.js
- Express.js
- face-api.js
- canvas
- multer

---

## 📁 Verified Project Structure

```
EduTrack/
│
├── App/
│   ├── assets/
│   │   └── edulogo.png
│   │
│   ├── Component/
│   │   └── Screens/
│   │       ├── Admin.js
│   │       ├── AdminDashboard.js
│   │       ├── AdminNotificationsScreen.js
│   │       ├── AdminReport.js
│   │       ├── AdminSignUp.js
│   │       ├── AttendanceReports.js
│   │       ├── AttendanceScreen.js
│   │       ├── Dashboard.js
│   │       ├── Login.js
│   │       ├── ManageStudent.js
│   │       ├── ManageTeachers.js
│   │       ├── NotificationsScreen.js
│   │       ├── QuickAccess.js
│   │       ├── ResetPw.js
│   │       ├── SettingsScreen.js
│   │       ├── SignupOrLogin.js
│   │       ├── StaffSignUp.js
│   │       └── TeacherProfile.js
│   │
│   ├── config/
│   │   └── firebase.js
│   │
│   ├── context/
│   │   └── ThemeContext.js
│   │
│   └── hooks/
│       └── useAuth.js
│
├──Server/
│   ├── routes/
│   │   └── faceApi.js
│   └── models/
│       └── (face-api model files)
├── package.json
└── README.md
```

---

## ⚡ Quick Start

### 1. Clone & Install Dependencies

```bash
# Clone repository
git clone https://github.com/UGKL1/EduTrack.git

# Install App dependencies
cd EduTrack/App
npm install

# Install Server dependencies
cd ../Server
npm install
```

### 2. Environment Setup

Create `.env` in App directory:

```env
# App/.env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
```

get private service account key from firebase console and put that as `serviceAccountKey.json` in Server directory:

### 3. Start Development Servers

```bash
# Start mobile app
cd App
npx expo start

# Start backend server (new terminal)
cd Server
node index.js
```

---

## 👥 Team

**The Open University of Sri Lanka - Group UGKL_1**

- 🎓 **Supervisor:** U.G.K.L. Senarathna
- 👨‍💻 **Lead Development / Project Manage** K.R.A.R. Jayathilaka
- 🎨 **UI/UX / Backend Development** L.G.S.B. Liyanage
- 📱 **Frontend Develpment / QA and Testing ** F.F. Shamra
- 🧪 **Frontend Develpment / QA and Testing ** Z.I.K. Nuha
- 📋 **UI/UX / Documentation:** M.S. Hafsa

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
