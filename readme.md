# DevTinder

A modern frontend for **DevTinder** — connect with developers, swipe, match, and build together. Built with Vite, React, TypeScript, Tailwind CSS, DaisyUI, and Redux Toolkit.

## Tech Stack

- **Vite** — Fast build tool and dev server
- **React 19** — UI library
- **TypeScript** — Type-safe JavaScript
- **React Router** — Client-side routing (with `Outlet` and nested routes)
- **Tailwind CSS** — Utility-first CSS framework
- **DaisyUI** — Component library on top of Tailwind (buttons, inputs, navbar, footer, loading)
- **Axios** — HTTP client for API calls
- **Redux Toolkit** — Global state (auth slice, typed `useAppDispatch` / `useAppSelector`)

## Implemented So Far

- **Routing** — Landing (`/`), Login (`/login`), Signup (`/signup`), Dashboard (`/dashboard`) with React Router and a shared `Layout` + `Outlet`
- **Layout** — Navbar (DevTinder logo; shows "Welcome, {firstName}" when logged in; on login page shows "Sign up", on signup page shows "Log in"; elsewhere avatar dropdown with Profile, Settings, Logout) and Footer (Services, Company, Social links). Navbar and Footer use matching `bg-base-300` background color. Footer hidden on login/signup pages.
- **Auth pages** — Login and Signup with DaisyUI-based `Input` and `Button`, client-side validation, error display; password fields have in-field eye icon to toggle visibility. Forms centered in viewport without scrolling.
- **Auth guard** — Logged-in users are automatically redirected from login/signup pages to dashboard. `LoginPage` and `SignupPage` check Redux `isAuthenticated` state.
- **Session restoration** — `AuthInitializer` component calls `/profile/view` API on app mount/refresh to restore user session. User data (including `profilePicture`, `firstName`, `lastName`, `email`, `about`, `skills`, etc.) stored in Redux and persists across page refreshes.
- **User profile display** — Navbar shows user's profile picture from Redux state (`user.profilePicture`) with fallback to default avatar. Welcome message displays user's first name from Redux.
- **Auth API** — Axios client (`src/api/client.ts`) with `withCredentials: true` for session cookies. Login, signup, logout, and `getProfile` functions in `src/api/auth.ts` with error handling. Handles backend response format `{ message, data: {...} }`.
- **CORS proxy** — Vite dev server proxy (`/api` → `http://localhost:8080`) configured in `vite.config.ts` to avoid CORS issues in development.
- **UI components** — Reusable DaisyUI wrappers: `Button` and `Input` in `src/components/ui`; `PageLoader` (DaisyUI loading spinner) as Suspense fallback
- **Lazy loading** — Route-level code splitting with `React.lazy()` for Layout and all pages; `Suspense` with `PageLoader` as fallback
- **Redux Toolkit** — Store with `auth` slice (`user`, `isAuthenticated`); `setCredentials` / `clearCredentials` actions; `Provider` in `main.tsx`; typed `useAppDispatch` and `useAppSelector` hooks
- **Landing page** — Tinder-style hero, CTAs (Create account / Log in), card-style visual
- **Mobile responsive** — Layout, auth forms, and landing tuned for small screens (safe areas, touch-friendly controls)
- **Project rules** — `cursor.rules` enforces DaisyUI for all buttons and inputs; no raw `<button>` / `<input>` without DaisyUI usage

## Prerequisites

- Node.js 18+
- npm (or pnpm / yarn)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

---

## Tailwind CSS & DaisyUI Setup

This project uses **Tailwind CSS** for styling and **DaisyUI** for ready-made components (buttons, cards, modals, themes, etc.).

### Dependencies

- `tailwindcss` — Core Tailwind CSS
- `postcss` — CSS processing
- `autoprefixer` — Vendor prefixes
- `daisyui` — DaisyUI component library (Tailwind plugin)

### Install (if not already present)

```bash
npm install -D tailwindcss postcss autoprefixer
npm install -D daisyui
```

### Configuration

**1. Initialize Tailwind (optional — config may already exist)**

```bash
npx tailwindcss init -p
```

**2. `tailwind.config.js`** — Include DaisyUI and your content paths:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
```

**3. `postcss.config.js`** — Use Tailwind and Autoprefixer:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**4. `src/style.css`** — Add Tailwind directives at the top:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Import this file in your main entry (e.g. `src/main.ts`).

### Using DaisyUI

- Use **utility classes** from Tailwind as usual.
- Use **DaisyUI components** via classes, e.g. `btn`, `btn-primary`, `card`, `card-body`, `navbar`, `modal`, etc.
- Switch **themes** with the `data-theme` attribute on `<html>` or use DaisyUI theme classes.

Example:

```html
<button class="btn btn-primary">Click me</button>
<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">Card title</h2>
    <p>Card content.</p>
  </div>
</div>
```

[DaisyUI components](https://daisyui.com/components/) · [Tailwind CSS docs](https://tailwindcss.com/docs)
