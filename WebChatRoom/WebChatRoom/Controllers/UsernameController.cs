using Microsoft.AspNetCore.Mvc;
using WebChatRoom.Singletons;

namespace WebChatRoom.Controllers
{
    [Route("[controller]")]
    public class UsernameController : ControllerBase
    {
        [HttpPost("add")]
        public IActionResult AddUsername(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
            {
                return BadRequest("Username cannot be empty.");
            }

            // Check if the username exists
            if (!ApplicationSingleton.AddUsername(username))
            {
                return BadRequest("Username already exists today.");
            }

            return Ok("Username added successfully.");
        }
    }
}
