
namespace TestApplication
{
    public class Answer
    {
        public int Id { get; set; }
        public string AnswerText { get; set; }

        public int QuestionId { get; set; }

        public bool IsCorrectAnswer { get; set; }

        public string ImageSource { get; set; }
    }
}
