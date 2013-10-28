define(function () {

    var regExEscape = function (text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };


    return {
        getCurrentDate: getCurrentDate,
        getSaveValidationErrorMessage: getSaveValidationErrorMessage,
        getEntityValidationErrorMessage: getEntityValidationErrorMessage,
        getURLParameter: getURLParameter,
        regExEscape: regExEscape
    }

    var restoreFilter = function (filterData) {
        var stored = filterData.stored,
            filter = filterData.filter,
            dc = filterData.datacontext;

        var filterList = [
            { raw: stored.searchText, filter: filter.searchText },
            { raw: stored.owner, filter: filter.owner, fetch: dc.getUserById(filter.owner().id()) }
        ];

        _.each(filterList, function (map) {
            var rawProperty = map.raw, 
                filterProperty = map.filter, 
                fetchMethod = map.fetch;
            if (rawProperty && filterProperty() !== rawProperty) {
                if (fetchMethod) {
                    var obj = fetchMethod(rawProperty.id);
                    if (obj) {
                        filterProperty(obj);
                    }
                } else {
                    filterProperty(rawProperty);
                }
            }
        });
    };

    function getCurrentUrl() {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.href) || [, null])[1]
        );
    };

    function getURLParameter(name) {
        return decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.href) || [, null])[1]
        );
    }

    function getCurrentDate() {
        return new Date();
    }

    function getSaveValidationErrorMessage(saveError) {
        try { 
            var firstError = saveError.entityErrors[0];
            return 'Validation Error: ' + firstError.errorMessage;
        } catch (e) { 
            return "Save validation error";
        }
    }

    function getEntityValidationErrorMessage(entity) {
        try {
            var errs = entity.entityAspect.getValidationErrors();
            var errmsgs = errs.map(function (ve) { return ve.errorMessage; });
            return errmsgs.length ? errmsgs.join("; ") : "no validation errors";
        } catch (e) {
            return "not an entity";
        }
    }
});