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
    public class GetGameEasterEggsByGameIdHandler : IRequestHandler<GetGameEasterEggsByGameIdQuery, List<GameEasterEggDto>>
    {
        private readonly IAsyncRepository<GameEasterEgg> _easterEggRepository;
        private readonly IMapper _mapper;

        public GetGameEasterEggsByGameIdHandler(IAsyncRepository<GameEasterEgg> easterEggRepository, IMapper mapper)
        {
            _easterEggRepository = easterEggRepository;
            _mapper = mapper;
        }

        public async Task<List<GameEasterEggDto>> Handle(GetGameEasterEggsByGameIdQuery request, CancellationToken cancellationToken)
        {
            var easterEggs = (await _easterEggRepository.ListAsync(cancellationToken))
                .Where(e => e.GameId == request.GameId)
                .ToList();

            return _mapper.Map<List<GameEasterEggDto>>(easterEggs);
        }
    }
}