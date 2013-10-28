define(['services/appsecurity', 'durandal/plugins/router', 'services/utils', 'services/errorhandler'],
    function (appsecurity, router, utils, errorhandler) {

        var username = ko.observable().extend({ required: true }),
            password = ko.observable().extend({ required: true, minLength: 6 }),
            rememberMe = ko.observable(),
            returnUrl = ko.observable(),
            isRedirect = ko.observable(false),
            isAuthenticated = ko.observable(false);

        var viewmodel = {

            username: username,
            password: password,
            rememberMe: rememberMe,
            returnUrl: returnUrl,
            isRedirect: isRedirect,
            appsecurity: appsecurity,
            goBack: function () {
                router.navigateBack();
            },

            activate: function () {
                //ga('send', 'pageview', { 'page': window.location.href, 'title': document.title });
                var redirect = utils.getURLParameter("redirectto");
                if (redirect != "null") {
                    this.isRedirect(true);
                }
                this.returnUrl(redirect != "null" ? redirect : "");

                return appsecurity.getExternalLogins().then(function (data) {
                    appsecurity.externalLogins(data);
                });
                return;
            },

            login: function () {

                if (this.errors().length != 0) {
                    this.errors.showAllMessages();
                    return;
                }

                var credential = new appsecurity.credential(this.username(), this.password(), this.rememberMe() || false),
                    self = this;

                appsecurity.login(credential, self.returnUrl())
                    .fail(self.handlevalidationerrors);
            },

            logout: function () {
                appsecurity.logout();
            },

            externalLogin: function (parent, data, event) {
                //appsecurity.externalLogin(data.Provider, this.returnUrl());
            },

            socialIcon: function (data) {
                var icon = "";
                switch (data.Provider.toLowerCase()) {
                    case "facebook":
                        icon = "icon-facebook-sign"
                        break;
                    case "twitter":
                        icon = "icon-twitter-sign"
                        break;
                    case "google":
                        icon = "icon-google-plus-sign"
                        break;
                    case "microsoft":
                        icon = "icon-envelope"
                        break;
                    default:
                        icon = "icon-check-sign"
                }
                return icon;
            }

        }

        errorhandler.includeIn(viewmodel);

        viewmodel["errors"] = ko.validation.group(viewmodel);

        return viewmodel;
    });