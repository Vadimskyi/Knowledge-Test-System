define(['config', 'durandal/system', 'services/logger'],
    function (config, system, logger) {

    var imageSettings = config.imageSettings;
    var referenceCheckValidator;
    var Validator = breeze.Validator;

    var orderBy = { //параметры сортировки
        test: 'name',
        user: 'firstName, lastName'
    };

    var Test = function () {
        this.id = ko.observable(-1);
        this.name = ko.observable().extend({ required: true });
        this.tags = ko.observable().extend({ required: true });
        this.description = ko.observable().extend({ required: true });
        this.questions = ko.observableArray([]);
    };

    var Question = function (id) {
        this.id = ko.observable(id);
        this.questionText = ko.observable();
        this.questionType = ko.observable();
        this.answers = ko.observableArray([]);
        this.imageSource = ko.observable();
    };

    var Answer = function (id) {
        this.id = ko.observable(id);
        this.answerText = ko.observable();
        this.isCorrectAnswer = ko.observable(false);
        this.imageSource = ko.observable();
    };

    var TestRestriction = function () {
        this.timeLimit = ko.observable().extend({required: true,  number: true });
        this.attemptsNumber = ko.observable().extend({required: true,  number: true });
        this.isPrivate = ko.observable(false);
    };

    var startTestObject = function (testId, userId) {
        this.testId = testId;
        this.userId = userId;
    };

    var submitedAnswerObject = function (answerText, isCorrectAnswer, imageSource) {
        this.answerText = answerText;
        this.isCorrectAnswer = isCorrectAnswer;
        this.imageSource = imageSource;
    };

    var submitedQuestionTypeObject = function (id) {
        this.id = id;
    };

    var submitedQuestionObject = function (questionId, questionText, questionTypeId, imageSource, answers) {
        this.questionId = questionId;
        this.questionText = questionText;
        this.questionTypeId = questionTypeId;
        this.imageSource = imageSource;
        this.answers = answers;
    };

    var submitedTestObject = function (testId, name, description, ownerId, tags, restriction, questions, userId) {
        this.id = testId;
        this.name = name;
        this.description = description;
        this.ownerId = ownerId;
        this.tags = tags;
        this.restriction = restriction;
        this.questions = questions;
        this.userId = userId;
    };

    var submitedRestrictionObject = function (timeLimit, attemptsNumber, isPrivate) {
        this.timeLimit = timeLimit;
        this.attemptsNumber = attemptsNumber;
        this.isPrivate = isPrivate;
    };

    var entityNames = { //названия сущностей
        user: 'User',
        test: 'Test',
        userRole: 'UserRole',
        statistic: 'Statistic',
        testRestriction: 'TestRestriction',
        question: 'Question',
        answer: 'Answer',
        questionType: 'QuestionType'
    };

    var validateCreatedTest = function (test) {
        var validationMessages = "Save failed: <hr />";
        var hasError = false;

        if (test.questions().length == 0){
            hasError = true;
            validationMessages += "Test should have at least one question!<hr />";
        }
        else{
            test.questions().forEach(function (q) {
                if (q.questionText() == null || q.questionText() == ""){
                    hasError = true;
                    validationMessages += "Question Text field is required!<hr />"
                }
                if (!q.questionType()){
                    hasError = true;
                    validationMessages += "Question Type field is required!<hr />"
                }
                if (q.answers().length == 0){
                    hasError = true;
                    validationMessages += "Question should have at least one answer!<hr />";
                }
                else {
                    q.answers().forEach(function (a) {
                        if (a.answerText() == null || a.answerText() == "") {
                            hasError = true;
                            validationMessages += "Answer Text field is required!<hr />"
                        }
                    });
                }
            });
        }

        if(!hasError)
            return true;
        else {
            logger.logError(validationMessages, test, system.getModuleId(model), true);
            return false;
        }
    };

    var model = {
        Test: Test,
        Question: Question,
        Answer: Answer,
        TestRestriction: TestRestriction,
        validateCreatedTest: validateCreatedTest,
        applyTestValidators: applyTestValidators,
        applyTestRestrictionValidators: applyTestRestrictionValidators,
        applyAnswerValidators: applyAnswerValidators,
        applyQuestionValidators: applyQuestionValidators,
        applyQuestionTypeValidators: applyQuestionTypeValidators,
        configureMetadataStore: configureMetadataStore,
        entityNames: entityNames,
        orderBy: orderBy,
        startTestObject: startTestObject,
        submitedQuestionObject: submitedQuestionObject,
        submitedTestObject: submitedTestObject,
        submitedAnswerObject: submitedAnswerObject,
        submitedRestrictionObject: submitedRestrictionObject,
        submitedQuestionTypeObject: submitedQuestionTypeObject
    };

    return model;

    //#region Internal Methods
    function configureMetadataStore(metadataStore) {    //конфигурируем инициализацию метаданных через конструктор
        metadataStore.registerEntityTypeCtor(
            'Test', null, testInitializer);
        metadataStore.registerEntityTypeCtor(
            'User', null, userInitializer);
        metadataStore.registerEntityTypeCtor(
            'Question', null, questionInitializer);
        metadataStore.registerEntityTypeCtor(
           'TestRestriction', null, restrictionInitializer);

        referenceCheckValidator = createReferenceCheckValidator();
        Validator.register(referenceCheckValidator);
        log('Validators registered');
    }
   
    function createReferenceCheckValidator() {
        var name = 'realReferenceObject';
        var ctx = { messageTemplate: 'Missing %displayName%' };
        var val = new Validator(name, valFunction, ctx);
        log('Validators created');
        return val;

        function valFunction(value, context) {
            if (value == null || value == undefined || value == "")
                return false;
            else
                return true;
        }
    }

    function applyTestValidators(metadataStore) {
        var types = ['name', 'description', 'tags', 'questions'];
        types.forEach(addValidator);
        log('Validators applied', types);

        function addValidator(propertyName) {
            var testType = metadataStore.getEntityType('Test');
            testType.getProperty(propertyName)
                .validators.push(referenceCheckValidator);
        }
    }

    function applyQuestionValidators(metadataStore) {
        var types = ['questionText', 'answers', 'questionType'];
        types.forEach(addValidator);
        log('Validators applied', types);

        function addValidator(propertyName) {
            var testType = metadataStore.getEntityType('Question');
            testType.getProperty(propertyName)
                .validators.push(referenceCheckValidator);
        }
    }

    function applyQuestionTypeValidators(metadataStore) {
        var types = ['description', 'key'];
        types.forEach(addValidator);
        log('Validators applied', types);

        function addValidator(propertyName) {
            var testType = metadataStore.getEntityType('QuestionType');
            testType.getProperty(propertyName)
                .validators.push(referenceCheckValidator);
        }
    }

    function applyAnswerValidators(metadataStore) {
        var types = ['answerText'];
        types.forEach(addValidator);
        log('Validators applied', types);

        function addValidator(propertyName) {
            var testType = metadataStore.getEntityType('Answer');
            testType.getProperty(propertyName)
                .validators.push(referenceCheckValidator);
        }
    }

    function applyTestRestrictionValidators(metadataStore) {
        var types = ['timeLimit', 'attemptsNumber'];
        types.forEach(addValidator);
        log('Validators applied', types);

        function addValidator(propertyName) {
            var testType = metadataStore.getEntityType('TestRestriction');
            testType.getProperty(propertyName)
                .validators.push(referenceCheckValidator);
        }
    }


    function testInitializer(test) {   //добавляет пиздатые компутеды
        test.tagsFormatted = ko.computed(function () {
            var text = test.tags();
            return text ? text.replace(/\|/g, ', ') : text;
        });
    };

    function questionInitializer(qustion) {   //добавляет пиздатые компутеды
        qustion.imageName = ko.computed(function () {
            return makeQuestionImageName(qustion.imageSource());
        });
    };

    function restrictionInitializer(rest) {   //добавляет пиздатые компутеды
        rest.timeLimitFormated = ko.computed(function () {
            return rest.timeLimit() + "min";
        });
    };

    function userInitializer(user) {
        user.fullName = ko.computed(function () {
            return user.firstName() + ' ' + user.lastName();
        });
        user.imageName = ko.computed(function () {
            return makeUserImageName(user.imageSource());
        });
        return user;
    };

    function makeUserImageName(source) {
        return imageSettings.imageUserBasePath +
            (source || imageSettings.unknownPersonImageSource);
    };

    function makeQuestionImageName(source) {
        if (source == null)
            return false;
        return imageSettings.imageQuestionBasePath +
            (source || imageSettings.unknownQuestionImageSource);
    };

    function log(msg, data, showToast) {
        logger.log(msg, data, system.getModuleId(model), showToast);
    }
    //#endregion
});