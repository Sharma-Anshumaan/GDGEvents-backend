<div align="center">

<img src="assets/images/iconforapp.png" alt="GDG on Campus IIIT Kalyani" width="140" />

# GDG IIIT Kalyani — Events

**The official companion app for GDG on Campus IIIT Kalyani.**
Browse community meetups, workshops and events — and register in a couple of taps.

[![Expo](https://img.shields.io/badge/Expo-SDK%2058-000020?logo=expo&logoColor=white)](https://docs.expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.88-61DAFB?logo=react&logoColor=white)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Platforms](https://img.shields.io/badge/Platform-Android%20%C2%B7%20iOS%20%C2%B7%20Web-lightgrey)](#tech-stack)
[![Version](https://img.shields.io/badge/version-1.0.1-blue)](#changelog)

<br />

[![Download Latest APK](https://img.shields.io/badge/Download-Latest%20APK-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://expo.dev/artifacts/eas/mbL_i79yTgHw9D8nAxNej1jq97eT_gxn_2mddZSYdzk.apk)
[![EAS Builds](https://img.shields.io/badge/EAS-All%20Builds-4630EB?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/accounts/iamanshumaans-team/projects/-gdg-events/builds)

</div>

---

## Overview

A lightweight Expo app that talks to a self-hosted Django REST API. It lists upcoming and past events, lets members sign in or register, and remembers their session on-device. The interface ships with a full **light / dark theme that follows the system by default**.

> **Downloading the APK?** Android will warn that the file is from an unknown source — allow "install from this source" when prompted.

## Features

| | Feature |
| --- | --- |
| **Events** | Upcoming and past events with title, date, venue, description and poster |
| **Accounts** | Register and log in against the Django API; token stored in `expo-secure-store` |
| **Theming** | Light / dark palettes that follow the system setting, with a manual override toggle |
| **Branding** | GDG on Campus IIIT Kalyani identity, custom app icon and splash screen |
| **Community** | Organisers section on the home screen with circular profile photos |

## Tech stack

| Layer | Choice |
| --- | --- |
| Runtime | Expo SDK 58 · React Native 0.88 · React 19 |
| Routing | [Expo Router](https://docs.expo.dev/router/introduction) (file-based) |
| Language | TypeScript 6 (strict) |
| Storage | `expo-secure-store` (auth token) · `@react-native-async-storage/async-storage` (theme preference) |
| Lint | ESLint 9 with `eslint-config-expo` |
| Backend | Django + Django REST Framework (see [GDGEvents-backend](https://github.com/Sharma-Anshumaan/GDGEvents-backend)) |
| Builds | EAS Build (cloud, no local Android Studio / Xcode required) |

## Getting started

**Prerequisites:** Node.js **22.13+** (Expo SDK 58 requirement — Node 20 still runs but prints deprecation warnings) and npm.

```bash
npm install
npx expo start
```

Then press `a` for Android, `i` for iOS, `w` for web — or scan the QR code with a development build.

Quality checks used in this repo:

```bash
npx tsc --noEmit     # typecheck
npx eslint src       # lint (npx expo lint needs Node 22+)
```

## Project structure

```text
GDGEvents/
├─ assets/images/        # app icon, splash, organiser photos
├─ src/
│  ├─ app/               # Expo Router routes — one file per screen
│  │  ├─ _layout.tsx     # theme provider, stack navigator, status bar
│  │  ├─ index.tsx       # home: branding, about, organisers
│  │  ├─ events.tsx      # event list
│  │  ├─ login.tsx
│  │  └─ register.tsx
│  ├─ components/        # Button, Field, AuthLayout, ThemeToggle
│  └─ lib/
│     ├─ api.ts          # API client + secure token helpers
│     └─ theme.tsx       # light/dark palettes, ThemeProvider hooks
├─ app.json              # Expo config (icon, package id, plugins, EAS project)
├─ eas.json              # build profiles
└─ eslint.config.js
```

## Backend & API

The app points at a Django REST API hosted on an Azure VM. The base URL lives in a single place — [`src/lib/api.ts`](src/lib/api.ts) — and is currently plain HTTP:

```ts
export const BASE_URL = "http://40.81.236.95/api";
```

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/register/` | — | Create an account |
| `POST` | `/api/login/` | — | Obtain an auth token |
| `GET` | `/api/events/` | Token | List events |
| `GET` | `/admin/` | Staff | Django admin |

## Building

All builds run in the cloud via EAS:

```bash
npx eas-cli build --platform android --profile preview
```

| Profile | Output | Use case |
| --- | --- | --- |
| `development` | Development client | Local development with native modules |
| `preview` | **APK**, internal distribution | Sharing testable builds with the team |
| `production` | AAB, version auto-increment | Play Store releases |

Finished builds appear at [expo.dev/accounts/iamanshumaans-team/projects/-gdg-events/builds](https://expo.dev/accounts/iamanshumaans-team/projects/-gdg-events/builds) with a QR code and a direct APK link.

## Known issue: "server unreachable" in release builds

If the app worked in **Expo Go** but every request failed in a **standalone APK**, this was the cause — and it is fixed as of `1.0.1`.

Android 9 (API 28) and newer block **cleartext HTTP traffic** by default. Expo Go ships with cleartext allowed, so development worked, while the release APK silently refused to reach the `http://` API. The fix enables it explicitly through the `expo-build-properties` plugin in `app.json`:

```json
[
  "expo-build-properties",
  { "android": { "usesCleartextTraffic": true } }
]
```

The proper long-term fix is to serve the API over **HTTPS** (a domain + Let's Encrypt certificate on the VM), after which the cleartext exception can be removed.

## Changelog

### 1.0.1

- Fixed **"server unreachable"** errors in release/APK builds by enabling `android.usesCleartextTraffic`.
- Added the app icon and adaptive icon to Android builds.

### 1.0.0

- Initial release: events list, authentication, organisers section, GDG IIIT Kalyani branding.
- Added light / dark theming that follows the system setting, with manual override.
- Migrated the whole UI to dark-mode-aware design tokens.
