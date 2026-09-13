# Birthday 2026 - Seva Sankalp Abhiyan & Media Wall

A modern, responsive web application built with **Angular 19**, **Tailwind CSS**, and **JSON Server** mock backend for the **Seva Sankalp Abhiyan** campaign and interactive Media Wall.

---

## 🚀 Quick Start Guide

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.x or higher recommended)
- **npm** (v9.x or higher)

---

### 1. Installation

Clone the repository and install project dependencies:

```bash
git clone https://github.com/CodingLovers-create/Birthday-2026.git
cd Birthday-2026
npm install
```

---

### 2. Running the Application

#### Option A: Run Full Application (App + Mock API Server) ⭐ *Recommended*

To run both the Angular development server (`http://localhost:4201`) and the mock API backend (`http://localhost:3001`) concurrently:

```bash
npm run dev
```

Open your browser and navigate to:
👉 **[http://localhost:4201](http://localhost:4201)**

---

#### Option B: Run Components Individually

- **Start Angular App Only**:
  ```bash
  npm run start
  # or
  npx ng serve --port 4201
  ```
  App will be available at `http://localhost:4201`.

- **Start Mock API Backend Only**:
  ```bash
  npm run mock-api
  ```
  Mock backend will run on `http://0.0.0.0:3001` (accessible locally and over network/emulators).

- **Reset Mock Database**:
  If you want to reset `db.json` back to clean initial mock data:
  ```bash
  npm run mock-api:reset
  ```

---

### 3. Build for Production

To compile and bundle the application for production deployment:

```bash
npm run build
```

The compiled output will be generated in the `dist/birthday-2026` directory.

---

## 📁 Key Routes & Modules

| Route | Description |
| :--- | :--- |
| `/main` | **Seva Sankalp Abhiyan Dashboard** – Hero section with 4 interactive Seva cards. |
| `/create-post` | **Create Post Page** – Photo upload/capture, canvas image compression, custom hashtags, and caption editor. |
| `/wall` | **Media Wall Feed** – Live post feed with like toggling, comment section, image viewer, and tag filtering. |
| `/profile` | **User Profile Page** – View personal uploaded posts and activity. |

---

## 🛠️ Tech Stack & Features

- **Framework**: Angular 19 (Standalone Components, Signals, RxJS)
- **Styling**: Tailwind CSS & Vanilla SCSS
- **Backend Mock**: `json-server` on `port 3001` with `0.0.0.0` host binding
- **Dev Proxy**: Integrated Angular `proxy.conf.json` for same-origin API proxying (`port 4201` ➔ `port 3001`)
- **Image Optimization**: Client-side canvas compression (~35KB JPEG) before submission
- **Cross-Component Communication**: Reactive `postCreated$` stream broadcasting new posts instantly to feed components

---

## 📄 License

This project is maintained for the **Birthday 2026** campaign.
