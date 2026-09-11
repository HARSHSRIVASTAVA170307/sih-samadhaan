# SkillRoute

> AI-powered career path decision and personalized learning roadmap platform

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/python-3.8+-blue.svg?style=for-the-badge&logo=python)](https://www.python.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react)](https://reactjs.org/)

## Overview

**SkillRoute** is an AI-powered career path decision and personalized learning roadmap platform that helps students choose the right career and learn it in a structured, time-bound way.

Unlike traditional career guidance tools, SkillRoute **does not just give advice** - it **decides the best-fit career path** and **builds an adaptive learning roadmap** based on the student's profile.

## Problem Statement

| Challenge | Impact |
|-----------|--------|
| **Too many career options** | Students feel overwhelmed and confused |
| **Lack of personalized guidance** | Generic advice doesn't match individual needs |
| **Rapidly changing industry demands** | Traditional guidance becomes outdated |
| **No clear learning order** | Students don't know where to start |
| **Generic roadmaps** | Ignore time constraints, skills, and learning pace |

## Solution

SkillRoute uses an **AI decision-making agent** to provide a complete learning journey:

| Step | Description |
|------|-------------|
| **1. Analyze** | Evaluate student's interests, skills, time availability, and learning pace |
| **2. Decide** | Select the best-fit career path using AI analysis |
| **3. Generate** | Create a personalized, time-bound learning roadmap |

## Key Features

SkillRoute delivers AI-powered career path decisions, personalized learning roadmaps with time and pace-aware planning, Firebase authentication, comprehensive progress tracking, and a modern React-Tailwind interface for an optimal student experience.

## Tech Stack

### Backend

| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance web framework |
| **Python 3.8+** | Core programming language |
| **Groq API** | Large Language Model for AI agents |
| **Firebase Admin SDK** | Backend authentication and database |
| **Pydantic** | Data validation and settings management |
| **python-dotenv** | Environment variable management |

### Frontend

| Technology | Purpose |
|------------|---------|
| **React** | UI library for building interactive interfaces |
| **Tailwind CSS** | Utility-first CSS framework |

### Database & Authentication

| Service | Purpose |
|---------|---------|
| **Firebase Firestore** | NoSQL cloud database |
| **Firebase Authentication** | User authentication service |


## Project Structure

```
skillroute-ai/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   └── utils/
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── README.md
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   └── agent-logic.md
│
├── README.md
└── .gitignore
```

## Setup Instructions

### Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| **Python** | 3.8+ | Backend runtime |
| **Node.js** | 14+ | Frontend runtime |
| **npm** | Latest | Package manager |
| **Git** | Latest | Version control |

### 1. Clone Repository

```bash
git clone https://github.com/<your-username>/skillroute-ai.git
cd skillroute-ai
```

### 2. Backend Setup

| Step | Command | Description |
|------|---------|-------------|
| **Navigate** | `cd backend` | Enter backend directory |
| **Create venv** | `python -m venv venv` | Create virtual environment |
| **Activate (Windows)** | `venv\Scripts\activate` | Activate virtual environment |
| **Activate (macOS/Linux)** | `source venv/bin/activate` | Activate virtual environment |
| **Install dependencies** | `pip install -r requirements.txt` | Install required packages |
| **Run server** | `uvicorn app.main:app --reload` | Start development server |

#### Backend Access Points

| Service | URL |
|---------|-----|
| **API Root** | http://127.0.0.1:8000 |
| **Interactive Docs** | http://127.0.0.1:8000/docs |
| **Alternative Docs** | http://127.0.0.1:8000/redoc |

### 3. Frontend Setup

| Step | Command | Description |
|------|---------|-------------|
| **Navigate** | `cd frontend` | Enter frontend directory |
| **Install dependencies** | `npm install` | Install required packages |
| **Run dev server** | `npm run dev` | Start development server |

### 4. Environment Configuration

Create a `.env` file inside `backend/` directory:

| Variable | Description | Example |
|----------|-------------|---------|
| `PROJECT_NAME` | Application name | SkillRoute |
| `ENV` | Environment mode | development |
| `GROQ_API_KEY` | Groq API key for LLM | gsk_... |
| `FIREBASE_CREDENTIALS` | Firebase service account | path/to/credentials.json |

**Example `.env` file:**

```env
PROJECT_NAME=SkillRoute
ENV=development
GROQ_API_KEY=your_groq_key_here
FIREBASE_CREDENTIALS=./firebase-credentials.json
```
