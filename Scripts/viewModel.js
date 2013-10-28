$(function () {
    //модель идентична модели из базы данных сервиса
    my.Answer = function () {
        this.answerId = ko.observable();
        this.answerText = ko.observable();
        this.queId = ko.observable();
        //реализовать безопасность. значение этого поля не передавать из сервиса.
        this.isCorrectAnswer = ko.observable();
    };

    my.Question = function () {
        this.questionID = ko.observable();
        this.questionName = ko.observable();
        this.answers = ko.observableArray([]);
        this.questionType = ko.observable();
    };

    my.vm = function () {
        var questions = ko.observableArray([]),

            chosenQuestionId = ko.observable(0),    //по дефолту не выбрано == 0

            chosenQuestionData = ko.observable(),

            checkedAnswer = ko.observable(),

            goToQuestion = function (question) {
                var answId = 0;
                my.vm.chosenQuestionId(question.questionID);
                my.vm.chosenQuestionData(question);
                $.each(question.answers(), function (i, a) {
                    if (a.isCorrectAnswer()) {
                        answId = a.answerId();
                        return;
                    }
                });
                if(!answId)
                {
                    question.answers()[0].isCorrectAnswer(true);
                    answId = question.answers()[0].answerId();
                }
                my.vm.checkedAnswer(answId);
            },

            loadData = function () {
                var Questions = [];
                $.get('/api/test', function (data) {
                    Questions = data;
                    var tmp = 1;
                });

                $.each(Questions, function (i, q) {
                    var quest = new my.Question().questionID(q.QuestionID)
                                                    .questionName(q.QuestionName)
                                                    .questionType(q.QuestionType);
                    var tmp = 1;
                    $.each(q.Answers, function (j, a) {
                        quest.answers.push(new my.Answer().answerId(a.AnswerID)
                                                            .answerText(a.AnswerText)
                                                            .queId(a.QuestionID)
                                                            .isCorrectAnswer(false));
                        var tmp = 1;
                    });
                    my.vm.questions.push(quest);
                });
                var tmp = 1;
            };

        checkedAnswer.subscribe(function (oldValue) {
            if (oldValue == undefined)
                return;
            //$.each(questions(), function (i, q) {
                $.each(chosenQuestionData().answers(), function (j, a) {
                    if (a.answerId() == oldValue) {
                        a.isCorrectAnswer(false);
                        return;
                    }
                });
            //});
        }, this, "beforeChange");

        checkedAnswer.subscribe(function (newValue) {
            //$.each(questions(), function (i, q) {
            $.each(chosenQuestionData().answers(), function (j, a) {
                    if (a.answerId() == newValue) {
                        a.isCorrectAnswer(true);
                        return;
                    }
                });
            //});
        });

        return {
            questions: questions,
            chosenQuestionId: chosenQuestionId,
            goToQuestion: goToQuestion,
            loadData: loadData,
            chosenQuestionData: chosenQuestionData,
            checkedAnswer: checkedAnswer
        };
    }();

    my.vm.loadData();
    ko.applyBindings(my.vm);
});