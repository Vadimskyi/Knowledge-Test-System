using System.Data.Entity.ModelConfiguration;

namespace JumpStartTest
{
    public class QuestionConfiguration : EntityTypeConfiguration<Question>
    {
        public QuestionConfiguration()
        {
            HasKey(a => new { a.TestId });
            //
            /*HasRequired(a => a.Test)
                .WithMany(s => s.Questions)
                .HasForeignKey(a => a.TestId)
                .WillCascadeOnDelete(false);*/
            //

        }
    }
}