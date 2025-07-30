using GamingWithMe.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GamingWithMe.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Game> Games => Set<Game>();
        public new DbSet<User> Users => Set<User>();
        public DbSet<UserGame> UserGames => Set<UserGame>();
        public DbSet<Language> Languages => Set<Language>();
        public DbSet<UserLanguage> UserLanguages => Set<UserLanguage>();
        public DbSet<Booking> Bookings => Set<Booking>();
        public DbSet<UserAvailability> UserAvailabilities => Set<UserAvailability>();
        public DbSet<Product> Products => Set<Product>();
        public DbSet<GameNews> GameNews => Set<GameNews>();
        public DbSet<Tag> Tags => Set<Tag>();
        public DbSet<UserTag> UserTags => Set<UserTag>();
        public DbSet<GameEvent> GameEvents => Set<GameEvent>();
        public DbSet<GameEasterEgg> GameEasterEggs => Set<GameEasterEgg>();
        public DbSet<Discount> Discounts => Set<Discount>();
        
        public DbSet<FixedService> FixedServices => Set<FixedService>();
        public DbSet<ServiceOrder> ServiceOrders => Set<ServiceOrder>();
        public DbSet<Notification> Notifications => Set<Notification>();


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>(e =>
            {
                e.HasKey(p => p.Id);
                e.Property(p => p.Username).IsRequired();
                e.HasIndex(p => p.Username).IsUnique();

                e.HasOne(p => p.IdentityUser)
                 .WithMany()
                 .HasForeignKey(p => p.UserId)
                 .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<GameEvent>(e =>
            {
                e.HasKey(x => x.Id);
            
                e.HasOne(x => x.Game)
                    .WithMany(g => g.Events)
                    .HasForeignKey(x => x.GameId)
                    .OnDelete(DeleteBehavior.Cascade);

                e.Property(x => x.PrizePool).HasPrecision(18, 2);
            });

            builder.Entity<GameEasterEgg>(e =>
            {
                e.HasKey(x => x.Id);

                e.HasOne(x => x.Game)
                    .WithMany(g => g.EasterEggs)
                    .HasForeignKey(x => x.GameId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<UserGame>(x =>
            {
                x.HasKey(eg => new { eg.PlayerId, eg.Gamename });

                x.HasOne(eg => eg.Player)
                .WithMany(p => p.Games)
                .HasForeignKey(eg => eg.PlayerId)
                .OnDelete(DeleteBehavior.Cascade);

                x.Property(eg => eg.Gamename)
                .IsRequired()
                .HasMaxLength(100);
            });

            builder.Entity<UserLanguage>(x =>
            {
                x.HasKey(epl => new { epl.PlayerId, epl.LanguageId });

                x.HasOne(epl => epl.Player)
                .WithMany(p => p.Languages)
                .HasForeignKey(epl => epl.PlayerId);

                x.HasOne(epl => epl.Language)
                .WithMany(g => g.Players)
                .HasForeignKey(epl => epl.LanguageId);
            });

            builder.Entity<Booking>(b =>
            {
                b.HasKey(x => x.Id);

                b.HasOne(x => x.Provider)
                    .WithMany()
                    .HasForeignKey(x => x.ProviderId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasOne(x => x.Customer)
                    .WithMany(u => u.Bookings)
                    .HasForeignKey(x => x.CustomerId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<Discount>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(p => p.PercentOff).HasPrecision(18, 2);
                e.HasOne(x => x.User)
                    .WithMany(u => u.Discounts)
                    .HasForeignKey(x => x.UserId);
            });

            builder.Entity<UserTag>(x =>
            {
                x.HasKey(ut => new { ut.UserId, ut.TagId });

                x.HasOne(ut => ut.User)
                    .WithMany(u => u.Tags)
                    .HasForeignKey(ut => ut.UserId);

                x.HasOne(ut => ut.Tag)
                    .WithMany(t => t.Users)
                    .HasForeignKey(ut => ut.TagId);
            });

            builder.Entity<FixedService>(e =>
            {
                e.HasKey(x => x.Id);
                e.Property(x => x.Title).IsRequired().HasMaxLength(200);
                e.Property(x => x.Description).IsRequired();
                
                e.HasOne(x => x.User)
                    .WithMany(u => u.FixedServices)
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<ServiceOrder>(e =>
            {
                e.HasKey(x => x.Id);
                
                e.HasOne(x => x.Service)
                    .WithMany()
                    .HasForeignKey(x => x.ServiceId)
                    .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(x => x.Customer)
                    .WithMany(u => u.ServiceOrders)
                    .HasForeignKey(x => x.CustomerId)
                    .OnDelete(DeleteBehavior.Restrict);

                e.HasOne(x => x.Provider)
                    .WithMany(u => u.ReceivedOrders)
                    .HasForeignKey(x => x.ProviderId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Tag>().HasData(
                new Tag("Gamer") { Id = new Guid("8f676a1d-3d9a-42e7-9476-9a8d88340f53") },
                new Tag("Tiktoker") { Id = new Guid("056f4d3c-6fed-4892-82dc-2f5939f2cdc1") },
                new Tag("Youtuber") { Id = new Guid("2a764c79-6825-4cfa-ad69-3121c33ea657") },
                new Tag("Musician") { Id = new Guid("d7c3984d-5ef3-4a3e-af8d-ff76a38ce679") },
                new Tag("Just chatting") { Id = new Guid("097de202-a9e8-40cf-9648-5ab402fa802d") }
            );

            builder.Entity<Language>().HasData(
                new Language("English") { Id = new Guid("a1c4c9f1-1111-4a2d-8f27-1dfc52f7a100") },
                new Language("Spanish") { Id = new Guid("b2d5e2a2-2222-4a4d-9c36-2aec83b1b200") },
                new Language("French") { Id = new Guid("c3e6f3b3-3333-4b6e-af45-3bfc94c2c300") },
                new Language("German") { Id = new Guid("d4f7e4c4-4444-4c8f-be54-4c0da5d3d400") },
                new Language("Chinese") { Id = new Guid("e5a8d5d5-5555-4da0-af63-5d1eb6e4e500") },
                new Language("Japanese") { Id = new Guid("f6b9c6e6-6666-4eb1-a072-6e2fc7f5f600") },
                new Language("Portuguese") { Id = new Guid("07a0a7f7-7777-4fc2-b181-7f30d8060700") },
                new Language("Russian") { Id = new Guid("18b1b8f8-8888-4fd3-a290-8f41e9171800") }
            );
        }
    }
}
