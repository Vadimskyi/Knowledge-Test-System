using System.Configuration;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Data.Objects.DataClasses;


namespace JumpStartTest
{
    public class EFDbContext : DbContext
    {
        public EFDbContext() : base(nameOrConnectionString: "TestAppDb") { }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
            //Database.SetInitializer(new MyDbInitializer());
            
            modelBuilder.Entity<Test>().HasMany(t => t.Questions).WithRequired()
                .HasForeignKey(q => q.TestId);

            modelBuilder.Entity<Question>().HasMany(t => t.Answers).WithRequired()
               .HasForeignKey(q => q.QuestionId);

            modelBuilder.Entity<Question>().HasRequired(q => q.QuestionType).WithMany(t => t.Questions).HasForeignKey(k => k.QuestionTypeId).WillCascadeOnDelete(false);

            modelBuilder.Entity<User>().HasRequired(u => u.UserRole).WithMany(r => r.Users).HasForeignKey(a => a.UserRoleId).WillCascadeOnDelete(false);

            /*modelBuilder.Entity<User>().HasMany(y => y.MyTests).WithMany(p => p.Participants).Map(m =>
            {
                m.MapLeftKey("UserId");
                m.MapRightKey("TestId");
                m.ToTable("UsersInTest");
            });*/

            modelBuilder.Entity<Test>().HasRequired(ct => ct.Owner).WithMany(r => r.CreatedTests).HasForeignKey(t => t.OwnerId).WillCascadeOnDelete(false);

            modelBuilder.Entity<Test>().HasRequired(r => r.Restriction).WithMany().HasForeignKey(k => k.RestrictionId).WillCascadeOnDelete(false);

            modelBuilder.Entity<Statistic>().HasKey(k => new { k.UserId, k.TestId });
            modelBuilder.Entity<Statistic>().HasRequired(s => s.User).WithMany(u => u.Statistics).HasForeignKey(k => k.UserId).WillCascadeOnDelete(false);
            modelBuilder.Entity<Statistic>().HasRequired(s => s.Test).WithMany(u => u.Statistics).HasForeignKey(k => k.TestId).WillCascadeOnDelete(false);
            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Test> Tests { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<QuestionType> QuestionTypes { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<TestRestriction> TestRestrictions { get; set; }
        public DbSet<Statistic> Statistics { get; set; }
        public DbSet<UsersInTest> UsersInTests { get; set; }
    }
}
