using Amazon.S3;
using Amazon.S3.Model;
using AutoMapper;
using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Dtos;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class CreateGameEasterEggHandler : IRequestHandler<CreateGameEasterEggCommand, GameEasterEggDto>
    {
        private readonly IAsyncRepository<GameEasterEgg> _easterEggRepository;
        private readonly IAsyncRepository<Game> _gameRepository;
        private readonly IAmazonS3 _s3Client;
        private readonly IMapper _mapper;
        private readonly string _bucketName = "gamingwithme";

        public CreateGameEasterEggHandler(
            IAsyncRepository<GameEasterEgg> easterEggRepository,
            IAsyncRepository<Game> gameRepository,
            IAmazonS3 s3Client,
            IMapper mapper)
        {
            _easterEggRepository = easterEggRepository;
            _gameRepository = gameRepository;
            _s3Client = s3Client;
            _mapper = mapper;
        }

        public async Task<GameEasterEggDto> Handle(CreateGameEasterEggCommand request, CancellationToken cancellationToken)
        {
            var game = await _gameRepository.GetByIdAsync(request.GameId, cancellationToken);
            if (game == null)
            {
                throw new ApplicationException($"Game with ID {request.GameId} not found");
            }

            var easterEggId = Guid.NewGuid();
            var key = $"easter-eggs/{request.GameId}/{easterEggId}{Path.GetExtension(request.ImageFile.FileName)}";

            var putRequest = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = key,
                InputStream = request.ImageFile.OpenReadStream(),
                ContentType = request.ImageFile.ContentType
            };

            await _s3Client.PutObjectAsync(putRequest, cancellationToken);
            var imageUrl = $"https://{_bucketName}.s3.{_s3Client.Config.RegionEndpoint.SystemName}.amazonaws.com/{key}";

            var easterEgg = new GameEasterEgg(
                request.Description,
                imageUrl,
                request.GameId
            )
            {
                Id = easterEggId
            };

            await _easterEggRepository.AddAsync(easterEgg, cancellationToken);

            return _mapper.Map<GameEasterEggDto>(easterEgg);
        }
    }
}