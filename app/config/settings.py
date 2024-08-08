# app/config/settings.py

import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

AUDIO_FILE = os.path.join(BASE_DIR, "output.wav")
VOICE_VOXS_URL = "http://127.0.0.1:50021"

LIVE2D_MODEL_DIR = os.path.join(BASE_DIR, "models", "live2d")
LIVE2D_MODEL_NAME = "hiyori_pro_t11"

STATIC_DIR = os.path.join(BASE_DIR, "static")
TEMPLATE_DIR = os.path.join(BASE_DIR, "templates")