using GamingWithMe.Application.Dtos;
using GamingWithMe.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Interfaces
{
    public interface IGameRepository
    {
        Task<Game> AddAsync(Game game);
        Task<Game?> GetByIdAsync(Guid id);
        Task<IReadOnlyList<Game>> ListAsync();

    }
}
