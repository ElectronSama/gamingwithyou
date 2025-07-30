using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Dtos
{
    public record MessageDto
    {
        public Guid Id { get; init; }
        public Guid SenderId { get; init; }
        public string SenderName { get; init; }
        public Guid ReceiverId { get; init; }
        public string ReceiverName { get; init; }
        public string Content { get; init; }
        public DateTime SentAt { get; init; }
    }
}
