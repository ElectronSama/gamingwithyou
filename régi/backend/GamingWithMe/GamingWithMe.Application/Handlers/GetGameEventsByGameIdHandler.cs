using AutoMapper;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Application.Queries;
using GamingWithMe.Domain.Entities;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class GetGameEventsByGameIdHandler : IRequestHandler<GetGameEventsByGameIdQuery, List<GameEventDto>>
    {
        private readonly IAsyncRepository<GameEvent> _eventRepository;
        private readonly IMapper _mapper;

        public GetGameEventsByGameIdHandler(IAsyncRepository<GameEvent> eventRepository, IMapper mapper)
        {
            _eventRepository = eventRepository;
            _mapper = mapper;
        }

        public async Task<List<GameEventDto>> Handle(GetGameEventsByGameIdQuery request, CancellationToken cancellationToken)
        {
            var events = (await _eventRepository.ListAsync(cancellationToken))
                .Where(e => e.GameId == request.GameId)
                .ToList();

            foreach (var gameEvent in events)
            {
                gameEvent.UpdateStatus();
            }

            return _mapper.Map<List<GameEventDto>>(events);
        }
    }
}