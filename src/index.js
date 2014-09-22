/**
 * @ngdoc module
 * @name voorhoede.components.keyBindings
 * @description
 * Contextual key combo handling through directives.
 */
angular.module('voorhoede.components.keyBindings', [
    'voorhoede.components.keyBindings.directives.bindKeys',
    'voorhoede.components.keyBindings.directives.keyBinding',
    'voorhoede.components.keyBindings.services.keyBindings'
]);