define(function () {
    toastr.options.timeOut = 4000;
    toastr.options.positionClass = 'toast-bottom-right';
    var throttle = 400;
    var storeExpirationMs = (1000 * 60 * 60 * 24); // 1 день

    var imageSettings = {
        imageUserBasePath: '../content/images/photos/',
        imageQuestionBasePath: '../content/images/questions/',
        unknownPersonImageSource: 'unknown_person.jpg',
        unknownQuestionImageSource: '../content/images/questions/unknown_question.jpg'
    };

    var remoteServiceName = 'api/breeze';   //имя основного контроллера

    var routes = [{
        url: 'tests',
        moduleId: 'viewmodels/tests/tests',
        name: 'All Tests',
        visible: true
    }, {
        url: 'users',
        moduleId: 'viewmodels/users',
        name: 'Users',
        visible: false,
        settings: { authorize: ["Administrator"] }
    }, {
        url: 'createtest',
        moduleId: 'viewmodels/tests/createtest',
        name: 'CreateTest',
        visible: true,
        settings: { authorize: ["User"] }
    }, {
        url: 'testdetail/:id',
        moduleId: 'viewmodels/tests/testdetail',
        name: 'View a Test',
        visible: false,
        settings: { authorize: ["User"] }
    }, {
        url: 'testing/:id',
        moduleId: 'viewmodels/tests/testing',
        name: 'Proceed...',
        visible: false,
        settings: { authorize: ["User"] }
    }, {
        url: 'login',
        moduleId: 'viewmodels/account/login',
        name: 'Login',
        visible: false
    }, {
        url: 'register',
        moduleId: 'viewmodels/account/register',
        name: 'Register',
        visible: false
    }, {
        url: 'account/:id',
        moduleId: 'viewmodels/account/account',
        name: 'Account',
        visible: false,
        settings: { authorize: ["User"] }
    }];

    var startModule = 'tests';      //стартовый модуль

    return {
        imageSettings: imageSettings,
        remoteServiceName: remoteServiceName,
        routes: routes,
        startModule: startModule,
        throttle: throttle
    };
});