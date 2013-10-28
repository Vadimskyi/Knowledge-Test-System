using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JumpStartTest
{
    public class Test
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public int OwnerId { get; set; }
        public User Owner { get; set; }

        public int RestrictionId { get; set; }
        public virtual TestRestriction Restriction { get; set; }

        public string Tags { get; set; }

        public virtual ICollection<Question> Questions { get; set; }
        public virtual ICollection<UsersInTest> Participants { get; set; }
        public virtual ICollection<Statistic> Statistics { get; set; }
    }
}
