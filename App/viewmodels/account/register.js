define(['services/appsecurity', 'durandal/plugins/router', 'services/errorhandler'],
    function (appsecurity, router, errorhandler) {
        var username = ko.observable().extend({ required: true }),
            firstName = ko.observable().extend({ required: true }),
            lastName = ko.observable().extend({ required: true }),
            email = ko.observable().extend({ required: true, email: true }),
            password = ko.observable().extend({ required: true, minLength: 6 }),
            confirmpassword = ko.observable().extend({ required: true, minLength: 6, equal: password });


        var vm = {
            username: username,
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            confirmpassword: confirmpassword,

            activate: function () {
                //ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
            },

            register: function () {
                var self = this;
                if (this.errors().length != 0) {
                    this.errors.showAllMessages();
                    return;
                }
                appsecurity.register(this.username(), this.firstName(), this.lastName(), this.email(), this.password(), this.confirmpassword())
                    .fail(self.handlevalidationerrors)
            }
        };

        errorhandler.includeIn(vm);

        vm["errors"] = ko.validation.group(vm);

        return vm;
    });