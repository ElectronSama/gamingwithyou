using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class DeleteGameEventHandler : IRequestHandler<DeleteGameEventCommand, bool>
    {
        private readonly IAsyncRepository<GameEvent> _eventRepository;

        public DeleteGameEventHandler(IAsyncRepository<GameEvent> eventRepository)
        {
            _eventRepository = eventRepository;
        }

        public async Task<bool> Handle(DeleteGameEventCommand request, CancellationToken cancellationToken)
        {
            var gameEvent = await _eventRepository.GetByIdAsync(request.EventId, cancellationToken);
            if (gameEvent == null)
            {
                return false;
            }

            await _eventRepository.Delete(gameEvent);
            return true;
        }
    }
}