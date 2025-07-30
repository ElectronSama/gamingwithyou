using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Domain.Entities
{
    public class UserGame
    {
        public Guid PlayerId { get; set; }
        public virtual User Player { get; set; }

        public string Gamename { get; set; }

        public UserGame()
        {
            
        }
    }
}
