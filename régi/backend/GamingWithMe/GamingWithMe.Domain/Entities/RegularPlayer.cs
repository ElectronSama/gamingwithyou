using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Domain.Entities
{
    public class RegularPlayer : User
    {
        public RegularPlayer() : base() { }
        public RegularPlayer(string userId, string username) : base(userId, username) { }
    }
}
