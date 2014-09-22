angular.module('voorhoede.components.keyBindings.directives.bindKeys', [])

    .constant('BIND_KEYS_EVENTS', {
        activate: 'focus',
        deactivate: 'blur'
    })

/**
 * @ngdoc directive
 * @name bindKeys
 * @module voorhoede.components.keyBindings
 * @restrict A
 *
 * @description
 * Binds keys to certain DOM events on the element.
 *
 * By default, the bindings are activated on `focus` and deactivated on `blur`.
 *
 * @param bindKeys {expression}
 * Expression containing an object notation of key combos and handlers.
 *
 * @param bindKeysEvents {expression}
 * Can be used to specify your own events to determine the life cycle of the handlers.
 * When used, the attribute value should be an object containing:
 *
 * - `activate`: event that will be used to activate the bindings _(default: focus)_
 * - `deactivate`: event that will be used to deactivate the bindings _(default: blur)_
 */
    .directive('bindKeys', ['$parse', 'keyBindings', 'BIND_KEYS_EVENTS', function($parse, keyBindings, BIND_KEYS_EVENTS) {
        var attrName = 'bindKeys';
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                var handlers = [];
                var handlerRemovers = [];
                var unwatchAttr;
                var unwatchEvents;
                var unwatchHandlers;

                attrs.$observe(attrName, function(value) {
                    if (unwatchAttr) unwatchAttr();
                    unwatchAttr = scope.$watchCollection(value, getHandlers);
                });

                attrs.$observe(attrName + 'Events', function(value) {
                    if (unwatchEvents) unwatchEvents();
                    unwatchEvents = scope.$watchCollection(value, bindEvents);
                });

                scope.$on('$destroy', function() {
                    deactivate();
                });

                function getHandlers(parsedExpression) {
                    if (!angular.isObject(parsedExpression)) {
                        throw new Error('[on-key] expression must be an object');
                    }

                    var output = [];

                    angular.forEach(parsedExpression, function(handlerExpression, combo) {
                        var handler = {
                            combo: combo
                        };
                        var parsedHandlerExpression;

                        if (angular.isFunction(handlerExpression)) {
                            handler.handler = handlerExpression;
                        } else if (angular.isString(handlerExpression)) {
                            parsedHandlerExpression = $parse(handlerExpression);
                            handler.handler = function(event, combo) {
                                var returnValue = parsedHandlerExpression(scope, {
                                    '$event': event,
                                    '$combo': combo
                                });
                                scope.$apply();
                                return returnValue;
                            };
                        } else {
                            throw new Error('[on-key] handler expression must be a function or string');
                        }

                        output.push(handler);
                    });

                    handlers = output;
                }

                function activate() {
                    if (unwatchHandlers) return;

                    unwatchHandlers = scope.$watch(function() {
                        return handlers;
                    }, function(newHandlers) {
                        removeHandlers();
                        angular.forEach(newHandlers, function(handler) {
                            handlerRemovers.push(keyBindings.addHandler(handler));
                        });
                    });
                }

                function deactivate() {
                    if (unwatchHandlers) {
                        unwatchHandlers();
                        unwatchHandlers = null;
                    }

                    removeHandlers();
                }

                function removeHandlers() {
                    angular.forEach(handlerRemovers, function(remove) {
                        remove();
                    });
                    handlerRemovers = [];
                }

                function applyActivate() {
                    scope.$apply(activate);
                }

                function applyDeactivate() {
                    scope.$apply(deactivate);
                }

                function toggleEvents(events, isOff) {
                    element[isOff ? 'on' : 'off'](events && events.activate ?
                        events.activate : BIND_KEYS_EVENTS.activate, applyActivate);

                    element[isOff ? 'on' : 'off'](events && events.deactivate ?
                        events.deactivate : BIND_KEYS_EVENTS.deactivate, applyDeactivate);
                }

                function bindEvents(newEvents, oldEvents) {
                    if (oldEvents && oldEvents !== newEvents) {
                        toggleEvents(oldEvents, false);
                    }

                    toggleEvents(newEvents, true);
                }
            }
        };
    }]);