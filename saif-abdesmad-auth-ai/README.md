# Authentication & AI Recommendation — Saif Abdesmad

Hey, this is my part of the **Way3D** project.

I worked on the more interactive / "fun" features of the app — the stuff that needed extra logic and animation. Honestly the auth page and the AI chatbot were the parts I had the most fun building.

## What I built

### Authentication module

- The whole **AuthPage** (login + signup) with an animated character that reacts to what the user is typing
- Three character variants: **black**, **purple** and **yellow**, plus shared logic in `shared/`
- A small **CharacterOrchestratorService** to switch between characters and trigger their animations
- **CharactersContext** for sharing character state
- **AuthLayout** (the page wrapper for auth pages)
- Global **AuthContext** so the rest of the app knows who's logged in

### AI recommendation feature

- **AIRecommendationPage** — landing for the AI feature
- **ChatBot** component (the actual chat interface)
- The recommendation **service** behind the chatbot
- Plus the older `AIRecommendation.tsx` page

### Data Portal

- **DataPortal** page (data visualization / interactive view)

## Tech I used

- React 19 + TypeScript
- Framer Motion + GSAP for the character animations
- React Router

## File structure

```
saif-abdesmad-auth-ai/
└── src/
    ├── AuthModule/
    │   ├── Layout/
    │   │   └── AuthLayout.tsx
    │   ├── pages/
    │   │   └── AuthPage.tsx
    │   ├── context/
    │   │   └── CharactersContext.tsx
    │   ├── service/
    │   │   └── CharacterOrchestratorService.ts
    │   └── characters/
    │       ├── shared/
    │       ├── black-character/
    │       ├── purple-character/
    │       └── yellow-character/
    ├── context/
    │   └── AuthContext.tsx
    └── pages/
        ├── AiRecommendation/
        │   ├── AIRecommendationPage.tsx
        │   ├── ChatBot.tsx
        │   └── service/
        ├── AIRecommendation.tsx
        └── DataPortal.tsx
```

## How to run it

From the project root:

```bash
npm install
npm run dev
```

Then:
- `http://localhost:5173/auth` for the auth page
- `http://localhost:5173/ai-recommendation` for the chatbot
- `http://localhost:5173/data` for the data portal
