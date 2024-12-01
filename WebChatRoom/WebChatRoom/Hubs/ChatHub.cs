using Microsoft.AspNetCore.SignalR;
using System.Collections.Concurrent;
using WebChatRoom.Models;

namespace WebChatRoom.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            Console.WriteLine($"Message received: {user}: {message}");
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        public override async Task OnConnectedAsync()
        {
            Console.WriteLine($"Client connected: {Context.ConnectionId}");
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            Console.WriteLine($"Client disconnected: {Context.ConnectionId}, Reason: {exception?.Message}");
            await base.OnDisconnectedAsync(exception);
        }


    }
}
