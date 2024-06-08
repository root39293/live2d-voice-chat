// chat.js
const speechBubble = document.getElementById("speech-bubble");
const inputBox = document.getElementById("input-box");
const sendButton = document.getElementById("send-button");
const userInputHistory = document.getElementById("user-input-history");

function addUserMessage(message) {
    userInputHistory.innerHTML = ""; // 이전 대화 내역 지우기
    const userMessage = document.createElement("div");
    userMessage.textContent = message;
    userMessage.classList.add("user-message");
    userInputHistory.appendChild(userMessage);
}

function addMessage(message) {
    if (typeof message === 'string') {
        const cleanedMessage = message.trim();
        speechBubble.textContent = cleanedMessage;
        speechBubble.style.display = "block";
    } else {
        console.error('Invalid message format:', message);
    }
}

function playAudio() {
    const audio = document.getElementById('audio');
    audio.src = '/audio';
    audio.play().catch(error => {
        console.error('오디오 재생 오류:', error);
    });
}

function sendMessage() {
    const message = inputBox.value;
    if (!message) return;
    addUserMessage(message); // 사용자 입력 내역 추가
    inputBox.value = "";

    fetch(`/chat?message=${encodeURIComponent(message)}`)
        .then(response => response.json())
        .then(data => {
            const koreanMessage = data.message;
            addMessage(koreanMessage);
            playAudio();
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

sendButton.addEventListener("click", sendMessage);

inputBox.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});