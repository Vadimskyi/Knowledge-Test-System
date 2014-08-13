using System.Data.Entity.ModelConfiguration;

namespace TestApplication
{
    public class QuestionConfiguration : EntityTypeConfiguration<Question>
    {
        public QuestionConfiguration()
        {
            HasKey(a => new { a.TestId });

        }
    }
}