angular.module('voorhoede.components.key-bindings.directives.key_binding', [])

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
                    return scope.handler({
                        '$event': event,
                        '$combo': combo
                    });
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