using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using GamingWithMe.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace GamingWithMe.Infrastructure.Repositories
{
    public sealed class GameRepository : IGameRepository
    {
        private readonly ApplicationDbContext _context;

        public GameRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Game> AddAsync(Game game)
        {
            await _context.Games.AddAsync(game);
            await _context.SaveChangesAsync();
            return game;
        }

        public async Task<Game?> GetByIdAsync(Guid id)
        {
            return await _context.Games.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<IReadOnlyList<Game>> ListAsync()
        {
            return await _context.Games.AsNoTracking().ToListAsync();
        }
    }
}
