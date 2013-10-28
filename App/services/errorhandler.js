define(['services/logger', 'durandal/system', 'services/utils'],
    function (logger, system, util) {

        var ErrorHandler = (function () {
            var ctor = function (targetObject) {

                this.handleError = function (error) {
                    if (error.entityErrors) {
                        error.message = util.getSaveValidationErrorMessage(error);
                    }

                    logger.logError(error.message, null, system.getModuleId(targetObject), true);
                    throw error;
                };

                this.log = function (message, showToast) {
                    logger.log(message, null, system.getModuleId(targetObject), showToast);
                };

                this.handlevalidationerrors = function (errors) {
                    if (errors.responseText != "") {
                        $.each($.parseJSON(errors.responseText), function (key, value) {
                            logger.logError(value, null, errors, true);
                        });
                    } else {
                        logger.logError(errors.statusText, null, errors, true);
                    }
                };
            };

            return ctor;
        })();

        return {
            includeIn: includeIn
        };

        function includeIn(targetObject) {
            return $.extend(targetObject, new ErrorHandler(targetObject));
        }
    });