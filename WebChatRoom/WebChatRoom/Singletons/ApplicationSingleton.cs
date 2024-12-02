using WebChatRoom.Models;

namespace WebChatRoom.Singletons
{
    public static class ApplicationSingleton
    {
        public static HashSet<string> Usernames { get; private set; } = new();
        public static List<ChatMessage> Messages { get; private set; } = new();

        public static void ClearCache()
        {
            Usernames.Clear();
            Messages.Clear();
        }

        public static bool AddUsername(string newUsername)
        {
            return Usernames.Add(newUsername);
        }

        public static void AddChatMessage(ChatMessage message)
        {
            Messages.Add(message);
        }
    }
}
