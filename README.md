# 🎓 CodeCraft Student Dashboard

The immersive participant experience for CodeCraft. Built with Next.js 15, this dashboard provides a sleek, high-tech interface for hackathon registration, progress tracking, and team collaboration.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## 📂 Project Structure

| Path | Description |
| :--- | :--- |
| `src/app/` | Next.js App Router (Auth & Protected groups). |
| `src/components/` | Core UI components (Cyber-UI aesthetic). |
| `src/context/` | Global state providers (Auth, Theme). |
| `src/hooks/` | Custom React hooks for data fetching and logic. |
| `src/lib/` | Firebase configuration and API utilities. |
| `src/store/` | Client-side state management. |
| `src/types/` | TypeScript definitions and interfaces. |

---

## 🛠️ Way of Working (Logic Flow)

```mermaid
graph TD
    A[Student Login] --> B{Session Active?}
    B -- No --> C[Auth Flow]
    B -- Yes --> D[Main Dashboard]
    D --> E[Hackathon List]
    E --> F[Registration Flow]
    F --> G[Phase 0: Agreement]
    G --> H[Phase 1+: Registration/Submission]
    H --> I[Profile Management]
```

---

## ⚡ Quick Start

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Run Development Server**

   ```bash
   npm run dev
   ```

3. **Production Build**

   ```bash
   npm run build
   ```

---

## 🌟 Visual Excellence

- **Cyber-UI Aesthetic**: Procedural animations, glassmorphism, and neon accents.
- **Dynamic Routing**: Instant navigation between hackathons and phases.
- **Responsive Design**: Optimized for both desktop and mobile participation.
- **Real-time Feedback**: Instant validation and submission status updates.
