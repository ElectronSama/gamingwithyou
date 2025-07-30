using System;
using System.Collections.Generic;

namespace GamingWithMe.Domain.Entities
{
    public enum EventStatus
    {
        Upcoming,
        Ongoing,
        Finished
    }

    public class GameEvent
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal PrizePool { get; set; }
        public int NumberOfTeams { get; set; }
        public string Location { get; set; }
        public EventStatus Status { get; set; }

        public Guid GameId { get; set; }
        public Game Game { get; set; }

        private GameEvent() { }

        public GameEvent(string title, DateTime startDate, DateTime endDate, decimal prizePool, 
                         int numberOfTeams, string location, Guid gameId)
        {
            Id = Guid.NewGuid();
            Title = title;
            StartDate = startDate;
            EndDate = endDate;
            PrizePool = prizePool;
            NumberOfTeams = numberOfTeams;
            Location = location;
            Status = DateTime.UtcNow < startDate ? EventStatus.Upcoming : 
                     DateTime.UtcNow > endDate ? EventStatus.Finished : EventStatus.Ongoing;
            GameId = gameId;
        }

        public void UpdateStatus()
        {
            var now = DateTime.UtcNow;
            if (now < StartDate)
                Status = EventStatus.Upcoming;
            else if (now > EndDate)
                Status = EventStatus.Finished;
            else
                Status = EventStatus.Ongoing;
        }
    }
}