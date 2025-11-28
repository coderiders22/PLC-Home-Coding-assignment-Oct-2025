using MiniProjectManager.Models;
using BCrypt.Net;

namespace MiniProjectManager.Services;

public class UserService : IUserService
{
    private readonly List<User> _users = new();

    public User? GetByEmail(string email) => _users.FirstOrDefault(u => u.Email == email);
    public User? GetById(Guid id) => _users.FirstOrDefault(u => u.Id == id);

    public User Create(string email, string password)
    {
        var user = new User { Email = email, PasswordHash = HashPassword(password) };
        _users.Add(user);
        return user;
    }

    public bool ValidateCredentials(string email, string password, out User? user)
    {
        user = GetByEmail(email);
        if (user == null) return false;
        return VerifyPassword(password, user.PasswordHash);
    }

    /// <summary>
    /// Hashes a password using BCrypt with automatic salt generation
    /// </summary>
    private static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
    }

    /// <summary>
    /// Verifies a password against a BCrypt hash
    /// </summary>
    private static bool VerifyPassword(string password, string hash)
    {
        try
        {
            return BCrypt.Net.BCrypt.Verify(password, hash);
        }
        catch
        {
            return false;
        }
    }
}
