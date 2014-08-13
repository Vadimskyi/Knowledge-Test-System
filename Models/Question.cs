using System.Collections.Generic;

namespace TestApplication
{
    public class Question
    {

        public int Id { get; set; }
        public string QuestionText { get; set; }

        public int TestId { get; set; }
        public Test Test { get; set; }

        public virtual ICollection<Answer> Answers { get; set; }

        public int QuestionTypeId { get; set; }
        public QuestionType QuestionType { get; set; }

        public string ImageSource { get; set; }
    }
}
