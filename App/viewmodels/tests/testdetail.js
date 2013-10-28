define(['services/appsecurity', 'services/datacontext', 'durandal/plugins/router', 'durandal/app'],
    function (appsecurity, datacontext, router, app) {
        var test = ko.observable();
        var initialized = false;
        var testIsTaken = ko.observable(false);
        var canTakeTest = ko.observable(true);

        var takeTest = function () {
            appsecurity.startTest(test().id())
                .then(function (result) {
                    if (result)
                    {
                        datacontext.log("test taken!", result, true);
                        testIsTaken(true);
                    }
                    else
                    {
                        datacontext.logError("test not taken!", result);
                    }
                });
        };

        var startTest = function () {
            startTestMessage().then(
                function (selectedOption) {
                    if (selectedOption == 'Yes')
                {
                    var url = '#/testing/' + test().id();
                    router.navigateTo(url);
                }
            });
        };

        var startTestMessage = function () {
            var title = 'Start test?';
            var msg = ' ';
            return app.showMessage(title, msg, ['Yes', 'No']).then(checkAnswer);

            var checkAnswer = function (selectedOption) {
                if (selectedOption === 'Yes') {
                    return true;
                }
                else
                    return false;
            };
        };

        var activate = function (routeData) {
            var id = parseInt(routeData.id);
            return datacontext.getTestById(id, test).then(function () {
                canTakeTest(false);
                return appsecurity.isTestTaken(id).then(function (result) {
                    if (result) {
                        testIsTaken(true);
                    }
                    else {
                        testIsTaken(false);
                    }
                })
            });
        };

        var goBack = function () {
            router.navigateTo("#/tests");
        };

        var vm = {
            activate: activate,
            goBack: goBack,
            test: test,
            takeTest: takeTest,
            startTest: startTest,
            canTakeTest: canTakeTest,
            testIsTaken: testIsTaken,
            title: 'Test Details'
        }
        return vm;
    });