using Microsoft.AspNetCore.Http;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Linq;

namespace GamingWithMe.Api.Swagger
{
    public class FileUploadOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var formParameters = context.ApiDescription.ParameterDescriptions
                .Where(p => p.Source.Id == "Form" || p.Source.Id == "FormFile");

            if (!formParameters.Any())
            {
                return;
            }

            var uploadFileMediaType = new OpenApiMediaType()
            {
                Schema = new OpenApiSchema()
                {
                    Type = "object",
                    Properties = formParameters.ToDictionary(
                        p => p.Name,
                        p => new OpenApiSchema()
                        {
                            Type = p.Type == typeof(IFormFile) ? "string" : null,
                            Format = p.Type == typeof(IFormFile) ? "binary" : null,
                            Description = p.ModelMetadata?.Description
                        })
                }
            };

            operation.RequestBody = new OpenApiRequestBody
            {
                Content = { ["multipart/form-data"] = uploadFileMediaType }
            };
        }
    }
}