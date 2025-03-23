let responses = {};

async function loadResponses() {
    const response = await fetch("responses.json");
    responses = await response.json();
}

document.addEventListener("DOMContentLoaded", function () {
    const chatContainer = document.getElementById("chat-container");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    fetch("mental_health_chatbot.json")
        .then(response => response.json())
        .then(data => {
            const chatbotData = data;

            sendButton.addEventListener("click", function () {
                processUserMessage();
            });

            userInput.addEventListener("keypress", function (event) {
                if (event.key === "Enter") {
                    processUserMessage();
                }
            });

            function processUserMessage() {
                let userMessage = userInput.value.trim().toLowerCase();
                if (userMessage === "") return;

                appendMessage("You", userMessage);
                userInput.value = "";

                // Show typing animation
                const typingIndicator = document.createElement("div");
                typingIndicator.classList.add("message", "bot");
                typingIndicator.innerHTML = "<span class='typing'>...</span>";
                chatContainer.appendChild(typingIndicator);
                chatContainer.scrollTop = chatContainer.scrollHeight;

                setTimeout(() => {
                    // Remove typing indicator
                    chatContainer.removeChild(typingIndicator);

                    // Get chatbot response
                    let botResponse = getResponse(userMessage);
                    appendMessage("Chatbot", botResponse);
                }, 1500); // 1.5 seconds delay to simulate typing
            }

            function getResponse(message) {
                for (let category in chatbotData) {
                    if (chatbotData[category][message]) {
                        return chatbotData[category][message];
                    }
                }
                return chatbotData["default"];
            }

            function appendMessage(sender, message) {
                const messageDiv = document.createElement("div");
                messageDiv.classList.add("message", sender === "You" ? "user" : "bot");
                messageDiv.innerText = `${sender}: ${message}`;
                chatContainer.appendChild(messageDiv);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        })
        .catch(error => console.error("Error loading chatbot data:", error));
});


function sendMessage() {
    let userInput = document.getElementById("user-input").value.trim();
    if (userInput === "") return;

    addMessage(userInput, "user");

    let botReply = getBotResponse(userInput);
    setTimeout(() => addMessage(botReply, "bot"), 500);

    document.getElementById("user-input").value = "";
}

function getBotResponse(userInput) {
    userInput = userInput.toLowerCase();
    for (let key in responses) {
        if (userInput.includes(key.toLowerCase())) {
            return responses[key];
        }
    }
    return "I'm sorry, I don't have an answer for that. But I'm here to help! 😊";
}

function addMessage(message, sender) {
    let chatBox = document.getElementById("chat-box");
    let messageDiv = document.createElement("p");
    messageDiv.classList.add(sender === "user" ? "user-message" : "bot-message");
    messageDiv.textContent = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function handleKeyPress(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

loadResponses();
