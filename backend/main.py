from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import json
import re
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
    print("WARNING: OPENROUTER_API_KEY not set. Set it in .env file variable.")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

SYSTEM_PROMPT_TEXT = """You are StoryScience Lab, an educational platform that explains STEM concepts through engaging storytelling.

Your task is to provide a clear, educational explanation of the science concept requested by the user.
- Use simple, accessible language
- Break down complex ideas into digestible parts
- Include real-world examples where helpful
- Keep explanations concise and informative (2-4 paragraphs max)

Provide ONLY the text explanation, nothing else.
Question: """

VISUALIZATION_TYPES = ["particle", "wave", "circuit", "molecule", "graph", "astronomy", "bar", "process"]

VIZ_CONFIGS = {
    "circuit": {
        "type": "circuit",
        "params": {
            "components": [
                {"type": "battery", "pos": [100, 200], "voltage": 9},
                {"type": "wire", "from": [140, 200], "to": [300, 200]},
                {"type": "resistor", "pos": [300, 200], "resistance": 100, "label": "Bulb"},
                {"type": "wire", "from": [350, 200], "to": [350, 350]},
                {"type": "wire", "from": [350, 350], "to": [100, 350]},
                {"type": "wire", "from": [100, 350], "to": [100, 240]},
                {"type": "led", "pos": [250, 275], "color": "#C6FF00"}
            ],
            "showCurrent": True
        }
    },
    "wave": {
        "type": "wave",
        "params": {
            "waves": [
                {"amplitude": 60, "frequency": 1.5, "wavelength": 120, "phase": 0, "color": "#C6FF00"},
                {"amplitude": 40, "frequency": 2, "wavelength": 80, "phase": 1.57, "color": "#FF6B6B"}
            ],
            "showGrid": True,
            "fill": True
        }
    },
    "astronomy": {
        "type": "astronomy",
        "params": {
            "bodies": [
                {"name": "Sun", "type": "star", "orbit": 0, "speed": 0, "radius": 50, "color": "#FFD700"},
                {"name": "Earth", "type": "planet", "orbit": 150, "speed": 1, "radius": 15, "color": "#4ECDC4"},
                {"name": "Mars", "type": "planet", "orbit": 220, "speed": 0.7, "radius": 12, "color": "#FF6B6B"}
            ],
            "showOrbits": True
        }
    },
    "molecule": {
        "type": "molecule",
        "params": {
            "atoms": [
                {"element": "O", "pos": [300, 250], "color": "#FF6B6B"},
                {"element": "H", "pos": [250, 320], "color": "#F5F5F5"},
                {"element": "H", "pos": [350, 320], "color": "#F5F5F5"}
            ],
            "bonds": [[0, 1], [0, 2]],
            "animateRotation": True
        }
    },
    "particle": {
        "type": "particle",
        "params": {
            "particles": [
                {"x": 0.2, "y": 0.3, "vx": 2, "vy": 1.5, "color": "#C6FF00"},
                {"x": 0.5, "y": 0.6, "vx": -1.5, "vy": 2, "color": "#FF6B6B"},
                {"x": 0.7, "y": 0.4, "vx": 1, "vy": -2, "color": "#4ECDC4"},
                {"x": 0.3, "y": 0.8, "vx": -2, "vy": -1, "color": "#FFE66D"}
            ],
            "bounds": [800, 500],
            "trail": True
        }
    },
    "graph": {
        "type": "graph",
        "params": {
            "functions": [
                {"eq": "sin(x)", "color": "#C6FF00", "lineWidth": 3},
                {"eq": "cos(x)", "color": "#FF6B6B", "lineWidth": 2}
            ],
            "xRange": [-10, 10],
            "yRange": [-3, 3],
            "showGrid": True,
            "animate": True
        }
    },
    "process": {
        "type": "process",
        "params": {
            "steps": [
                {"label": "Input", "pos": [150, 200], "color": "#C6FF00"},
                {"label": "Process", "pos": [400, 200], "color": "#FF6B6B"},
                {"label": "Output", "pos": [650, 200], "color": "#4ECDC4"}
            ],
            "flow": True,
            "animateFlow": True
        }
    },
    "bar": {
        "type": "bar",
        "params": {
            "data": [
                {"label": "A", "value": 75, "color": "#C6FF00"},
                {"label": "B", "value": 45, "color": "#FF6B6B"},
                {"label": "C", "value": 90, "color": "#4ECDC4"}
            ],
            "animate": True
        }
    }
}

KEYWORD_VIZ_MAP = [
    (["force", "gravity", "newton", "motion", "acceleration", "mass", "friction"], "particle"),
    (["photosynthesis", "respiration", "dna", "rna", "cell", "gene", "evolution", "ecosystem", "organism", "living"], "process"),
    (["reaction", "acid", "base", "ph", "chemistry", "chemical"], "molecule"),
    (["electric", "electrical", "circuit", "current", "voltage", "battery", "wire", "resistor", "bulb", "led", "conduction"], "circuit"),
    (["wave", "sound", "light", "frequency", "wavelength", "amplitude", "vibration", "electromagnetic", "ripple"], "wave"),
    (["planet", "orbit", "solar", "star", "moon", "mars", "earth", "jupiter", "saturn", "galaxy", "universe", "astronomy", "asteroid"], "astronomy"),
    (["particle", "gas", "brownian", "collision", "kinetic"], "particle"),
    (["graph", "function", "math", "curve", "sine", "cosine", "equation", "plot", "trigonometry"], "graph"),
    (["how does", "how do", "process", "step", "procedure", "method", "stage", "phase", "workflow", "work", "engine", "machine"], "process"),
]

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
        
        text_content = await call_llm(SYSTEM_PROMPT_TEXT, request.question, max_tokens=800)
        
        viz_config = None
        question_lower = request.question.lower()
        
        for keywords, viz_type in KEYWORD_VIZ_MAP:
            if any(w in question_lower for w in keywords):
                viz_config = VIZ_CONFIGS[viz_type].copy()
                viz_config["title"] = request.question[:40]
                break
        
        if not viz_config:
            viz_config = VIZ_CONFIGS["bar"].copy()
            viz_config["title"] = request.question[:40]
        
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
