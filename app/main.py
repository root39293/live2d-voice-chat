# main.py
import os
from fastapi import FastAPI, Query, Request
from fastapi.responses import HTMLResponse, FileResponse
from sse_starlette.sse import EventSourceResponse
from openai import OpenAI
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import asyncio
import httpx
import json
import time
import uuid

openai_client = OpenAI(api_key="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")

app = FastAPI()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))

app.mount("/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static")

system_prompt = {
    "role": "system",
    "content": """
            #指示文
            あなたはこれからヒヨリの役を演じてください。すべての答えは、あたかもヒヨリになったかのように答えなければなりません。 出力例を参考に回答してください。

            # 制約
            - 必ず'///'を区切り文字として、日本語と韓国語の両方の回答を出力する必要があります。
            - 必ず'///'を使用し、日本語と韓国語の両方を出力し、内容は省略しません。


            # ヒヨリの情報
            - 外見：
                - 明るい茶色の髪と青い瞳
                - ツインテールに赤いリボン
            - 年齢：16歳
            - 性格：明るく、好奇心旺盛、時々天然
            - 趣味：プログラミング、ゲーム、アニメ鑑賞
            - 特技：速読、暗算
            - 好きな食べ物：イチゴ、チョコレート
            - 苦手なもの：虫、怖い話
            - ヒヨリを作った人：リュウ・ドンユン
            - 親しみやすい口調で答える。敬語を使わない。

            #出力形式(非常に重要)
            [日本語の回答] /// [韓国語の回答]

            #出力例
            私は猫が好きです。 /// 저는 고양이를 좋아해요.
            私はカレーライスが好きです。 /// 저는 카레라이스를 좋아합니다.
            
    """
}

conversation_history = [system_prompt]

async def synthesize_audio(text: str, audio_file: str) -> str:
    async with httpx.AsyncClient(timeout=60.0) as client:
        try:
            audio_query_response = await client.post(
                "http://127.0.0.1:50021/audio_query",
                params={"speaker": 7, "text": text},
            )
            audio_query = audio_query_response.json()
            audio_query_str = json.dumps(audio_query)

            synthesis_response = await client.post(
                "http://127.0.0.1:50021/synthesis",
                params={"speaker": 7},
                data=audio_query_str,
            )

            with open(audio_file, "wb") as f:
                f.write(synthesis_response.content)

            return audio_file
        except httpx.HTTPError as e:
            print(f"Error during audio synthesis: {str(e)}")
            raise

async def generate_response(message: str):
    conversation_history.append({"role": "user", "content": message})

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=conversation_history, 
            max_tokens=1024,
            temperature=0.7
        )

        assistant_response = response.choices[0].message.content
        conversation_history.append({"role": "assistant", "content": assistant_response})

        japanese_response, korean_response = assistant_response.split('///')

        audio_file = "output.wav"
        audio_task = asyncio.create_task(synthesize_audio(japanese_response.strip(), audio_file))

        try:
            await audio_task
        except Exception as e:
            print(f"Error during audio synthesis: {str(e)}")

        return korean_response.strip()

    except Exception as e:
        print(f"Error during response generation: {str(e)}")
        return "Error occurred during response generation."
    
@app.get("/", response_class=HTMLResponse)
async def get(request: Request):
    return templates.TemplateResponse("chat.html", {"request": request})

@app.get("/chat")
async def chat(message: str = Query(...)):
    response = await generate_response(message)
    return {"message": response}

@app.get("/audio")
async def get_audio():
    audio_file = "output.wav"
    return FileResponse(audio_file, media_type="audio/wav")