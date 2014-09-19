angular.module('voorhoede.components.key-bindings.directives.bind_keys', [])

    .constant('BIND_KEYS_EVENTS', {
        activate: 'focus',
        deactivate: 'blur'
    })

    .directive('bindKeys', ['$parse', 'keyBindings', 'BIND_KEYS_EVENTS', function($parse, keyBindings, BIND_KEYS_EVENTS) {
        var attrName = 'bindKeys';
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                var handlers = [];
                var handlerRemovers = [];
                var unwatch;
                var unwatchEvents;

                attrs.$observe(attrName, function(value) {
                    if (unwatch) unwatch();
                    unwatch = scope.$watchCollection(value, getHandlers);
                });

                attrs.$observe(attrName + 'Events', function(value) {
                    if (unwatchEvents) unwatchEvents();
                    unwatchEvents = scope.$watchCollection(value, bindEvents);
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
                                return parsedHandlerExpression(scope, {
                                    '$event': event,
                                    '$combo': combo
                                });
                            };
                        } else {
                            throw new Error('[on-key] handler expression must be a function or string');
                        }

                        output.push(handler);
                    });

                    handlers = output;
                }

                function activate() {
                    scope.$watch(function() {
                        return handlers;
                    }, function(newHandlers) {
                        deactivate();
                        angular.forEach(newHandlers, function(handler) {
                            handlerRemovers.push(keyBindings.addHandler(handler));
                        });
                    });
                }

                function deactivate() {
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