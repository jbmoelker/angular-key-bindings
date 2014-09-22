angular.module('voorhoede.components.keyBindings.directives.keyBinding', [])
/**
 * @ngdoc directive
 * @name keyBinding
 * @module voorhoede.components.keyBindings
 * @restrict E
 *
 * @description
 * Binds keys to the lifecycle of the scope.
 *
 * @param combo {string}
 * A key combo that will be passed to Mousetrap. [List of supported keys](http://craig.is/killing/mice#keys)
 *
 * @param handler {expression}
 * Expression that will be evaluated as event handler. Available expression locals:
 *
 * - `$event`: The event object
 * - `$combo`: The combo that triggered the event
 *
 * @example
 * Using the `n` key globally in the app to create a new document, unless the currently focused element
 * is editable (e.g., input, select)
 *
<example module="app">
    <file name="index.html">
        <div ng-controller="AppCtrl as app">
            <key-binding combo="n" handler="app.createNewDocument()"></key-binding>
            <div class="form-group">
                <input class="form-control" type="text">
            </div>
            <div class="form-group">
                <textarea class="form-control"></textarea>
            </div>
        </div>
    </file>
    <file name="index.js">
        angular.module('app', ['voorhoede.components.keyBindings'])
            .controller('AppCtrl', function() {
                this.createNewDocument = function() {
                    alert('Create new document');
                };
            });
    </file>
</example>
 *
 * @example
 * Using the escape key in every closable component to close it, but only closing 1 component at a time.
 *
<example module="app">
    <file name="index.html">
        <dropdown button-text="Dropdown level 1">
            <dropdown button-text="Dropdown level 2">
                <dropdown  button-text="Dropdown level 3">
                </dropdown>
            </dropdown>
        </dropdown>
    </file>
    <file name="dropdown.html">
        <div class="dropdown" ng-class="{'open': dropdown.isOpen}">
            <button class="btn btn-default" ng-click="dropdown.toggle()">
                {{ buttonText }}
                <span class="caret"></span>
            </button>
            <ul class="dropdown-menu" ng-if="dropdown.isOpen">
                <key-binding combo="esc" handler="dropdown.close()"></key-binding>
                <li><a href="">Item 1</a></li>
                <li><a href="">Item 2</a></li>
                <li ng-transclude></li>
            </ul>
        </div>
    </file>
    <file name="index.js">
        angular.module('app', ['voorhoede.components.keyBindings'])
            .directive('dropdown', function() {
                return {
                    restrict: 'E',
                    scope: {buttonText: '@'},
                    templateUrl: 'dropdown.html',
                    transclude: true,
                    controllerAs: 'dropdown',
                    controller: function() {
                        this.isOpen = false;

                        this.toggle = function() {
                            this.isOpen = !this.isOpen;
                        };

                        this.close = function() {
                            this.isOpen = false;
                        };
                    }
                };
            });
    </file>
</example>
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