    angular.module('components.dropdownButton', [
        'voorhoede.components.keyBindings'
    ])
        .directive('dropdownButton', function() {
            return {
                restrict: 'E',
                scope: {'label': '@'},
                transclude: true,
                templateUrl: 'dropdownButton.html',
                controllerAs: 'controller',
                controller: function() {
                    this.isOpen = false;
                    this.toggle = function() {
                        this.isOpen = !this.isOpen;
                    };
                }
            };
        });