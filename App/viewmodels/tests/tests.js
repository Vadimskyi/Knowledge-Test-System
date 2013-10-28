define(['services/datacontext', 'durandal/plugins/router', 'services/filter_tests', 'services/store', 'services/utils'],
    function (datacontext, router, TestFilter, store, utils) {
        var defaultTests = ko.observableArray();
        var tests = ko.observableArray();
        var owners = ko.observableArray();
        var initialized = false;
        var isRefreshing = false;
        var testFilter = new TestFilter();
        var stateKey = { filter: 'vm.tests.filter' };

        var addFilterSubscriptions = function () {
            testFilter.searchText.subscribe(onFilterChange);
            testFilter.owner.subscribe(onFilterChange);
        };

        var clearAllFilters = function (refresh) {
            testFilter.owner(null).searchText('');
            if (refresh == null)
            getTests(tests);
        };

        var clearFilter = function () {
            testFilter.searchText('');
        };

        var dataOptions = function (force) {
            return {
                results: tests,
                filter: testFilter,
                forceRefresh: force
            };
        };

        var gotoDetails = function (selectedTest) {
            if (selectedTest && selectedTest.id()) {
                var url = '#/testdetail/' + selectedTest.id();
                router.navigateTo(url);
            }
        }

        var viewAttached = function (view) {    //automatically raised by framework
            bindEventToList(view, '.session-brief', gotoDetails);
        };

        var bindEventToList = function (rootSelector, selector, callback, eventName) {
            var eName = eventName || 'click';   //default is 'click' event
            $(rootSelector).on(eName, selector, function () {
                var test = ko.dataFor(this);
                callback(test);
                return false;
            });
        };

        var forceRefreshCmd = ko.asyncCommand({
            execute: function (complete) {
                $.when(getTests(tests))
                    .always(complete);
            }
        });

        var onFilterChange = function () {
            if (!isRefreshing) {
                //store.save(stateKey.filter, ko.toJS(testFilter));
                tests($.extend(true, {}, defaultTests)._latestValue);
                getTests(null, dataOptions(false));
            }
        };

        var restoreFilter = function () {
            var stored = store.fetch(stateKey.filter);
            if (!stored) { return; }
            utils.restoreFilter({
                stored: stored,
                filter: testFilter,
                datacontext: datacontext
            });
        };

        init = function () {
            // Subscribe to specific changes of observables
            addFilterSubscriptions();
        };

        init();

        var getTests = function (tests, options) {
            if (!isRefreshing) {
                isRefreshing = true;
                if (tests) {
                    return datacontext.getTests(tests, options)
                            .then(function () {
                                defaultTests($.extend(true, {}, tests)._latestValue);
                                owners(datacontext.getOwnersFromTests(tests));
                                isRefreshing = false;
                            });
                }
                datacontext.getTests(tests, options);
                isRefreshing = false;
            }
        };

        var vm = {
            activate: function () {
                return this.refresh();
            },

            tests: tests,
            owners: owners,
            title: 'Tests',
            viewAttached: viewAttached,
            testFilter: testFilter,
            clearFilter: clearFilter,
            clearAllFilters: clearAllFilters,

            refresh: function () {
                return getTests(tests);
            },

            forceRefreshCmd: forceRefreshCmd
        }
        return vm;

    });