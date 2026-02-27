# StoryScience Lab

An edutainment web app that explains complex STEM concepts through interleaved storytelling using Gemini's multimodal output (text + AI-generated images).

## Project Overview

**Category:** Creative Storyteller  
**Tech Stack:** React + TypeScript, FastAPI, Gemini 2.0 Flash, Google Cloud Run  
**Target Audience:** Lifelong learners

## Features

- Ask any STEM question and receive interactive explanations
- AI-generated visualizations accompany text explanations
- Clean, modern dark interface with electric lime accent
- Category filtering for Physics, Chemistry, Biology, Math, Computer Science, Astronomy, Environment

## Prerequisites

- Node.js 18+
- Python 3.11+
- Google Cloud Project with Vertex AI API enabled
- Google Cloud SDK installed

## Local Development

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install -r requirements.txt
export GOOGLE_CLOUD_PROJECT=your-project-id
export GOOGLE_CLOUD_LOCATION=us-central1
python main.py
```

## Deployment to Google Cloud Run

### Option 1: Deploy Backend Only

```bash
cd backend
gcloud run deploy storyscience-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

### Option 2: Deploy Full Stack

```bash
# Build and push frontend
cd frontend
gcloud builds submit --tag gcr.io/$PROJECT_ID/storyscience-frontend

# Deploy frontend
gcloud run deploy storyscience-frontend \
  --image gcr.io/$PROJECT_ID/storyscience-frontend \
  --region us-central1 \
  --allow-unauthenticated

# Note: Update nginx.conf proxy_pass to your backend URL
```

## Environment Variables

- `GOOGLE_CLOUD_PROJECT`: Your GCP project ID
- `GOOGLE_CLOUD_LOCATION`: GCP region (default: us-central1)

## Architecture

```
User Input → React Frontend → FastAPI Backend → Gemini API
                              ↓
                      Vertex AI (Gemini + Imagen)
```

## Demo

Watch the demo video to see StoryScience Lab in action.

## License

MIT
