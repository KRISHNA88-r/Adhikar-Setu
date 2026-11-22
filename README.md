# Adhikar Setu

Voice-first, multilingual guide to Indian government schemes. IDEA//FORGE hackathon project (Track 1, Problem 1).

**What it does**
- **Check my benefits**: 7 easy questions by voice or tap (English, Hindi, Telugu) -> a rules engine labels each scheme *May qualify*, *Almost eligible* or *Not eligible*, with reasons. Near misses say what is missing (for example "bring an income certificate").
- **Is this message real? (Scam Shield)**: paste a message or link; get a risk level, the reasons, and whether each link is an official government domain.
- **Understand a notice**: photo or pasted text -> plain summary, deadline, next action (needs `OPENAI_API_KEY`).
- **Scheme pages**: benefit, who can get it, how to apply, tick-off document checklist, official link, and a **print / save as PDF application packet**.
- **Ask a question**: answers only from the scheme directory, with source links (works without a key too: shows closest schemes).
- **Privacy**: no Aadhaar / bank numbers; answers stay in the browser tab (`sessionStorage`); one tap deletes them. Login is optional and not needed for any feature.

**Design rule: the AI explains, rules decide.** Eligibility is deterministic Java (`backend/.../rules/RuleEngine.java`). The language model never decides eligibility.

## Stack
React 18 + Vite (Vercel) · Spring Boot 3.4 / Java 17 (Render, Docker) · PostgreSQL · optional OpenAI API · browser Web Speech API for voice.

## Run locally
1. PostgreSQL: create database `adhikar_setu` (pgAdmin 4).
2. Backend (`backend/`): set `DATABASE_URL=jdbc:postgresql://localhost:5432/adhikar_setu`, `DB_USERNAME`, `DB_PASSWORD`, `APP_JWT_SECRET` (32+ chars), `CORS_ALLOWED_ORIGINS=http://localhost:5173`, optional `OPENAI_API_KEY`. Run `mvn spring-boot:run`. The 17 schemes in `src/main/resources/data/schemes.json` load automatically on every start (edit the file, restart, data refreshes).
3. Frontend (`frontend/`): `npm install`, copy `.env.example` to `.env`, `npm run dev`, open http://localhost:5173.
4. Voice input works in Chrome / Edge. Read-aloud depends on the voices installed on the device; test Telugu on the phone you will demo on.

## Deploy
- **Render (backend)**: Docker web service from `backend/`. Env vars: `DATABASE_URL` (JDBC form `jdbc:postgresql://HOST:5432/DB`), `DB_USERNAME`, `DB_PASSWORD`, `APP_JWT_SECRET`, `OPENAI_API_KEY`, `CORS_ALLOWED_ORIGINS` (exact Vercel URL, no trailing slash). Health check `/actuator/health`. Free instances sleep: open the site once before presenting.
- **Vercel (frontend)**: root directory `frontend`, build `npm run build`, output `dist`, env `VITE_API_BASE_URL=https://YOUR-SERVICE.onrender.com/api`.

## API
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/eligibility/check` | Profile -> every scheme with status + reasons (rules engine) |
| GET | `/api/schemes`, `/api/schemes/{slug}` | Directory and detail |
| POST | `/api/scam/check` | Scam Shield |
| POST | `/api/notice/explain` | Notice explainer (text or image data URL) |
| POST | `/api/assistant/ask` | Grounded Q&A in the chosen language |
| POST | `/api/auth/register`, `/api/auth/login` | Optional accounts (JWT) |

## Tests
`backend/src/test/java/com/adhikarsetu/rules/` has 15 unit tests for the rules engine and Scam Shield (`mvn test -Dtest='RuleEngineTest,ScamShieldTest'`). `AdhikarSetuApplicationTests` needs a running PostgreSQL.

## Before you present (important)
- **Verify every scheme** in `schemes.json` against its official page, then set `lastVerified` and `"verified": true`. Rules are simplified screening rules, and several amounts and limits were written from general knowledge, not checked live. The app shows a "prototype rules, confirm on the official site" notice until you do.
- **Hindi and Telugu text** was machine-written. Have a native speaker review `frontend/src/i18n/hi.json` and `te.json`.
- Add 2-3 sourced statistics to the pitch (your project document also lists this).

## Not built yet
WhatsApp/SMS channel, offline PWA, deadline reminders, admin panel, impact dashboard, Tier-2 languages, Bhashini integration. They are listed in your document as stretch items.
