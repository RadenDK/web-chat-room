"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

connection.start().then(() => {
    console.log("SignalR connection established.");
}).catch(err => {
    console.error("Connection failed: ", err);
});

connection.on("ReceiveMessage", function (user, message) {
    console.log(`Message received from ${user}: ${message}`);

    const chatLog = document.getElementById("chatLog");
    const messageElement = document.createElement("div");
    messageElement.textContent = `${user}: ${message}`;
    chatLog.appendChild(messageElement);
});

function sendMessage() {
    const user = "test"; // Replace with dynamic user if needed
    const message = document.getElementById("messageInput").value;

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
