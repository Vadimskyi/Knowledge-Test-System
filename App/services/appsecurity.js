define(function (require) {
    var system = require('durandal/system'),
		app = require('durandal/app'),
		router = require('durandal/plugins/router'),
        model = require('services/model');

    var self = this;

    var baseAdress = "api/account";

    var credential = function (username, password, rememberme) {
        this.userName = username;
        this.password = password;
        this.rememberMe = rememberme;
    };

    var progressHandlingFunction = function (e) {
        if (e.lengthComputable) {
            $('progress').attr({ value: e.loaded, max: e.total });
        }
    };

    var completeHandler = function (e) {
        var success = e;
    };

    var errorHandler = function (error) {
        var err = error;
    };

    var user = ko.observable({ IsAuthenticated: false, UserName: "", Roles: [], UserId: 0, AntiforgeryToken: null });

    var userId = ko.observable();

    var externalLogins = ko.observable();

    return {
        credential: credential,
        user: user,
        userId: userId,
        baseAdress: baseAdress,
        externalLogins: externalLogins,

        isUserInRole: function (roles) {
            var self = this,
				  isuserinrole = false;
            $.each(roles, function (key, value) {
                if (self.user().Roles.indexOf(value) != -1) {
                    isuserinrole = true;
                }
            });
            return isuserinrole;
        },

        login: function (credential, navigateToUrl) {
            var self = this;
            var promise = $.post(baseAdress + "/login", credential)
				.done(function (data) {
				    self.user(data);
				    userId(data.UserId);
				    if (data.IsAuthenticated == true) {
				        if (navigateToUrl) {
				            router.navigateTo("#/" + navigateToUrl);
				        } else {
				            router.navigateTo("/#/");
				        }
				    }
				})
				.fail(function (data) {
				    self.user({ IsAuthenticated: false, UserName: "", Roles: [] });
				});

            return promise;
        },

        logout: function () {
            var self = this;
            var promise = $.post(baseAdress + "/logout", credential)
				.done(function (data) {
				    self.user(data);
				    userId(data.UserId);
				    if (router.activeRoute().settings.authorize != null) {
				        router.navigateTo("/#/");
				    }
				})
				.fail(function (data) {
				    return data;
				});
            return promise;
        },

        register: function (username, firstName, lastName, email, password, confirmpassword) {
            var self = this;
            var promise = $.post(baseAdress + "/register", { username: username, firstName: firstName, lastName: lastName, email: email, password: password, confirmpassword: confirmpassword })
				.done(function (data) {
				    self.user(data);
				    userId(data.UserId);
				    router.navigateTo("/#/");
				});
            return promise;
        },

        getExternalLogins : function () {
            var self = this;
            var promise = $.get(baseAdress + "/externalloginslist");
            return promise;
        },

        externalLogin: function (provider, returnurl) {
            location.href = baseAdress + "/externallogin?provider=" + provider + "&returnurl=" + returnurl;
        },

        getAuthInfo: function () {
            var self = this;
            var promise = $.get(baseAdress + "/userinfo");
            return promise;
        },

        uploadImages: function () {
            var formData = new FormData();
            $(".browse").each(function (i, value) {
                formData.append("file", value.files[0]);
            });

            return $.ajax({
                url: baseAdress + '/uploadimage',
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                type: 'POST',
                success: completeHandler,
                error: errorHandler
            });
        },

        startTest: function (testId) {
            var test = new model.startTestObject(testId, user().UserId);
            var promise = $.post("api/test/starttest", test);
            return promise;
        },

        isTestTaken: function (testId) {
            var promise = $.post(baseAdress + "/istesttaken", { testId: testId });
            return promise;
        }
    };
});