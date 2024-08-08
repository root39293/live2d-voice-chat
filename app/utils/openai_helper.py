# app/utils/openai_helper.py

from openai import OpenAI
from app.config.settings import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)

async def generate_response(message: str, conversation_history: list):
    conversation_history.append({"role": "user", "content": message})

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=conversation_history, 
        max_tokens=1024,
        temperature=0.7
    )

    assistant_response = response.choices[0].message.content
    conversation_history.append({"role": "assistant", "content": assistant_response})

    japanese_response, korean_response = assistant_response.split('///')
    return japanese_response.strip(), korean_response.strip()