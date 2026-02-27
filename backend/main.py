from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestionRequest(BaseModel):
    question: str
    category: str | None = None

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
if not OPENROUTER_API_KEY:
    print("WARNING: OPENROUTER_API_KEY not set. Set it in .env file variable.") or environment
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

SYSTEM_PROMPT_TEXT = """You are StoryScience Lab, an educational platform that explains STEM concepts through engaging storytelling.

Your task is to provide a clear, educational explanation of the science concept requested by the user.
- Use simple, accessible language
- Break down complex ideas into digestible parts
- Include real-world examples where helpful
- Keep explanations concise but informative (2-4 paragraphs max)

Provide ONLY the text explanation, nothing else.
Question: """

SYSTEM_PROMPT_VISUAL = """You are StoryScience Lab's visualization designer.

Given the following science explanation, choose the BEST visualization type and create its configuration.

Available visualization types:
- "particle" - For particle systems, gas molecules, Brownian motion
- "wave" - For sound waves, light waves, electromagnetic radiation
- "circuit" - For electrical circuits, current flow, batteries
- "molecule" - For molecular structures, chemical bonds, DNA
- "graph" - For mathematical functions, data relationships
- "astronomy" - For planetary orbits, solar system, celestial bodies
- "bar" - For comparisons, statistics, data charts
- "process" - For processes, workflows, step-by-step explanations

IMPORTANT: Return ONLY valid JSON, no other text. Use this exact format:
{"type": "circuit", "title": "Electric Current Flow", "params": {"components": [{"type": "battery", "label": "Battery", "position": [50, 100]}, {"type": "wire", "from": [50, 100], "to": [200, 100]}, {"type": "resistor", "label": "Bulb", "position": [200, 100], "value": "60W"}], "animation": "flow", "speed": 1}}

Use appropriate params for each visualization type. Keep titles short (3-6 words).

Science explanation to visualize:
"""

VISUALIZATION_TYPES = ["particle", "wave", "circuit", "molecule", "graph", "astronomy", "bar", "process"]

@app.get("/")
async def root():
    return {"message": "StoryScience Lab API is running"}

@app.post("/api/explain")
async def explain_concept(request: QuestionRequest):
    try:
        if not OPENROUTER_API_KEY:
            raise HTTPException(status_code=500, detail="OpenRouter API key not configured")
        
        import httpx
        
        async def call_llm(system_prompt: str, user_prompt: str, max_tokens: int = 1000):
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    OPENROUTER_API_URL,
                    headers={
                        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                        "Content-Type": "application/json",
                        "HTTP-Referer": "https://storyscience-lab.dev",
                        "X-Title": "StoryScience Lab"
                    },
                    json={
                        "model": "google/gemini-2.0-flash-001",
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt}
                        ],
                        "temperature": 0.7,
                        "max_tokens": max_tokens
                    },
                    timeout=60.0
                )
                
                if response.status_code != 200:
                    raise HTTPException(status_code=response.status_code, detail=response.text)
                
                data = response.json()
                return data["choices"][0]["message"]["content"]
        
        # Step 1: Get text explanation
        text_content = await call_llm(SYSTEM_PROMPT_TEXT, request.question, max_tokens=800)
        
        # Step 2: Get visualization config
        visual_prompt = f"{SYSTEM_PROMPT_VISUAL}\n\n{text_content}"
        viz_json = await call_llm(SYSTEM_PROMPT_VISUAL, visual_prompt, max_tokens=500)
        
        # Parse visualization config
        viz_config = None
        try:
            viz_config = json.loads(viz_json.strip())
            if "type" not in viz_config or viz_config["type"] not in VISUALIZATION_TYPES:
                viz_config = None
        except json.JSONDecodeError:
            viz_config = None
        
        # Fallback: keyword-based visualization
        if not viz_config:
            question_lower = request.question.lower()
            viz_type = "bar"
            
            if any(w in question_lower for w in ["electric", "circuit", "current", "voltage", "electron"]):
                viz_type = "circuit"
            elif any(w in question_lower for w in ["wave", "sound", "light", "frequency"]):
                viz_type = "wave"
            elif any(w in question_lower for w in ["molecule", "atom", "chemical", "bond"]):
                viz_type = "molecule"
            elif any(w in question_lower for w in ["planet", "orbit", "solar", "star", "moon"]):
                viz_type = "astronomy"
            elif any(w in question_lower for w in ["graph", "function", "math", "curve"]):
                viz_type = "graph"
            elif any(w in question_lower for w in ["particle", "gas", "motion"]):
                viz_type = "particle"
            elif any(w in question_lower for w in ["process", "step", "how"]):
                viz_type = "process"
            
            viz_config = {
                "type": viz_type,
                "title": request.question[:40],
                "params": {}
            }
        
        # Build response
        parts = [
            {"type": "text", "content": text_content.strip()},
            {"type": "visual", "vizConfig": viz_config}
        ]
        
        return {"response": parts}
        
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
