# Mihira

This repository is split by product surface:

- `mobile/` - Expo application, native projects, mobile tests, mobile assets, EAS config, and Expo package lock.
- `web/` - Web app and web build configuration. Keep web-specific changes inside this folder.
- `core/` - Shared server routes, AI, Vedic astrology, scripture corpus, and shared types, imported by both `mobile/` and `web/` as `@core/*`. It imports nothing from either app; run its tests from `core/` with `npm test`.
- `supabase/` - Database migrations and backend data model changes.
- `docs/` - Product, release, setup, strategy, and data reference material.

Root-level package scripts are only convenience wrappers. Run mobile commands from `mobile/` or with `npm run mobile:start`; run web commands from `web/` or with `npm run web:dev`.

## Mobile: install and run

The mobile app is Expo SDK 58 (React Native 0.88) and runs as a development build, not in Expo Go.

### Prerequisites

- **Node 22, 24 or 25** (stable releases). Node 27 pre-releases break `expo prebuild` (the icon step fails in `jimp-compact`). With nvm: `nvm use 25`.
- **Xcode 27** and **CocoaPods** for iOS. Set `export LANG=en_US.UTF-8` in your shell, or CocoaPods warns and can fail.
- An Apple Developer account added in Xcode (Settings → Accounts) on the team that owns `com.mihira.app`.

### Install

```bash
cd mobile
npm ci
cp .env.example .env.local   # then fill in the values
npx expo install --check     # should print "Dependencies are up to date"
```

If Metro later reports missing `.ttf` files or missing `dist/` files in a package, `node_modules` is corrupted. Reinstall cleanly with `rm -rf node_modules && npm ci`.

`ios/` and `android/` are generated and gitignored. After changing native dependencies, the Expo SDK version or `app.config.js`, regenerate them:

```bash
npx expo prebuild --platform ios --clean
```

### Run on the iOS Simulator

```bash
npx expo run:ios
```

### Run on a physical iPhone

1. Connect the iPhone by cable, unlock it and tap **Trust** for the Mac.
2. Turn on Developer Mode: **Settings → Privacy & Security → Developer Mode**, restart, then tap **Turn On** at the prompt after unlocking.
3. Find the device's UDID with `xcrun devicectl list devices`. Its status should be `available (paired)`.
4. Build and launch:

   ```bash
   npx expo run:ios --device <UDID>
   ```

The app uses the Push Notifications capability, so it needs a provisioning profile for `com.mihira.app`. If the build fails with *"Provisioning Profile 'iOS Team Provisioning Profile: \*' does not support the Push Notifications capability"*, let Xcode create the profile by building once with provisioning updates allowed:

```bash
cd ios
xcodebuild -workspace Mihira.xcworkspace -scheme Mihira -configuration Debug \
  -destination id=<UDID> -derivedDataPath ./build \
  -allowProvisioningUpdates -allowProvisioningDeviceRegistration build
xcrun devicectl device install app --device <UDID> build/Build/Products/Debug-iphoneos/Mihira.app
cd ..
npx expo start --dev-client
xcrun devicectl device process launch --device <UDID> com.mihira.app
```

Building once from Xcode (open `ios/Mihira.xcworkspace`, pick the iPhone, press Run) also creates the profile.

The phone loads JavaScript from Metro on port 8081, so keep it on the same Wi-Fi network as the Mac. Saving a file reloads the app.

### Run on Android

```bash
npx expo run:android
```

### Tests

```bash
cd mobile && npx jest
cd core && npm test
```
