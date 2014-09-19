angular.module('voorhoede.components.key-bindings.services.key_bindings', [])

    .service('keyBindings', function() {
        var self = this;

        self.comboGroups = {};

        self.addHandler = function(handler) {

            // TODO: add support for leaving away the combo, as "any key" handler
            if (!handler || !handler.combo) {
                throw new Error('[keyBindings] handlers must specify a combo');
            }

            if (!self.comboGroups[handler.combo]) {
                self.comboGroups[handler.combo] = [];
                self._bindComboGroup(handler.combo);
            }

            var handlers = self.comboGroups[handler.combo];

            handlers.push(handler);

            return function removeHandler() {
                var index = handlers.indexOf(handler);
                if (index > -1) {
                    handlers.splice(index, 1);
                    if (!handlers.length) {
                        self._unbindComboGroup(handler.combo);
                    }
                }
            };
        };

        self._bindComboGroup = function(combo) {
            Mousetrap.bind(combo, function(event, combo) {
                self._triggerHandlers(self.comboGroups[combo], event, combo);
            });
        };

        self._unbindComboGroup = function(combo) {
            Mousetrap.unbind(combo);
            self.comboGroups[combo] = null;
        };

        self._triggerHandlers = function(handlers, event, combo) {
            var triggerNext = true;
            var i = handlers.length;

            while (triggerNext && --i > -1) {
                triggerNext = handlers[i].handler(event, combo) === true;
            }
        };
    });