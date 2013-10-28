using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Globalization;
using System.Runtime.Serialization;

namespace JumpStartTest
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