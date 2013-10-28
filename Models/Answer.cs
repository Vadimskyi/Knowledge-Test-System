using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace JumpStartTest
{
    public class Answer
    {
        public int Id { get; set; }
        public string AnswerText { get; set; }

        public int QuestionId { get; set; }
        //public Question Questions { get; set; }

        public bool IsCorrectAnswer { get; set; }

        public string ImageSource { get; set; }
    }
}
