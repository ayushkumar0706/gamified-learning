# DEVELOPMENT STATUS
> **Last Updated:** 2026-09-19
> **Source:** Verified by full codebase inspection. Only verified facts are recorded here.

---

## Project State

| Property | Value |
|---|---|
| **Overall State** | Active development — MVP core substantially built; Phase 2 features are UI stubs |
| **Deployment** | Frontend deployed to **Vercel** (`https://gamified-learning-green.vercel.app`); Backend deployed to **Render** |
| **Frontend Technology** | React 19 + Vite 8 + TailwindCSS 4 + react-router-dom v7 + Lucide Icons |
| **Backend Technology** | Node.js + Express 5 + Mongoose 9 |
| **Database** | MongoDB Atlas (connected via `MONGO_URI` env var) |
| **Authentication** | JWT stored in `httpOnly` cookies; `sameSite: none` in production |
| **AI Integration** | Google Gemini (`@google/generative-ai`) for AI-generated quiz questions |

---

## Completed Features

### Session: 2026-09-20 — Admin System & Messaging Integration
- [x] Built `AdminRoute`, `AdminLayout`, and `AdminSidebar` for secure Admin Shell access.
- [x] Added `GET /api/admin/stats` endpoint to provide real-time metrics for `AdminDashboard`.
- [x] Built `AdminJourney.jsx` allowing admins to view the career level structure.
- [x] Built `AdminTopics.jsx` allowing admins to manage learning topics and prerequisites.
- [x] Fixed Admin login routing: admins are now correctly routed to `/admin` and are exempt from the onboarding flow.
- [x] Built real-time/polling Messaging UI (`Messages.jsx`) and connected it to `GET /api/messages` and `POST /api/messages`.

### Session: 2026-09-20 — College Identity & Onboarding Fixes
- [x] Restructured Onboarding Flow: Users must register via `/register` (or `/login`), then authenticate, before being presented with the `/onboarding` flow.
- [x] Onboarding Component (`Onboarding.jsx`) now operates purely for authenticated users. The `StepAccount` was completely removed from the frontend component.
- [x] College search selection is strictly enforced. The "Add 'other' college" button was removed. Users must select a valid, existing `College` document from the database (debounced search via `GET /api/colleges?search=`). 
- [x] A UI placeholder alert was added for users who cannot find their college, advising them to contact support for the MVP.
- [x] `ProtectedRoute` logic accurately gates access. If `onboardingComplete` is `false`, any route other than `/onboarding` will aggressively redirect to `/onboarding`.
- [x] Topbar (`PublicNavbar.jsx`) and Landing Page CTAs were successfully updated to point to `/register` instead of `/onboarding`.
- [x] Backend Validation (`updateProfile`): When saving profile with `onboardingComplete: true`, the API enforces that a valid `user.college` exists and successfully queries the DB to confirm the selected `ObjectId` matches a real `College` record.

### Session: 2026-09-19 — Vision Audit Fixes
- [x] `GET /api/auth/me` now populates `college` with `name` and `city` fields — frontend receives college name without extra API call
- [x] `ProtectedRoute` gates app access: if `onboardingComplete === false`, redirects to `/onboarding` (prevents leaderboard 400 errors and broken college identity for unboarded users)
- [x] Fixed invalid Gemini model `gemini-3.6-flash` → `gemini-1.5-flash` in `generateQuestions.js` — AI quiz creation now functional in production
- [x] Sidebar: college name badge shown below user mini-profile (uses populated `user.college.name`)
- [x] Topbar: college name chip shown on md+ screens between page title and stats
- [x] Dashboard CTA banner is now fully dynamic — reads active level from `clearedLevelIds` and actual topic progress % instead of hardcoded text
- [x] `TopicList` at `/learn` now defaults to the user's active career level topics (first un-cleared level). Includes a level-switcher dropdown. Fixes the all-topics-unsorted issue.
- [x] XP formula raised: `correctCount * 20 + (scorePercentage >= 70 ? 50 : 0)` — a 10-question perfect quiz now gives 250 XP (was 100 XP)
- [x] Daily mission targets recalibrated: Daily Learner → 150 XP (was 50); Quiz Master reward → 50 XP; Level Up reward → 100 XP
- [x] Dashboard API now returns `recommendedTopics`: next 3 incomplete topics from the active career level, sorted by order
- [x] Dashboard UI: "What to Do Next" widget shows the 3 recommended topics as clickable cards

### Level Clearance System (previous)
- [x] `UserLevelProgress` model — user + level cleared pair, clearedAt, xpAwarded, badgeAwarded snapshot; unique index per user-level
- [x] `GET /api/levels/my-progress` — returns all levels the current user has officially cleared
- [x] `POST /api/levels/:id/clear` — server-side criteria check; awards xpReward, awards badge to user.badges, creates UserLevelProgress; returns celebration data
- [x] Clearance criteria evaluation: topic-completion (completed status count), quiz-pass (bestScorePercentage >=70 count), manual/challenge/project/problem-count auto-pass
- [x] Prerequisite check: requires previous level to be cleared before allowing clearance of next
- [x] Dashboard API now returns `clearedLevelIds` array and `collegeRank` in response
- [x] Journey page uses real cleared-level data; `getLevelStatus` is prerequisite-chain aware
- [x] Journey page shows `Clear Level` button only when all criteria met (client-side pre-check)
- [x] Celebration modal on level clearance: shows XP earned, badge unlocked, animated
- [x] Dashboard mini-map `activeIndex` now derived from `clearedLevelIds.length` (not hardcoded)
- [x] Dashboard stat card shows real college rank when user has a college

### Previously Completed

### Authentication
- [x] `POST /api/auth/register` with express-validator validation
- [x] `POST /api/auth/login` — bcrypt password comparison, JWT cookie
- [x] `POST /api/auth/logout` — clears cookie
- [x] `GET /api/auth/me` — returns authenticated user from cookie
- [x] `authMiddleware` — verifies JWT cookie, attaches `req.user`
- [x] `roleMiddleware` (restrictTo) — role-based access control
- [x] Frontend `AuthContext` — global auth state via `/auth/me`, login/logout methods
- [x] `ProtectedRoute` component — redirects unauthenticated users
- [x] Cookie options correct for local (`lax`) and production (`none`+`secure`)

### User & Profile
- [x] Full `User` model with: identity, college/academic info, XP/gamification fields, social links, privacy settings, onboarding flag
- [x] `GET /api/users/profile` — returns full profile with college populated
- [x] `PUT /api/users/profile` — updates: name, bio, careerGoal, branch, year, social links, visibility, photo
- [x] `POST /api/users/request-senior` — promotes to `senior` if >=10 completed topics and account >=365 days
- [x] `POST /api/users/update-role` — admin-only
- [x] Profile page (UI) — fetches real data, edit modal, XP/streak/level/badges/social links display
- [x] Settings page (UI) — profile visibility saves via real API; password change form UI only

### College
- [x] `College` model — name, city, state, domain, logo, isVerified
- [x] `GET /api/colleges?search=` — regex search, public (no auth)
- [x] `GET /api/colleges/:id`
- [x] `POST /api/colleges` (admin only)
- [x] `PATCH /api/colleges/:id` (admin only)
- [x] Text index on name/city/state

### Career Journey Levels
- [x] `Level` model — name, order, icon, color, xpRequired, xpReward, badgeUnlocked, clearanceCriteria[], prerequisiteLevel
- [x] All 7 levels seeded via `seed-levels.js`: Basic > DSA > First Project > Resume > Interview Prep > Job Apply > Placement
- [x] CRUD endpoints for levels (admin-protected)
- [x] Journey page (UI) — real levels + progress + topics; vertical roadmap; expandable level cards with criteria

### Topics
- [x] `Topic` model — level ref, title, subject, description, order, prerequisiteTopic
- [x] CRUD endpoints (`GET /api/topics?level=`, `GET /api/topics/:id`, POST, PATCH, DELETE)
- [x] TopicList page (UI) — fetches and displays topics
- [x] TopicDetail page (UI) — video resources, coding resources, quiz link, progress status

### Progress Tracking
- [x] `Progress` model — user+topic unique pair, status (not-started/in-progress/completed), bestScorePercentage, completedAt
- [x] `GET /api/progress/me` — all user topic progress
- [x] Progress auto-updated on quiz submission (>=70% score marks topic as completed)

### Quizzes (AI-Generated)
- [x] `Quiz` model — topic, difficultyLevel, source
- [x] `Question` model — quiz ref, questionText, options[], correctAnswerIndex, explanation
- [x] `POST /api/quizzes` (admin/senior) — Gemini generates MCQ questions
- [x] `GET /api/quizzes/:id` — quiz + questions (no answers exposed)
- [x] `GET /api/quizzes?topic=` — list quizzes for topic
- [x] TakeQuiz page (UI) — full quiz experience, submits attempt

### Attempt Submission & XP
- [x] `Attempt` model — user, quiz, scorePercentage, xpAwarded, timeTakenSeconds, answers[]
- [x] `POST /api/attempts/submit` — grades server-side, awards XP, updates level, updates streak, upserts progress
- [x] `POST /api/attempts/check-answer` — single answer check
- [x] XP formula: correctCount * 10 per submission
- [x] IST-aware streak: increments if last activity yesterday, resets if >1 day gap
- [x] XP to platform level: progressive (level N requires N*100 XP)

### Gamification
- [x] XP system (awarded on quiz submission)
- [x] Platform level derived from XP via `calculateLevel` utility
- [x] Current streak and max streak tracked on User model
- [x] Badge schema on User model (storage ready; automatic award logic not yet wired)
- [x] Dashboard API: xp, level, xpToNextLevel, streak, maxStreak, progressSummary, recentAttempts

### Dashboard
- [x] `GET /api/dashboard/me` — gamification summary + progress + recent attempts
- [x] Dashboard page (UI) — greeting, streak message, XP bar, stat cards, journey mini-map, progress overview, recent attempts, CTA banner, quick actions

### Leaderboard
- [x] `GET /api/leaderboard?filter=overall|streak&limit=N` — college-scoped, privacy-filtered
- [x] Current-user entry appended with real rank if outside top-N
- [x] Leaderboard page (UI) — filter tabs (Overall/Streak), sticky current-user row

### Video Resources
- [x] `VideoResource` model — topic, title, url, styleTag, difficulty, upvotes, upvotedBy[], submittedBy, status
- [x] Full CRUD + upvote endpoints
- [x] Displayed in TopicDetail

### Coding Resources
- [x] `CodingResource` model — topic, title, url, platform, difficulty, submittedBy, status
- [x] Full CRUD endpoints
- [x] Displayed in TopicDetail

### Layout & Navigation
- [x] `AppLayout` — authenticated shell (Sidebar + Topbar + content)
- [x] `Sidebar` — all nav routes, user mini-profile, logout
- [x] `Topbar` — streak pill, XP pill, dark mode toggle, notification bell (static), avatar
- [x] `MobileNav` — mobile bottom navigation
- [x] Dark mode toggle (localStorage + `.dark` class on `<html>`)
- [x] `PublicNavbar` — landing page navigation

### Public Landing Page
- [x] Full landing page: hero, mock dashboard card, 7-level career journey visual, features grid, leaderboard demo, social section, gamification section, career readiness section, final CTA

### Onboarding
- [x] 5-step flow: college search -> prep level -> career goal -> account creation
- [x] Real college search via API (debounced 400ms)
- [x] Saves college, year, branch, careerGoal, currentPreparationLevel, onboardingComplete
- [x] Redirects to /dashboard after completion

### Design System
- [x] Full CSS design system in `index.css` — Tailwind v4 `@theme`, color tokens (light + dark), component classes (card, btn, badge, stat-card, sidebar, xp-bar, skeleton, etc.)
- [x] Indigo/Violet/Emerald/Amber palette throughout

### Seniors Directory
- [x] Backend `GET /api/seniors` — fetches users with `role: 'senior'` scoped to college
- [x] Connected Seniors UI to real backend API; added loading state
- [x] Profile mapping handles dynamic search and filtering

### Community Feed
- [x] `Post` model with embedded replies and `college` scoping
- [x] `POST /api/community/posts` (Create post)
- [x] `GET /api/community/posts` (Fetch posts)
- [x] `POST /api/community/posts/:id/reply` (Add reply)
- [x] `POST /api/community/posts/:id/upvote` (Toggle upvote)
- [x] Community UI fully connected to real API with loading state

### Settings & Security
- [x] Password Change Endpoint: `PUT /api/auth/change-password`
- [x] Settings form connected to backend.

### Leaderboard Period Filter
- [x] Introduced `XPLog` model to track when XP is earned.
- [x] Refactored `/api/leaderboard` to support `weekly` and `monthly` queries via MongoDB Aggregation pipelines.
- [x] Updated Leaderboard UI to toggle between All-time, Weekly, and Monthly.

### Jobs & Placements
- [x] `Job` model created.
- [x] Mock jobs seeded to database.
- [x] Match score dynamically calculated for students based on level and career goal.
- [x] UI connected to `/api/jobs` and `POST /api/jobs/:id/referral`.

### Daily Missions
- [x] Created `MissionClaim` model to track rewards.
- [x] Built `/api/missions` endpoint that dynamically aggregates daily progress using `XPLog`.
- [x] Added dynamic "Today's Missions" widget to the Dashboard UI.

### Automated Badge Awards
- [x] Created `POST /api/users/badges/sync` to check and award badges.
- [x] `Achievements.jsx` and `Profile.jsx` now rely on DB badges as source of truth.
- [x] XP correctly awarded to `user.xp` and `XPLog` when a badge is claimed.

---

## Partially Completed Features

### Badges
- User model has `badges[]` array and storage.
- **Issue:** No automatic badge award logic. Profile page renders `DEFAULT_BADGES` (hardcoded static array), NOT real `user.badges`.

### Jobs Page
- Full UI (job listings, filter, match-score display, apply modal).
- Now connected to real backend!

### Achievements Page
- Full badge display UI.
- Now dynamically syncs and awards badges via backend API.

### Notifications Bell
- Icon in Topbar with red dot indicator.
- **Issue:** No backend, no real notification data.

### Messages
- Full UI with conversation list and chat window.
- Connected to real backend (`/api/messages`).

---

## Not Yet Implemented

From `PROJECT_BRIEF.md`, these features do not exist in any form:

1. **Placement tracking**
2. **Public leaderboard** (landing page shows mock)
3. **College analytics**

---

## Known Issues

| # | Issue | Location | Severity |
|---|---|---|---|
| 3 | Gemini model string `gemini-3.6-flash` — verify correct model name | `generateQuestions.js:28` | Medium |
| 12 | No college rank in dashboard API response | `dashboardController.js` | Medium |
| 14 | `createTopic` has typo `desciription` | `topicController.js:7` | Low |

---

## Existing API / Backend

### Environment Variables Required (keys only — never put values here)

| Variable | Purpose |
|---|---|
| `PORT` | Server port |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `GEMINI_API_KEY` | Google Gemini API key |
| `NODE_ENV` | Set to `production` for secure cookies |
| `RENDER` | Set to `true` when hosted on Render |

### CORS Whitelist
- `http://localhost:5173`
- `http://localhost:5174`
- `https://gamified-learning-green.vercel.app`

### API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register user |
| POST | `/api/auth/login` | Public | Login user |
| POST | `/api/auth/logout` | Required | Logout user |
| PUT | `/api/auth/change-password` | Required | Update password |
| GET | `/api/auth/me` | Required | Current user |
| GET | `/api/users/profile` | Required | Own profile |
| PUT | `/api/users/profile` | Required | Update profile |
| POST | `/api/users/request-senior` | Required | Request senior role |
| POST | `/api/users/update-role` | Admin | Admin role change |
| GET | `/api/colleges` | None | Search colleges |
| GET | `/api/colleges/:id` | None | Get college |
| POST | `/api/colleges` | Admin | Create college |
| PATCH | `/api/colleges/:id` | Admin | Update college |
| GET | `/api/levels` | Required | All levels |
| GET | `/api/levels/:id` | Required | Single level |
| POST | `/api/levels` | Admin | Create level |
| PATCH | `/api/levels/:id` | Admin | Update level |
| DELETE | `/api/levels/:id` | Admin | Delete level |
| GET | `/api/seniors` | Required | List seniors |
| GET | `/api/topics` | Required | List topics (?level=) |
| GET | `/api/topics/:id` | Required | Get topic |
| POST | `/api/topics` | Admin | Create topic |
| PATCH | `/api/topics/:id` | Admin | Update topic |
| DELETE | `/api/topics/:id` | Admin | Delete topic |
| GET | `/api/progress/me` | Required | Own progress |
| GET | `/api/dashboard/me` | Required | Dashboard summary |
| GET | `/api/leaderboard` | Required | College leaderboard |
| POST | `/api/quizzes` | Admin/Senior | Create AI quiz |
| GET | `/api/quizzes/:id` | Required | Take quiz |
| GET | `/api/quizzes?topic=` | Required | List quizzes |
| POST | `/api/attempts/submit` | Required | Submit quiz attempt |
| POST | `/api/attempts/check-answer` | Required | Check single answer |
| GET | `/api/videoresources` | Required | List videos |
| POST | `/api/videoresources` | Required | Submit video |
| POST | `/api/videoresources/:id/upvote` | Required | Upvote video |
| PUT | `/api/videoresources/:id` | Owner/Admin | Update video |
| DELETE | `/api/videoresources/:id` | Owner/Admin | Delete video |
| GET | `/api/coding-resources` | Required | List coding problems |
| POST | `/api/coding-resources` | Required | Submit problem |
| PUT | `/api/coding-resources/:id` | Owner/Admin | Update problem |
| DELETE | `/api/coding-resources/:id` | Owner/Admin | Delete problem |

---

## Existing Frontend

### Pages (18 files)

| Page | File | Data Source | Status |
|---|---|---|---|
| Landing | `LandingPage.jsx` | Static/mock | Complete |
| Login | `Login.jsx` | Real API | Complete |
| Register | `Register.jsx` | Real API | Complete |
| Onboarding | `Onboarding.jsx` | Real API | Complete |
| Dashboard | `Dashboard.jsx` | Real API | Complete (minor issues) |
| Journey | `Journey.jsx` | Real API | Complete (clearance stub) |
| TopicList | `TopicList.jsx` | Real API | Complete |
| TopicDetail | `TopicDetail.jsx` | Real API | Complete |
| TakeQuiz | `TakeQuiz.jsx` | Real API | Complete |
| LevelList | `LevelList.jsx` | Real API | Complete |
| Leaderboard | `Leaderboard.jsx` | Real API | Complete |
| Profile | `Profile.jsx` | Real API + static | Partial |
| Achievements | `Achievements.jsx` | Real API | Complete |
| Seniors | `Seniors.jsx` | Real API | Complete |
| Community | `Community.jsx` | Real API | Complete |
| Jobs | `Jobs.jsx` | Real API | Complete |
| Settings | `Settings.jsx` | Real API | Complete |
| Messages | `Messages.jsx` | Real API | Complete |

### Components
- `context/AuthContext.jsx` — global auth state
- `components/ProtectedRoute.jsx` — auth guard
- `components/PublicNavbar.jsx` — marketing nav
- `components/layout/AppLayout.jsx` — app shell
- `components/layout/Sidebar.jsx` — desktop sidebar
- `components/layout/Topbar.jsx` — topbar
- `components/layout/MobileNav.jsx` — mobile nav
- `services/api.js` — fetch wrapper (reads `VITE_BASE_URL`)

### Routes
- Public: `/`, `/login`, `/register`, `/onboarding`
- Protected: `/dashboard`, `/journey`, `/learn`, `/levels`, `/levels/:levelId/topics`, `/topics`, `/topics/:id`, `/quizzes/:id/take`, `/leaderboard`, `/achievements`, `/profile`, `/seniors`, `/community`, `/jobs`, `/settings`, `/messages`

---

## Deployment

### Frontend — Vercel
- Build: `vite build` / `npm run build`
- Required env var: `VITE_BASE_URL` = backend base URL

### Backend — Render
- Start: `node index.js`
- Required env vars: `PORT`, `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `NODE_ENV=production`, `RENDER=true`

---

## Important Architecture Decisions

1. **JWT in httpOnly cookies** — No localStorage token. Cookie auto-adapts (local: lax, production: none+secure via `isProduction` flag).
2. **MongoDB Atlas** — Cloud-hosted. Retry logic (5 attempts, 3s delay) in `connectDB`.
3. **TailwindCSS v4** — New `@theme` directive; CSS variables as primary styling mechanism.
4. **React 19 + Vite 8** — Latest; all functional components with hooks.
5. **Gemini AI for quizzes** — On-demand generation; no pre-stored question banks.
6. **Progress >=70% = completed** — Set in `attemptController.js:113`.
7. **College-scoped leaderboard** — Users only see own-college peers; filtered by `profileVisibility`.
8. **Senior eligibility** — `role=senior` requires >=10 completed topics AND account >=365 days old.
9. **Monorepo** — `Backend/` and `frontend/` are siblings under `Gamified/`. No shared package.json.
10. **IST streak** — Uses UTC+5:30 offset to define calendar day boundary for streaks.
11. **Express 5** — Breaking changes from v4 (async error handling). Do not downgrade.

---

### Lower Priority — Phase 3+
9. Direct messaging (Completed)
10. Admin content management (Completed)
11. AI mentor / personalized recommendations

---

## Development Rules

> All future development agents MUST follow these rules.

1. **Read this file first** before implementing anything.
2. **Do NOT rebuild** working functionality.
3. **Inspect relevant files** before creating new ones.
4. **Preserve production** — do not change cookie settings, CORS config, deployment config, or auth architecture without careful review.
5. **No secrets in code** — never hardcode API keys, JWT secrets, or DB credentials.
6. **No destructive DB operations** — no dropping collections or resetting user data.
7. **Reuse existing patterns** — use `api.js` for all frontend API calls; follow existing CSS class conventions.
8. **Update this file** after each completed task — only with verified, actually implemented changes.
9. **Follow the brief** — `PROJECT_BRIEF.md` is the product/UX/design source of truth.
10. **Feature priority** — Phase 1 (core loop) > Phase 2 (community/seniors) > Phase 3 (jobs) > Phase 4 (AI).
11. **Mock data is intentional** for Phase 2+ features — do not replace unless building the real backend for that feature.
12. **Cookie handling is production-critical** — the `isProduction` flag in `authController.js` must not change without understanding deployment impact.

