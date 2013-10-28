using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JumpStartTest
{
    public class TestRestriction
    {
        public int Id { get; set; }
        public int TimeLimit { get; set; }
        public int AttemptsNumber { get; set; }
        public bool IsPrivate { get; set; }
    }
}