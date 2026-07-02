# Vaultline — Access Console

A React auth frontend built against the documented Auth API (`API_User_Guide_Full_Updated.pdf`), with a distinct neumorphic "vault" visual identity — a combination-lock dial as the recurring mark, circular OTP notches instead of boxes, and a "clearance level" toggle instead of a plain role dropdown.

## API

Base URL: `https://backend-auth-c86g.onrender.com/api`

| Action | Method | Endpoint |
|---|---|---|
| Register | POST | `/auth/register` |
| Login | POST | `/auth/login` |
| Change password | PUT | `/auth/change-password` |
| Request OTP | POST | `/auth/forgot-password` |
| Reset password | POST | `/auth/reset-password` |
| User panel | GET | `/user` |
| Admin panel | GET | `/admin` |

The stored JWT is sent as `Authorization: Bearer <token>` on every authenticated request (see note below).

## Features

- Register / login / logout, with the token persisted in `localStorage`
- Role-based routing: `user` role can only reach `/user`; `admin` can reach both `/user` and `/admin`
- Forgot password as a 2-step flow: request OTP → enter OTP + new password (unlike a single form with disabled fields)
- Change password for a logged-in user
- Dashboard panels render whatever the `/user` and `/admin` endpoints actually return, instead of hardcoded placeholder numbers

## Tech Stack

React 19 + Vite, Redux Toolkit, React Router v6, Axios, plain CSS (no Tailwind) with a hand-built neumorphic design system.

## Getting Started

```bash
npm install
npm run dev
```

## A note on the Authorization header

The API doc shows `Authorization: YOUR_TOKEN` (no `Bearer` prefix). This app sends `Authorization: Bearer <token>` instead, matching how the existing reference implementation calls the same backend. If the live backend actually expects the raw token without `Bearer `, update the interceptor in `src/api/client.js`.

## Troubleshooting "Registration failed" / generic errors

The backend is hosted on Render's free tier, which spins the service down after inactivity — the first request after a while can take 30-60 seconds to wake it up, and used to just show a generic error. This has been fixed:

- `src/api/client.js` now sets a 60s timeout instead of relying on the browser default, so a cold start doesn't get cut off early.
- Every thunk in `src/redux/authSlice.js` now goes through a shared `describeError` helper that distinguishes three different failure modes instead of collapsing them into one message:
  - A real error message from the backend (e.g. `"Invalid"`, `"Access denied"`)
  - A timeout ("the server took too long to respond — it may be waking up")
  - A genuine network/CORS failure ("could not reach the server")

If you still see "Registration failed" after this fix, open the browser console/network tab on the actual failing request — the new error message will now tell you which of the three cases it is, which narrows down whether it's a cold-start issue, a CORS issue, or the backend genuinely rejecting the request (e.g. duplicate email).

## Design notes

- **Palette**: steel-grey neumorphic base (`#e4e8ef`) with a brass accent (`#a9772f`) — a security/vault palette rather than a generic dark-mode or pastel dashboard.
- **Type**: Familjen Grotesk for display, Inter for body, IBM Plex Mono for the OTP/token-adjacent UI.
- **Signature element**: the Vault Dial — used as the static logo mark, a spinning loading indicator, and (available for) a click-open unlock animation on success.
