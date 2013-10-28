using DotNetOpenAuth.AspNet;
using Microsoft.Web.WebPages.OAuth;
using JumpStartTest.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Web.Helpers;
using System.Web.Http;
using System.Web.Security;
using System.Threading;
using WebMatrix.WebData;

using System.Transactions;
using System.Web;
using JumpStartTest.Helpers;

namespace JumpStartTest.Controllers
{
    [ModelValidation]
    public class TestController : ApiController
    {
        EFDbContext _db = new EFDbContext();

        [HttpPost]
        [HttpOptions]
        public bool SaveTest(Test test)
        {
            _db.TestRestrictions.Add(test.Restriction);
            _db.Tests.Add(test);
            _db.SaveChanges();
            var test1 = test;
            return true;
        }

        [HttpPost]
        [HttpOptions]
        public bool StartTest(StartTestObject test)
        {
            if (test == null)
                throw new ArgumentNullException();

            Statistic s = new Statistic()
            {
                TestId = test.TestId,
                UserId = test.UserId,
                StartDate = DateTime.Now.ToShortDateString() + "  " + DateTime.Now.ToShortTimeString(),
                EndDate = null
            };
            _db.Statistics.Add(s);
            _db.SaveChanges();
            Test tes = _db.Tests.Where(t => t.Id == test.TestId).First();
            tes.Statistics.Add(s);
            User use = _db.Users.Where(u => u.Id == test.UserId).First();
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
            TestChecker tc = new TestChecker(_db);
            int percent = tc.CheckTest(test);
            Statistic st = null;

            try
            {
                st = _db.Statistics.Where(s => (s.TestId == test.Id && s.UserId == test.UserId)).First();
            }
            catch (Exception ex) { return 0; }

            st.EndDate = DateTime.Now.ToShortDateString() + "  " + DateTime.Now.ToShortTimeString();
            st.Progress = percent + "/" + _db.Questions.Where(q => q.TestId == test.Id).Count();
            _db.SaveChanges();
            return percent;
        }
    }
}