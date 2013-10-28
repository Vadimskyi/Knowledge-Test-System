using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace JumpStartTest
{
    public class User
    {
        public User()
        {
            Gender = " "; // make no assumption
            ImageSource = string.Empty;
        }
        public int Id { get; set; }
        [MaxLength(12)]
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Login { get; set; }
        [MaxLength(16)]
        public string Password { get; set; }
        public string Email { get; set; }
        public string Twitter { get; set; }

        public string Gender { get; set; }
        public string ImageSource { get; set; }
        public string Bio { get; set; }

        public int UserRoleId { get; set; }
        public UserRole UserRole { get; set; }

        public virtual ICollection<Test> CreatedTests { get; set; }
        public virtual ICollection<UsersInTest> MyTests { get; set; }
        public virtual ICollection<Statistic> Statistics { get; set; }
    }
}
