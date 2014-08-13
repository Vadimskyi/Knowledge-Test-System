using System.Collections.Generic;

namespace TestApplication
{
    public class UserRole
    {
        public int Id { get; set; }
        public string RoleName { get; set; }

        public virtual ICollection<User> Users { get; set; }
    }
}
