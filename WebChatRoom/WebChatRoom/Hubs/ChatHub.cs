using Microsoft.AspNetCore.SignalR;
using WebChatRoom.Models;
using WebChatRoom.Singletons;

namespace WebChatRoom.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            Console.WriteLine($"Message received: {user}: {message}");
            ChatMessage chatMessage = new ChatMessage { Sender = user, Message = message };
            ApplicationSingleton.AddChatMessage(chatMessage);
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"Client connected: {Context.ConnectionId}");

            // Send the chat history to the new client
            await Clients.Caller.SendAsync("LoadChatHistory", ApplicationSingleton.Messages);

            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"Client disconnected: {Context.ConnectionId}, Reason: {exception?.Message}");
            await base.OnDisconnectedAsync(exception);
        }
    }
}
