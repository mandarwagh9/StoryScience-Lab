# StoryScience Lab

An edutainment web app for the **Gemini Live Agent Challenge** that explains complex STEM concepts through interactive storytelling with text and animated SVG visualizations.

## Project Overview

- **Category:** Creative Storyteller  
- **Tech Stack:** React + TypeScript + Vite + Tailwind CSS, FastAPI, OpenRouter API (Gemini), Google Cloud Run  
- **Target Audience:** Lifelong learners

## Features

- Ask any STEM question and receive interactive explanations
- Two-step LLM approach: text explanation → visualization config
- 8 animated visualization types: particle, wave, circuit, molecule, graph, astronomy, bar, process
- Clean, modern dark interface with electric lime accent (#C6FF00)
- Category filtering for Physics, Chemistry, Biology, Math, Computer Science, Astronomy, Environment

## Prerequisites

- Node.js 18+
- Python 3.11+
- OpenRouter API key (get free key at https://openrouter.ai)

## Local Development

### 1. Set API Key

```bash
# Set OpenRouter API key
export OPENROUTER_API_KEY=your-api-key-here
```

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
# Runs on http://localhost:8000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

## API Endpoints

- `GET /` - Health check
- `POST /api/explain` - Get explanation with visualization

Request:
```json
{"question": "How does electricity flow in a circuit?"}
```

Response:
```json
{
  "response": [
    {"type": "text", "content": "Electricity flows..."},
    {"type": "visual", "vizConfig": {"type": "circuit", "title": "Circuit", "params": {...}}}
  ]
}
```

## Visualization Types

| Type | Description |
|------|-------------|
| `particle` | Particle simulation with bouncing particles |
| `wave` | Animated wave motion (sine waves) |
| `circuit` | Electric circuit with battery, wires, resistors, LED |
| `molecule` | Molecular structure with rotation |
| `graph` | Mathematical function graphs |
| `astronomy` | Planetary orbits |
| `bar` | Animated bar charts |
| `process` | Process flow diagrams |

## Deployment to Google Cloud Run

### Deploy Backend

```bash
cd backend
gcloud run deploy storyscience-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars OPENROUTER_API_KEY=your-api-key
```

### Deploy Frontend

```bash
cd frontend
gcloud builds submit --tag gcr.io/$PROJECT_ID/storyscience-frontend

gcloud run deploy storyscience-frontend \
  --image gcr.io/$PROJECT_ID/storyscience-frontend \
  --region us-central1 \
  --allow-unauthenticated
```

## Architecture

```
User Input → React Frontend → FastAPI Backend → OpenRouter (Gemini)
                              ↓
                        SVG Animations
```

## Demo

Try questions like:
- "How does electricity flow in a circuit?"
- "What is a sound wave?"
- "Explain how the solar system works"

## License

MIT
