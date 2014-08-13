using System;
using System.Linq;
using System.Web.Http;
using TestApplication.Filters;
using TestApplication.Helpers;

namespace TestApplication.Controllers
{
    [ModelValidation]
    public class TestController : ApiController
    {
        private readonly EFDbContext _db;

        public TestController(EFDbContext context)
        {
            _db = context;
        }

        [HttpPost]
        [HttpOptions]
        public bool SaveTest(Test test)
        {
            _db.TestRestrictions.Add(test.Restriction);
            _db.Tests.Add(test);
            _db.SaveChanges();
            return true;
        }

        [HttpPost]
        [HttpOptions]
        public bool StartTest(StartTestObject test)
        {
            if (test == null)
                throw new ArgumentNullException();

            var s = new Statistic()
            {
                TestId = test.TestId,
                UserId = test.UserId,
                StartDate = DateTime.Now.ToShortDateString() + "  " + DateTime.Now.ToShortTimeString(),
                EndDate = null
            };
            _db.Statistics.Add(s);
            _db.SaveChanges();
            Test tes = _db.Tests.First(t => t.Id == test.TestId);
            tes.Statistics.Add(s);
            User use = _db.Users.First(u => u.Id == test.UserId);
            use.Statistics.Add(s);
            _db.UsersInTests.Add(new UsersInTest
            {
                Test = tes,
                User = use
            });

            _db.SaveChanges();
            return true;
        }

        [HttpPost]
        [HttpOptions]
        public int SubmitTest(SubmitedTest test)
        {
            var tc = new TestChecker(_db);
            int percent = tc.CheckTest(test);
            Statistic st = null;

            try
            {
                st = _db.Statistics.First(s => (s.TestId == test.Id && s.UserId == test.UserId));
            }
            catch (Exception ex) { return 0; }

            st.EndDate = DateTime.Now.ToShortDateString() + "  " + DateTime.Now.ToShortTimeString();
            st.Progress = percent + "/" + _db.Questions.Count(q => q.TestId == test.Id);
            _db.SaveChanges();
            return percent;
        }
    }
}