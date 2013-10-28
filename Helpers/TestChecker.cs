using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace JumpStartTest.Helpers
{
    public class TestChecker
    {
        EFDbContext _db;
        public TestChecker(EFDbContext db)
        {
            _db = db;
        }

        public int CheckTest(SubmitedTest test)
        {
            int correctAnswers = 0;
            foreach (var que in test.Questions)
            {
                int key = _db.QuestionTypes.Where(n => n.Id == que.QuestionTypeId).Select(q => q.Key).FirstOrDefault();
                switch (key)
                {
                    case 1: //один ответ из нескольких
                        {
                            if (que.Answers == null)
                                break;
                            if (que.Answers.FirstOrDefault() == null)
                                break;

                            int answId = int.Parse(que.Answers.FirstOrDefault());
                            if (_db.Answers.Where(a => a.Id == answId).First().IsCorrectAnswer)
                                correctAnswers++;
                        }
                        break;
                    case 2: //несколько ответов
                        {
                            if (que.Answers == null)
                                break;
                            if (que.Answers.FirstOrDefault() == null)
                                break;

                            bool isCorrect = true;
                            IQueryable<Answer> answers = _db.Answers.Where(n => n.QuestionId == que.QuestionId);
                            int answersCount = answers.Where(n => n.IsCorrectAnswer == true).Count();

                            int count = 0;

                            foreach (string ans in que.Answers)
                            {
                                int answId = int.Parse(ans);
                                if (!answers.Where(a => a.Id == answId).First().IsCorrectAnswer)
                                {
                                    isCorrect = false;
                                }
                                count++;
                            }

                            if (count != answersCount)
                                isCorrect = false;

                            if (isCorrect)
                                correctAnswers++;
                        }
                        break;
                    case 3: //один ответ
                        {
                            if (que.Answers == null)
                                break;
                            if (que.Answers.FirstOrDefault() == null)
                                break;

                            string answ = que.Answers.FirstOrDefault();
                            IQueryable<Answer> answers = _db.Answers.Where(n => n.QuestionId == que.QuestionId);
                            if (answ.ToUpper() == answers.FirstOrDefault().AnswerText.ToUpper())
                                correctAnswers++;
                        }
                        break;
                }
            }
            return correctAnswers;
        }
    }
}