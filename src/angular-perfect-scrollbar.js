angular.module('perfect_scrollbar', [])
    .directive('perfectScrollbar', function ($parse, $timeout) {
        return {
            restrict: 'E',
            transclude: true,
            template:  '<div><div ng-transclude></div></div>',
            replace: true,
            link: function ($scope, $elem, $attr) {
                $elem.perfectScrollbar({
                    wheelSpeed: $parse($attr.wheelSpeed)() || 50,
                    wheelPropagation: $parse($attr.wheelPropagation)() || false,
                    minScrollbarLength: $parse($attr.minScrollbarLength)() || false,
                });

                if ($attr.refreshOnChange) {
                    updatePerfectScrollbar = function() {
                        $timeout(function () {
                            $elem.perfectScrollbar('update');
                        }, 10);
                    };

                    if (typeof $scope.$eval($attr.refreshOnChange) == 'object') {
                        $scope.$watchCollection($attr.refreshOnChange, updatePerfectScrollbar);
                    } else {
                        $scope.$watch($attr.refreshOnChange, updatePerfectScrollbar);
                    }
                }
            }
        }
    });
