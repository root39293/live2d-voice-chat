// chat.js
const speechBubble = document.getElementById("speech-bubble");
const inputBox = document.getElementById("input-box");
const sendButton = document.getElementById("send-button");

function addMessage(message) {
    const cleanedMessage = message.trim();
    speechBubble.textContent = cleanedMessage;
    speechBubble.style.display = "block";
}

function playAudio() {
    const audio = new Audio('/audio');
    audio.play();
}

function sendMessage() {
    const message = inputBox.value;
    if (!message) return;
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