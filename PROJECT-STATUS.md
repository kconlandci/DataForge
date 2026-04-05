# DataForge - Project Status

**Last updated:** March 29, 2026

## Overview

DataForge is a React 19 + TypeScript + Vite 8 + Tailwind v4 + Capacitor 8 Android app for SQL and data analytics training.

## Current Scope

- 100 labs total
- 66 free labs
- 34 premium labs
- 6 learning paths
- 4 renderer types

## Learning Paths

- SQL Fundamentals
- Database Design
- Data Analysis
- Data Pipelines
- Business Intelligence
- Advanced Analytics

## Engine Notes

- RevenueCat cold-start readiness is gated through app context.
- Premium cache keys are scoped by Firebase anonymous UID.
- Progress is mirrored to Capacitor Preferences with Zod validation and recovery.
- Analytics resume tracking is enabled on app foreground.
- Retry resets the lab timer before a fresh attempt.
- Dev, Upgrade, Analytics, and legal screens are lazy loaded.
- Safe-area padding, aria labels, dialog fallbacks, and back-navigation fallbacks are in place.
- External links use `@capacitor/browser` with browser fallback.

## Remaining Production Setup

- Replace placeholder RevenueCat credentials.
- Replace inherited Firebase configuration with a DataForge Firebase project.
- Create a real DataForge Android signing keystore before shipping a release bundle.
