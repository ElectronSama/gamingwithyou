using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class DeleteNewsItemHandler : IRequestHandler<DeleteNewsItemCommand, bool>
    {
        private readonly IAsyncRepository<GameNews> _repo;

        public DeleteNewsItemHandler(IAsyncRepository<GameNews> repo)
        {
            _repo = repo;
        }

        public async Task<bool> Handle(DeleteNewsItemCommand request, CancellationToken cancellationToken)
        {
            var newsItem = await _repo.GetByIdAsync(request.NewsId, cancellationToken);
            
            if (newsItem == null)
            {
                return false;
            }

            await _repo.Delete(newsItem);
            return true;
        }
    }
}