define(['services/datacontext'], function (datacontext) {
    var users = ko.observableArray();
    var initialized = false;

    var vm = {
        activate: activate,
        users: users,
        title: 'Users',
        refresh: refresh
    }
    return vm;

    function activate() {
        if (initialized) {//если данные уже загружены с сервера
            return;
        }
        initialized = true;
        return refresh();
    }

    function refresh() {
        return datacontext.getUsers(users);
    }
});