using GamingWithMe.Application.Dtos;
using MediatR;
using System.Collections.Generic;

namespace GamingWithMe.Application.Queries
{
    public record GetBillingHistoryQuery(string UserId) : IRequest<List<BillingRecordDto>>;
}