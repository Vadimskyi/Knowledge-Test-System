
namespace TestApplication
{
    public class Statistic
    {
        public int UserId { get; set; }
        public User User { get; set; }
        public int TestId { get; set; }
        public Test Test { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string Progress { get; set; }
    }
}