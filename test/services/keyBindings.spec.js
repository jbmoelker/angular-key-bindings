describe('keyBindings service', function() {
    var testHandler = {
        combo: 'test',
        handler: function() {}
    };
    var testHandler2 = {
        combo: 'test',
        handler: function() {}
    };
    var testHandler3 = {
        combo: 'test',
        handler: function() {}
    };
    var continueingHandler = {
        combo: 'test',
        handler: function() {
            return true;
        }
    };
    var continueingHandler2 = {
        combo: 'test',
        handler: function() {
            return true;
        }
    };

    var service;

    beforeEach(module('voorhoede.components.keyBindings.services.keyBindings'));

    beforeEach(inject(function(keyBindings) {
        service = keyBindings;
    }));

    afterEach(function() {
        Mousetrap.reset();
    });

    describe('addHandler()', function() {
        describe('if no group exists yet', function() {
            it('should create a group and push the handler into it', function() {
                service.addHandler(testHandler);
                expect(service.comboGroups.test).toEqual([testHandler]);
            });

            it('should bind the combo', function() {
                spyOn(service, 'bindCombo');
                service.addHandler(testHandler);
                expect(service.bindCombo).toHaveBeenCalledWith('test');
            });
        });

        describe('if a group already exists', function() {
            it('should push the handler into the group', function() {
                service.comboGroups = {'test': [testHandler]};
                service.addHandler(testHandler2);
                expect(service.comboGroups.test).toEqual([testHandler, testHandler2]);
                service.addHandler(testHandler3);
                expect(service.comboGroups.test).toEqual([testHandler, testHandler2, testHandler3]);
            });
        });

        it('should return removeHandler()', function() {
            var returnValue = service.addHandler(testHandler);
            expect(typeof returnValue).toBe('function');
            expect(returnValue.name).toBe('removeHandler');
        });
    });
    
    describe('removeHandler()', function() {
        var removeHandler;
        var removeHandler2;
        var removeHandler3;

        beforeEach(function() {
            removeHandler = service.addHandler(testHandler);
            removeHandler2 = service.addHandler(testHandler2);
            removeHandler3 = service.addHandler(testHandler3);
        });

        it('should remove the handler from its group', function() {
            removeHandler();
            expect(service.comboGroups.test).toEqual([testHandler2, testHandler3]);
            removeHandler2();
            expect(service.comboGroups.test).toEqual([testHandler3]);
        });

        it('should not throw if the handler was already removed from its group', function() {
            service.comboGroups = {'test': []};
            expect(removeHandler).not.toThrow();
        });

        it('should not throw if the group was already removed', function() {
            service.comboGroups = {};
            expect(removeHandler).not.toThrow();
        });

        describe('if the handler was the last remaining within the group', function() {
            it('should unbind the combo', function() {
                spyOn(service, 'unbindCombo');
                removeHandler();
                removeHandler2();
                removeHandler3();
                expect(service.unbindCombo).toHaveBeenCalledWith('test');
            });

            it('should null the group', function() {
                removeHandler();
                removeHandler2();
                removeHandler3();
                expect(service.comboGroups.test).toBe(null);
            });
        });
    });

    describe('bindCombo()', function() {
        beforeEach(function() {
            service.comboGroups = {test: [testHandler, testHandler2, testHandler3]};
        });

        it('should delegate to Mousetrap', function() {
            spyOn(Mousetrap, 'bind');
            service.bindCombo('test');
            expect(Mousetrap.bind).toHaveBeenCalled();
            expect(Mousetrap.bind.mostRecentCall.args[0]).toBe('test');
        });

        it('should call triggerHandlers() in the event handler, passing the correct arguments', function() {
            spyOn(service, 'triggerHandlers');
            service.bindCombo('test');
            Mousetrap.trigger('test');
            expect(service.triggerHandlers).toHaveBeenCalledWith(service.comboGroups.test, {}, 'test');
        });
    });

    describe('unbindCombo()', function() {
        it('should delegate to Mousetrap', function() {
            service.comboGroups = {test: [testHandler, testHandler2, testHandler3]};
            spyOn(Mousetrap, 'unbind');
            service.unbindCombo('test');
            expect(Mousetrap.unbind).toHaveBeenCalledWith('test');
        });
    });

    describe('triggerHandlers()', function() {
        it('should call the last handler in the group, continueing to the next if a handler returns true', function() {
            var handlers = [
                testHandler,
                testHandler2,
                testHandler3,
                continueingHandler,
                continueingHandler2
            ];
            spyOn(testHandler, 'handler').andCallThrough();
            spyOn(testHandler2, 'handler').andCallThrough();
            spyOn(testHandler3, 'handler').andCallThrough();
            spyOn(continueingHandler, 'handler').andCallThrough();
            spyOn(continueingHandler2, 'handler').andCallThrough();
            service.triggerHandlers(handlers, {}, 'test');
            expect(testHandler.handler).not.toHaveBeenCalled();
            expect(testHandler2.handler).not.toHaveBeenCalled();
            expect(testHandler3.handler).toHaveBeenCalledWith({}, 'test');
            expect(continueingHandler.handler).toHaveBeenCalledWith({}, 'test');
            expect(continueingHandler2.handler).toHaveBeenCalledWith({}, 'test');
        });
    });
});