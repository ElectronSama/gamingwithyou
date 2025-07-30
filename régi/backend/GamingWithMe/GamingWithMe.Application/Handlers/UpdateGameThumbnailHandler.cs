using Amazon.S3;
using Amazon.S3.Model;
using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class UpdateGameThumbnailHandler : IRequestHandler<UpdateGameThumbnailCommand, string>
    {
        private readonly IAsyncRepository<Game> _gameRepository;
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName = "gamingwithme";

        public UpdateGameThumbnailHandler(IAsyncRepository<Game> gameRepository, IAmazonS3 s3Client)
        {
            _gameRepository = gameRepository;
            _s3Client = s3Client;
        }

        public async Task<string> Handle(UpdateGameThumbnailCommand request, CancellationToken cancellationToken)
        {
            var game = await _gameRepository.GetByIdAsync(request.GameId, cancellationToken);
            if (game == null)
            {
                throw new ApplicationException("Game not found.");
            }

            var oldThumbnailUrl = game.ThumbnailUrl;

            var file = request.ThumbnailFile;
            var key = $"thumbnails/games/{game.Id}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            var putRequest = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = key,
                InputStream = file.OpenReadStream(),
                ContentType = file.ContentType
            };

            await _s3Client.PutObjectAsync(putRequest, cancellationToken);
            var newThumbnailUrl = $"https://{_bucketName}.s3.{_s3Client.Config.RegionEndpoint.SystemName}.amazonaws.com/{key}";

            game.ThumbnailUrl = newThumbnailUrl;
            await _gameRepository.Update(game);

            if (!string.IsNullOrEmpty(oldThumbnailUrl))
            {
                try
                {
                    var oldKey = new Uri(oldThumbnailUrl).AbsolutePath.TrimStart('/');
                    await _s3Client.DeleteObjectAsync(new DeleteObjectRequest
                    {
                        BucketName = _bucketName,
                        Key = oldKey
                    }, cancellationToken);
                }
                catch (Exception)
                {
                }
            }

            return newThumbnailUrl;
        }
    }
}