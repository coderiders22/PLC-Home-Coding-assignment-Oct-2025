using MiniProjectManager.Models;
using System.Security.Cryptography;
using System.Text;

namespace MiniProjectManager.Services;

public class UserService : IUserService
{
    private readonly List<User> _users = new();

    public User? GetByEmail(string email) => _users.FirstOrDefault(u => u.Email == email);
    public User? GetById(Guid id) => _users.FirstOrDefault(u => u.Id == id);

    public User Create(string email, string password)
    {
        var user = new User { Email = email, PasswordHash = Hash(password) };
        _users.Add(user);
        return user;
    }

    public bool ValidateCredentials(string email, string password, out User? user)
    {
        user = GetByEmail(email);
        if (user == null) return false;
        return user.PasswordHash == Hash(password);
    }

    private static string Hash(string input)
    {
        // Simple SHA256 for demo (NOT recommended for real password storage)
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(input));
        return Convert.ToBase64String(bytes);
    }
}
