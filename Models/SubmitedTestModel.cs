using System.Collections.Generic;

namespace TestApplication
{
    public class StartTestObject
    {
        public int TestId { get; set; }
        public int UserId { get; set; }
    }

    public class SubmitedTest
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public IEnumerable<SubmitedQuestion> Questions { get; set; }
    }

    public class SubmitedQuestion
    {
        public int QuestionId { get; set; }
        public int QuestionTypeId { get; set; }
        public IEnumerable<string> Answers{ get; set; }
    }
}