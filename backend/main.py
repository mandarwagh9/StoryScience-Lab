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

# Templates that generate dynamic viz configs based on question content
def generate_viz_config(question: str, text_content: str) -> dict:
    """Generate visualization config dynamically based on question content"""
    q = question.lower()
    t = text_content.lower()
    
    # Circuit/Electricity
    if any(w in q for w in ["electric", "electrical", "circuit", "current", "voltage", "battery", "wire", "resistor", "bulb", "led", "conduction"]):
        # Extract numbers from text for dynamic values
        voltage = 9
        resistance = 100
        nums = re.findall(r'\b(\d+)\b', t)
        if nums:
            voltage = min(int(nums[0]), 24) if int(nums[0]) > 0 else 9
            resistance = min(int(nums[1]) if len(nums) > 1 else 100, 1000)
        
        return {
            "type": "circuit",
            "title": question[:40],
            "params": {
                "components": [
                    {"type": "battery", "pos": [100, 200], "voltage": voltage},
                    {"type": "wire", "from": [140, 200], "to": [300, 200]},
                    {"type": "resistor", "pos": [300, 200], "resistance": resistance, "label": "Load"},
                    {"type": "wire", "from": [350, 200], "to": [350, 350]},
                    {"type": "wire", "from": [350, 350], "to": [100, 350]},
                    {"type": "wire", "from": [100, 350], "to": [100, 240]},
                    {"type": "led", "pos": [250, 275], "color": "#C6FF00"}
                ],
                "showCurrent": True
            }
        }
    
    # Wave/Sound/Light
    if any(w in q for w in ["wave", "sound", "light", "frequency", "wavelength", "amplitude", "vibration", "electromagnetic", "ripple"]):
        # Extract relevant values from text
        amp = 60
        freq = 1.5
        wave_len = 120
        
        if "high" in t and "frequency" in t:
            freq = 2.5
        elif "low" in t and "frequency" in t:
            freq = 0.5
            
        return {
            "type": "wave",
            "title": question[:40],
            "params": {
                "waves": [
                    {"amplitude": amp, "frequency": freq, "wavelength": wave_len, "phase": 0, "color": "#C6FF00"},
                    {"amplitude": amp * 0.6, "frequency": freq * 1.3, "wavelength": wave_len * 0.7, "phase": 1.57, "color": "#FF6B6B"}
                ],
                "showGrid": True,
                "fill": True
            }
        }
    
    # Astronomy
    if any(w in q for w in ["planet", "orbit", "solar", "star", "moon", "mars", "earth", "jupiter", "saturn", "galaxy", "universe", "astronomy"]):
        # Build dynamic body list based on what's mentioned
        bodies = []
        
        if any(w in t for w in ["sun", "star"]):
            bodies.append({"name": "Sun", "type": "star", "orbit": 0, "speed": 0, "radius": 50, "color": "#FFD700"})
        
        if any(w in t for w in ["mercury"]):
            bodies.append({"name": "Mercury", "type": "planet", "orbit": 60, "speed": 4.1, "radius": 6, "color": "#A0A0A0"})
        if any(w in t for w in ["venus"]):
            bodies.append({"name": "Venus", "type": "planet", "orbit": 90, "speed": 3.2, "radius": 9, "color": "#F5D76E"})
        if any(w in t for w in ["earth"]):
            bodies.append({"name": "Earth", "type": "planet", "orbit": 130, "speed": 2.9, "radius": 10, "color": "#4ECDC4"})
        if any(w in t for w in ["mars"]):
            bodies.append({"name": "Mars", "type": "planet", "orbit": 170, "speed": 2.4, "radius": 7, "color": "#FF6B6B"})
        if any(w in t for w in ["jupiter"]):
            bodies.append({"name": "Jupiter", "type": "planet", "orbit": 230, "speed": 1.3, "radius": 25, "color": "#F5D76E"})
        if any(w in t for w in ["saturn"]):
            bodies.append({"name": "Saturn", "type": "planet", "orbit": 290, "speed": 0.9, "radius": 20, "color": "#F4D03F"})
            
        # Default if nothing specific found
        if not bodies:
            bodies = [
                {"name": "Sun", "type": "star", "orbit": 0, "speed": 0, "radius": 50, "color": "#FFD700"},
                {"name": "Earth", "type": "planet", "orbit": 150, "speed": 1, "radius": 15, "color": "#4ECDC4"},
                {"name": "Mars", "type": "planet", "orbit": 220, "speed": 0.7, "radius": 12, "color": "#FF6B6B"}
            ]
        
        return {
            "type": "astronomy",
            "title": question[:40],
            "params": {
                "bodies": bodies,
                "showOrbits": True
            }
        }
    
    # Molecule/Chemistry
    if any(w in q for w in ["molecule", "atom", "chemical", "bond", "hydrogen", "oxygen", "carbon", "water", "co2", "chemistry"]):
        atoms = []
        combined = q + " " + t
        
        if any(w in combined for w in ["co2", "carbon dioxide"]):
            atoms = [
                {"element": "C", "pos": [300, 250], "color": "#666666"},
                {"element": "O", "pos": [240, 250], "color": "#FF6B6B"},
                {"element": "O", "pos": [360, 250], "color": "#FF6B6B"}
            ]
        elif any(w in combined for w in ["methane", "ch4"]):
            atoms = [
                {"element": "C", "pos": [300, 250], "color": "#666666"},
                {"element": "H", "pos": [250, 200], "color": "#F5F5F5"},
                {"element": "H", "pos": [350, 200], "color": "#F5F5F5"},
                {"element": "H", "pos": [250, 300], "color": "#F5F5F5"},
                {"element": "H", "pos": [350, 300], "color": "#F5F5F5"}
            ]
        elif any(w in combined for w in ["water", "h2o"]):
            atoms = [
                {"element": "O", "pos": [300, 250], "color": "#FF6B6B"},
                {"element": "H", "pos": [250, 320], "color": "#F5F5F5"},
                {"element": "H", "pos": [350, 320], "color": "#F5F5F5"}
            ]
        else:
            atoms = [
                {"element": "C", "pos": [300, 250], "color": "#666666"},
                {"element": "H", "pos": [250, 320], "color": "#F5F5F5"},
                {"element": "H", "pos": [350, 320], "color": "#F5F5F5"}
            ]
        
        bonds = [[0, i] for i in range(1, len(atoms))]
        
        return {
            "type": "molecule",
            "title": question[:40],
            "params": {
                "atoms": atoms,
                "bonds": bonds,
                "animateRotation": True
            }
        }
    
    # Particle/Physics
    if any(w in q for w in ["particle", "gas", "brownian", "collision", "kinetic", "force", "gravity", "motion", "velocity"]):
        num_particles = 4
        if "many" in t or "multiple" in t:
            num_particles = 8
        elif "few" in t:
            num_particles = 3
            
        colors = ["#C6FF00", "#FF6B6B", "#4ECDC4", "#FFE66D", "#A78BFA", "#F472B6", "#60A5FA", "#34D399"]
        particles = []
        for i in range(num_particles):
            particles.append({
                "x": 0.1 + (i * 0.7 / num_particles),
                "y": 0.2 + (i % 2) * 0.5,
                "vx": -2 + (i % 3) * 1.5,
                "vy": -1.5 + (i % 4) * 1,
                "color": colors[i % len(colors)]
            })
        
        return {
            "type": "particle",
            "title": question[:40],
            "params": {
                "particles": particles,
                "bounds": [800, 500],
                "trail": True
            }
        }
    
    # Graph/Math
    if any(w in q for w in ["graph", "function", "math", "curve", "sine", "cosine", "equation", "trigonometry"]):
        functions = []
        if "sin" in t or "sine" in t:
            functions.append({"eq": "sin(x)", "color": "#C6FF00", "lineWidth": 3})
        if "cos" in t or "cosine" in t:
            functions.append({"eq": "cos(x)", "color": "#FF6B6B", "lineWidth": 2})
        if "tan" in t:
            functions.append({"eq": "tan(x)", "color": "#4ECDC4", "lineWidth": 2})
        if not functions:
            functions = [
                {"eq": "sin(x)", "color": "#C6FF00", "lineWidth": 3},
                {"eq": "cos(x)", "color": "#FF6B6B", "lineWidth": 2}
            ]
        
        return {
            "type": "graph",
            "title": question[:40],
            "params": {
                "functions": functions,
                "xRange": [-10, 10],
                "yRange": [-3, 3],
                "showGrid": True,
                "animate": True
            }
        }
    
    # Process/How things work - biology, life processes, how stuff works
    if any(w in q for w in ["how does", "how do", "process", "step", "procedure", "method", "work", "engine", "machine", "photosynthesis", "respiration", "digestion", "cycle"]):
        # Extract key terms from question for labels
        words = re.findall(r'\b\w+\b', question.lower())
        stop_words = {'how', 'does', 'what', 'is', 'a', 'an', 'the', 'do', 'you', 'it'}
        key_words = [w for w in words if w not in stop_words and len(w) > 2]
        
        if len(key_words) >= 3:
            steps = [
                {"label": key_words[0].title(), "pos": [150, 200], "color": "#C6FF00"},
                {"label": key_words[1].title(), "pos": [400, 200], "color": "#FF6B6B"},
                {"label": key_words[2].title(), "pos": [650, 200], "color": "#4ECDC4"}
            ]
        else:
            steps = [
                {"label": "Input", "pos": [150, 200], "color": "#C6FF00"},
                {"label": "Process", "pos": [400, 200], "color": "#FF6B6B"},
                {"label": "Output", "pos": [650, 200], "color": "#4ECDC4"}
            ]
        
        return {
            "type": "process",
            "title": question[:40],
            "params": {
                "steps": steps,
                "flow": True,
                "animateFlow": True
            }
        }
    
    # Default: generate bar chart from any numbers in text
    numbers = re.findall(r'\b(\d+(?:\.\d+)?)\b', t)
    if numbers:
        data = []
        colors = ["#C6FF00", "#FF6B6B", "#4ECDC4", "#FFE66D", "#A78BFA", "#F472B6"]
        labels = ["A", "B", "C", "D", "E", "F"]
        for i, num in enumerate(numbers[:6]):
            try:
                val = min(float(num), 100)
                data.append({"label": labels[i], "value": val, "color": colors[i % len(colors)]})
            except:
                pass
        
        if data:
            return {
                "type": "bar",
                "title": question[:40],
                "params": {
                    "data": data,
                    "animate": True
                }
            }
    
    # Ultimate fallback - process viz
    return {
        "type": "process",
        "title": question[:40],
        "params": {
            "steps": [
                {"label": "Start", "pos": [150, 200], "color": "#C6FF00"},
                {"label": "Process", "pos": [400, 200], "color": "#FF6B6B"},
                {"label": "End", "pos": [650, 200], "color": "#4ECDC4"}
            ],
            "flow": True,
            "animateFlow": True
        }
    }

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
        
        # Get text explanation
        text_content = await call_llm(SYSTEM_PROMPT_TEXT, request.question, max_tokens=800)
        
        # Generate dynamic visualization config based on question + text
        viz_config = generate_viz_config(request.question, text_content)
        
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
