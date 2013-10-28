define(['config', 'services/utils'],
	function (config, utils) {

		var TestFilter = function () {
			var self = this;
			self.searchText = ko.observable().extend({ throttle: config.throttle });
			self.owner = ko.observable(); // object
			return self;
		};

		TestFilter.prototype = function () {
			var tagDelimiter = '|';
			var escapedTagDelimiter = '\\|';

			var searchTest = function (searchText, test) {
				if (!searchText) return true; 
				var srch = utils.regExEscape(searchText.toLowerCase());
				if (test.name().toLowerCase().search(srch) !== -1) return true;
				if (test.owner().firstName().toLowerCase().search(srch) !== -1) return true;
				if (test.owner().lastName().toLowerCase().search(srch) !== -1) return true;
				if (test.tags().toLowerCase().search(srch) !== -1) return true;
				return false;
			};

			var modelTest = function (owner, test) {
				if (owner && owner.id() !== test.owner().id()) return false;
				return true;
			};

			predicate = function (self, test) {
				var match = searchTest(self.searchText(), test)
					&& modelTest(self.owner(), test);
				return match;
			};

			return {
				predicate: predicate
			};
		}();

		return TestFilter;
});