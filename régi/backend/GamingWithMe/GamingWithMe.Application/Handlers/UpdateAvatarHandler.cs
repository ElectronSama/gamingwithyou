using Amazon.S3;
using Amazon.S3.Model;
using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class UpdateAvatarHandler : IRequestHandler<UpdateAvatarCommand, string>
    {
        private readonly IAsyncRepository<User> _userRepository;
        private readonly IAmazonS3 _s3Client;
        private readonly string _bucketName = "gamingwithme";

        public UpdateAvatarHandler(IAsyncRepository<User> userRepository, IAmazonS3 s3Client)
        {
            _userRepository = userRepository;
            _s3Client = s3Client;
        }

        public async Task<string> Handle(UpdateAvatarCommand request, CancellationToken cancellationToken)
        {
            var user = (await _userRepository.ListAsync(cancellationToken))
                .FirstOrDefault(u => u.UserId == request.UserId);

            if (user == null)
            {
                throw new ApplicationException("User not found.");
            }

            var oldAvatarUrl = user.AvatarUrl;

            var file = request.AvatarFile;
            var key = $"avatars/{user.Id}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            var putRequest = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = key,
                InputStream = file.OpenReadStream(),
                ContentType = file.ContentType
            };

            await _s3Client.PutObjectAsync(putRequest, cancellationToken);
            var newAvatarUrl = $"https://{_bucketName}.s3.{_s3Client.Config.RegionEndpoint.SystemName}.amazonaws.com/{key}";

            user.AvatarUrl = newAvatarUrl;
            await _userRepository.Update(user);

            if (!string.IsNullOrEmpty(oldAvatarUrl))
            {
                try
                {
                    var oldKey = new Uri(oldAvatarUrl).AbsolutePath.TrimStart('/');
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

            return newAvatarUrl;
        }
    }
}