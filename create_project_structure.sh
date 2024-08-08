#!/bin/bash

# 프로젝트 루트 디렉토리 생성
mkdir -p interactive-live2d-voice
cd interactive-live2d-voice

# app 디렉토리 및 하위 디렉토리 생성
mkdir -p app/config
mkdir -p app/models/live2d
mkdir -p app/static/css
mkdir -p app/static/js
mkdir -p app/templates
mkdir -p app/utils

# 파일 생성
touch app/config/__init__.py
touch app/config/settings.py
touch app/static/css/styles.css
touch app/static/js/chat.js
touch app/static/js/live2d.js
touch app/templates/chat.html
touch app/utils/__init__.py
touch app/utils/audio.py
touch app/utils/openai_helper.py
touch app/__init__.py
touch app/main.py

# 루트 디렉토리 파일 생성
touch .env
touch .gitignore
touch README.md
touch pyproject.toml

echo "프로젝트 구조가 생성되었습니다."