# DataForge - Play Store Launch Guide

DataForge is configured as an Android Capacitor app with package name `com.forgelabs.dataforge`.

## Build Steps

Run these from the project root:

```bash
npm run build
npx cap sync android
cd android
./gradlew bundleRelease
```

Release bundle output:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

## Store Listing Starter Copy

Short description:

```text
Practice SQL, analytics, and BI decisions through interactive data labs.
```

Full description:

```text
DataForge is a mobile-first SQL and data analytics training app built around scenario-based labs.

Work through 100 hands-on labs across SQL fundamentals, database design, analytics, data pipelines, business intelligence, and advanced optimization topics. Each lab uses focused decision mechanics so you practice how to think through queries, schema choices, data quality issues, and reporting tradeoffs.

DataForge includes:
- 100 total labs
- 66 free labs and 34 premium labs
- 6 learning paths
- 4 renderer styles for query reasoning, configuration, investigation, and remediation
- XP, streak, completion, and recommendation systems

Use DataForge to build stronger instincts for SQL, data modeling, dashboarding, ETL, and performance tuning.
```

## Required Follow-Up Before Release

- Replace the placeholder RevenueCat API key in `src/config/revenuecat.ts`.
- Replace the inherited Firebase project config in `src/config/firebase.ts` with DataForge credentials.
- Create a real DataForge signing keystore and set `DATAFORGE_KEYSTORE_PATH`, `DATAFORGE_STORE_PASSWORD`, `DATAFORGE_KEY_ALIAS`, and `DATAFORGE_KEY_PASSWORD` for release builds.
- Add final Play Store graphics and screenshots.

## Current Android Config

| Setting | Value |
|---|---|
| App name | `DataForge` |
| Subtitle | `DataForge: Data Training` |
| Package name | `com.forgelabs.dataforge` |
| versionCode | `5` |
| versionName | `1.0.4` |
