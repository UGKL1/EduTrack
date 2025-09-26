EduTrack: Smart Attendance System Using Facial Recognition

EduTrack is a modern, efficient attendance management system designed for educational institutions. By leveraging facial recognition technology through a mobile application, it eliminates manual attendance hassles while ensuring accuracy and security.

Key Features

Real-Time Facial Recognition: Instantly recognizes and marks student attendance using the device camera

User-Friendly Interface: Clean, intuitive design requiring minimal training

Cross-Platform Support: Built with React Native for both Android and iOS

Comprehensive Data Management: Create, update, and manage student records with ease

Detailed Reports and Analytics: Generate attendance reports with trend analysis

Role-Based Access Control: Separate interfaces for teachers and administrators

Secure Data Storage: End-to-end encryption with Firebase security

Offline Capability: Works with limited connectivity

Why EduTrack?

Saves time: No more calling names or using paper registers

Eliminates proxy attendance: Facial recognition prevents fraudulent marking

Reduces administrative burden: Automated data collection and report generation

Provides real-time data: Instant access to attendance information

Cost-effective solution: No need for expensive hardware or RFID cards

Technology Stack
Frontend

React Native (cross-platform mobile development)

Expo Camera (camera integration for image capture)

NativeWind (Tailwind CSS for styling)

Axios (API communication)

Backend

Node.js and Express.js (server framework)

Firebase Firestore (real-time database)

Firebase Authentication (secure user management)

Azure Face API (facial recognition service)

JWT Tokens (secure authentication)

Development Tools

Visual Studio Code (primary IDE)

Android Studio (testing and debugging)

Figma (UI/UX design)

GitHub (version control and collaboration)

Prerequisites

Before starting, ensure you have installed:

Node.js (v16 or higher)

npm or yarn

React Native CLI

Android Studio (for Android development)

Xcode (for iOS development, macOS only)

Installation and Setup

Clone the Repository

git clone https://github.com/your-username/edutrack-attendance-system.git
cd edutrack-attendance-system


Install Dependencies

# Frontend dependencies
npm install  

# iOS dependencies (macOS only)
cd ios && pod install && cd ..


Environment Configuration

Create a .env file in the root directory and add the following:

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id

# Azure Face API
AZURE_FACE_API_KEY=your_azure_face_api_key
AZURE_FACE_ENDPOINT=your_azure_endpoint

# Backend API
API_BASE_URL=http://localhost:3000


Firebase Setup

Create a Firebase project at Firebase Console

Enable Firestore Database

Enable Authentication with Email/Password

Download configuration files:

google-services.json (Android → place in android/app/)

GoogleService-Info.plist (iOS → place in ios/)

Azure Face API Setup

Create an Azure account and Face API resource

Copy API key and endpoint

Add them to your .env file

Running the Application
Development Mode
# Start Metro bundler
npx react-native start  

# Run on Android
npx react-native run-android  

# Run on iOS (macOS only)
npx react-native run-ios  

Backend Server
cd backend  
npm install  
npm run dev  

Usage Guide
For Teachers

Login with credentials provided by the administrator

Create class session: Select class and subject

Take attendance: Use camera to scan students

Review and submit: Verify and save records

View reports: Check history and analytics

For Administrators

Manage users: Add or remove teachers and update permissions

Maintain student database: Records and photos

Generate system reports: Attendance and usage analytics

Monitor activity: Track system performance

Testing

Run unit tests

npm test


Run integration tests

npm run test:integration


Run end-to-end tests

npm run test:e2e

Deployment
Mobile App

Build Android APK

cd android && ./gradlew assembleRelease


Build iOS (requires Xcode)

cd ios && xcodebuild -workspace EduTrack.xcworkspace -scheme EduTrack archive

Backend Deployment Options

Firebase Functions (recommended)

Heroku

AWS EC2

DigitalOcean

Security and Privacy

Data encryption in transit and at rest

GDPR compliance with international privacy standards

Role-based access with strict permissions

Audit logs for activity tracking

Secure authentication with JWT and Firebase Auth

Project Status

Planning and Research: Completed

UI/UX Design: Completed

Development Phase: In Progress

Testing Phase: Pending

Deployment: Pending

Contributing

We welcome contributions.

Fork the repository

Create your feature branch

git checkout -b feature/amazing-feature


Commit your changes

git commit -m 'Add amazing feature'


Push to the branch

git push origin feature/amazing-feature


Open a Pull Request

Team

UGKL_1 - The Open University of Sri Lanka

K.R.A.R. Jayathilaka – Project Lead & Backend Developer

L.G.S.B. Liyanage – Frontend Developer & UI/UX Designer

F.F. Shamra – Mobile App Developer

Z.I.K. Nuha – Database Administrator & Testing

M.S. Hafsa – Quality Assurance & Documentation

Supervisor: U.G.K.L. Senarathna

Built With

Developed by Team UGKL_1 for the future of education.
