# FAITH PWA

## What It Is

FAITH PWA is the mobile companion to the FAITH Workspace Platform — a
Progressive Web App that gives every employee quick, secure access to the HR
services they use daily: attendance, leave, company announcements, room
booking and their own staff profile.

It runs directly in a browser and can also be installed to a phone's home
screen like a native app, with no app store download required. Because it
talks to the same backend as the main FAITH Workspace Platform, everything
stays perfectly in sync — there is no separate system to maintain or
reconcile.

## Who It's For

Every staff member who needs to check their attendance, apply for leave,
stay informed on company news or book a meeting room — from their phone
during a commute, or from a desktop browser at their desk. Managers get an
additional view of their team's attendance without needing a separate tool.

---

# Core Modules

## Authentication & Session

Secure, persistent sign-in that keeps sessions safe without getting in the
way.

Staff sign in with their existing username and password and the app
remembers them across restarts so they aren't asked to log in every time they
open it. Behind the scenes, the app continuously checks whether a session is
still valid and if it has expired — or been ended remotely, for example by
IT revoking access — the user is signed out safely with a clear explanation
rather than being left confused by failed requests.

Signing out is deliberate: a confirmation is required before leaving and
signing out (whether by choice or because a session died) clears any
information cached on the device, so nothing from a previous login lingers
around. For transparency, the Home screen footer can show the last sign-in
time, IP address and device/platform used — useful context if something
ever looks unfamiliar.

## Home Dashboard

One screen that gives every employee the day's most important information at
a glance, the moment the app opens.

A greeting adjusts to the time of day and a live attendance summary shows
exactly where the user stands for today. A leave section surfaces pending
applications and the remaining annual leave balance without needing to open
the Leave module directly. The latest company announcements scroll past in a
carousel, and a room-booking snapshot shows active bookings and recent
history. Every section links straight through to its full module, so nothing
requires digging through menus to find.

## Attendance

A clear picture of where an employee stands — today, this week, or this
month — without needing to interpret raw timestamps.

Staff can switch between their own attendance and for managers, their
team's. Weekly and monthly views make it easy to spot patterns and every day
is marked in plain language — present, late, absent, on leave, a weekend, or
a public holiday — with a human-readable note like "45 minutes late" or "On
time" rather than a bare status code. Pulling down to refresh confirms the
data is current with a simple toast message.

## Leave Management

Everything needed to apply for, track and manage leave, from one place.

Eleven leave types are supported — annual, medical, emergency, replacement
and more — each automatically asking for exactly what it needs: a
supporting document for some, a clinic selection for medical leave, nothing
extra for the rest. Staff can request a single day, a date range, or a half
day, and the app calculates the duration automatically rather than leaving
that arithmetic to the employee. A monthly balance view and a short summary
of leave policy keep expectations clear and a pending application can be
withdrawn if plans change. A built-in clinic search helps staff find and
record which clinic issued a medical certificate without leaving the form.

## Newsflash

Company announcements that are impossible to miss and easy to act on.

Broadcasts appear in a scrollable list with a full detail view supporting
richly formatted content — not just plain text — so announcements can include
the same formatting the person who wrote them intended. Each one is tagged
Critical, Important, or Normal, so the messages that matter most stand out
visually rather than getting lost among routine updates. Acknowledging that
an announcement has been read takes one tap and the most recent items also
surface directly on the Home dashboard.

## Room Booking

Finding and reserving a meeting room takes seconds, not a phone call to
facilities.

Staff browse rooms with real-time slot availability for any given day —
slots that have already passed today are handled automatically so they can't
be booked by mistake. Multiple time slots can be selected together, a
purpose is attached to the booking and confirming takes the user straight to
their bookings list. Everything is organized under Upcoming, Past and
Cancelled tabs and cancelling an existing booking takes one confirmed tap.

## Staff Profile & Settings

Keeping personal information accurate and the app feeling personal.

Staff can view their full profile — name, designation, contact details,
address — and update their contact information and address with built-in
validation, so a typo in an email or an incomplete phone number is caught
before it's saved. Settings include a light/dark theme toggle and an About
screen showing the current app version and what changed in the latest
release, so staff always know they're on an up-to-date build.

## Shared Experience

A consistent, polished feel in every corner of the app.

Every confirmation dialog, alert, toast notification, bottom sheet and
loading indicator comes from one shared design system, so the app never
feels like it's stitched together from different screens built at different
times. Light and dark themes are supported everywhere automatically, and the
layout is mobile-first but scales cleanly up to a desktop browser window.

## App Layout — Desktop & Installable PWA

Feels right whether it's a phone in someone's hand or a browser tab on a
desk.

On a phone — or once installed to a home screen as a Progressive Web App —
FAITH fills the entire screen like a native app, with no browser chrome
getting in the way. Opened in a normal desktop browser window instead, it
automatically frames itself inside a realistic phone mockup, so the
experience always looks intentional rather than a mobile site awkwardly
stretched across a wide screen. Either way, it can be installed straight
from the browser in a couple of taps, with no app store required.

---

# Platform & Technology

FAITH PWA is built as a Progressive Web App: it runs directly in the
browser, installs like a native app when a user chooses to, and requires no
app store, update mechanism, or device-specific build to reach every staff
member at once. It connects to the same backend as the FAITH Workspace
Platform, so attendance, leave, staff records, and room bookings all stay in
sync with the system the organization already runs on.
