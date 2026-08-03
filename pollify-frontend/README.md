# Pollify — Frontend

A React + Tailwind CSS frontend for **Pollify**, a community polling app, matching the dashboard and login screens you shared.

## Stack
- React 19 + Vite
- Tailwind CSS v4
- React Router
- lucide-react icons

## Pages included
- **Login** (`/login`) — matches your screenshot: split hero + form, stats row
- **Signup** (`/signup`)
- **Dashboard / Explore** (`/`) — "Ask the community", filter tabs, poll feed, right sidebar profile + poll type stats
- **Create Poll** (`/create`) — poll type picker (Single Choice, Yes/No, Rating, Image, Open Ended), dynamic options
- **My Polls**, **Voted**, **Saved** — empty states, ready to wire to a backend
- **Settings** — profile edit form

## Interactive features (working with mock data)
- Voting on polls (single choice / yes-no / star rating) updates percentages live
- Upvote, comment count, and save/bookmark toggle on poll cards
- Sidebar navigation + active states
- Mock auth: any email/password logs you in (no real backend yet)

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
```

Output goes to `dist/`.

## Next steps to make it "real"
This is frontend-only with mock data in `src/data/mockData.js`. To connect it to your MERN backend:
1. Replace `AuthContext` login/logout with real API calls (JWT, cookies, etc.)
2. Replace `polls` mock array with data fetched from your Express/MongoDB API
3. Wire the Create Poll form's `handleSubmit` to POST to your backend
4. Add real-time updates (Socket.io / polling) for live vote counts
