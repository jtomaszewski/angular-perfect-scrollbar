angular.module('perfect_scrollbar', [])

.provider('perfectScrollbar', function(){
  _this = this;

  _this.options = {};
  possibleOptions = ['wheelSpeed', 'wheelPropagation', 'minScrollbarLength', 'useBothWheelAxes', 'useKeyboard'];

  _this.setOptions = function(options) {
    for (var i in possibleOptions) {
      key = possibleOptions[i];
      if (typeof options[key] !== 'undefined') {
        _this.options[key] = options[key];
      }
    }

    return _this;
  };

  _this.$get = function(){
    return {
      possibleOptions: possibleOptions,

      getOptions: function(){
        return _this.options;
      }
    };
  };
})

.directive('perfectScrollbar', ['$parse', '$timeout', 'perfectScrollbar', function ($parse, $timeout, perfectScrollbar) {
  return {
    restrict: 'E',
    transclude: true,
    template:  '<div><div ng-transclude></div></div>',
    replace: true,
    link: function ($scope, $elem, $attr) {
      // You can set perfect-scrollbar options by setting an attribute on
      // directive's element (f.e. `wheel-propagation="false"`);
      // or setting it globally with `perfectScrollbarProvider.setOptions`.
      var getOptions = function() {
        options = perfectScrollbar.getOptions();

        for (var i in perfectScrollbar.possibleOptions) {
          key = perfectScrollbar.possibleOptions[i];
          if ($attr[key]) {
            options[key] = $parse($attr[key])();
          }
        }

        return options;
      };

      $elem.perfectScrollbar(getOptions());

      updatePerfectScrollbar = function() {
        $timeout(function () {
          $elem.perfectScrollbar('update');
        }, 10);
      };

      // Update perfect-scrollbar when `refresh-on-change` attr changes.
      if ($attr.refreshOnChange) {
        if (typeof $scope.$eval($attr.refreshOnChange) == 'object') {
          $scope.$watchCollection($attr.refreshOnChange, updatePerfectScrollbar);
        } else {
          $scope.$watch($attr.refreshOnChange, updatePerfectScrollbar);
        }
      }

      // Scroll container to top when `scroll-top-on-change` attr changes.
      if ($attr.scrollTopOnChange) {
        $scope.$watch($attr.scrollTopOnChange, function(){
          $elem.scrollTop(0);
        });
      }
    }
  };
}]);
