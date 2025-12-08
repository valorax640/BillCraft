# BillCraft

A fully offline billing application for shopkeepers built with React Native 0.80.1. 

## Features
- 100% offline functionality
- Product & Customer management
- GST calculation (CGST/SGST/IGST)
- Invoice generation & history
- Sales analytics
- Dark mode support
- PIN lock security
- Local data backup

## Prerequisites
- Node.js >= 18
- React Native CLI
- Android Studio (for Android)
- Xcode (for iOS, macOS only)

## Installation Steps

### 1. Create React Native Project
```bash
npx react-native init OfflineBillingApp --version 0.80.1
cd OfflineBillingApp
```

### 2. Install Dependencies
```bash
npm install @react-native-async-storage/async-storage@^1.19.0
npm install @react-navigation/native@^6.1.7
npm install @react-navigation/stack@^6.3.17
npm install react-native-gesture-handler@^2.12.0
npm install react-native-reanimated@^3.3. 0
npm install react-native-screens@^3.22.0
npm install react-native-safe-area-context@^4.7.0
npm install react-native-vector-icons@^10.0. 0
npm install react-native-picker-select@^9.0.0
```

### 3. Link Assets (Icons)
```bash
npx react-native-asset
```

### 4. Android Setup
Add to `android/app/build.gradle`:
```gradle
apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
```

### 5. iOS Setup (macOS only)
```bash
cd ios
pod install
cd ..
```

### 6.  Run the App
```bash
# Android
npx react-native run-android

# iOS
npx react-native run-ios
```

## Project Structure
See FOLDER_STRUCTURE.md for detailed folder organization. 

## Data Storage
All data is stored locally using AsyncStorage.  No internet connection required.

## Backup
Data can be exported as JSON from Settings > Backup & Restore.

## License
MIT
```
```
BillCraft/
├── android/                    # Android native code
├── ios/                        # iOS native code
├── src/
│   ├── assets/                # Images, fonts, icons
│   │   └── images/
│   ├── components/            # Reusable components
│   │   ├── ProductCard.jsx
│   │   ├── CustomerCard.jsx
│   │   ├── InvoiceCard. jsx
│   │   ├── ProductForm.jsx
│   │   ├── CustomerForm.jsx
│   │   ├── InvoiceItemPicker.jsx
│   │   ├── CustomButton.jsx
│   │   ├── CustomInput.jsx
│   │   ├── Header.jsx
│   │   ├── SearchBar.jsx
│   │   └── ConfirmModal.jsx
│   ├── screens/               # All app screens
│   │   ├── HomeScreen.jsx
│   │   ├── ProductListScreen.jsx
│   │   ├── AddEditProductScreen.jsx
│   │   ├── CustomerListScreen. jsx
│   │   ├── AddEditCustomerScreen.jsx
│   │   ├── CreateInvoiceScreen.jsx
│   │   ├── InvoiceHistoryScreen.jsx
│   │   ├── InvoiceDetailScreen.jsx
│   │   ├── AnalyticsScreen.jsx
│   │   ├── SettingsScreen.jsx
│   │   ├── ShopProfileScreen.jsx
│   │   ├── BackupScreen.jsx
│   │   └── PinLockScreen.jsx
│   ├── navigation/            # Navigation setup
│   │   └── AppNavigator.jsx
│   ├── context/               # Context API
│   │   ├── DataContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── AuthContext.jsx
│   ├── storage/               # AsyncStorage handlers
│   │   └── StorageService.js
│   ├── utils/                 # Helper functions
│   │   ├── calculations.js
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── invoiceGenerator.js
│   ├── constants/             # App constants
│   │   ├── colors.js
│   │   ├── gstRates.js
│   │   └── config.js
│   └── App.jsx                # Root component
├── package.json
├── babel.config.js
├── metro.config.js
├── . eslintrc.js
├── .prettierrc. js
└── README.md
```