<div align="center">

<img src="frontend/assets/images/iconforapp.png" alt="GDG on Campus IIIT Kalyani" width="130" />

# GDG IIIT Kalyani — Events Platform

**Full stack behind the GDG on Campus IIIT Kalyani events app** — a cross-platform mobile client and the Django REST API that powers it.

[![Expo](https://img.shields.io/badge/Expo-SDK%2058-000020?logo=expo&logoColor=white)](https://docs.expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.88-61DAFB?logo=react&logoColor=white)](https://reactnative.dev)
[![Django](https://img.shields.io/badge/Django-6-092E20?logo=django&logoColor=white)](https://www.djangoproject.com)
[![Version](https://img.shields.io/badge/app%20version-1.0.1-blue)](#)

<br />

[![Download Latest APK](https://img.shields.io/badge/Download-Latest%20APK-3DDC84?style=for-the-badge&logo=android&logoColor=white)](https://expo.dev/artifacts/eas/mbL_i79yTgHw9D8nAxNej1jq97eT_gxn_2mddZSYdzk.apk)
[![EAS Builds](https://img.shields.io/badge/EAS-All%20Builds-4630EB?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/accounts/iamanshumaans-team/projects/-gdg-events/builds)

</div>

---

## What's in this repository

| Path | Description | Stack |
| --- | --- | --- |
| [`frontend/`](frontend) | The mobile app: events feed, authentication, light/dark theming | Expo SDK 58 · React Native 0.88 · TypeScript 6 |
| [`backend/`](backend), [`accounts/`](accounts) | Django REST API: auth tokens, events endpoint, admin | Django 6 · Django REST Framework |
| [`manage.py`](manage.py) · [`requirements.txt`](requirements.txt) | Python entrypoint and dependencies | Python 3 |
| [`setup.ps1`](setup.ps1) | Local Windows setup helper | PowerShell |

Full app documentation, screens and theming details live in [`frontend/README.md`](frontend/README.md).

## Quick start

**Mobile app**

```bash
cd frontend
npm install
npx expo start
```

**API**

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## API

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/register/` | — | Create an account |
| `POST` | `/api/login/` | — | Obtain an auth token |
| `GET` | `/api/events/` | Token | List events |
| `GET` | `/admin/` | Staff | Django admin |

The mobile client reads the base URL from `frontend/src/lib/api.ts`.

## Getting the app on a phone

Tap the **Download Latest APK** button above (Android will ask you to allow installing from this source), or open the [EAS builds page](https://expo.dev/accounts/iamanshumaans-team/projects/-gdg-events/builds) and scan the QR code of the newest build.

> **Known issue (fixed in app v1.0.1):** release APKs could not reach the API — Android 9+ blocks cleartext HTTP by default while Expo Go allows it. Resolved by enabling `android.usesCleartextTraffic` through `expo-build-properties`.

> **Note:** `db.sqlite3` is committed for convenience during development. It should be removed from version control before the repository is used in production.
