// app/static/js/chat.js

const speechBubble = document.getElementById("speech-bubble");
const inputBox = document.getElementById("input-box");
const sendButton = document.getElementById("send-button");
const userInputHistory = document.getElementById("user-input-history");
const audio = document.getElementById('audio');
const chatForm = document.getElementById("chat-form");

function addUserMessage(message) {
    userInputHistory.innerHTML = "";
    const userMessage = document.createElement("div");
    userMessage.textContent = message;
    userMessage.classList.add("user-message");
    userInputHistory.appendChild(userMessage);
}

chatForm.addEventListener("submit", function(event) {
    event.preventDefault();
    sendMessage();
});

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
    audio.src = '/audio';
    audio.play().catch(error => {
        console.error('Audio playback error:', error);
    });
}

async function sendMessage() {
    const message = inputBox.value.trim();
    if (!message) return;

    addUserMessage(message);
    inputBox.value = "";

    try {
        const response = await fetch(`/chat?message=${encodeURIComponent(message)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        addMessage(data.message);
        playAudio();
    } catch (error) {
        console.error("Error:", error);
        addMessage("An error occurred. Please try again.");
    }
}

inputBox.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});