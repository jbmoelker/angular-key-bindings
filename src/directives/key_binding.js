angular.module('voorhoede.components.key-bindings.directives.key_binding', [])
/**
 * @ngdoc directive
 * @name keyBinding
 * @module key-bindings
 * @restrict E
 *
 * @description
 * Binds keys to the lifecycle of the scope.
 *
 * @param combo {string}
 * Key combo that will be passed to Mousetrap.
 *
 * @param handler {expression}
 * Expression that will be evaluated when the specified key combo is performed.
 */
    .directive('keyBinding', ['keyBindings', function(keyBindings) {
        return {
            restrict: 'E',
            scope: {
                combo: '@',
                handler: '&'
            },
            link: function(scope, element, attrs) {
                var removeFn;

                function remove() {
                    if (removeFn) removeFn();
                    removeFn = null;
                }

                function handler(event, combo) {
                    var returnValue = scope.handler({
                        '$event': event,
                        '$combo': combo
                    });
                    scope.$apply();
                    return returnValue;
                }

                scope.$watch('combo', function(combo) {
                    remove();

                    if (combo) {
                        removeFn = keyBindings.addHandler({
                            combo: combo,
                            handler: handler
                        });
                    }
                });

                scope.$on('$destroy', function() {
                    remove();
                });
            }
        };
    }]);