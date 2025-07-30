using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace GamingWithMe.Domain.Common
{
    public static class SlugGenerator
    {
        private static readonly Regex InvalidChars = new(@"[^a-z0-9\s-]", RegexOptions.Compiled);
        private static readonly Regex MultiSpace = new(@"\s+", RegexOptions.Compiled);

        public static string From(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
                throw new ArgumentException("Input cannot be empty.", nameof(input));

            var v = input.ToLowerInvariant();
            v = InvalidChars.Replace(v, "");
            v = MultiSpace.Replace(v, "-").Trim('-');
            return v;
        }
    }
}
