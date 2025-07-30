using GamingWithMe.Domain.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Domain.Entities
{
    public class Game
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Slug { get; set; }
        public string? ThumbnailUrl { get; set; }
        public ICollection<GameNews> News { get; set; }
        public ICollection<GameEvent> Events { get; set; }
        public ICollection<GameEasterEgg> EasterEggs { get; set; }

        private Game() { }

        public Game(string name, string description)
        {
            Id = Guid.NewGuid();
            Name = name;
            Description = description ?? string.Empty;
            Slug = SlugGenerator.From(name);
            News = new List<GameNews>();
            Events = new List<GameEvent>();
            EasterEggs = new List<GameEasterEgg>();
        }
    }
}
