using Microsoft.AspNetCore.SignalR;
using WebChatRoom.Hubs;
using WebChatRoom.Singletons;

namespace WebChatRoom.BackgroundServices
{
    public class DailyCacheCleaner : BackgroundService
    {

        private readonly IHubContext<ChatHub> _hubContext;

        public DailyCacheCleaner(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // Calculate the delay until the next midnight
                    DateTime now = DateTime.Now;
                    DateTime nextMidnight = DateTime.Today.AddDays(1);
                    TimeSpan delay = nextMidnight - now;

                    // Wait until midnight
                    await Task.Delay(delay, stoppingToken);

                    // Clear the cache
                    ApplicationSingleton.ClearCache();

                    // Clear the chatlog for all clients connected to the hub
                    await _hubContext.Clients.All.SendAsync("LoadChatHistory", ApplicationSingleton.Messages);

                    Console.WriteLine($"Cache cleared at {DateTime.Now}");
                }
                catch (TaskCanceledException)
                {
                    // Task was canceled, exit gracefully
                    break;
                }
                catch (Exception ex)
                {
                    // Log the exception (or handle it in a way that fits your app)
                    Console.WriteLine($"Error in DailyCacheCleaner: {ex.Message}");
                }
            }
        }
    }
}
