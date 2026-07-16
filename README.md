# 📊 SmartFinance Workspace

An secure personal finance tracker and operation task workspace built using **React 18**, **TypeScript**, **Tailwind CSS**, and **Supabase (Auth & Database)**.

The application allows users to gain complete control of their financial life with multi-currency tracking, budget caps, category allocations, savings targets, and an integrated daily operations checklist.

---

## ✨ Key Features

- 👤 **Secure Authentication Gateway**: Full email registration and standard password logins powered by **Supabase Auth**.
- 🏦 **Durable Cloud Synchronization**: Automatic and real-time synchronization of transactions, active tasks, savings, and custom configurations across sessions.
- 📉 **Comparative Financial Analytics**: Visually tracking rolling 6-month income versus expenses using fluid, interactive area charts designed with **Recharts**.
- 🎯 **Targeted Savings Goals**: Set goals with responsive milestone trackers, and contribute towards reserves directly from the interface.
- 🛡️ **Graceful Client-side Fallbacks**: If database limits or offline states occur, the application seamlessly switches to a robust browser key-value `localStorage` system without data disruption.
- 🗣️ **Bilingual Support (English & Burmese)**: Change the system UI language dynamically with instantaneous local translations.
- 🌓 **Ambient Dark / Light Theme**: An eye-safe color scheme conforming perfectly to user preferences, matching a premium slate aesthetic.

---

## 🛠️ Tech Stack & Libraries

- **Frontend Framework**: [React 18](https://react.dev/) with [Vite](https://vite.dev/) (fast HMR-free development server, pre-configured production pipelines).
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict type-safety, dedicated type declarations).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Responsive layouts, utility-first classes, transition effects).
- **Database & Authentication**: [Supabase](https://supabase.com/) (PostgreSQL real-time client SDK).
- **Charting Engine**: [Recharts](https://recharts.org/) (Dynamic SVG charts with customized responsive wrappers).
- **Icons**: [Lucide React](https://lucide.dev/) (Modern, consistent, lightweight SVG icons).

---

## 📂 Modular Project Structure

The project has been refactored into a highly maintainable, modular structure adhering to best practices and separation of concerns:

```text
├── src/
│   ├── components/            # Dedicated visual UI components & widgets
│   │   ├── AnalyticsChart.tsx # Comparative area charts using Recharts
│   │   ├── AuthGateway.tsx    # Responsive login, register, and guest gateway
│   │   ├── BudgetsView.tsx    # Monthly budgets and threshold limits
│   │   ├── ReportsView.tsx    # Complete financial breakdowns
│   │   ├── SavingsView.tsx    # Savings target sliders and progress bars
│   │   ├── Sidebar.tsx        # Collapsible dynamic desktop/mobile sidebar
│   │   ├── StatCards.tsx      # Balance, income, and task metrics trackers
│   │   ├── TasksWorkspace.tsx # Consolidated task checklist & priorities
│   │   ├── Toast.tsx          # Custom ambient micro-toast notifications
│   │   ├── TopHeader.tsx      # Language toggles, theme switcher, and balance
│   │   ├── TransactionsTable.tsx # Dashboard overview of latest activity
│   │   └── TransactionsView.tsx  # In-depth financial ledger audits
│   │
│   ├── hooks/
│   │   └── useFinanceState.ts # Custom React Hook handling state, authentication, and actions
│   │
│   ├── utils/
│   │   ├── constants.ts       # Centralized factory data seeds (fallback values)
│   │   ├── financeHelpers.ts  # Pure helper functions for formatting and calculations
│   │   ├── supabaseClient.ts  # Initialized Supabase client instance
│   │   ├── supabaseService.ts # Database CRUD and retry fallback services
│   │   └── translations.ts    # Native English & Burmese dictionary
│   │
│   ├── types.ts               # Shared global TypeScript types and interfaces
│   ├── App.tsx                # Main Router rendering dynamic viewports
│   ├── index.css              # Core tailwind setup & custom global CSS styles
│   └── main.tsx               # Client bootstrap mounting
```

---

## 🚀 Get Started Locally

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Installation
Install the project dependencies using npm:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file at the root of your project (you can copy `.env.example` as a template):
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
```

### 4. Running Development Server
Start the local server. By default, it will be mapped to serve on port `3000`:
```bash
npm run dev
```

### 5. Production Build
To build and compile the application for deployment into the static `dist` folder:
```bash
npm run build
```

---

## ⚡ Supabase Configuration & Tables

To enable durable cloud synchronization, ensure your Supabase project contains the following tables:

### 1. `transactions`
- `id` (text / primary key)
- `date` (text / date)
- `description` (text)
- `category` (text)
- `amount` (numeric)
- `type` (text - e.g., 'Income' | 'Expense')
- `user_id` (uuid / referencing `auth.users.id` - nullable if fallback is allowed)

### 2. `tasks`
- `id` (text / primary key)
- `title` (text)
- `priority` (text - e.g., 'High' | 'Low')
- `completed` (boolean)
- `created_at` (timestamp with time zone)
- `user_id` (uuid / referencing `auth.users.id` - nullable if fallback is allowed)

### 3. `savings_goals`
- `id` (text / primary key)
- `name` (text)
- `target` (numeric)
- `current` (numeric)
- `category` (text)
- `user_id` (uuid / referencing `auth.users.id` - nullable if fallback is allowed)

### 4. `settings`
- `user_id` (uuid / referencing `auth.users.id` - primary key part)
- `key` (text - primary key part - e.g., 'budgetCap' | 'categoryBudgets')
- `value` (text - stringified configs)

---

## 🎨 Design Philosophy

- **Modern Slate Aesthetic**: Standardizing a dark-indigo cosmic palette paired with clear typography using *Inter*.
- **High-Contrast Microinteractions**: Generous negative spaces, clean borders, and smooth state animations for focus and legibility.
- **Data Over Noise**: Clear, humbler text descriptions avoiding fake system statistics, offering precise financial details instead.
