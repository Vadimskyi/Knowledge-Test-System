define(['services/appsecurity', 'services/datacontext', 'durandal/plugins/router', 'durandal/app', 'services/model'],
    function (appsecurity, datacontext, router, app, model) {
        var testId;
        var checkedAnswer = ko.observable();
        var testDescription = ko.observable();
        var timeLimit = ko.observable();

        var testFinished;

        var submitedQuestions = [];

        var timer;

        var initializeQuestions = function (questions) {
            questions().forEach(function (q) {
                q.checkedAnswer = ko.observable();

                q.checkedAnswer.subscribe(function (oldValue) {
                    this.answers().forEach(function (a) {
                        if (a.id() == oldValue) {
                            a.isCorrectAnswer(false);
                        }
                    });
                }, q, "beforeChange");

                q.checkedAnswer.subscribe(function (newValue) {
                    this.answers().forEach(function (a) {
                        if (a.id() == newValue) {
                            a.isCorrectAnswer(true);
                        }
                    });
                }, q);

                q.answers().forEach(function (a) {
                    a.checked = ko.observable(false);
                });
            });
        };

        var createSubmitedTestObject = function (questions) {
            var test = new model.submitedTestObject(testId, null, null, null, null, null, [], appsecurity.user().UserId);
            questions().forEach(function (q) {
                switch (q.questionType.key())
                {
                    case 1: //один ответ из нескольких
                        {
                            var subQ = new model.submitedQuestionObject(q.id, null, q.questionType.id(), null, [q.checkedAnswer()]);
                            test.questions.push(subQ);
                        }
                        break;
                    case 2: //несколько ответов
                        {
                            var question = new model.submitedQuestionObject(q.id, null, q.questionType.id(), null, [])
                            q.answers.forEach(function (a) {
                                if (a.checked())
                                    question.answers.push(a.id());
                            });
                            test.questions.push(question);
                        }
                        break;
                    case 3: //оджин ответ
                        {
                            if (q.chosenAnswers())
                                test.questions.push(new model.submitedQuestionObject(q.id, null, q.questionType.id(), null, [q.chosenAnswers()]));
                        }
                }
            });
            return test;
        };

        var vm = {
            activate: function (routeData) {
                timer = setInterval(function () {
                    timeLimit(timeLimit() - 1);
                    if (timeLimit() <= 0) {
                        submitTest();
                    }
                }, 60000);

                testFinished = false;
                testId = parseInt(routeData.id);
                testDescription(datacontext.getTestDetails(testId, testDescription));
                timeLimit(testDescription().timeLimit());
                return datacontext.getQuestionsByTestId(testId, this.questions).then(initializeQuestions(this.questions));
            },

            deactivate: function () {
                datacontext.cancelChanges();
                this.questions = ko.observableArray();
                this.selectedQuestionId(0);
                this.chosenQuestionData(null);
            },

            goBack: function () {
                router.navigateBack();
            },

            questions: ko.observableArray(),

            goToQuestion: function (question) {
                vm.selectedQuestionId(question.id);
                vm.chosenQuestionData(question);
            },

            selectedQuestionId: ko.observable(0),
            chosenQuestionData: ko.observable(),

            submitTest: function () {
                clearInterval(timer);
                testFinished = true;
                datacontext.submitTest(createSubmitedTestObject(this.questions)).then(function (data) {
                    datacontext.log("Correct answers:" + data, data, true);
                    router.navigateBack();
                });
            },

            canDeactivate: function () {
                if (!testFinished)
                {
                    var title = 'Your progress will not be saved.';
                    var msg = 'Are you sure you want to leave this page?';
                    var checkAnswer = function (selectedOption) {
                        if (selectedOption === 'Yes') {
                            return true;
                        }
                        else
                            return false;
                    };

                    return app.showMessage(msg, title, ['Yes', 'No']).then(checkAnswer);
                }
                return true;
            },

            formatedTime: ko.computed(function () {
                return timeLimit() + ' min';
            }),

            viewAttached: function () {
                $(".qImages").fancybox();
            },

            title : "Testing"
        }
        return vm;
    });