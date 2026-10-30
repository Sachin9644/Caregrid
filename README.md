# CareGrid Mobile — Hybrid Mobile Application (HMAD)
**Real-Time Hospital Bed Allocation & Emergency Blood Bank Telemetry System**

> Built for the **Mobile Application Development (MAD)** Assignment.  
> Implemented using a modern **Hybrid Mobile App Development** approach with **React 19, TypeScript, Tailwind CSS, Vite, and Capacitor**.

---

## 📱 Executive Summary & Concept

During medical emergencies, minutes matter. **CareGrid Mobile** is a hybrid mobile application designed to bridge the gap between citizens, emergency paramedics, and regional hospitals. It aggregates and streams real-time telemetry on:
1. **Critical Care Bed Availability**: Live tracking of Intensive Care Unit (ICU), Ventilator, Oxygen-supported, and General beds across Government, Private Super-Specialty, and Trust hospitals.
2. **Regional Blood Bank Stocks**: Group-wise inventory ($A^+, A^-, B^+, B^-, AB^+, AB^-, O^+, O^-$) with compatibility filtering and critical deficit alerts.
3. **One-Touch Emergency SOS**: Instant dispatch trigger alerting nearest Advanced Life Support (ALS) / Basic Life Support (BLS) ambulance fleets with live ETA.
4. **Urgent Blood Appeals**: Rapid community broadcasts using native mobile sharing sheets (WhatsApp, Telegram, SMS).

---

## 🏗️ Architecture: Hybrid App Approach

### Why Hybrid Mobile Development for CareGrid?
| Criteria | Native (Java/Kotlin or Swift) | Hybrid (Capacitor + Web Container) |
| :--- | :--- | :--- |
| **Codebase** | Separate codebases for Android & iOS | **Single Unified Codebase** for Android, iOS, and Web |
| **Deployment Speed** | Slow, platform-specific refactoring | **Rapid iteration & instant hot updates** |
| **Hardware Access** | Direct SDK | **Capacitor Hardware Plugins** (Haptics, Share, Network, Preferences) |
| **Offline Resilience** | SQLite / Room | **Capacitor Preferences with LocalStorage caching layer** |
| **Emergency Accessibility**| App Store installation required | Works natively on Android device **AND** directly in mobile browsers |

### Hybrid Architecture Diagram

```
+--------------------------------------------------------------+
|                    CareGrid Mobile UI Layer                  |
|    React 19 + TypeScript + Tailwind CSS + Lucide Icons       |
|    (Overview, Hospital Beds, Blood Bank, SOS Fleet, Trends)  |
+--------------------------------------------------------------+
                                |
+--------------------------------------------------------------+
|                  Service & Abstraction Layer                 |
|   - NativeService (Haptics, Share, Network, Preferences)     |
|   - CareGridRepository (Offline-First In-Memory & Storage)   |
+--------------------------------------------------------------+
                                |
+--------------------------------------------------------------+
|                    Capacitor Native Bridge                   |
|   @capacitor/core | @capacitor/android | @capacitor/haptics  |
+--------------------------------------------------------------+
                                |
+--------------------------------------------------------------+
|                   Android OS / Hardware Layer                |
|    - Vibrator / Haptic Engine    - Native Share Dialog       |
|    - Network State Telemetry     - Dialer (tel:108)          |
+--------------------------------------------------------------+
```

---

## 🚀 Key Functional Modules

### 1. Dashboard (Overview)
- **6 Key Performance Indicators (KPIs)**: Total Available Beds, Critical ICU Beds, Ventilators Ready, Blood Units In Stock, Network Hospitals, and Average Ambulance ETA.
- **Hourly ICU Occupancy Trend**: Interactive spline graph showing citywide bed utilization and emergency inflow velocity.
- **Urgent Blood Ticker**: Real-time alerts with direct calling and broadcasting.

### 2. Verified Hospital Directory & Bed Reservation
- Real-time filtering by **Zone** (*Central Metro, North, South, West*) and **Bed Type** (*ICU, Ventilator, Oxygen, General*).
- Comprehensive facility categorization (*Government vs Private Super-Specialty vs Trust*).
- Interactive **Bed Detail Modal** with Google Maps distance, direct emergency desk phone dialer, and one-tap critical bed allocation holding.

### 3. Community Blood Bank Telemetry
- Group-wise stock matrix with Rh-factor indicators and stock status (*Critical, Low, Moderate, Sufficient*).
- Compatibility matching (identifying universal donors $O^-$ and universal recipients $AB^+$).
- **Raise Urgent Blood Appeal**: In-app form that stores the appeal locally and launches the native mobile share sheet to broadcast to community donor groups.

### 4. Emergency SOS & Fleet Tracker
- **One-Touch Emergency SOS**: High-visibility tactile emergency trigger with haptic feedback.
- **Direct Helplines**: Quick dialers for `108` (Central Ambulance), `102` (Maternity & Infant), and `104` (Medical Advisory).
- **Ambulance Fleet Status**: Real-time listing of ALS/BLS vehicles, current zone, driver contacts, and dynamic ETA in minutes.
- **First Aid Golden Hour Protocol**: Critical triage guidelines for cardiac arrest, severe trauma, and stroke.

### 5. Predictive Analytics & Telemetry Export
- 24-hour bed pressure trajectory curves.
- District-wise bed utilization progress bars.
- One-click **Export Telemetry Report** formatted as CSV for district health administrative reviews.

---

## 🛠️ Step-by-Step Build Instructions

### Prerequisites
- Node.js (v18 or higher) and npm installed.
- (Optional for Android APK build) Android Studio with Android SDK (API 34+) and Java JDK 17+.

### 1. Install Dependencies
```bash
cd caregrid-mobile
npm install
```

### 2. Run Local Development Server (Browser Testing)
```bash
npm run dev
```
Open `http://localhost:3000` in your browser (or press `F12` and toggle the Mobile Device toolbar for simulated Android/iPhone screens).

### 3. Build Web Production Bundle
```bash
npm run build
```
The optimized bundle will be generated into the `dist/` directory.

### 4. Add Android Container & Build APK
```bash
# Initialize Android container
npx cap add android

# Sync web assets to the native Android project
npx cap sync

# Open the project directly in Android Studio
npx cap open android
```
Inside Android Studio:
1. Select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
2. The compiled `.apk` will be output to:
   `android/app/build/outputs/apk/debug/app-debug.apk`.

Or build directly from the command line using Gradle:
```bash
cd android
./gradlew assembleDebug
```

---

 
 
