using MiniProjectManager.Models;

namespace MiniProjectManager.Services;
public interface IUserService
{
    User? GetByEmail(string email);
    User? GetById(Guid id);
    User Create(string email, string password); // password will be hashed
    bool ValidateCredentials(string email, string password, out User? user);
}
