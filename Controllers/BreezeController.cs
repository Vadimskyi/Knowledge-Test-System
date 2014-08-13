using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Breeze.WebApi;
using Newtonsoft.Json.Linq;

namespace TestApplication.Controllers
{
    [BreezeController]
    [AllowAnonymous]
    public class BreezeController : ApiController
    {
        private readonly EFContextProvider<EFDbContext> _contextProvider =  new EFContextProvider<EFDbContext>();

        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            var error = new EntityError();
            error.ErrorMessage = "success";
            var entityErrors = new List<EntityError>() { error };
            var sr = new SaveResult() { Errors = entityErrors.Cast<object>().ToList() };
            return sr;
        }

        [HttpGet]
        public object Lookups()
        {
            var userRoles = _contextProvider.Context.UserRoles;
            var statistics = _contextProvider.Context.Statistics;
            var testRestrictions = _contextProvider.Context.TestRestrictions;
            var questionType = _contextProvider.Context.QuestionTypes;
            return new { userRoles, statistics, testRestrictions, questionType };
        }

        [HttpGet]
        public IQueryable<Test> Tests()
        {
            return _contextProvider.Context.Tests;
        }

        [HttpGet]
        public IQueryable<User> Users()
        {
            return _contextProvider.Context.Users;
        }

        [HttpGet]
        public IQueryable<Question> Questions()
        {
            return _contextProvider.Context.Questions.Include("Answers");
        }

        [HttpGet]
        public IQueryable<QuestionType> QuestionTypes()
        {
            return _contextProvider.Context.QuestionTypes;
        }

        [HttpGet]
        public IQueryable<Answer> Answers()
        {
            return _contextProvider.Context.Answers;
        }

        [HttpGet]
        public IQueryable<UsersInTest> UsersInTests()
        {
            return _contextProvider.Context.UsersInTests;
        }
    }
}