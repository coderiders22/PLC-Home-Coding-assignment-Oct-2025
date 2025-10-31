using Microsoft.AspNetCore.Mvc;
using MiniProjectManager.DTOs;
using MiniProjectManager.Services;

namespace MiniProjectManager.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IJwtService _jwtService;

    public AuthController(IUserService userService, IJwtService jwtService)
    {
        _userService = userService;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest("Email and password required.");

        if (_userService.GetByEmail(req.Email) != null)
            return BadRequest("Email already registered.");

        var user = _userService.Create(req.Email, req.Password);
        var token = _jwtService.GenerateToken(user);
        return Ok(new AuthResponse(token));
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest req)
    {
        if (!_userService.ValidateCredentials(req.Email, req.Password, out var user))
            return Unauthorized("Invalid credentials.");

        var token = _jwtService.GenerateToken(user!);
        return Ok(new AuthResponse(token));
    }
}
