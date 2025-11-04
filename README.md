# 🎓 EduTrack: Smart Attendance System

**Modern Facial Recognition Attendance System**

EduTrack is a modern attendance system for educational institutions. Using facial recognition on mobile devices, it ensures accuracy, security, and zero manual effort.

---

## 🌟 Core Features

### 👩‍🏫 For Teachers

- **Real-Time Face Recognition** – Instant attendance marking
- **Offline Support** – Works with limited connectivity
- **Class Management** – Track student attendance history
- **Detailed Reports** – Generate & export attendance data
- **Profile Management** – Customizable teacher profiles

### 👨‍💼 For Administrators

- **Centralized Dashboard** – Complete system overview
- **User Management** – Handle teachers and students
- **Advanced Analytics** – Track attendance patterns
- **Custom Reports** – Generate institution-wide insights
- **Role-Based Access** – Secure permission system

---

## 🛠️ Technology Stack

### 📱 Mobile App

- **Framework:** React Native + Expo
- **UI Components:** Native Base
- **Camera:** Expo Camera + Face Detection
- **State Management:** React Hooks
- **Navigation:** React Navigation v7
- **Forms & Validation:** React Hook Form

### 🖥️ Backend

- **Server:** Node.js + Express
- **Face API:** Azure Cognitive Services
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **File Storage:** Firebase Storage
- **API Security:** JWT

### 🔧 Development Tools

- **IDE:** Visual Studio Code
- **Mobile Testing:** Expo Go
- **Version Control:** Git + GitHub
- **API Testing:** Postman
- **Deployment:** EAS (Expo Application Services)

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

Create `.env` in both App and Server directories:

```env
# App/.env
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_bucket
FIREBASE_APP_ID=your_app_id
API_URL=http://your_server_url:3000

# Server/.env
AZURE_FACE_API_KEY=your_key
AZURE_FACE_API_ENDPOINT=your_endpoint
AZURE_PERSON_GROUP_ID=your_group_id
```

### 3. Start Development Servers

```bash
# Start mobile app
cd App
npx expo start

# Start backend server (new terminal)
cd Server
npm start
```

---

## 📱 App Navigation

```
├── Auth Stack
│   ├── SignupOrLogin
│   ├── Login (Teacher)
│   ├── Admin Login
│   ├── Reset Password
│   └── Staff/Admin SignUp
│
├── Teacher Stack
│   ├── Dashboard
│   ├── Attendance Screen
│   ├── Reports
│   ├── Profile
│   └── Settings
│
└── Admin Stack
    ├── Dashboard
    ├── Manage Students
    ├── Manage Teachers
    ├── Reports
    └── Settings
```

---

## 🔒 Security Features

- **Authentication:** Firebase email/password + JWT
- **Face Data:** Azure secure face templates
- **API Security:** Request validation & rate limiting
- **Data Privacy:** GDPR-compliant data handling
- **Audit Logs:** Track all system activities

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👥 Team

**The Open University of Sri Lanka - Group UGKL_1**

- 🎓 **Supervisor:** U.G.K.L. Senarathna
- 👨‍💻 **Lead Developer:** K.R.A.R. Jayathilaka
- 🎨 **UI/UX:** L.G.S.B. Liyanage
- 📱 **Mobile Dev:** F.F. Shamra
- 🧪 **QA Lead:** Z.I.K. Nuha
- 📋 **Documentation:** M.S. Hafsa

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
