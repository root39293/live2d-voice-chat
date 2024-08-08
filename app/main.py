# app/main.py
from fastapi import FastAPI, Query, Request, HTTPException
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import asyncio
from app.config.prompts import SYSTEM_PROMPT

from app.config.settings import STATIC_DIR, TEMPLATE_DIR, AUDIO_FILE, LIVE2D_MODEL_DIR, LIVE2D_MODEL_NAME
from app.utils.audio import synthesize_audio
from app.utils.openai_helper import generate_response

app = FastAPI()
templates = Jinja2Templates(directory=TEMPLATE_DIR)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

system_prompt = {"role": "system", "content": SYSTEM_PROMPT}

conversation_history = [system_prompt]

@app.get("/", response_class=HTMLResponse)
async def get(request: Request):
    return templates.TemplateResponse("chat.html", {"request": request})

@app.get("/chat")
async def chat(message: str = Query(...)):
    try:
        japanese_response, korean_response = await generate_response(message, conversation_history)
        audio_task = asyncio.create_task(synthesize_audio(japanese_response))
        await audio_task
        return {"message": korean_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.get("/audio")
async def get_audio():
    return FileResponse(AUDIO_FILE, media_type="audio/wav")

@app.get("/live2d_model_info")
async def get_live2d_model_info():
    model_path = f"/static/models/live2d/{LIVE2D_MODEL_NAME}/{LIVE2D_MODEL_NAME}.model3.json"
    return {"modelPath": model_path}