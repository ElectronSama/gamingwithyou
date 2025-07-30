using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Domain.Entities
{
    public class GameNews
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime PublishedAt { get; set; }

        public Guid GameId { get; set; }
        public Game Game { get; set; }

        private GameNews() { }

        public GameNews(string title, string content, Guid gameId)
        {
            Id = Guid.NewGuid();
            Title = title;
            Content = content;
            GameId = gameId;
            PublishedAt = DateTime.UtcNow;
        }
    }
}
