using System.Collections.Generic;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, int templateId, Dictionary<string, string> variables);
    }
}