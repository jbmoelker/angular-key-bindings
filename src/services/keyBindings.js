angular.module('voorhoede.components.keyBindings.services.keyBindings', [])
/**
 * @ngdoc service
 * @name keyBindings
 * @module voorhoede.components.keyBindings
 */
    .service('keyBindings', function() {
        var self = this;

        /**
         * @ngdoc property
         * @name keyBindings#comboGroups
         * @type {object}
         */
        self.comboGroups = {}; // TODO: use this for a cheat sheet component

        /**
         * @ngdoc method
         * @name keyBindings#addHandler
         * @param handler {object}
         * Should contain:
         *
         * - __combo__: Combo that will be passed to Mousetrap
         * - __handler__: Function that will be used as event handler
         *
         * @returns {function} Function to remove the handler
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

        self.bindCombo = function(combo) {
            Mousetrap.bind(combo, function(event, _combo) {
                self.triggerHandlers(self.comboGroups[combo], event, _combo);
            });
        };

        self.unbindCombo = function(combo) {
            Mousetrap.unbind(combo);
        };

        self.triggerHandlers = function(handlers, event, combo) {
            var triggerNext = true;
            var i = handlers.length;

            while (triggerNext && i-- > 0) {
                triggerNext = handlers[i].handler(event, combo) === true;
            }
        };
    });