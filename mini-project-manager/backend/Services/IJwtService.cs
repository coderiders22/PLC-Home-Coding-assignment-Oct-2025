using MiniProjectManager.Models;

namespace MiniProjectManager.Services;
public interface IJwtService
{
    string GenerateToken(User user);
}
