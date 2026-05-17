# Investing App - Build Instructions

This app is built with **Expo** (React Native). Since the local environment does not have the Android SDK, the easiest way to generate an APK is using **Expo Application Services (EAS)**.

## Prerequisites
1. [Node.js](https://nodejs.org/) (already installed)
2. [Expo Go](https://expo.dev/go) app on your Android phone for testing.
3. An [Expo Account](https://expo.dev/signup).

## How to Build the APK (.apk)

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo:**
   ```bash
   eas login
   ```

3. **Configure Project:**
   ```bash
   eas build:configure
   ```

4. **Build for Android:**
   To get an APK (instead of an AAB for the Play Store), you need to modify your `eas.json` or run:
   ```bash
   eas build -p android --profile preview
   ```
   *Note: The `preview` profile usually defaults to APK. Ensure your `eas.json` has `buildType: "apk"` for that profile.*

5. **Download the APK:**
   Once the build is finished in the cloud, EAS will provide a link to download the `.apk` file directly to your phone.

## Features
- **Thai Stocks:** Mock data (can be integrated with SET APIs).
- **Crypto Top 50:** Live data from CoinGecko.
- **NASDAQ & Gold:** Mock data (integrated in Global category).

## Local Development
To run the app in your browser:
```bash
npm run web
```
To run on your phone via Expo Go:
```bash
npx expo start
```
Scan the QR code with the Expo Go app.
