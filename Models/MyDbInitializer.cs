using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.Entity;
using System.Web.Security;
using WebMatrix.WebData;

namespace JumpStartTest
{
    public class MyDbInitializer : DropCreateDatabaseAlways<EFDbContext>
    {

        protected override void Seed(EFDbContext context)
        {
            QuestionType qt1 = new QuestionType() { Key = 1, Description = "Select one of the following answers." };
            QuestionType qt2 = new QuestionType() { Key = 2, Description = "Select several of the following answers." };
            QuestionType qt3 = new QuestionType() { Key = 3, Description = "Enter the correct answer to the question." };
            //
            UserRole ur1 = new UserRole() { RoleName = "Administrator"};
            UserRole ur2 = new UserRole() { RoleName = "User" };

            if (!WebSecurity.Initialized)
            {
                WebSecurity.InitializeDatabaseConnection("TestAppDb", "User", "Id", "Login", autoCreateTables: true);
            }

            if (!Roles.RoleExists("Administrator"))
            {
                Roles.CreateRole("Administrator");

            }

            if (!Roles.RoleExists("User"))
            {
                Roles.CreateRole("User");
            }

            //context.SaveChanges();
            //
            Question qe1 = new Question 
            {
                QuestionText = "Which of the following is true?", 
                QuestionType = qt1 
            };

            qe1.Answers = new List<Answer> 
            {
                new Answer() { AnswerText = "IsPostBack is a method of System.UI.Web.Page class", IsCorrectAnswer = false }, 
                new Answer() { AnswerText = "IsPostBack is a method of System.Web.UI.Page class", IsCorrectAnswer = false }, 
                new Answer() { AnswerText = "IsPostBack is a readonly property of System.Web.UI.Page class", IsCorrectAnswer = true }
            };

            Question qe2 = new Question 
            {
                QuestionText = "Select the type Processing model that asp.net simulate", 
                QuestionType = qt1 
            };

            qe2.Answers = new List<Answer> 
            { 
                new Answer() { AnswerText = "Event-driven", IsCorrectAnswer = true },
                new Answer() { AnswerText = "Static", IsCorrectAnswer = false },
                new Answer() { AnswerText = "Linear", IsCorrectAnswer = false },
                new Answer() { AnswerText = "TopDown", IsCorrectAnswer = false },
            };

            Question qe3 = new Question 
            {
                QuestionText = "Abandon is an ASP ________ object method.", 
                QuestionType = qt1 
            };

            qe3.Answers = new List<Answer> 
            { 
                new Answer() { AnswerText = "server", IsCorrectAnswer = false }, 
                new Answer() { AnswerText = "session", IsCorrectAnswer = true }, 
                new Answer() { AnswerText = "request", IsCorrectAnswer = false }, 
                new Answer() { AnswerText = "response", IsCorrectAnswer = false } 
            };

            Question qe4 = new Question 
            {
                QuestionText = "What is a connection object?", 
                QuestionType = qt1 
            };

            qe4.Answers = new List<Answer> 
            { 
                new Answer() { AnswerText = "Specifies whether to use a DSN or DSN-less connection", IsCorrectAnswer = false }, 
                new Answer() { AnswerText = "Specifies which type of database is being used", IsCorrectAnswer = false }, 
                new Answer() { AnswerText = "Specifies the type of driver to use, database format and filename", IsCorrectAnswer = false }, 
                new Answer() { AnswerText = "First opens the initial connection to a database before giving any database information", IsCorrectAnswer = true } 
            };

            Question qe5 = new Question 
            {
                QuestionText = "Which objects is used to create foreign key between tables?", 
                QuestionType = qt1 
            };

            qe5.Answers = new List<Answer> 
            { 
                new Answer() { AnswerText = "DataRelationship", IsCorrectAnswer = false }, 
                new Answer() { AnswerText = "DataRelation", IsCorrectAnswer = true }, 
                new Answer() { AnswerText = "DataConstraint", IsCorrectAnswer = false }, 
                new Answer() { AnswerText = "Datakey", IsCorrectAnswer = false } 
            };
            //
            Question qe6 = new Question 
            {
                QuestionText = "Which one of the following is the last stage of the Web forms lifecycle?", 
                QuestionType = qt1 
            };
            qe6.Answers = new List<Answer> 
            { 
                new Answer() { AnswerText = "Page_Load", IsCorrectAnswer = false }, 
                new Answer() { AnswerText = "Event Handling", IsCorrectAnswer = false }, 
                new Answer() { AnswerText = "Page_Unload", IsCorrectAnswer = true }, 
                new Answer() { AnswerText = "Page_Init", IsCorrectAnswer = false } 
            };

            Question qe7 = new Question 
            {
                QuestionText = "Which of the following is not a requirement when merging modified data into a DataSet?", 
                QuestionType = qt2 
            };
            qe7.Answers = new List<Answer> 
            { 
                new Answer() { AnswerText = "A primary key must be defined on the DataTable objects", IsCorrectAnswer = true }, 
                new Answer() { AnswerText = "The DataSet schemas must match in order to merge", IsCorrectAnswer = true }, 
                new Answer() { AnswerText = "The destination DataSet must be empty prior to merging", IsCorrectAnswer = false }, 
                new Answer() { AnswerText = "A DataSet must be merged into the same DataSet that created it.", IsCorrectAnswer = true } 
            };

            Question qe8 = new Question { QuestionText = "Random question. Don`t mind?", QuestionType = qt2 };
            qe8.Answers = new List<Answer> { new Answer() { AnswerText = "no", IsCorrectAnswer = true }, new Answer() { AnswerText = "Yes", IsCorrectAnswer = false }, new Answer() { AnswerText = "no", IsCorrectAnswer = true }, new Answer() { AnswerText = "No", IsCorrectAnswer = true } };
            Question qe9 = new Question { QuestionText = "How old are you?", QuestionType = qt1 };
            qe9.Answers = new List<Answer> { new Answer() { AnswerText = "19", IsCorrectAnswer = false }, new Answer() { AnswerText = "20", IsCorrectAnswer = true }, new Answer() { AnswerText = "21", IsCorrectAnswer = false }, new Answer() { AnswerText = "54", IsCorrectAnswer = false } };
            Question qe10 = new Question { QuestionText = "What is your name?", QuestionType = qt2 };
            qe10.Answers = new List<Answer> { new Answer() { AnswerText = "Vadim", IsCorrectAnswer = true }, new Answer() { AnswerText = "Petya", IsCorrectAnswer = false }, new Answer() { AnswerText = "Vasya", IsCorrectAnswer = false }, new Answer() { AnswerText = "Jenya", IsCorrectAnswer = false } };
            Question qe11 = new Question { QuestionText = "Did you like this test-system?", QuestionType = qt1 };
            qe11.Answers = new List<Answer> { new Answer() { AnswerText = "Yes", IsCorrectAnswer = true }, new Answer() { AnswerText = "Yes", IsCorrectAnswer = true }, new Answer() { AnswerText = "Yes", IsCorrectAnswer = true }, new Answer() { AnswerText = "No", IsCorrectAnswer = false } };
            Question qe12 = new Question { QuestionText = "Random question. Don`t mind?", QuestionType = qt3 };
            qe12.Answers = new List<Answer> { new Answer() { AnswerText = "no", IsCorrectAnswer = true }, new Answer() { AnswerText = "Yes", IsCorrectAnswer = false }, new Answer() { AnswerText = "no", IsCorrectAnswer = true }, new Answer() { AnswerText = "No", IsCorrectAnswer = true } };
            Question qe13 = new Question { QuestionText = "How old are you?", QuestionType = qt1 };
            qe13.Answers = new List<Answer> { new Answer() { AnswerText = "19", IsCorrectAnswer = false }, new Answer() { AnswerText = "20", IsCorrectAnswer = true }, new Answer() { AnswerText = "21", IsCorrectAnswer = false }, new Answer() { AnswerText = "54", IsCorrectAnswer = false } };
            Question qe14 = new Question { QuestionText = "What is your name?", QuestionType = qt2 };
            qe14.Answers = new List<Answer> { new Answer() { AnswerText = "Vadim", IsCorrectAnswer = true }, new Answer() { AnswerText = "Petya", IsCorrectAnswer = false }, new Answer() { AnswerText = "Vasya", IsCorrectAnswer = false }, new Answer() { AnswerText = "Jenya", IsCorrectAnswer = false } };
            Question qe15 = new Question { QuestionText = "Did you like this test-system?", QuestionType = qt1 };
            qe15.Answers = new List<Answer> { new Answer() { AnswerText = "Yes", IsCorrectAnswer = true }, new Answer() { AnswerText = "Yes", IsCorrectAnswer = true }, new Answer() { AnswerText = "Yes", IsCorrectAnswer = true }, new Answer() { AnswerText = "No", IsCorrectAnswer = false } };
            Question qe16 = new Question { QuestionText = "Random question. Don`t mind?", QuestionType = qt3 };
            qe16.Answers = new List<Answer> { new Answer() { AnswerText = "no", IsCorrectAnswer = true }, new Answer() { AnswerText = "Yes", IsCorrectAnswer = false }, new Answer() { AnswerText = "no", IsCorrectAnswer = true }, new Answer() { AnswerText = "No", IsCorrectAnswer = true } };
            //
            Test t1 = new Test { Name = "ASP.NET Test", Description = "temporary test for testing my test application #1", Tags = "ASP, C#, .NET" };
            Test t2 = new Test { Name = "SecondTest", Description = "temporary test for testing my test application #2", Tags = "qwerty" };
            Test t3 = new Test { Name = "ThirdTest", Description = "temporary test for testing my test application #3", Tags = "qwerty" };
            Test t4 = new Test { Name = "FourthTest", Description = "temporary test for testing my test application #4", Tags = "qwerty" };
            //
            TestRestriction tr1 = new TestRestriction() {TimeLimit = 30, AttemptsNumber = 3, IsPrivate=false };
            TestRestriction tr2 = new TestRestriction() { TimeLimit = 45, AttemptsNumber = 3, IsPrivate = false };
            TestRestriction tr3 = new TestRestriction() { TimeLimit = 20, AttemptsNumber = 5, IsPrivate = false };
            TestRestriction tr4 = new TestRestriction() { TimeLimit = 35, AttemptsNumber = 3, IsPrivate = false };
            context.TestRestrictions.Add(tr1);
            context.TestRestrictions.Add(tr2);
            context.TestRestrictions.Add(tr3);
            context.TestRestrictions.Add(tr4);
            //
            t1.Questions = new List<Question> { qe1, qe2, qe3, qe4, qe5, qe6, qe7 };
            t2.Questions = new List<Question> { qe8 };
            t3.Questions = new List<Question> { qe9, qe10, qe11, qe12 };
            t4.Questions = new List<Question> { qe13, qe14, qe15, qe16 };
            //
            User u1 = new User() { FirstName = "Vadim", LastName = "Zakrzewskiy", Login = "admin", Password = "12345678910", Email = "veizxell@gmail.com", Twitter = "@veizxell", Gender = "M", ImageSource = "react1.jpg", Bio = "Im 20 years old. Currently live in Kiev." };
            User u2 = new User() { FirstName = "Petya", LastName = "Zakrzewskiy", Login = "devil", Password = "12345678910", Email = "veizxell@gmail.com", Twitter = "@veizxell", Gender = "M", ImageSource = "react2.jpg", Bio = "Im 20 years old. Currently live in Kiev." };
            User u3 = new User() { FirstName = "Masha", LastName = "Zakrzewskiy", Login = "nagibator", Password = "12345678910", Email = "veizxell@gmail.com", Twitter = "@veizxell", Gender = "M", ImageSource = "react3.jpg", Bio = "Im 20 years old. Currently live in Kiev." };
            User u4 = new User() { FirstName = "Sasha", LastName = "Zakrzewskiy", Login = "fantomas", Password = "12345678910", Email = "veizxell@gmail.com", Twitter = "@veizxell", Gender = "M", ImageSource = "vadim.jpg", Bio = "Im 20 years old. Currently live in Kiev." };
            //
            t1.Owner = u1;
            t2.Owner = u2;
            t3.Owner = u3;
            t4.Owner = u4;

            UsersInTest uit = new UsersInTest 
            {
                User = u1,
                Test = t1
            };

            ur1.Users = new List<User> { u1 };
            ur2.Users = new List<User> { u2, u3, u4 };
            //
            context.UserRoles.Add(ur1);
            context.UserRoles.Add(ur2);

            t1.Restriction = tr1;
            context.Tests.Add(t1);
            context.SaveChanges();

            t2.Restriction = tr2;
            context.Tests.Add(t2);
            context.SaveChanges();

            t3.Restriction = tr3;
            context.Tests.Add(t3);
            context.SaveChanges();

            t4.Restriction = tr4;
            context.Tests.Add(t4);
            context.SaveChanges();

            //


            if (WebSecurity.UserExists("admin"))
            {
                WebSecurity.CreateAccount("admin", "admin123", false);
                Roles.AddUsersToRoles(new string[] { "admin" }, new string[] { "User", "Administrator" });
            }

            if (WebSecurity.UserExists("devil"))
            {
                WebSecurity.CreateAccount("devil", "devil123", false);
                Roles.AddUsersToRoles(new string[] { "devil" }, new string[] { "User" });
            }
        }
    }
}
