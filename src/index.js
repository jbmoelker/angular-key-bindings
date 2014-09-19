/**
 * @ngdoc module
 * @name key-bindings
 * @description
 * Context-based key combo handling through directives.
 */
angular.module('voorhoede.components.key-bindings', [
    'voorhoede.components.key-bindings.directives.bind_keys',
    'voorhoede.components.key-bindings.directives.key_binding',
    'voorhoede.components.key-bindings.services.key_bindings'
]);