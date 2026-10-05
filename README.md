# SignalR Chatroom

This is a small hobby project I made to learn more about SignalR.

It's a basic chatroom where messages are stored in memory on my server and reset at midnight. Nothing fancy — just a fun way to experiment with real-time messaging.

You can try it out here: [https://chatroom.rasmusjensen.tech/](https://chatroom.rasmusjensen.tech/)  
(If it's still up and running!)

## Deployment

Production is deployed from [RadenDK/homeserver](https://github.com/RadenDK/homeserver): the service definition lives in [`publicvm/docker-compose.yml`](https://github.com/RadenDK/homeserver/blob/main/publicvm/docker-compose.yml). This repo only builds and pushes the image to GHCR.
