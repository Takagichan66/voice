// Initialize Web Speech API objects
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
const startBtn = document.getElementById('start-btn');
const outputDiv = document.getElementById('output');

let isListening = false;  // Track if the recognition is active

// Speech Recognition settings
recognition.lang = 'vi-VN';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

startBtn.addEventListener('click', () => {
    if (isListening) {
        recognition.stop();  // Stop listening and trigger the onend event
        startBtn.textContent = "Bắt đầu nghe";
    } else {
        recognition.start();  // Start listening
        startBtn.textContent = "Dừng nghe";
    }
    isListening = !isListening;  // Toggle the listening flag
});

// Listen for speech recognition results
recognition.onresult = (event) => {
    const you = event.results[0][0].transcript.toLowerCase();
    console.log('Bạn nói:', you);
    addMessage(`Bạn: ${you}`);
    processText(you);
};

recognition.onerror = (event) => {
    console.error('Recognition Error:', event.error);
    addMessage("Lỗi nhận diện giọng nói.");
    isListening = false;
    startBtn.textContent = "Bắt đầu nghe";
};

// Gửi dữ liệu lên server để xử lý và nhận phản hồi
function processText(text) {
    fetch('http://localhost:3000/process-text', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    })
    .then(response => response.json())
    .then(data => {
        const response = data.response;
        addMessage(`Trợ lý: ${response}`);
        speak(response);
    })
    .catch(error => {
        console.error('Error:', error);
        addMessage("Lỗi kết nối đến máy chủ.");
    });
}

// Speak the response using ResponsiveVoice
function speak(text) {
    responsiveVoice.speak(text, "Vietnamese Female");  // Use the Vietnamese female voice
}

// Add a message to the chat window
function addMessage(text) {
    const message = document.createElement('div');
    message.textContent = text;
    outputDiv.appendChild(message);
    outputDiv.scrollTop = outputDiv.scrollHeight;
}
