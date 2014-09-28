/**
 * @ngdoc module
 * @name voorhoede.components.keyBindings
 * @description
 * Contextual key combo handling through directives.
 */
angular.module('voorhoede.components.keyBindings', [
    'voorhoede.components.keyBindings.directives.keyBinding',
    'voorhoede.components.keyBindings.services.keyBindings'
]);
angular.module('voorhoede.components.keyBindings.services.keyBindings', [])
/**
 * @ngdoc service
 * @name keyBindings
 * @module voorhoede.components.keyBindings
 * @description
 * Manages the grouping of key combos and handlers, and (un)binds combos at appropriate moments using Mousetrap.
 */
    .service('keyBindings', function() {
        var self = this;

        /**
         * @ngdoc property
         * @name keyBindings#comboGroups
         * @type {object}
         * @description
         * Contains all currently active handlers, grouped by key combo.
         */
        // TODO: use this for a cheat sheet component
        self.comboGroups = {};

        /**
         * @ngdoc method
         * @name keyBindings#addHandler
         *
         * @param handler {object}
         * Handler object that should contain at least:
         *
         * - `combo`: A key combo that will be passed to Mousetrap.
         *   [List of supported keys](http://craig.is/killing/mice#keys)
         * - `handler`: Function that will be used as event handler. Passed arguments:
         *     - `event`: The event object
         *     - `combo`: The combo that triggered the event
         *
         * You can add any additional properties that you may want to use later (e.g., you can pass a `description`
         * if you want to be able to generate a human-readable cheat sheet of active key bindings.)
         *
         * @returns {function} Function to remove the handler.
         */
        self.addHandler = function(handler) {

            // TODO: add support for leaving away the combo, as "any key" handler
            if (!handler || !handler.combo) {
                throw new Error('[keyBindings] handlers must specify a combo');
            }

            if (!self.comboGroups[handler.combo]) {
                self.comboGroups[handler.combo] = [];
                self.bindCombo(handler.combo);
            }

            self.comboGroups[handler.combo].push(handler);

            return function removeHandler() {
                var comboGroup = self.comboGroups[handler.combo];
                var index;
                if (comboGroup) {
                    index = comboGroup.indexOf(handler);
                    if (index > -1) {
                        comboGroup.splice(index, 1);
                        if (!comboGroup.length) {
                            self.unbindCombo(handler.combo);
                            self.comboGroups[handler.combo] = null;
                        }
                    }
                }
            };
        };

        /**
         * @ngdoc method
         * @name keyBindings#bindCombo
         * @description
         * Binds {@link keyBindings#triggerHandlers triggerHandlers()} to the specified key combo using Mousetrap.
         *
         * @param combo {string}
         */
        self.bindCombo = function(combo) {
            Mousetrap.bind(combo, function(event, _combo) {
                self.triggerHandlers(self.comboGroups[combo], event, _combo);
            });
        };

        /**
         * @ngdoc method
         * @name keyBindings#unbindCombo
         * @description
         * Unbinds the specified key combo using Mousetrap.
         *
         * @param combo {string}
         */
        self.unbindCombo = function(combo) {
            Mousetrap.unbind(combo);
        };

        /**
         * @ngdoc method
         * @name keyBindings#triggerHandlers
         * @description
         * Triggers the appropriate handlers in the provided group. This means in any case the last one,
         * and the next handler for each handler that returns `true`.
         *
         * @param handlers {array}
         * @param event {object}
         * @param combo {string}
         */
        self.triggerHandlers = function(handlers, event, combo) {
            var triggerNext = true;
            var i = handlers.length;

            while (triggerNext && i-- > 0) {
                triggerNext = handlers[i].handler(event, combo) === true;
            }
        };
    });
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
 * <example module="app">
 *     <file name="index.html">
 *         <div ng-controller="AppCtrl as app">
 *             <key-binding combo="n" handler="app.createNewDocument()"></key-binding>
 *             <div class="form-group">
 *                 <input class="form-control" type="text">
 *             </div>
 *             <div class="form-group">
 *                 <textarea class="form-control"></textarea>
 *             </div>
 *         </div>
 *     </file>
 *     <file name="index.js">
 *         angular.module('app', [
 *             'voorhoede.components.keyBindings'
 *         ])
 *             .controller('AppCtrl', function() {
 *                 this.createNewDocument = function() {
 *                     alert('Create new document');
 *                 };
 *             });
 *     </file>
 * </example>
 *
 * @example
 * Using `esc` to close nested dropdown components, one at a time.
 *
 * <example module="app">
 *     <file name="index.html">
 *         <dropdown-button label="Dropdown 1">
 *             <ul class="dropdown-menu">
 *                 <li><a href="">Item 1</a></li>
 *                 <li><a href="">Item 2</a></li>
 *                 <li>
 *                     <dropdown-button label="Dropdown 2">
 *                         <ul class="dropdown-menu">
 *                             <li><a href="">Item 3</a></li>
 *                             <li><a href="">Item 4</a></li>
 *                             <li>
 *                                 <dropdown-button label="Dropdown 3">
 *                                     <ul class="dropdown-menu">
 *                                         <li><a href="">Item 5</a></li>
 *                                         <li><a href="">Item 6</a></li>
 *                                     </ul>
 *                                 </dropdown-button>
 *                             </li>
 *                         </ul>
 *                     </dropdown-button>
 *                 </li>
 *             </ul>
 *         </dropdown-button>
 *     </file>
 *     <file name="index.js">
 *         angular.module('app', [
 *             'components.dropdownButton'
 *         ]);
 *     </file>
 *     <file name="dropdownButton.html">
 *         <div class="dropdown">
 *             <button class="btn btn-default" ng-click="controller.toggle()">
 *                 {{ label }}
 *                 <span class="caret"></span>
 *             </button>
 *             <div ng-if="controller.isOpen">
 *                 <key-binding combo="esc" handler="controller.toggle()"></key-binding>
 *             </div>
 *             <div ng-transclude ng-if="controller.isOpen" class="open"></div>
 *         </div>
 *     </file>
 *     <file name="dropdownButton.js">
 *         angular.module('components.dropdownButton', [
 *             'voorhoede.components.keyBindings'
 *         ])
 *             .directive('dropdownButton', function() {
 *                 return {
 *                     restrict: 'E',
 *                     scope: {'label': '@'},
 *                     transclude: true,
 *                     templateUrl: 'dropdownButton.html',
 *                     controllerAs: 'controller',
 *                     controller: function() {
 *                         this.isOpen = false;
 *                         this.toggle = function() {
 *                             this.isOpen = !this.isOpen;
 *                         };
 *                     }
 *                 };
 *             });
 *     </file>
 * </example>
 */
    .directive('keyBinding', ['keyBindings', function(keyBindings) {
        return {
            restrict: 'E',
            scope: {
                combo: '@',
                handler: '&'
            },
            link: function(scope) {
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