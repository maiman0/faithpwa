# FAITH PWA — Next Revision Roadmap

Pre-deployment hardening, split by **Frontend** (this Expo/PWA repo) and
**Backend** (the PHP API). Focus area: session security + the review findings.

> Principle: session-security truth (IP, last login, last activity, revocation)
> is **collected server-side**. The client cannot reliably know its own IP and
> anything it reports is spoofable — the client only sends device context and
> *displays* what the backend records.

---

## ✅ Done (current revision)

- [x] Auto kick-out on `401` (response interceptor → `notifySessionExpired`).
- [x] Token expiry enforced (`getValidToken`); expired token never sent and is
      cleared on load → redirect to login.
- [x] Session bridge (`contexts/api/session.ts`) de-dupes burst 401s; re-armed
      on each login; all stores cleared on logout/kick-out.

---

## Frontend (Expo / PWA)

### Session & security
- [ ] **Context headers** on the axios instance (`contexts/api/api.tsx`):
      `X-App-Version`, `X-Platform` (ios/android/web), `X-Device`. Lets the
      backend enrich each session row with device info.
- [ ] **Capture `session_id`** returned at login (store alongside the token in
      `tokenContext`) so the app can identify/self-revoke "this device".
- [ ] **"Last sign-in" in Settings** — show `last_login_at` + ip/device from a
      backend endpoint.
- [ ] **Active sessions screen** — list devices, "sign out other devices"
      (calls a backend revoke endpoint; relies on the 401 flow already built).

### Hygiene / deployment
- [ ] Add `.env` to `.gitignore` (currently tracked); commit `.env.example`.
      Confirm no real secret is ever client-side (`EXPO_PUBLIC_*` ships public).
- [ ] Rework `public/sw.js`: it's cache-first for the app shell with no
      `activate` cleanup → users keep stale JS after deploys. Move to
      network-first / stale-while-revalidate + versioned cache purge
      (prefer Workbox / Expo PWA tooling over the hand-rolled SW).
- [ ] Remove SW-registration `console.log`s in `app/_layout.tsx`.

### Edge cases
- [ ] Gate login success on a **token actually being present**, not just
      `status === 'success'` (avoid "logged in" with no token).
- [ ] Startup-fetch retry: every module's auto-fetch is guarded by
      `length === 0 && !loading && !error`; once `error` is set it never
      retries. Add retry-on-focus or a manual retry affordance.
- [ ] Verify **manager-view** attendance response (`/attendance.php` no flag)
      matches the `Attendance[]` shape the store/UI assume; branch if not.

---

## Backend (PHP API)

### Session storage (security workhorse)
- [ ] **`auth_sessions`** table — one row per token/device:
      `id`, `staff_id`, `token_hash` (store SHA-256, **never raw token**),
      `issued_at`, `expires_at`, `last_seen_at`, `ip_address`, `user_agent`,
      `platform`, `app_version`, `device`, `revoked_at`.
- [ ] **`auth_events`** append-only audit log: `staff_id`, `event_type`
      (login / logout / failed_login / expired), `ip_address`, `user_agent`,
      `created_at`. Insert-only — survives session-row deletion.
- [ ] Denormalized convenience columns on `staff`: `last_login_at`,
      `last_login_ip`, `last_seen_at` (cheap display, optional).

### Capture rules
- [ ] **IP from the request** (`$_SERVER['REMOTE_ADDR']`). Trust
      `X-Forwarded-For` **only** when the immediate peer is a known proxy;
      take the left-most untrusted hop. Never trust a client-reported IP.
- [ ] **Throttle `last_seen_at`** writes (only update if `now - last_seen > ~5m`)
      to avoid hammering the DB on every request. Redis optional for hot state.
- [ ] Issue opaque token (or JWT); look up by `token_hash` per request.

### Endpoints
- [ ] Return `session_id` (+ `expires_at`) in the login response.
- [ ] `GET /sessions` — active sessions for the user (for the Settings screen).
- [ ] `DELETE /sessions/{id}` (+ "sign out others") — sets `revoked_at`; next
      request from that device returns `401` → client auto-logs-out.
- [ ] Confirm the API returns **`401`** for auth failure/expiry/revocation
      (some PHP handlers return `200` + error body or `403`). The frontend
      interceptor keys off `401` — broaden it if the signal differs.

### Validation & privacy
- [ ] Server-side validation is mandatory (client checks are bypassable):
      uploads (type/size/content — mirror `useUpload`'s allowlist + 1 MB cap),
      profile fields (mirror `helpers/staff.ts`).
- [ ] Explicit success/error response shapes for mutations (leave/staff). The
      frontend `isMutationOk` is deliberately lenient (treats any 200 without an
      `error` as success) — backend must return clear error signals.
- [ ] **Retention policy (PDPA):** purge `auth_events`/IP data after a set
      window (e.g. 90–180 days); document it in the privacy notice; restrict
      who can read the audit log.

---

## Open questions to confirm with backend
1. Exact auth-failure status code (`401` assumed).
2. Token lifetime server-side vs the client's 7-day expiry (keep them aligned;
   if the server expires sooner, the `401` path covers it).
3. Does `/attendance.php` (manager view) return the same row shape as
   `?default=true` (operation view)?
