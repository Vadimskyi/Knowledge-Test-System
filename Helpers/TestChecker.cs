using System;
using System.Linq;

namespace TestApplication.Helpers
{
    public class TestChecker
    {
        private EFDbContext _db;

        public TestChecker(EFDbContext db)
        {
            _db = db;
        }

        public int CheckTest(SubmitedTest test)
        {
            int correctAnswers = 0;

            foreach (var question in test.Questions)
            {
                int key = _db.QuestionTypes.Where(n => n.Id == question.QuestionTypeId).Select(q => q.Key).FirstOrDefault();
                switch (key)
                {
                    case 1: //один ответ из нескольких
                        {
                            if (question.Answers == null || question.Answers.FirstOrDefault() == null)
                                break;

                            int answId;
                            int.TryParse(question.Answers.FirstOrDefault(), out answId);
                            if (_db.Answers.First(a => a.Id == answId).IsCorrectAnswer)
                                correctAnswers++;
                        }
                        break;
                    case 2: //несколько ответов
                        {
                            if (question.Answers == null || question.Answers.FirstOrDefault() == null)
                                break;

                            bool isCorrect = true;
                            IQueryable<Answer> answers = _db.Answers.Where(n => n.QuestionId == question.QuestionId);
                            int answersCount = answers.Count(n => n.IsCorrectAnswer);

                            int count = 0;

                            foreach (string ans in question.Answers)
                            {
                                int answId = int.Parse(ans);
                                if (!answers.First(a => a.Id == answId).IsCorrectAnswer)
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
                            if (question.Answers == null)
                                break;
                            if (question.Answers.FirstOrDefault() == null)
                                break;

                            string submintedAnswer = question.Answers.FirstOrDefault();
                            IQueryable<Answer> answers = _db.Answers.Where(n => n.QuestionId == question.QuestionId);
                            var answer = answers.FirstOrDefault();
                            if (answer != null && String.Equals(submintedAnswer, answer.AnswerText, StringComparison.CurrentCultureIgnoreCase))
                                correctAnswers++;
                        }
                        break;
                }
            }
            return correctAnswers;
        }
    }
}