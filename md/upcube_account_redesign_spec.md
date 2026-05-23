# Upcube Account Redesign Specification

## Project

**Repo path:** `/Users/sha/Documents/AI/account`  
**Product:** Upcube Account  
**Goal:** Redesign the account service into a clean, dark, trustworthy account center inspired by the structure of modern account dashboards, while keeping the design fully Upcube-branded and IP-safe.

This document describes the target experience for `account.upcube.ai`.

---

## Design Direction

Upcube Account should feel like the central identity and trust hub for the entire Upcube ecosystem. It should not look like a generic login page or a raw auth demo. It should feel like a premium account console where users can:

- Sign in with Google
- View their profile
- Manage connected Upcube apps
- Review security and session status
- See privacy and data controls
- Return safely back to the product app they came from

The visual reference is a dark account-management dashboard with a left sidebar, centered content column, large profile identity area, stacked cards, calm spacing, and simple account/security sections.

The implementation must be original. Do not copy Google branding, icons, layouts exactly, text, or visual assets. Use the reference only for product structure, information hierarchy, and calm account-center behavior.

---

## Core Product Principle

The account app is the trusted identity layer for Upcube.

Every screen should answer one of these questions clearly:

1. Who am I signed in as?
2. Which Upcube apps are connected?
3. Is my account secure?
4. What data and privacy controls exist?
5. Where will I return after login?

---

## Target Layout

### App Shell

Use a full-screen dashboard shell.

```text
┌──────────────────────────────────────────────────────────────┐
│ Top bar                                                      │
├───────────────┬──────────────────────────────────────────────┤
│ Left sidebar  │ Main account content                         │
│               │                                              │
│ Navigation    │ Centered profile/account cards                │
│               │                                              │
└───────────────┴──────────────────────────────────────────────┘
```

### Top Bar

The top bar should be minimal and stable.

Required elements:

- Upcube logo mark on the left
- Product name: `Account`
- Optional search field: `Search account settings`
- Right-side account avatar or initials
- Optional small app switcher icon for Upcube apps

Do not use Google branding or Google-style icons.

### Left Sidebar

The sidebar should make the account app feel like a real account center.

Recommended sections:

```text
Home
Profile
Security
Connected Apps
Privacy
Billing
Sessions
Developer Access
Settings
```

Sidebar behavior:

- Desktop: persistent left sidebar
- Mobile: collapsible drawer
- Active state: soft gray pill or subtle border
- Icons: use neutral Lucide-style icons or existing project icon system
- Keep sidebar width around 240–280px

### Main Content Area

Main content should be centered with a max width around 680–760px.

Use stacked rounded cards, not dense tables.

Recommended surface hierarchy:

```css
--account-bg: #0f0f10;
--account-sidebar: #151516;
--account-card: #1f2023;
--account-card-hover: #27282c;
--account-border: rgba(255, 255, 255, 0.1);
--account-text: #f4f4f5;
--account-muted: #a1a1aa;
--account-subtle: #71717a;
--account-accent: #ffffff;
--account-danger: #b42318;
--account-success: #22c55e;
```

Keep the look mostly black, charcoal, and white. Use color only for security state, success state, warning state, and links.

---

## Page Structure

## 1. Home / Overview

The home page should show the signed-in user and account health.

### Hero Profile Block

Show:

- User avatar or initials
- Display name
- Email
- Account status chip: `Signed in`, `Secure`, or `Needs review`
- Primary action: `Manage profile`
- Secondary action: `Sign out`

Example structure:

```text
[Avatar]

Shadab Chow
user@example.com

[Signed in] [Google connected]

Search account settings...
```

Do not hardcode real user details. Always render from session when available.

### Account Health Cards

Show 3–4 cards:

```text
Security
Recent sign-in activity and session health.

Connected Apps
Apps using your Upcube account.

Privacy
Data and personalization controls.

Sessions
Devices and browsers currently signed in.
```

Each card should be clickable and route to the matching section.

---

## 2. Profile Page

Purpose: show identity details from the signed-in session.

Fields:

- Profile picture
- Name
- Email
- Account ID, if available
- Login provider
- Created date, if available
- Last sign-in, if available

Important:

- Do not expose sensitive internal IDs unless useful for support.
- Do not allow editing Google-managed profile values unless the app has its own profile model.
- Show read-only fields clearly.

---

## 3. Security Page

Purpose: make users trust the account system.

Sections:

```text
Security status
Recent sign-in activity
Active sessions
Password / provider information
Two-factor status, if supported later
```

For current MVP, if only Google OAuth exists, say:

```text
Your sign-in is managed through Google OAuth.
```

Do not imply that Upcube manages the user’s Google password or Google 2FA.

Use honest labels:

- `Google sign-in connected`
- `Session active`
- `No password stored by Upcube`

---

## 4. Connected Apps Page

Purpose: show which Upcube products are connected to the account.

Apps to include:

```text
Upcube
Upcube News
Upcube Books
Upcube Jobs
Upcube Globe / Planet
Upcube Quantum
Upcube Robotics
Upcube University
Ethen / Upcube Chat
Upcube Games
```

Card fields:

- App name
- App URL
- Connection status
- Last used, if available
- Button: `Open app`

Connection statuses:

```text
Connected
Available
Needs sign-in
Coming soon
```

This page should make the ecosystem feel unified.

---

## 5. Privacy Page

Purpose: explain data controls clearly.

Sections:

```text
Account data
Session data
Connected app data
Export data
Delete account
```

For MVP, if export/delete are not implemented, show disabled cards with honest text:

```text
Data export is planned for a future release.
```

Avoid fake controls.

---

## 6. Billing Page

Purpose: placeholder for future subscriptions.

Current MVP behavior:

- Show a calm empty state
- Say billing is not active yet if no billing integration exists
- Do not show fake plans or fake payment methods

Suggested text:

```text
Billing is not active for this account yet.
Paid plans and subscription controls will appear here when available.
```

---

## 7. Sessions Page

Purpose: show session state and sign-out controls.

Current MVP:

- Current browser session
- Login provider
- Sign out button
- Return-to destination if user entered from a product app

Future:

- Multi-device sessions
- Revoke session
- Session history

---

## 8. Sign-In Page

The sign-in page should be redesigned to match the account center.

Required behavior:

- Preserve existing Google OAuth flow
- Preserve `return_to`
- Show clear destination when return_to exists

Suggested layout:

```text
Upcube Account

Sign in to continue
Use your Upcube Account to access News, Books, Jobs, Planet, Quantum, Robotics, University, Games, and Ethen.

[Continue with Google]

Returning to:
https://product.upcube.ai
```

Rules:

- Do not add additional OAuth providers unless implemented.
- Do not break `/api/auth/login/google`.
- Do not break `/api/auth/callback/google`.
- Do not break return-to validation.
- Do not store Google secrets in product apps.

---

## 9. Return-To Experience

When a product app sends the user to:

```text
https://account.upcube.ai/signin?return_to=<encoded product URL>
```

The account app should:

1. Validate the return URL against allowed origins.
2. Show the destination on the sign-in page.
3. Complete Google login.
4. Redirect the user back to the original product app.

Allowed production origins should include:

```text
https://upcube.ai
https://news.upcube.ai
https://books.upcube.ai
https://jobs.upcube.ai
https://planet.upcube.ai
https://quantum.upcube.ai
https://robotics.upcube.ai
https://university.upcube.ai
https://ethen.upcube.ai
https://games.upcube.ai
```

Local development origins may include:

```text
http://localhost:3000
http://localhost:3001
```

---

## Visual Style

### Dark Mode First

Use dark mode as the primary account experience.

Body background:

```css
background: #0f0f10;
color: #f4f4f5;
```

Cards:

```css
background: #1f2023;
border: 1px solid rgba(255, 255, 255, 0.1);
border-radius: 20px;
```

Sidebar:

```css
background: #151516;
border-right: 1px solid rgba(255, 255, 255, 0.08);
```

Buttons:

```css
primary: white background, black text
secondary: transparent/gray background, white text
danger: muted red, not overly bright
```

### Spacing

Use generous spacing:

```css
page padding: 24px desktop, 16px mobile
card padding: 20–24px
section gap: 20–32px
sidebar item height: 44–48px
```

### Typography

Preferred:

- Geist Sans, Inter, or system sans
- No decorative fonts
- Body: 14–16px
- Headings: 24–32px
- Muted labels: 13–14px

---

## Components to Build or Refactor

Recommended components:

```text
components/account/AccountShell.tsx
components/account/AccountSidebar.tsx
components/account/AccountTopBar.tsx
components/account/AccountCard.tsx
components/account/ProfileHero.tsx
components/account/AccountHealthCards.tsx
components/account/ConnectedAppsList.tsx
components/account/SecurityOverview.tsx
components/account/SessionPanel.tsx
components/account/ReturnToNotice.tsx
```

Recommended routes:

```text
/
 /profile
 /security
 /apps
 /privacy
 /billing
 /sessions
 /settings
 /signin
```

Keep existing API routes unchanged unless a bug is found.

---

## Implementation Constraints

Do not break:

```text
/api/auth/session
/api/auth/login/google
/api/auth/callback/google
/api/auth/logout
/signin?return_to=
```

Do not add product-app OAuth secrets.

Do not remove return-to validation.

Do not claim unavailable features are live.

Do not copy Google’s branding, icons, exact UI, or text.

---

## Acceptance Criteria

The redesign is complete when:

1. `account.upcube.ai` has a polished dark account-center UI.
2. Signed-out users see a premium sign-in page.
3. Signed-in users see a dashboard with profile, security, apps, privacy, billing, and sessions.
4. The sidebar and top bar work on desktop and mobile.
5. Google sign-in still works.
6. `return_to` still works after login.
7. Product app redirects are still allowed.
8. `games.upcube.ai` is added to allowed origins.
9. Production env uses `NEXT_PUBLIC_ACCOUNT_URL=https://account.upcube.ai`.
10. Build and type checks pass.

---

## Validation Commands

Run from:

```bash
cd /Users/sha/Documents/AI/account
```

Commands:

```bash
npm run build
npm run lint
npx tsc --noEmit
```

If a command is not configured, report it honestly instead of inventing success.

---

## Manual QA Checklist

Test these:

```text
https://account.upcube.ai
https://account.upcube.ai/signin
https://account.upcube.ai/signin?return_to=https%3A%2F%2Fnews.upcube.ai
https://account.upcube.ai/signin?return_to=https%3A%2F%2Fgames.upcube.ai
```

Confirm:

- Sign-in page loads
- Google login starts
- Return-to destination is displayed
- Login returns to product app
- Account dashboard loads after sign-in
- Sidebar navigation works
- Sign out works
- Mobile view does not break
- No Google branding is copied into the Upcube UI

---

## Implementation Prompt

```text
Cost/cache control: Keep this stable instruction block first and unchanged across jobs. Do not prepend changing repo status, timestamps, logs, screenshots, or summaries before it. Use targeted file reads only. Do not paste large file contents unless required. After initial repo inspection, summarize findings briefly instead of repeatedly sending raw logs. Make only scoped changes inside the connected local repo. Do not create commits, branches, PRs, zip files, copied bundles, downloadable artifacts, or GitHub-side automation. Treat the current repo code and tests as the implementation source of truth. If required facts are missing, report them as not provided instead of guessing.

Job name: Redesign Upcube Account into premium account center

Repo path: /Users/sha/Documents/AI/account

Goal:
Redesign the account app into a premium dark account-center experience for the Upcube ecosystem, inspired by modern account dashboard structure but fully original and Upcube-branded.

Reference direction:
Use the provided Google Account screenshots only as structural inspiration:
- left account navigation
- centered profile/dashboard content
- profile hero
- security sections
- connected apps sections
- privacy/settings sections
- stacked cards and calm spacing

Do not copy Google branding, icons, text, exact layout, or visual assets.

Required first repo actions:
1. Inspect package.json and framework setup.
2. Inspect existing routes under app/.
3. Inspect current auth files:
   - app/signin/page.tsx
   - app/signin/signin-content.tsx
   - app/api/auth/session/route.ts if present
   - app/api/auth/login/google/route.ts
   - app/api/auth/callback/google/route.ts
   - app/api/auth/logout/route.ts
   - lib/upcube-auth/*
   - lib/auth/*
4. Inspect current global CSS and layout files.
5. Identify what can be redesigned safely without breaking OAuth.

Implementation scope:
1. Build a dark account dashboard shell.
2. Add sidebar navigation:
   - Home
   - Profile
   - Security
   - Connected Apps
   - Privacy
   - Billing
   - Sessions
   - Settings
3. Add dashboard cards for profile, security, connected apps, privacy, billing, and sessions.
4. Redesign the sign-in page with:
   - Upcube Account branding
   - Continue with Google button
   - return_to destination display
5. Add games.upcube.ai to allowed return origins if not already present in env example/config docs.
6. Ensure production account URL remains https://account.upcube.ai.
7. Preserve existing OAuth routes and session behavior.
8. Preserve return_to validation and redirect behavior.
9. Make the UI responsive for mobile.

Explicit non-scope:
- Do not add new OAuth providers.
- Do not add billing provider logic.
- Do not add fake security claims.
- Do not add fake data export/delete functionality.
- Do not copy Google branding or Google UI assets.
- Do not move OAuth secrets into product apps.

Validation commands:
cd /Users/sha/Documents/AI/account
npm run build
npm run lint
npx tsc --noEmit

Manual checks to report:
1. /signin loads.
2. /signin?return_to=https%3A%2F%2Fnews.upcube.ai displays the return destination.
3. Google login button still points to the existing login route.
4. Return-to redirect still works.
5. Dashboard loads when signed in.
6. Sidebar pages render.
7. Mobile layout works.
8. No OAuth routes were broken.

Required final response:
- Summary
- Files changed
- Auth routes preserved
- Return-to behavior
- Validation commands and pass/fail results
- Manual QA results
- Any blockers
```
