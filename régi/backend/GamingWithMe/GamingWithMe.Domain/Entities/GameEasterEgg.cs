using System;

namespace GamingWithMe.Domain.Entities
{
    public class GameEasterEgg
    {
        public Guid Id { get; set; }
        public string Description { get; set; }
        public string ImageUrl { get; set; }

        public Guid GameId { get; set; }
        public Game Game { get; set; }

        private GameEasterEgg() { }

        public GameEasterEgg(string description, string imageUrl, Guid gameId)
        {
            Id = Guid.NewGuid();
            Description = description;
            ImageUrl = imageUrl ?? string.Empty;
            GameId = gameId;
        }
    }
}