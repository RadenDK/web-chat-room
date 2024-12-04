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
            if (username == GetCurrentUsernameFromCookie())
            {
                return Ok("It is already your username");
            }


            if (ApplicationSingleton.AddUsername(username))
            {
                // Need to remove the old username before adding the new cookie since that cookie will replace the value
                // This is to free up the username so that others can get it
                string oldUsername = GetCurrentUsernameFromCookie();
                ApplicationSingleton.RemoveUsername(oldUsername);

                // This will replace the existing cookie
                AddUsernameCookie(username);
            }
            else
            {
                return BadRequest("Username already exists today.");
            }

            return Ok("Username added successfully.");
        }

        private void AddUsernameCookie(string username)
        {
            CookieOptions cookieOption = new CookieOptions();
            cookieOption.Secure = true;
            cookieOption.HttpOnly = true;
            cookieOption.Expires = DateTimeOffset.UtcNow.AddDays(1);
            cookieOption.IsEssential = true;

            Response.Cookies.Append("BigBadCookieMonsterCommingToGetYa", username, cookieOption);
        }

        private string GetCurrentUsernameFromCookie()
        {
            // Attempt to retrieve the cookie by its name
            if (Request.Cookies.TryGetValue("BigBadCookieMonsterCommingToGetYa", out string username))
            {
                return username; // Return the value of the cookie
            }
            return null; // Return null if the cookie does not exist
        }

    }
}
