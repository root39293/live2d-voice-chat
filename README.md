# Interactive Live2D Voice Chat

실시간 Conversation이 가능한 Live2D 캐릭터와 음성 합성을 활용한 대화형 채팅 인터페이스 개인 프로젝트입니다.

## 주요 기능

- Live2D 캐릭터 실시간 립싱크 표시
- 텍스트-음성 변환 (TTS) 기능
- 일본어와 한국어 동시 출력
- GPT-4o 기반 LLM 응답

## Stack

- FastAPI
- Static Web
- VOICEVOX
- GPT-4o


## Requirements
- Python 3.8+
- Poetry
- Docker
- ffmpeg

## Install & Run

1. ffmpeg:
   - Ubuntu: `sudo apt-get install ffmpeg`
   - macOS: `brew install ffmpeg`
   - Windows: https://ffmpeg.org/download.html


2. VOICEVOX Docker :
   ~~~
   docker run --rm -it -p 50021:50021 voicevox/voicevox_engine:cpu-ubuntu20.04-latest
   ~~~

1. dependency install:
   ~~~
   poetry install
   ~~~

2. env:
   ~~~
   OPENAI_API_KEY=your_api_key_here
   ~~~

3. run server:
   ~~~
   poetry run uvicorn app.main:app --reload
   ~~~

## Customize

- Live2D 모델 변경: `app/config/settings.py`의 `LIVE2D_MODEL_NAME` 수정
- 캐릭터 설정 변경: `app/config/prompts.py`의 `CHARACTER_PROMPT` 수정
    (주의: `FIXED_CONSTRAINTS`는 유지)

## Notice

- VOICEVOX가 로컬에서 실행 중이어야 함 (포트 50021)
- Live2D 모델 파일이 `app/models/live2d/[YOUR_MODEL_NAME]/` 디렉토리에 위치해야 함
