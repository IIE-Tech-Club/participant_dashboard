# 🎓 CodeCraft Student Portal

![Next.js](https://img.shields.io/badge/Next.js-15.x-000000?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-12.12-FFCA28?style=for-the-badge&logo=firebase)
![Vercel](https://img.shields.io/badge/Vercel-Analytics-000000?style=for-the-badge&logo=vercel)

The **CodeCraft Student Portal** is the primary interface for hackathon participants. Built on Next.js with Tailwind CSS 4, it offers a seamless onboarding experience, real-time submission tracking, and a unified participant profile.

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router architecture)
- **State Management**: Zustand (via `hackathonStore.ts`)
- **Styling**: Tailwind CSS 4 (Modern utility-first CSS)
- **Infrastructure**: Firebase Client & Admin SDK
- **Observability**: Vercel Analytics & Speed Insights

---

## 📂 Repository Structure

| Path | Purpose |
| :--- | :--- |
| `src/app/` | Next.js App Router (Pages, Layouts, API Routes) |
| `src/app/(protected)/` | Authenticated participant views |
| `src/components/` | Modular UI components (Layout, UI, Phases) |
| `src/store/` | Global state management via Zustand |
| `src/lib/` | Shared utilities and Firebase configuration |
| `src/types/` | TypeScript interface definitions |

---

## 🔄 Way of Working (Logic Flow)

```mermaid
graph TD
    A[Student Landing] --> B[Auth Flow]
    B --> C[Profile Setup]
    C --> D[Hackathon Discovery]
    D --> E[Registration Phase]
    E --> F[Team Formation]
    F --> G[Project Submission]
    G --> H[Evaluation Results]
```

---

## 🚀 Getting Started

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Run Dev Server**:

   ```bash
   npm run dev
   ```

3. **Production Build**:

   ```bash
   npm run build
   ```
