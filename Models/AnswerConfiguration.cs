using System.Data.Entity.ModelConfiguration;

namespace TestApplication
{
    public class AnswerConfiguration : EntityTypeConfiguration<Answer>
    {
        public AnswerConfiguration()
        {
            HasKey(a => new { a.QuestionId });
        }
    }
}