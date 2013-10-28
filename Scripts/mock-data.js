var my = my || {};

my.dataservice = (function (my) {
    "use strict";
    var getTests = function () {
        return my.sampleTests;
    };
    return {
        getTest: getTests
    };
})(my);

/*my.sampleTests = (function (my) {
    "use strict";
    var data = null; {
        Questions: [
            {
                QuestionID: 1,
                QuestionName: "How old are you?",
                Answers: [
                    { AnswerID: 1, AnswerText: "I`m 19", QuestionID: 1, IsCorrectAnswer: false },
                    { AnswerID: 2, AnswerText: "I`m 21", QuestionID: 1, IsCorrectAnswer: false },
                    { AnswerID: 3, AnswerText: "I`m 20", QuestionID: 1, IsCorrectAnswer: true },
                    { AnswerID: 4, AnswerText: "I`m 54", QuestionID: 1, IsCorrectAnswer: false }
                ],
                QuestionType: "default"
            },
            {
                QuestionID: 2,
                QuestionName: "What is your name?",
                Answers: [
                    { AnswerID: 5, AnswerText: "My name is Vasya", QuestionID: 2, IsCorrectAnswer: false },
                    { AnswerID: 6, AnswerText: "My name is Vadim", QuestionID: 2, IsCorrectAnswer: true },
                    { AnswerID: 7, AnswerText: "My name is Masha", QuestionID: 2, IsCorrectAnswer: false },
                    { AnswerID: 8, AnswerText: "My name is Jenya", QuestionID: 2, IsCorrectAnswer: false }
                ],
                QuestionType: "default"
            },
            {
                QuestionID: 3,
                QuestionName: "Did you like this test-system?",
                Answers: [
                    { AnswerID: 9, AnswerText: "Yes", QuestionID: 3, IsCorrectAnswer: true },
                    { AnswerID: 10, AnswerText: "Yes", QuestionID: 3, IsCorrectAnswer: true },
                    { AnswerID: 11, AnswerText: "Yes", QuestionID: 3, IsCorrectAnswer: true },
                    { AnswerID: 12, AnswerText: "No", QuestionID: 3, IsCorrectAnswer: false }
                ],
                QuestionType: "many"
            },
            {
                QuestionID: 4,
                QuestionName: "Random test. Don`t mind?",
                Answers: [
                    { AnswerID: 13, AnswerText: "no", QuestionID: 4, IsCorrectAnswer: true },
                    { AnswerID: 14, AnswerText: "no", QuestionID: 4, IsCorrectAnswer: true },
                    { AnswerID: 15, AnswerText: "Yes", QuestionID: 4, IsCorrectAnswer: true },
                    { AnswerID: 16, AnswerText: "No", QuestionID: 4, IsCorrectAnswer: false }
                ],
                QuestionType: "many"
            }
        ]
    };
    var get = (function () {
        if (data === null) {
            data = $.mockJSON.generateFromTemplate({
                "Questions|4-4": [{
                    "QuestionID|+1": 1,
                    "QuestionName": "@LETTER_UPPER@LOREM_IPSUM" + '?',
                    "Answers|4-4": [{
                        "AnswerID|+1": 1,
                        "AnswerText": "@LETTER_UPPER@LOREM_IPSUM",
                        "QuestionID|+1": _.uniqueId(),
                        "IsCorrectAnswer|0-1": false
                    }],
                    "QuestionType": "@CITY_NAME"
                }]
            })
        }
        return data;
    })();
    return { data: data };
})(my);*/