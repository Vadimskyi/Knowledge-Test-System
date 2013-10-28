define(['durandal/plugins/router', 'services/appsecurity', 'services/logger', 'services/datacontext', 'services/utils'],
function (router, appsecurity, logger, datacontext, utils) {

    var userInfo = ko.observable();
    var myTests = ko.observableArray();
    var showUserInfo = ko.observable(true);
    var showMytests = ko.observable(false);

    function goToDetails(test)
    {
        var url = '#/testdetail/' + test.id();
        router.navigateTo(url);
    }

    function activate(routeData) {
        var id = parseInt(routeData.id);
        return datacontext.getUserById(id, userInfo);
    };

    function viewAttached(view) {
    };

    function clickHandler(path) {
        switch (path) {
            case "userinfo":
                showUserInfo(true);
                showMytests(false);
                break;
            case "mytests":
                showUserInfo(false);
                showMytests(true);
                break;
            default:
                break;
        }
    };

    var goBack = function () {
        router.navigateBack();
    };

    var vm = {
        activate: activate,
        viewAttached: viewAttached,
        userInfo: userInfo,
        myTests: myTests,
        showUserInfo: showUserInfo,
        showMytests: showMytests,
        clickHandler: clickHandler,
        goBack: goBack,
        goToDetails: goToDetails
    };

    return vm;
});