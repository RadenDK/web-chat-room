"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

connection.start().then(() => {
    console.log("SignalR connection established.");
}).catch(err => {
    console.error("Connection failed: ", err);
});

// Helper function to format and append a message to the chat log
function appendMessage(chatLog, timestamp, sender, message) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    const formattedTimestamp = timestamp ? formatter.format(new Date(timestamp)) : "";
    const messageElement = document.createElement("div");
    messageElement.className = "chat-message";

    messageElement.innerHTML = `
        <span class="timestamp">${formattedTimestamp}</span>
        <span class="username">${sender}</span>: 
        <span class="message">${message}</span>
    `;

    chatLog.prepend(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

connection.on("LoadChatHistory", function (messages) {
    const chatLog = document.getElementById("chatLog");
    chatLog.innerHTML = "";

    const reversedMessages = [...messages].reverse();

    reversedMessages.forEach(message => {
        appendMessage(chatLog, message.timestamp, message.sender, message.message);
    });
});

connection.on("ReceiveMessage", function (user, message) {
    const chatLog = document.getElementById("chatLog");
    const currentTime = new Date().toISOString();
    appendMessage(chatLog, currentTime, user, message);
});

function sendMessage() {
    const user = document.getElementById("usernameInput").value || "Anonymous";
    const message = document.getElementById("messageInput").value;

    if (!message.trim()) {
        console.error("Message cannot be empty.");
        return;
    }

    connection.invoke("SendMessage", user, message).catch(function (err) {
        console.error(err.toString());
    });

    document.getElementById("messageInput").value = "";
}

document.getElementById("messageInput").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

document.getElementById("sendMessageBtn").addEventListener("click", function () {
    sendMessage();
});

document.getElementById("usernameInput").addEventListener("blur", function () {
    const usernameInput = document.getElementById("usernameInput");
    const sendMessageBtn = document.getElementById("sendMessageBtn");
    const messageInput = document.getElementById("messageInput");
    const username = usernameInput.value.trim();

    if (!username) {
        // Default to "Anonymous" without sending a request
        resetUsernameField("Anonymous user");
        sendMessageBtn.disabled = false;
        messageInput.disabled = false;
        return;
    }

    // Validate the username via the controller
    fetch(`/Username/add?username=${encodeURIComponent(username)}`, { method: "POST" })
        .then(response => {
            if (response.ok) {
                resetUsernameField(""); // Clear any error state
                sendMessageBtn.disabled = false;
                messageInput.disabled = false;
            } else {
                return response.text().then(text => { throw new Error(text); });
            }
        })
        .catch(error => {
            console.error("Error validating username:", error);
            setUsernameFieldInvalid("Username is already taken.");
            sendMessageBtn.disabled = true;
            messageInput.disabled = true;
        });
});

function resetUsernameField() {
    const usernameInput = document.getElementById("usernameInput");
    const statusPopup = document.getElementById("usernameStatus");

    usernameInput.classList.remove("invalid");
    statusPopup.textContent = "";
}

function setUsernameFieldInvalid(message) {
    const usernameInput = document.getElementById("usernameInput");
    const statusPopup = document.getElementById("usernameStatus");

    usernameInput.classList.add("invalid");
    statusPopup.textContent = message;
    statusPopup.style.display = "block";
}
