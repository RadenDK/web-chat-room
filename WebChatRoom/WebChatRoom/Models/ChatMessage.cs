using System.Text.Json.Serialization;

namespace WebChatRoom.Models
{
    public class ChatMessage
    {
        [JsonPropertyName("sender")]
        public string Sender { get; set; }

        [JsonPropertyName("timestamp")]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [JsonPropertyName("message")]
        public string Message { get; set; }
    }
}
