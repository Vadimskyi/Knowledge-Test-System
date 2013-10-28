using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JumpStartTest
{
    public class QuestionType
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public int Key { get; set; }

        public virtual ICollection<Question> Questions { get; set; }
    }
}
