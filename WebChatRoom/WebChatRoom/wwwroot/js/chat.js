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
        second: '2-digit',
        hour12: false
    });

    const formattedTimestamp = timestamp ? formatter.format(new Date(timestamp)) : "";
    const messageElement = document.createElement("div");
    messageElement.textContent = `${formattedTimestamp} ${sender}: ${message}`;
    chatLog.appendChild(messageElement);
}


connection.on("LoadChatHistory", function (messages) {
    const chatLog = document.getElementById("chatLog");
    chatLog.innerHTML = ""; // Clear existing messages

    messages.forEach(message => {
        appendMessage(chatLog, message.timestamp, message.sender, message.message);
    });
});

connection.on("ReceiveMessage", function (user, message) {
    console.log(`Message received from ${user}: ${message}`);

    const chatLog = document.getElementById("chatLog");
    // Use the current time for newly received messages
    const currentTime = new Date().toISOString();
    appendMessage(chatLog, currentTime, user, message);
});

function sendMessage() {
    const user = document.getElementById("usernameInput").value || "Anonymous"; // Default to Anonymous
    const message = document.getElementById("messageInput").value;

    if (!message.trim()) {
        console.error("Message cannot be empty.");
        return;
    }

    connection.invoke("SendMessage", user, message).catch(function (err) {
        console.error(err.toString());
    });

    // Clear the input field
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

// Add event listener for blur event on usernameInput
document.getElementById("usernameInput").addEventListener("blur", function () {
    const username = document.getElementById("usernameInput").value;
    const sendMessageBtn = document.getElementById("sendMessageBtn");
    const messageInput = document.getElementById("messageInput");

    if (username) {
        fetch(`/Username/add?username=${encodeURIComponent(username)}`, {
            method: "POST"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                console.log(`Username ${username} was added`);
                sendMessageBtn.disabled = false;
                messageInput.disabled = false;
            })
            .catch(error => {
                console.error("There was a problem with the fetch operation:", error);
                sendMessageBtn.disabled = true;
                messageInput.disabled = true;
            });
    } else {
        sendMessageBtn.disabled = true;
        messageInput.disabled = true;
    }
});
