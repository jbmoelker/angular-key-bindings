    angular.module('app', [
        'voorhoede.components.keyBindings'
    ])
        .controller('AppCtrl', function() {
            this.createNewDocument = function() {
                alert('Create new document');
            };
        });