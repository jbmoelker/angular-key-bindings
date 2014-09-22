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