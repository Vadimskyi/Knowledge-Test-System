define(['durandal/system', 'services/logger', 'durandal/plugins/router', 'config', 'services/datacontext', 'services/appsecurity'],
function (system, logger, router, config, datacontext, appsecurity) {
    var shell = {
        title: "Hello",
        activate: function () {
            return datacontext.primeData(appsecurity)
            .then(boot)
            .fail(failedInitialization);
        },

        userId: null,
        user: ko.observable(),
        goToAccount: null,

        appsecurity: appsecurity,
        router: router,
        logout: logout
    };

    return shell;

    function logout() {
        var self = this;
        appsecurity.logout().fail(failedInitialization);
    }

    function failedInitialization(error) {
        var msg = 'Ошибка инициализации приложения: ' + error.message;
        logger.logError(msg, error, system.getModuleId(shell), true);
    }

    function boot() {
        logger.log('Test App Started!',
                    null,
                    system.getModuleId(shell),
                    true);

        router.map(config.routes);
        //
        shell.user(appsecurity.user().UserName)
        appsecurity.userId(appsecurity.user().UserId);
        shell.goToAccount = ko.computed(function () {
            var url = '#/account/' + appsecurity.userId();
            return url;
        });

        //
        router.guardRoute = function (routeInfo) {
            if (routeInfo.settings.authorize) {
                if (appsecurity.user().IsAuthenticated && appsecurity.isUserInRole(routeInfo.settings.authorize)) {
                    return true
                } else {
                    if (routeInfo.url.match(/:id/gi))
                        return "/#/login";
                    return "/#/login?redirectto=" + routeInfo.url;
                }
            }
            return true;
        }

        return router.activate(config.startModule);
    }
});