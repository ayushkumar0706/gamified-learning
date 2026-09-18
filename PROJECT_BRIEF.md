# PROJECT BRIEF â€” GAMIFIED COLLEGE LEARNING & PLACEMENT PLATFORM

I am building a modern web application for college students that combines learning, gamification, competition, community, senior guidance, and placement preparation.

The core idea is:

> **Learn together. Compete with your college. Build your career. Get placed.**

This should NOT feel like a traditional LMS or boring educational website. It should feel like a combination of:

* Duolingo â†’ gamification, streaks, progression
* LeetCode â†’ coding competition, rankings, achievements
* roadmap.sh â†’ structured learning roadmap
* Peerlist â†’ developer/student identity and profiles
* LinkedIn â†’ professional/career ecosystem
* Discord â†’ community and communication

Do NOT copy their UI directly. Use them only as UX/product inspiration.

---

# 1. CORE PRODUCT IDEA

Students register and select their college.

Once they select their college, they become part of their college's learning ecosystem.

The platform should allow students to:

* Learn step-by-step
* Follow a structured career roadmap
* Complete levels
* Earn XP
* Maintain daily streaks
* Earn badges
* Take quizzes and assessments
* Complete challenges
* See their rank within their college
* Compare progress with peers
* Find and learn from seniors
* Chat with seniors and other students
* Ask questions
* Track their placement preparation
* Discover relevant jobs
* Eventually track applications and placement progress

The key differentiator is:

> **This is not just an online learning platform. It is a college-based career-growth and learning community.**

---

# 2. CORE LEARNING JOURNEY

The entire career journey should be divided into 7 major levels:

1. BASIC
2. DSA
3. FIRST PROJECT
4. RESUME
5. INTERVIEW PREPARATION
6. JOB APPLY
7. PLACEMENT

The user should always know:

* Where they currently are
* What they have completed
* What they need to do next
* How much XP they have
* What is required to unlock the next level

Example:

BASIC âœ“
â†“
DSA âœ“
â†“
FIRST PROJECT â†’ CURRENT
â†“
RESUME ðŸ”’
â†“
INTERVIEW ðŸ”’
â†“
JOB APPLY ðŸ”’
â†“
PLACEMENT ðŸ”’

---

# 3. LEVEL CLEARANCE SYSTEM

Levels should not simply say "course completed."

Each level should have explicit clearance criteria.

For example:

DSA LEVEL

* Complete required lessons
* Solve a certain number of problems
* Complete topic quizzes
* Complete challenge problems
* Pass final assessment

Example UI:

DSA

Progress: 87%

â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–‘â–‘

Requirements:

âœ“ Complete Arrays
âœ“ Complete Strings
âœ“ Complete Linked Lists
âœ“ Solve 25 problems
âœ“ Pass topic quizzes
â—‹ Final Challenge

[ TAKE FINAL CHALLENGE ]

After successful completion:

ðŸŽ‰ LEVEL CLEARED!

+500 XP

Unlocked:

ðŸ”“ FIRST PROJECT
ðŸ… DSA WARRIOR BADGE

The level-clearance system should make progression feel meaningful.

---

# 4. GAMIFICATION SYSTEM

The application should heavily but intelligently use gamification.

Important elements:

### XP

Users earn XP from:

* Completing lessons
* Solving problems
* Passing quizzes
* Completing challenges
* Completing projects
* Maintaining streaks
* Helping other students
* Participating in the community

### Levels

XP should contribute to the user's overall platform level.

Example:

Level 7

740 / 1000 XP

â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–‘â–‘

### Streaks

Example:

ðŸ”¥ 12 Day Streak

Daily learning activity should maintain the streak.

### Badges

Examples:

ðŸ§  DSA Warrior
ðŸš€ First Project
ðŸ”¥ 7 Day Streak
ðŸ”¥ 30 Day Streak
ðŸ† Top 10 College
ðŸŽ¯ Placement Ready
ðŸ’» Problem Solver
ðŸ¤ Community Helper

Badges should feel visually rewarding.

### Leaderboard

Users should be ranked within their college.

Example:

COLLEGE LEADERBOARD

Rank | Student | Level | XP

ðŸ¥‡ Rahul | 14 | 4250 XP
ðŸ¥ˆ Priya | 13 | 4100 XP
ðŸ¥‰ Aman | 12 | 3920 XP
14 | Ayush | 7 | 1740 XP

Also provide filters such as:

* Overall
* This Week
* This Month
* All Time
* DSA
* Projects
* Streak
* Placement Ready

Avoid making competition toxic. The leaderboard should motivate rather than shame users.

---

# 5. PUBLIC WEBSITE / BEFORE LOGIN

A visitor who is not logged in should NOT immediately see a login form.

The landing page should explain the product in approximately 5â€“10 seconds.

The public navigation can be:

LOGO

How It Works
Features
Colleges
Leaderboard

Login
[ JOIN YOUR COLLEGE ]

---

# 6. LANDING PAGE STRUCTURE

## Hero Section

Main headline:

> YOUR COLLEGE.
> YOUR JOURNEY.
> YOUR PLACEMENT.

Supporting text:

> Learn together. Compete with your peers. Get guidance from seniors. Build your career â€” one level at a time.

Primary CTA:

[ ðŸš€ START YOUR JOURNEY ]

Secondary CTA:

[ LOGIN ]

The right side of the hero should contain a beautiful mock dashboard showing:

* User name
* Level
* XP
* Streak
* College rank
* Progress

Do NOT use generic stock photos as the main visual.

Instead, use the actual product UI as the hero visual.

---

# 7. LANDING PAGE SECTIONS

After the hero, include:

## Section 1 â€” Your Career Journey

Show the seven levels visually:

BASIC
â†“
DSA
â†“
FIRST PROJECT
â†“
RESUME
â†“
INTERVIEW
â†“
JOB APPLY
â†“
PLACEMENT

Make it look like a game/progression map.

---

## Section 2 â€” Learn With Your College

Show a college leaderboard preview.

Example:

YOUR COLLEGE

ðŸ¥‡ Rahul â€” 2450 XP
ðŸ¥ˆ Priya â€” 2310 XP
ðŸ¥‰ Arjun â€” 2180 XP
14. Ayush â€” 1740 XP

Message:

> See where you stand. Learn from the best. Grow together.

---

## Section 3 â€” Never Prepare Alone

Explain the social ecosystem:

Seniors
â†“
Guidance

Peers
â†“
Competition

Community
â†“
Collaboration

Show a realistic chat preview from a senior helping a junior.

---

## Section 4 â€” Gamified Learning

Show:

ðŸ”¥ Streaks
âš¡ XP
ðŸ† Leaderboards
ðŸ… Badges
ðŸŽ¯ Challenges
â¬†ï¸ Level Ups

---

## Section 5 â€” Career & Placement

Explain that the platform eventually connects learning progress to job readiness.

For example:

Completed DSA
âœ“

Completed React
âœ“

Completed Project
âœ“

Resume Ready
âœ“

Interview Ready
â—‹

Job Ready
â—‹

---

## Final CTA

Headline:

> YOUR PLACEMENT JOURNEY STARTS HERE.

CTA:

[ JOIN YOUR COLLEGE â†’ ]

---

# 8. REGISTRATION / ONBOARDING FLOW

Do NOT make registration a huge boring form.

Use a short onboarding process.

### Step 1

Where do you study?

[ Search your college... ]

### Step 2

Choose your college.

Example:

ðŸ« College A
ðŸ« College B
ðŸ« College C

### Step 3

What is your current preparation level?

* Just starting
* Learning DSA
* Building projects
* Preparing for placements
* Already applying

### Step 4

What are you preparing for?

* Software Development
* DSA
* Web Development
* Placements
* Interviews

### Step 5

Create account.

Basic information:

* Name
* Email
* Password
* College
* Year
* Branch

Optional later:

* GitHub
* LinkedIn
* LeetCode
* Codeforces

After onboarding â†’ send the user directly to their personalized DASHBOARD.

---

# 9. AFTER LOGIN â€” MAIN APPLICATION

The logged-in application should feel different from the marketing website.

Use a persistent sidebar on desktop.

Sidebar:

LOGO

ðŸ  Dashboard
ðŸŽ¯ My Journey
ðŸ“š Learn
ðŸ† Leaderboard
ðŸ‘¥ Community
ðŸŽ“ Seniors
ðŸ’¬ Messages
ðŸ’¼ Jobs
ðŸ… Achievements
ðŸ‘¤ Profile
âš™ Settings

Top-right area:

ðŸ”¥ Streak
âš¡ XP
ðŸ† College Rank
ðŸ‘¤ Profile

---

# 10. DASHBOARD

The dashboard is the most important logged-in page.

It should answer:

> "What should I do today—

Do not make it a collection of meaningless statistics.

Top:

> Good evening, [Name] ðŸ‘‹

> You're on a 12 day streak.

[ CONTINUE LEARNING ]

Then show:

## My Journey

Basic âœ“
DSA 80%
First Project ðŸ”’
Resume ðŸ”’
Interview ðŸ”’
Job Apply ðŸ”’
Placement ðŸ”’

---

## Today's Mission

Example:

âœ“ Solve 3 Array Problems +60 XP
â—‹ Complete Binary Search +80 XP
â—‹ Read one DSA lesson +30 XP

[ START MISSION ]

---

## College Ranking

Show current college rank.

Example:

ðŸ† YOUR COLLEGE

#14 You

â†‘ 3 positions this week

[ VIEW LEADERBOARD ]

---

## Recommended For You

Personalized recommendations based on current level.

For example:

Because you are learning DSA:

* Arrays
* Binary Search
* Two Pointers

---

# 11. MY JOURNEY PAGE

This should be one of the most visually impressive pages.

Make it feel like a game map / career roadmap.

Example:

ðŸŽ“ PLACEMENT READY ðŸ”’
â”‚
ðŸ’¼ JOB APPLY ðŸ”’
â”‚
ðŸŽ¤ INTERVIEW ðŸ”’
â”‚
ðŸ“„ RESUME ðŸ”’
â”‚
ðŸš€ FIRST PROJECT ðŸ”’
â”‚
ðŸ§  DSA âœ“
â”‚
ðŸŒ± BASIC âœ“

Each level should be clickable.

When clicked, show:

* Description
* Progress
* Topics
* Tasks
* XP
* Requirements
* Badges
* Clearance criteria

---

# 12. LEARNING PAGE

The learning system should follow:

LEARN â†’ PRACTICE â†’ QUIZ â†’ CHALLENGE â†’ CLEAR LEVEL

Topics can contain:

* Video/resources
* Explanation
* Examples
* Practice problems
* Quiz
* Challenge

Avoid making the page look like a traditional LMS.

Make progress highly visible.

---

# 13. LEADERBOARD PAGE

Create a dedicated leaderboard.

Tabs:

This Week
This Month
All Time

Categories:

Overall
DSA
Projects
Streak
Placement Ready

Show the current user prominently even if they are far down the list.

Example:

14 | YOU | Level 7 | 1740 XP

Also show movement:

â†‘ 3 positions

This creates motivation.

---

# 14. COMMUNITY PAGE

Community should feel like a college developer community.

Sections:

ðŸ”¥ Trending
ðŸ’¬ Discussions
ðŸ‘¨ðŸŽ“ Seniors
ðŸ’¡ Questions

Example post:

Rahul Â· 3rd Year Â· Senior

"How I prepared for my software placement in 45 days"

â¤ï¸ 42
ðŸ’¬ 18

Allow users to:

* Ask questions
* Create posts
* Reply
* Like/react
* Follow useful discussions
* Search topics

---

# 15. SENIOR DIRECTORY

Create a dedicated "Find a Senior" feature.

Example:

FIND A SENIOR

Search:
[ DSA / React / TCS / SDE ]

Profile card:

Rahul Sharma
4th Year Â· CSE

DSA â€¢ React â€¢ Placement

ðŸ† Level 18

[ VIEW PROFILE ]
[ MESSAGE ]

Students should be able to discover high-performing seniors who voluntarily make their profiles available.

---

# 16. CHAT / MESSAGING

Allow students to chat with:

* Seniors
* Peers
* Friends
* Community members

The goal is mentorship and preparation guidance.

Keep it professional and safe.

Consider:

* Report/block
* Privacy controls
* Message requests
* Online/offline status
* Conversation search

---

# 17. STUDENT PROFILE

The profile should feel like a developer/career identity.

Example:

AYUSH KUMAR

B.Tech IT Â· 3rd Year

Level 7
ðŸ”¥ 12 Day Streak
ðŸ† College Rank #14

Progress:

DSA â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–‘â–‘
Projects â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–‘â–‘â–‘
Resume â–ˆâ–ˆâ–ˆâ–ˆâ–‘â–‘â–‘â–‘

Achievements:

ðŸ§  DSA Warrior
ðŸš€ Builder
ðŸ”¥ 30 Day Streak

Optionally show:

GitHub
LinkedIn
LeetCode
Codeforces

The profile should communicate:

> "This is what I have achieved."

not merely:

> "This is my account."

---

# 18. JOBS PAGE

Eventually connect learning progress to job recommendations.

Example:

SOFTWARE DEVELOPER INTERN

Match: 87%

Because you completed:

âœ“ DSA
âœ“ React
âœ“ Git
âœ“ First Project

[ VIEW JOB ]

The long-term goal is to make job readiness connected to actual learning progress.

---

# 19. PRIVACY

The platform should NOT expose everyone's private information just because they belong to the same college.

Student profiles should be opt-in/public according to user settings.

Students should control:

* Profile visibility
* Academic information visibility
* Contact information
* Social links
* Messaging permissions

---

# 20. DESIGN LANGUAGE

The design should be:

Modern
Clean
Developer-focused
Gamified
Professional
Social
Minimal but engaging

Avoid:

* Generic education website design
* Excessive blue
* Too many gradients
* Excessive shadows
* Huge stock photography
* Too many colors
* Cluttered dashboards
* Excessive animations

The product should feel like a serious startup/product, not a college project.

---

# 21. COLOR PALETTE

Recommended palette:

Background:
#F8FAFC

Main Text:
#0F172A

Primary:
#6366F1

Primary Dark:
#4F46E5

Secondary:
#8B5CF6

Success:
#10B981

XP / Reward:
#F59E0B

Danger:
#EF4444

Card:
#FFFFFF

Border:
#E2E8F0

Muted Text:
#64748B

The main visual identity should be:

INDIGO + VIOLET + EMERALD + AMBER

Do NOT use every color everywhere.

Use:

Indigo/Violet â†’ actions and progression
Emerald â†’ completion/success
Amber â†’ XP/rewards
Red â†’ errors/warnings

---

# 22. DARK MODE

Support dark mode.

Recommended dark colors:

Background:
#0B1120

Cards:
#111827

Text:
#F8FAFC

Muted:
#94A3B8

Primary:
#6366F1

Use dark navy rather than pure black.

---

# 23. TYPOGRAPHY

Primary font:

Inter

Alternative:

Plus Jakarta Sans
or
Manrope

Code/technical text:

JetBrains Mono

Typography should be clean and modern.

---

# 24. ICONS

Use one consistent icon library.

Recommended:

Lucide Icons

Do not mix multiple unrelated icon libraries.

Custom illustrations can be used for:

* Badges
* Achievements
* Level completion
* Special rewards

---

# 25. ANIMATIONS

Use subtle meaningful animations.

Examples:

XP gain:

+50 XP â†‘

Streak animation:

ðŸ”¥ 12

Badge unlock:

Badge scales/fades in

Level completion:

Progress bar reaches 100% â†’ celebration

Leaderboard:

#17 â†’ #14 â†‘

Avoid excessive animations that hurt performance or usability.

---

# 26. RESPONSIVE DESIGN

The application must work on:

* Desktop
* Laptop
* Tablet
* Mobile

On mobile, replace the desktop sidebar with:

* Bottom navigation
  or
* Hamburger navigation

The dashboard should remain usable on small screens.

---

# 27. PRODUCT INFORMATION ARCHITECTURE

PUBLIC:

Home
How It Works
Features
Colleges
Public Leaderboard Preview
Login
Register

â†“

ONBOARDING

College
Year
Branch
Current Level
Career Goal

â†“

AUTHENTICATED APP:

Dashboard
My Journey
Learn
Leaderboard
Community
Seniors
Messages
Jobs
Achievements
Profile
Settings

---

# 28. DEVELOPMENT PRIORITY

Do NOT try to build every feature simultaneously.

Build the MVP first.

## Phase 1 â€” MVP

Authentication
â†“
College selection
â†“
Dashboard
â†“
7-level journey
â†“
Learning content
â†“
XP
â†“
Streak
â†“
College leaderboard
â†“
Badges
â†“
Student profile

## Phase 2

Community
Senior profiles
Chat
Messaging

## Phase 3

Jobs
Applications
Placement tracking
College analytics

## Phase 4

AI mentor
Personalized roadmap
AI interview preparation
AI resume feedback
Personalized recommendations

---

# 29. MOST IMPORTANT UX PRINCIPLE

Every screen should answer one of these questions:

### Dashboard

"What should I do today—

### My Journey

"Where am I in my career journey—

### Learning

"What should I learn—

### Level

"What do I need to complete—

### Leaderboard

"Where do I stand—

### Community

"Who can help me—

### Senior Directory

"Who has already achieved what I want—

### Jobs

"Am I ready for this opportunity—

### Profile

"What have I achieved—

---

# 30. DESIGN INSPIRATION

Study these products for specific ideas:

Duolingo
â†’ gamification, streaks, learning progression

roadmap.sh
â†’ career roadmaps and structured learning

LeetCode
â†’ competition, rankings, coding identity

Peerlist
â†’ developer profiles and professional identity

LinkedIn
â†’ professional networking

Discord
â†’ community/chat

GitHub
â†’ developer credibility

Mobbin
â†’ real-world UI/UX research

Dribbble
â†’ visual design inspiration

IMPORTANT:

Do not copy these products.

Study the UX patterns and create a unique visual identity for this college-focused platform.

---

# 31. CORE PRODUCT FEELING

The user should open the application and immediately think:

> "I know where I am."

Then:

> "I know what I need to do next."

Then:

> "I can see how I'm performing compared to my college."

Then:

> "I can ask someone who is ahead of me for help."

And finally:

> "If I keep progressing here, I will become placement-ready."

The emotional loop should be:

LEARN
â†“
COMPLETE
â†“
EARN XP
â†“
LEVEL UP
â†“
SEE RANK
â†“
GET MOTIVATED
â†“
LEARN MORE
â†“
HELP / CONNECT
â†“
BECOME PLACEMENT READY

---

# 32. IMPORTANT DESIGN DIRECTION

The most unique screen of the entire application should be:

## "MY CAREER JOURNEY"

It should visually communicate the student's complete path:

ðŸŒ± BASIC
â†“
ðŸ§  DSA
â†“
ðŸš€ PROJECT
â†“
ðŸ“„ RESUME
â†“
ðŸŽ¤ INTERVIEW
â†“
ðŸ’¼ JOB APPLY
â†“
ðŸŽ“ PLACEMENT

This should become the visual identity of the product.

The application should feel like a **career game**, where the real reward is becoming genuinely skilled and placement-ready.

---

# FINAL REQUEST TO THE AI

Using this complete product brief, help me design/build the application.

When suggesting UI:

1. Keep the design consistent across all pages.
2. Follow the color palette above.
3. Prioritize usability over decoration.
4. Make gamification visually satisfying but professional.
5. Make the "My Career Journey" the central product concept.
6. Keep public pages and authenticated application pages visually distinct.
7. Make the dashboard action-oriented.
8. Make the application feel like a real modern startup product.
9. Avoid generic LMS design.
10. Think about scalability and maintainability while designing the UI and component structure.

If generating code, prefer a clean component-based architecture and reusable components rather than putting everything into one huge component.

If proposing additional features, prioritize features that strengthen the core loop:

LEARN â†’ COMPETE â†’ CONNECT â†’ PROGRESS â†’ GET PLACED

Do not add features simply for the sake of making the application bigger.


You are now the primary development agent for my existing Gamified College Learning & Placement Platform.

IMPORTANT: The project is ALREADY BUILT to its current state and has been DEPLOYED. We are now continuing development from the existing implementation. Do NOT rebuild the project from scratch.

First, read and understand the complete `PROJECT_BRIEF.md` file. Treat it as the master product, UX, design, architecture, and development specification.

Then inspect the existing project carefully, including the frontend and backend, to understand what has already been implemented.

Do NOT modify application code yet.

==================================================

1. EXISTING PROJECT IS THE SOURCE OF TRUTH
   ==================================================

The actual existing codebase is the source of truth for what has been implemented.

Do not assume that a feature is missing simply because it is described in `PROJECT_BRIEF.md`.

Inspect the relevant implementation and determine:

* What frontend features already exist
* What backend features already exist
* Existing routes
* Existing API endpoints
* Existing controllers/services
* Existing database models/schemas
* Existing authentication and authorization
* Existing React components
* Existing hooks/context/state management
* Existing API/service layer
* Existing routing
* Existing styling/design system
* Existing deployment configuration
* Existing environment-variable structure
* Existing integrations

Do not rewrite working functionality just because you would implement it differently.

==================================================
2. CREATE DEVELOPMENT_STATUS.md
===============================

Create a new file at the project root:

`DEVELOPMENT_STATUS.md`

This file will be the persistent development handoff/state file for this project.

It must contain an accurate snapshot of the CURRENT implementation after inspecting the repository.

Include sections such as:

# Development Status

## Project State

* Current overall state
* Deployment state
* Frontend technology
* Backend technology
* Database
* Important existing architecture

## Completed Features

List features that are actually implemented and verified from the codebase.

## Partially Completed Features

List features that exist but are incomplete.

## Not Yet Implemented

List important features from `PROJECT_BRIEF.md` that are not currently implemented.

## Known Issues

List existing bugs, incomplete behavior, technical issues, or areas that need attention.

## Existing API / Backend

Summarize important existing endpoints, controllers, models, middleware, and integrations.

## Existing Frontend

Summarize important pages, components, routes, hooks, contexts, and services.

## Deployment

Record the current deployment structure and relevant configuration without exposing secrets.

## Current Development Priority

Based on the project brief and existing implementation, identify the next logical development area.

## Important Architecture Decisions

Record important decisions already present in the project so future development does not unnecessarily change them.

## Development Rules

Record the important rules from this prompt that future development agents must follow.

IMPORTANT:
Only record information that you can verify from the existing project.
Do not invent completed features.
Do not claim something is working unless you can verify it from the implementation.

==================================================
3. DEPLOYMENT SAFETY
====================

Because the application is already deployed:

* Preserve working production functionality.
* Do not unnecessarily change deployment configuration.
* Do not expose secrets, API keys, database credentials, JWT secrets, or environment variables containing sensitive values.
* Do not perform destructive database operations.
* Do not reset or delete production data.
* Do not casually change authentication, database schemas, API contracts, or environment-variable names.
* Before making future production-affecting changes, inspect the existing configuration first.
* Development should happen incrementally and be tested locally before deployment.

==================================================
4. FUTURE DEVELOPMENT WORKFLOW
==============================

From this point onward, development must happen component-by-component / feature-by-feature.

For every future task:

ANALYZE
â†’ INSPECT
â†’ CLASSIFY
â†’ EXPLAIN
â†’ IMPLEMENT
â†’ VERIFY
â†’ UPDATE STATUS
â†’ STOP

Before implementing a task:

* Inspect only the relevant existing files.
* Explain what needs to be changed.
* Identify affected frontend/backend/database/deployment areas.
* Classify the task as Easy, Medium, or Complex.

Easy examples:

* CSS changes
* spacing
* typography
* icons
* simple cards
* buttons
* presentational components
* responsive adjustments

Medium examples:

* dashboard functionality
* forms
* CRUD features
* API integration
* profile editing
* learning pages
* leaderboard UI
* community UI

Complex examples:

* authentication/security architecture
* authorization/roles
* XP and gamification logic
* level clearance/unlocking
* streak calculations
* leaderboard ranking logic
* complex database relationships
* real-time messaging
* notifications
* job matching
* AI mentor/recommendation systems
* major architectural changes
* significant backend refactoring

For genuinely complex or high-risk tasks, explain the architectural concerns before implementation. If the task has significant uncertainty or could cause major breakage, stop and ask before making the change.

Do NOT stop merely because a task is large. Stop when there is genuine architectural uncertainty, security risk, destructive database risk, or a major decision that needs my approval.

==================================================
5. TOKEN / CONTEXT EFFICIENCY
=============================

Do not unnecessarily inspect, rewrite, or discuss the entire repository for every task.

For each task:

* Read `PROJECT_BRIEF.md` when product context is needed.
* Read `DEVELOPMENT_STATUS.md` for current project state.
* Inspect only relevant files.
* Make the smallest clean change necessary.
* Reuse existing components, hooks, services, APIs, models, and patterns.
* Do not create duplicate functionality.
* Do not implement future features unless explicitly requested.
* Do not make unrelated changes.

==================================================
6. EXISTING ARCHITECTURE
========================

Prefer the existing architecture over introducing new patterns.

Before creating something new, check whether an equivalent already exists.

Reuse:

* existing components
* existing API helpers
* existing hooks
* existing contexts
* existing services
* existing routes
* existing middleware
* existing models
* existing styling conventions

Do not introduce a new library, framework, state-management system, database pattern, or architectural approach unless there is a clear reason.

==================================================
7. BACKEND / API RULES
======================

Before creating a new API endpoint:

1. Check whether an existing endpoint already provides the required functionality.
2. Reuse existing backend logic where possible.
3. Preserve existing API contracts unless a change is genuinely necessary.
4. Keep frontend and backend behavior consistent.
5. Never create fake/mock backend functionality unless explicitly requested.

==================================================
8. CODE QUALITY
===============

The goal is a clean, maintainable, scalable, production-quality application.

Follow:

* component-based architecture
* reusable components
* clear naming
* separation of concerns
* appropriate error handling
* loading states
* empty states
* error states
* authentication states
* responsive design
* accessibility where practical
* secure handling of sensitive data

Do not optimize for maximum amount of code.

Optimize for correctness, maintainability, and user experience.

==================================================
9. DESIGN
=========

Follow the design system and UX principles defined in `PROJECT_BRIEF.md`.

The product should remain:

* modern
* clean
* developer-focused
* professional
* gamified
* social
* engaging without being cluttered

`My Career Journey` is a central experience.

Do not introduce random visual styles that conflict with the existing design system.

==================================================
10. VERIFICATION
================

After future implementation tasks:

* Check imports
* Check syntax
* Check frontend compilation/build
* Check backend startup
* Check affected API calls
* Check authentication/authorization when relevant
* Check existing functionality for regressions
* Check responsive behavior for UI changes
* Check production/deployment implications

Only update `DEVELOPMENT_STATUS.md` with changes that were actually implemented and verified.


