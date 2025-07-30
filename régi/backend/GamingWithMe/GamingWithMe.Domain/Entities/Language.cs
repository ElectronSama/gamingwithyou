using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Domain.Entities
{
    public class Language
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public ICollection<UserLanguage> Players { get; set; }

        public Language()
        {
            
        }

        public Language(string name)
        {
            Name = name;
            Players = new List<UserLanguage>();
        }
    }
}
