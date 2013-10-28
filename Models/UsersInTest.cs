using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace JumpStartTest
{
    public class UsersInTest
    {
        [Key, Column(Order = 0)]
        public int TestId { get; set; }
        //public Test Test { get; set; }
        [Key, Column(Order = 1)]
        public int UserId { get; set; }
        //public User User { get; set; }

        public virtual User User { get; set; }
        public virtual Test Test { get; set; }
    }
}