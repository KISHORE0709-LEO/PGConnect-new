# 🏠 PGConnect

> A modern PG (Paying Guest) management platform connecting students with quality accommodations

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF.svg)](https://vitejs.dev/)

## ✨ Features

### 🎓 For Students
- **Smart Search & Filters**: Find PGs by location, price, amenities, and preferences
- **Interactive Map View**: GPS location with nearby landmarks and transportation
- **AI Roommate Matching**: Find compatible roommates based on lifestyle preferences
- **3D Building Visualization**: Explore room layouts and availability
- **Real-time Availability**: Live updates on room availability and pricing

### 🏢 For PG Owners
- **Property Management**: Add and manage multiple PG properties
- **Tenant Dashboard**: Track payments, occupancy, and tenant details
- **Flexible Building Config**: Configure rooms, floors, and sharing arrangements
- **Revenue Analytics**: Monitor income and occupancy rates
- **Automated Notifications**: Payment reminders and booking alerts

### 🔧 Technical Features
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Real-time Updates**: Live data synchronization
- **Secure Authentication**: Firebase-based user management
- **Modern UI/UX**: Clean, intuitive interface with smooth animations


## 🛠️ Tech Stack

| Technology | Purpose |
|------------|----------|
| **React 18** | Frontend framework with hooks and concurrent features |
| **TypeScript** | Type-safe JavaScript development |
| **Tailwind CSS** | Utility-first CSS framework |
| **Vite** | Fast build tool and dev server |
| **React Router** | Client-side routing |
| **Radix UI** | Accessible component primitives |
| **Firebase** | Backend services (Auth, Firestore) |
| **Lucide React** | Modern icon library |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Button, Card, etc.)
│   ├── BuildingVisualizer.tsx
│   ├── PGLocationMap.tsx
│   └── ...
├── pages/              # Application pages/routes
│   ├── StudentDashboard.tsx
│   ├── OwnerDashboard.tsx
│   ├── PGDetails.tsx
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── context/            # React context providers
└── config/             # Configuration files
```

## 🎯 Key Features Demo

### Student Experience
1. **Browse PGs** - Filter by location, price, amenities
2. **View Details** - See photos, amenities, GPS location
3. **Find Roommates** - AI-powered compatibility matching
4. **Book Rooms** - Secure booking with owner contact

### Owner Experience
1. **List Property** - Add PG with photos and details
2. **Manage Tenants** - Track payments and occupancy
3. **Building Config** - Set up floors, rooms, sharing options
4. **Analytics** - Monitor revenue and performance

