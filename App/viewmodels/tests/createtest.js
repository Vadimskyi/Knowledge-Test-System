define(['services/datacontext', 'services/appsecurity', 'durandal/plugins/router', 'durandal/app', 'services/model', 'services/errorhandler'],
    function (datacontext, appsecurity, router, app, model, errorhandler) {
        var uniqQuestionId = 0;
        var uniqAnswerId = 0;

        var getAnswerEntity = function (questionId) {
            var a = new model.Answer(vm.getUniqAnswerId());
            a.questionId = ko.observable(questionId);
            
            return a;
        };

        var getQuestionEntity = function () {
            var q = new model.Question(vm.getUniqQuestionId());
            q.answers = ko.observableArray([]);
            q.inputName = "name" + q.id();
            q.removeAnswer = removeAnswer;
            q.checked = ko.observable();

            q.checked.subscribe(function (oldValue) {
                this.answers().forEach(function (a) {
                    if (a.id() == oldValue) {
                        a.isCorrectAnswer(false);
                    }
                });
            }, q,  "beforeChange");

            q.checked.subscribe(function (newValue) {
                this.answers().forEach(function (a) {
                    if (a.id() == newValue) {
                        a.isCorrectAnswer(true);
                    }
                });
            }, q);
            return q;
        };

        
        var removeAnswer = function (a) {
            vm.questions().forEach(function (q) {
                if (q.id() == a.questionId()) {
                    q.answers.remove(a);
                    return;
                }
            });
        };

        var setImageSource = function (file, question) {
            question.imageSource(file.name);
        };

        var isSaving = ko.observable(false);

        var goBack = function () {
            router.navigateBack();
        };
        
        var hasChanges = ko.computed(function () {
            return datacontext.hasChanges();
        });

        var canSave = ko.computed(function () {
            return !isSaving();
        });

        var createSubmitedTestObject = function (test, testRestriction) {
            var submitedRestriction =
                new model.submitedRestrictionObject(
                    testRestriction.timeLimit(),
                    testRestriction.attemptsNumber(),
                    testRestriction.isPrivate());

            var submitedTest =
                new model.submitedTestObject(
                    test.id(),
                    test.name(),
                    test.description(),
                    appsecurity.user().UserId,
                    test.tags(),
                    submitedRestriction,
                    [], null);

            test.questions().forEach(function (q) {
                var submitedAnswers = [];
                q.answers().forEach(function (a) {
                    submitedAnswers.push(
                        new model.submitedAnswerObject(
                            a.answerText(),
                            a.isCorrectAnswer(),
                            a.imageSource()
                        ));
                });

                var submitedQuestion =
                    new model.submitedQuestionObject(
                        q.id(),
                        q.questionText(),
                        q.questionType().id,
                        q.imageSource(),
                        submitedAnswers);

                submitedTest.questions.push(submitedQuestion)
            });
            return submitedTest;
        };

        var canDeactivate = function () {
                /*//if (hasChanges()) {
                    var msg = 'Do you want to leave and cancel?';
                    return app.showMessage(msg, 'Navigate Away', ['Yes', 'No'])
                        .then(function (selectedOption) {
                            if (selectedOption === 'Yes') {
                                //datacontext.cancelChanges();
                            }
                            return selectedOption;
                        });
                //}*/
                return true;
        };

        var viewAttached = function () {

        };

        var vm = {
            activate: function () {

                this.questions.push(getQuestionEntity());

                return datacontext.getQuestionTypes(this.questionTypes);
            },

            deactivate: function () {
                this.test = new model.Test();
                this.questions = ko.observableArray([]);
                this.testRestriction = new model.TestRestriction();
                this["errors"] = ko.validation.group(this);
            },

            viewAttached: viewAttached,

            goBack: goBack,
            canDeactivate: canDeactivate,
            canSave: canSave,
            hasChanges: hasChanges,

            save: function () {
                vm.test.questions = vm.questions;
                if (this.errors().length != 0) {
                    var result = model.validateCreatedTest(vm.test);
                    this.errors.showAllMessages();
                    return;
                }

                var code = ko.observable();
                if (model.validateCreatedTest(vm.test))
                {
                    isSaving(true);
                    var submitedObject = createSubmitedTestObject(vm.test, vm.testRestriction);
                    datacontext.saveTest(submitedObject).then(function (data) {
                        appsecurity.uploadImages()
                            .then(function () {
                                router.navigateTo('#/');
                            });
                    });
                }
            },

            test: new model.Test(),
            questionTypes: ko.observableArray(),
            questions: ko.observableArray([]),
            testRestriction: new model.TestRestriction(),

            getUniqAnswerId: function () {
                return uniqAnswerId -= 1;
            },

            getUniqQuestionId: function (){
                return uniqQuestionId -= 1;
            },

            addQuestion: function () {
                this.questions.push(getQuestionEntity());
            },

            removeQuestion: function (q) {
                vm.questions.remove(q);
            },

            addAnswer: function (q) {
                if (q.questionType().key == 3 && q.answers().length > 0)
                    return;
                q.answers.push(getAnswerEntity(q.id()));
            },

            setImageSource: setImageSource,

            title: 'Create Test'
        }

        errorhandler.includeIn(vm);

        vm["errors"] = ko.validation.group(vm);

        return vm;
    });