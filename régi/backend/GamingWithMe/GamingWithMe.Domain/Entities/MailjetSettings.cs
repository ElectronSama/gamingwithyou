using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Domain.Entities
{
    public class MailjetSettings
    {
        public string ApiKey { get; set; }
        public string SecretKey { get; set; }
        public string SenderEmail { get; set; }
        public string SenderName { get; set; }
    }
}
