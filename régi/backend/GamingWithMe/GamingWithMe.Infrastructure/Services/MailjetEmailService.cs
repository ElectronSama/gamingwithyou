using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using Mailjet.Client;
using Mailjet.Client.Resources;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GamingWithMe.Infrastructure.Services
{
    public class MailjetEmailService : IEmailService
    {
        private readonly MailjetSettings _mailjetSettings;

        public MailjetEmailService(IOptions<MailjetSettings> mailjetSettings)
        {
            _mailjetSettings = mailjetSettings.Value;
        }

        public async Task SendEmailAsync(string toEmail, string subject, int templateId, Dictionary<string, string> variables)
        {
            var client = new MailjetClient(_mailjetSettings.ApiKey, _mailjetSettings.SecretKey);

            var mailjetVariables = new JObject
            {
                { "current_year", DateTime.UtcNow.Year.ToString() }
            };

            if (variables != null)
            {
                foreach (var variable in variables)
                {
                    mailjetVariables.Add(variable.Key, variable.Value);
                }
            }

            MailjetRequest request = new MailjetRequest
            {
                Resource = SendV31.Resource,
            }
            .Property(Send.Messages, new JArray {
                new JObject {
                    {
                        "From",
                        new JObject {
                            {"Email", _mailjetSettings.SenderEmail},
                            {"Name", _mailjetSettings.SenderName}
                        }
                    }, {
                        "To",
                        new JArray {
                            new JObject {
                                {"Email", toEmail}
                            }
                        }
                    }, {
                        "TemplateID",
                        templateId
                    }, {
                        "TemplateLanguage",
                        true
                    }, {
                        "Subject",
                        subject
                    }, {
                        "Variables",
                        mailjetVariables
                    }
                }
            });

            MailjetResponse response = await client.PostAsync(request);
        }
    }
}