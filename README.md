# live2d-voice-chat

LLM 기반의 실시간 대화가 가능한 Live2D 캐릭터와 일본어 음성 합성을 결합한 간단한 채팅 인터페이스를 구현한 토이프로젝트

## 주요 기능

- Live2D 캐릭터의 실시간 립싱크 표시
- 텍스트를 음성으로 변환하는 TTS 기능 지원
- 일본어와 한국어 동시 출력 가능
- LLM 기반 응답 제공

## Stack

- FastAPI
- Static Web
- VOICEVOX
- LLM

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
