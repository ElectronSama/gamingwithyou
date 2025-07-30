using GamingWithMe.Application.Commands;
using GamingWithMe.Application.Interfaces;
using GamingWithMe.Domain.Entities;
using MediatR;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Application.Handlers
{
    public class CreateProductHandler : IRequestHandler<CreateProductCommand, Stripe.Product>
    {
        private readonly ProductService _productService;
        private readonly IAsyncRepository<Domain.Entities.Product> _productRepository;
        private readonly IAsyncRepository<User> _userRepository;

        public CreateProductHandler(ProductService productService, IAsyncRepository<Domain.Entities.Product> productRepository, IAsyncRepository<User> userRepository)
        {
            _productService = productService;
            _productRepository = productRepository;
            _userRepository = userRepository;
        }

        public async Task<Stripe.Product> Handle(CreateProductCommand request, CancellationToken cancellationToken)
        {
            var dto = request.ProductDto;

            var productOptions = new ProductCreateOptions
            {
                Name = dto.title,
                Description = dto.description,
                DefaultPriceData = new ProductDefaultPriceDataOptions
                {
                    UnitAmount = dto.price * 100,
                    Currency = "usd",

                },
                
            };

            var stripeProduct = await _productService.CreateAsync(productOptions);

            var user = (await _userRepository.ListAsync()).FirstOrDefault(x=> x.UserId == request.userId);

            if(user is null)
            {
                throw new InvalidOperationException("User not found");
            }

            var product = new Domain.Entities.Product
            {
                Title = dto.title,
                Description = dto.description,
                Price = dto.price,
                Duration = dto.duration,
                UserId = user.Id,
                StripePriceId = stripeProduct.DefaultPriceId,
            };

            await _productRepository.AddAsync(product);

            return stripeProduct;
        }
    }
}
