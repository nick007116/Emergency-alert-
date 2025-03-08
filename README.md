<div align="center">
  <h1>🚨 Emergency Alert System 🚨</h1>
  <p><em>A modern emergency response management platform built with Next.js and Firebase</em></p>
  <a href="https://emergency-alert-lfkp.onrender.com/" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-View%20on%20Render-blue?style=for-the-badge&logo=render" alt="View on Render" />
  </a>
</div>

---

## 📋 Project Overview

This Emergency Alert System is designed to streamline emergency response coordination, connecting those in need with responders. The application features:

- 🔐 **Secure Admin Login** - Role-based authentication system
- 📊 **Real-time Dashboard** - Monitor and manage incoming emergency requests
- 🚨 **Emergency Filtering** - Categorize alerts by type (Fire, Medical, Police, SOS)
- 👥 **User Management** - Track registered users and their details
- 📍 **Location Tracking** - Access exact emergency locations with map integration
- 📞 **One-click Communication** - Direct calling to emergency contacts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Firebase project with Firestore and Realtime Database
- Environment variables configured (see below)

### Environment Setup
Create a `.env.local` file with your Firebase configuration:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/emergency-alert.git
   cd emergency-alert
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the development server
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Built With

- [**Next.js 15**](https://nextjs.org/) - React framework with server components
- [**Firebase**](https://firebase.google.com/) - Authentication, Firestore & Realtime Database
- [**Tailwind CSS**](https://tailwindcss.com/) - Utility-first CSS framework
- [**React 19**](https://react.dev/) - UI component library

## 📱 Features

### Admin Authentication
Secure login system with token-based authentication for emergency responders.

### Dashboard Interface
Real-time monitoring of emergency requests with filtering options for different emergency types.

### User Management
Track registered users with detailed information for quick response coordination.

### Emergency Request Handling
- View emergency details
- One-click map integration
- Direct calling to the person in distress
- Request management with completion tracking

## 💻 Project Structure

```
app/
├── dashboard/    # Admin dashboard views
├── page.js       # Login page
├── layout.js     # Root layout with theme setup
├── globals.css   # Global styles
└── utils/        # Shared utilities
    └── firebase.js  # Firebase configuration
```

## 📦 Deployment

The application is currently deployed on Render:

<div align="center">
  <h3><a href="https://emergency-alert-lfkp.onrender.com/" target="_blank">https://emergency-alert-lfkp.onrender.com/</a></h3>
</div>

You can also deploy your own instance on Vercel with minimal configuration:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Femergency-alert)

---

<div align="center">
  <p>Created for emergency response coordination and management</p>
  <p>© 2023 Emergency Alert Team</p>
</div>