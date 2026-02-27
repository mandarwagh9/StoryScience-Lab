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

SYSTEM_PROMPT_VISUAL = """You are StoryScience Lab's visualization designer. Your job is to generate detailed, specific visualization configurations.

CRITICAL: You MUST output ONLY valid JSON. No explanations, no markdown, no text before or after.

Available visualization types and their REQUIRED params:

1. "circuit" - For electrical circuits, current flow, batteries
   REQUIRED params:
   {
     "components": [
       {"type": "battery", "pos": [x, y], "voltage": number},
       {"type": "wire", "from": [x1, y1], "to": [x2, y2]},
       {"type": "resistor", "pos": [x, y], "label": "text", "resistance": number},
       {"type": "led", "pos": [x, y], "color": "#hexcolor"},
       {"type": "bulb", "pos": [x, y], "label": "text"}
     ],
     "showCurrent": true/false,
     "flowDirection": "clockwise"/"counterclockwise"
   }
   Example: {"type": "circuit", "title": "Simple Circuit", "params": {"components": [{"type": "battery", "pos": [100, 200], "voltage": 9}, {"type": "wire", "from": [140, 200], "to": [300, 200]}, {"type": "resistor", "pos": [300, 200], "label": "Bulb", "resistance": 100}, {"type": "wire", "from": [350, 200], "to": [350, 350]}, {"type": "wire", "from": [350, 350], "to": [100, 350]}, {"type": "wire", "from": [100, 350], "to": [100, 240]}, {"type": "led", "pos": [250, 275], "color": "#C6FF00"}], "showCurrent": true, "flowDirection": "clockwise"}}

2. "wave" - For sound waves, light waves, electromagnetic radiation
   REQUIRED params:
   {
     "waves": [
       {"amplitude": number, "frequency": number, "wavelength": number, "phase": number, "color": "#hexcolor"}
     ],
     "showGrid": true/false,
     "fill": true/false
   }
   Example: {"type": "wave", "title": "Sine Wave", "params": {"waves": [{"amplitude": 60, "frequency": 1.5, "wavelength": 120, "phase": 0, "color": "#C6FF00"}, {"amplitude": 40, "frequency": 2, "wavelength": 80, "phase": 1.57, "color": "#FF6B6B"}], "showGrid": true, "fill": true}}

3. "particle" - For particle systems, gas molecules, Brownian motion
   REQUIRED params:
   {
     "particles": [
       {"x": number, "y": number, "vx": number, "vy": number, "color": "#hexcolor"}
     ],
     "bounds": [width, height],
     "trail": true/false
   }
   Example: {"type": "particle", "title": "Gas Particles", "params": {"particles": [{"x": 0.2, "y": 0.3, "vx": 2, "vy": 1.5, "color": "#C6FF00"}, {"x": 0.5, "y": 0.6, "vx": -1.5, "vy": 2, "color": "#FF6B6B"}, {"x": 0.7, "y": 0.4, "vx": 1, "vy": -2, "color": "#4ECDC4"}, {"x": 0.3, "y": 0.8, "vx": -2, "vy": -1, "color": "#FFE66D"}], "bounds": [800, 500], "trail": true}}

4. "molecule" - For molecular structures, chemical bonds
   REQUIRED params:
   {
     "atoms": [
       {"element": "symbol", "pos": [x, y], "color": "#hexcolor"}
     ],
     "bonds": [[index1, index2], ...],
     "animateRotation": true/false
   }
   Example: {"type": "molecule", "title": "Water Molecule", "params": {"atoms": [{"element": "O", "pos": [300, 250], "color": "#FF6B6B"}, {"element": "H", "pos": [250, 320], "color": "#F5F5F5"}, {"element": "H", "pos": [350, 320], "color": "#F5F5F5"}], "bonds": [[0, 1], [0, 2]], "animateRotation": true}}

5. "graph" - For mathematical functions
   REQUIRED params:
   {
     "functions": [
       {"eq": "expression", "color": "#hexcolor", "lineWidth": number}
     ],
     "xRange": [min, max],
     "yRange": [min, max],
     "showGrid": true/false,
     "animate": true/false
   }
   Example: {"type": "graph", "title": "Trig Functions", "params": {"functions": [{"eq": "sin(x)", "color": "#C6FF00", "lineWidth": 3}, {"eq": "cos(x)", "color": "#FF6B6B", "lineWidth": 2}], "xRange": [-10, 10], "yRange": [-3, 3], "showGrid": true, "animate": true}}

6. "astronomy" - For planetary orbits, solar system
   REQUIRED params:
   {
     "bodies": [
       {"name": "name", "type": "star"/"planet", "orbit": number, "speed": number, "radius": number, "color": "#hexcolor"}
     ],
     "showOrbits": true/false
   }
   Example: {"type": "astronomy", "title": "Solar System", "params": {"bodies": [{"name": "Sun", "type": "star", "orbit": 0, "speed": 0, "radius": 50, "color": "#FFD700"}, {"name": "Earth", "type": "planet", "orbit": 150, "speed": 1, "radius": 15, "color": "#4ECDC4"}, {"name": "Mars", "type": "planet", "orbit": 220, "speed": 0.7, "radius": 12, "color": "#FF6B6B"}], "showOrbits": true}}

7. "bar" - For comparisons, statistics
   REQUIRED params:
   {
     "data": [
       {"label": "text", "value": number, "color": "#hexcolor"}
     ],
     "animate": true/false
   }
   Example: {"type": "bar", "title": "Data Comparison", "params": {"data": [{"label": "A", "value": 75, "color": "#C6FF00"}, {"label": "B", "value": 45, "color": "#FF6B6B"}, {"label": "C", "value": 90, "color": "#4ECDC4"}], "animate": true}}

8. "process" - For processes, workflows
   REQUIRED params:
   {
     "steps": [
       {"label": "text", "pos": [x, y], "color": "#hexcolor"}
     ],
     "flow": true/false,
     "animateFlow": true/false
   }
   Example: {"type": "process", "title": "Process Flow", "params": {"steps": [{"label": "Input", "pos": [150, 200], "color": "#C6FF00"}, {"label": "Process", "pos": [400, 200], "color": "#FF6B6B"}, {"label": "Output", "pos": [650, 200], "color": "#4ECDC4"}], "flow": true, "animateFlow": true}}

IMPORTANT: 
- Use 800x500 as canvas size (coords 0-800 for x, 0-500 for y)
- Keep titles short (3-6 words)
- Use colors from the brand: #C6FF00 (lime), #FF6B6B (red), #4ECDC4 (teal), #FFE66D (yellow)
- Output EXACT JSON format with NO additional text

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
