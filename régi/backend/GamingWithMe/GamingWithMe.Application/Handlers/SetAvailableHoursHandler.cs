using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class SetAvailableHoursHandler : IRequestHandler<SetAvailableHoursCommand, bool>
    {
        private readonly IAsyncRepository<User> _repo;
        private readonly IAsyncRepository<UserAvailability> _arepo;


        public SetAvailableHoursHandler(IAsyncRepository<User> repo, IAsyncRepository<UserAvailability> arepo)
        {
            _repo = repo;
            _arepo = arepo;
        }
        public async Task<bool> Handle(SetAvailableHoursCommand request, CancellationToken cancellationToken)
        {
            var kalapacs = (await _repo.ListAsync(cancellationToken)).FirstOrDefault(x => x.UserId == request.userId);

            var userid = kalapacs?.Id ?? throw new Exception("hiba");

            var user = await _repo.GetByIdAsync(userid, cancellationToken, g => g.DailyAvailability);

            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            user.DailyAvailability.Clear();


            foreach (var kvp in request.Hours.Days)
            {
                var day = kvp.Key;
                var timeRange = kvp.Value;

                if (!TimeSpan.TryParse(timeRange.From, out var start) || !TimeSpan.TryParse(timeRange.Duration, out var end))
                {
                    throw new FormatException($"Invalid time format: {timeRange.From} - {timeRange.Duration}");
                }

                if (start >= end)
                {
                    throw new ArgumentException($"Start time must be before end time: {start} - {end}");
                }


            }

            return true;


        }
    }
}
