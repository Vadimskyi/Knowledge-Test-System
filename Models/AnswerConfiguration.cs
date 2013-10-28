using System.Data.Entity.ModelConfiguration;

namespace JumpStartTest
{
    public class AnswerConfiguration : EntityTypeConfiguration<Answer>
    {
        public AnswerConfiguration()
        {
            HasKey(a => new { a.QuestionId });
            //
            /*HasRequired(a => a.Questions)
                .WithMany(s => s.Answers)
                .HasForeignKey(a => a.QuestionId)
                .WillCascadeOnDelete(false);*/
            //
        }
    }
}