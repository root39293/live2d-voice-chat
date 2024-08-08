# app/utils/audio.py
import httpx
import json
from app.config.settings import VOICE_VOXS_URL, AUDIO_FILE

async def synthesize_audio(text: str) -> str:
    async with httpx.AsyncClient(timeout=60.0) as client:
        audio_query_response = await client.post(
            f"{VOICE_VOXS_URL}/audio_query",
            params={"speaker": 7, "text": text},
        )
        audio_query = audio_query_response.json()
        audio_query_str = json.dumps(audio_query)

        synthesis_response = await client.post(
            f"{VOICE_VOXS_URL}/synthesis",
            params={"speaker": 7},
            data=audio_query_str,
        )

        with open(AUDIO_FILE, "wb") as f:
            f.write(synthesis_response.content)

        return AUDIO_FILE