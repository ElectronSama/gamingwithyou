using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

namespace GamingWithMe.Application.Services
{
    public class UsernameValidationService
    {
        private static readonly HashSet<string> ForbiddenUsernames = new(StringComparer.OrdinalIgnoreCase)
        {
            "admin", "administrator", "root", "system", "api", "www", "mail", "email",
            "support", "help", "info", "contact", "about", "terms", "privacy", "legal",
            "test", "demo", "sample", "example", "null", "undefined", "anonymous",
            "guest", "user", "player", "gamer", "mod", "moderator", "staff",
            "bot", "robot", "automated", "service", "noreply", "no-reply",
            "fuck", "shit", "damn", "hell", "ass", "bitch", "bastard", "crap"
        };

        public static void ValidateUsername(string username)
        {
            if (string.IsNullOrWhiteSpace(username))
                throw new InvalidOperationException("Username cannot be empty.");

            if (username.Length < 3)
                throw new InvalidOperationException("Username must be at least 3 characters long.");

            if (username.Length > 50)
                throw new InvalidOperationException("Username cannot be longer than 50 characters.");

            if (!Regex.IsMatch(username, @"^[a-zA-Z0-9_]+$"))
                throw new InvalidOperationException("Username can only contain letters, numbers, and underscores.");

            if (username.StartsWith("_") || username.EndsWith("_"))
                throw new InvalidOperationException("Username cannot start or end with an underscore.");

            if (username.Contains("__"))
                throw new InvalidOperationException("Username cannot contain consecutive underscores.");

            if (Regex.IsMatch(username, @"^\d+$"))
                throw new InvalidOperationException("Username cannot be only numbers.");

            if (ForbiddenUsernames.Contains(username))
                throw new InvalidOperationException("This username is not allowed. Please choose a different one.");

            if (username.Length >= 3 && Regex.IsMatch(username, @"(.)\1{2,}"))
                throw new InvalidOperationException("Username cannot contain more than 2 consecutive identical characters.");
        }

        public static string GenerateUsernameFromEmail(string email)
        {
            var username = email.Split('@')[0];
            username = Regex.Replace(username, @"[^a-zA-Z0-9_]", "");
            
            username = username.Trim('_');
            
            if (username.Length < 3)
            {
                username = $"user{DateTime.Now.Ticks % 10000}";
            }
            
            if (Regex.IsMatch(username, @"^\d+$"))
            {
                username = $"user{username}";
            }

            return username;
        }

        public static string EnsureUniqueUsername(string baseUsername, List<string> existingUsernames)
        {
            if (!existingUsernames.Any(u => string.Equals(u, baseUsername, StringComparison.OrdinalIgnoreCase)))
            {
                return baseUsername;
            }

            int counter = 1;
            string uniqueUsername;
            do
            {
                uniqueUsername = $"{baseUsername}{counter}";
                counter++;
            }
            while (existingUsernames.Any(u => string.Equals(u, uniqueUsername, StringComparison.OrdinalIgnoreCase)));

            return uniqueUsername;
        }
    }
}