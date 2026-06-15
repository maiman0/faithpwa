# FAITH PWA — Claude Instructions

## Project Summary

FAITH Mobile is a mobile-first workspace platform built with **Expo**, **React Native**, and **TypeScript**. It serves as the companion application for the FAITH Workspace Platform, allowing employees to manage attendance, leave applications, room bookings, and company updates from a unified mobile experience.

The application follows a centralized design system and a hook-driven architecture to ensure scalability and maintainability.

---

## Build Order (Always Follow)

Every new feature should be implemented in this sequence:

1. **`constants/<module>.ts`** — Types, interfaces, enums, mock data, business constants
2. **`helpers/<module>.ts`** — Pure, stateless utilities (date/time formatting, derivations). No React, no side effects.
3. **`hooks/use<Module>.ts`** — Business logic, API integration, actions, computed values
4. **`contexts/`** — Only for application-wide state (Auth, Theme, Overlay, Backend Session)
5. **`components/<module>/`** — Reusable UI components
6. **`app/.../<module>/index.tsx`** — Screen implementation consuming hooks only

Never skip layers.

---

## Architecture Rules

* **Hook-first architecture.** Screens never fetch or transform data directly.
* **No `any`.** All modules must be strongly typed.
* **Business logic belongs inside hooks.**
* **Context API is reserved for global application state only.**
* **Reusable components must remain presentation-only.**
* **All user feedback (dialogs, toasts, loaders, bottom sheets) must use the shared Overlay system.**
* **No native `alert()` usage.**
* **Modules should remain self-contained and reusable.**

---

## Tech Stack

| Layer         | Tool                     |
| ------------- | ------------------------ |
| Framework     | Expo                     |
| UI            | React Native Paper (MD3) |
| Language      | TypeScript               |
| Routing       | Expo Router              |
| Global State  | Context API              |
| Theme System  | `useTheme()`             |
| Design System | `useDesign()`            |
| HTTP          | PHP Backend API          |
| Mobile        | React Native             |

---

## Core Modules

```
Authentication
├── Login
├── Session Management

Attendance
├── Attendance Record
├── Attendance Status

Leave
├── Create Leave
├── View Leave
├── Leave Withdrawal

Newsflash
├── Company Newsflash
├── Newsflash Acknowledgement

Room Booking
├── Room Availability
├── Create Booking
├── Update Booking

Staff
├── Profile
├── Settings

Shared
├── Overlay System
├── Theme System
├── Design Tokens
├── Backend Context
```

---

## File Structure

```
app/
components/
hooks/
helpers/
constants/
contexts/

app/.../<module>/index.tsx
components/<module>/
hooks/use<Module>.ts
helpers/<module>.ts
constants/<module>.ts
contexts/<module>Context.tsx
```

---

## Design System Rules

* Use `useTheme()` for all colors.
* Use `useDesign()` for spacing, radius, typography, sizing, and layout tokens.
* Never hardcode spacing or border radius values unless absolutely necessary.
* Components should automatically support Light and Dark themes.
* Prefer semantic colors over direct palette values.

---

## Overlay Rules

All user interaction feedback should use the shared overlay system:

* Alert Dialog
* Confirmation Dialog
* Bottom Sheet
* Toast Notification
* Fullscreen Loader
* Modal

Never use browser alerts or custom implementations.

---

## Backend Integration

The application integrates with an existing PHP backend.

* API calls should be encapsulated inside hooks.
* UI should never directly communicate with the backend.
* Shared authentication and session state should be managed through Context API.
* Keep backend implementation abstracted from presentation components.

---

## Date & Time Display

* Never render raw API date/time strings (e.g. `08:30:00`, `2026-06-15`) in the UI.
* All date, time, and duration display must go through `helpers/<module>.ts` formatters.
* Formatters must be pure, accept nullable input, and return a safe fallback (e.g. `--:--`, `--`).
* Times display in 12-hour format (`8:30 AM`), dates in human-readable form (`Monday, 15 June`).

---

## Code Style

* TypeScript-first architecture
* Functional components only
* No `any`
* Keep screens thin
* Business logic belongs in hooks
* Reusable UI belongs in `components`
* No unnecessary comments
* Follow existing design token system
* Prefer composition over duplication

---

## UI Philosophy

FAITH Mobile emphasizes:

* Mobile-first experience
* Clean enterprise interfaces
* Compact operational layouts
* Consistent design language
* Accessible navigation
* Reusable design tokens
* Scalable component architecture

---

## Before Completing Any Module

1. Verify TypeScript has no errors
2. Verify Light and Dark themes render correctly
3. Verify overlay interactions work properly
4. Verify responsive behavior across screen sizes
5. Ensure components consume hooks instead of embedding business logic
6. Ensure all spacing, typography, and colors use the design system
