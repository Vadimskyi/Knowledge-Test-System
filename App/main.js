require.config({
    paths: {"text": "durandal/amd/text"}
});

define(function (require) {
    var system = require('durandal/system'),
        app = require('durandal/app'),
        router = require('durandal/plugins/router'),
        viewLocator = require('durandal/viewLocator'),
        logger = require('services/logger'),
        appsecurity = require('services/appsecurity'),
        config = require('config');

    system.debug(true);     //console messages.

    app.start().then(function () {  //ждем пока загрузится дурандл и потом делаем дела...
        router.useConvention();

        viewLocator.useConvention();

        ko.validation.init({    //инициализируем нокаут валидацию
            grouping: {
                deep: true,
                observable: true
            },
            decorateElement: true,
            errorElementClass: "has-error",
            registerExtenders: true,
            messagesOnModified: true,
            insertMessages: true,
            parseInputAttributes: true,
            messageTemplate: null
        });

        app.setRoot('viewmodels/shell', 'entrance');   //находит шелл.жс и .аштмл в апп фолдере, асоциирует их между собой и ставит рутом(id='applicationHost').

        router.handleInvalidRoute = function (route, params) {
            logger.logError('No route found', route, 'main', true);
        }
    });
});