using Amazon.S3;
using Amazon.S3.Model;
using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class DeleteGameEasterEggHandler : IRequestHandler<DeleteGameEasterEggCommand, bool>
    {
        private readonly IAsyncRepository<GameEasterEgg> _easterEggRepository;
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName = "gamingwithme";

        public DeleteGameEasterEggHandler(IAsyncRepository<GameEasterEgg> easterEggRepository, IAmazonS3 s3Client)
        {
            _easterEggRepository = easterEggRepository;
            _s3Client = s3Client;
        }

        public async Task<bool> Handle(DeleteGameEasterEggCommand request, CancellationToken cancellationToken)
        {
            var easterEgg = await _easterEggRepository.GetByIdAsync(request.EasterEggId, cancellationToken);
            if (easterEgg == null)
            {
                return false;
            }

            if (!string.IsNullOrEmpty(easterEgg.ImageUrl))
            {
                try
                {
                    var oldKey = new Uri(easterEgg.ImageUrl).AbsolutePath.TrimStart('/');
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

            await _easterEggRepository.Delete(easterEgg);
            return true;
        }
    }
}