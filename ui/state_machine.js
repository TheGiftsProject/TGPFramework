ObjectRepository.Require('TGP.UI.StateMachine', function() {

    TGP.Namespace('FSM');

    TGP.UI.StateMachine = function(stateName, component) {
        this.stateName = stateName;
        this.component = component;
        this.stateMachines = [];
        this.currentState = null;
    };

    TGP.UI.StateMachine.prototype.AddStateMachines = function(stateMachines) {
        if (TGP.Core.GetType(stateMachines) != 'array') {
            stateMachines = [stateMachines];
        }

        this.stateMachines = this.stateMachines.concat(stateMachines);

        return this;
    };

    TGP.UI.StateMachine.prototype.FindChildStateMachine = function(name) {
        for (var i = 0, length = this.stateMachines.length; i < length; ++i) {
            if (this.stateMachines[i].stateName == name) {
                return this.stateMachines[i];
            }
        }
    };

    TGP.UI.StateMachine.prototype.LoadState = function(finishCallback, childStates) {
        var thisSM = this;

        if (!childStates) { childStates = []; }

        flow.exec(
            function() {
                if (thisSM.component && (thisSM.component.status !== TGP.UI.Component.STATUS.LOADED)) {
                    thisSM.component.LoadState(this);
                } else {
                    this();
                }
            },
            function(error) {
                if (!error && (thisSM.currentState && (childStates.length === 0 || thisSM.currentState.stateName != childStates[0]))) {
                    thisSM.currentState.UnloadState(this);
                } else {
                    this(error);
                }
            },
            function(error) {
                if (!error) {
                    thisSM.currentState = null;

                    if (childStates.length > 0) {
                        thisSM.currentState = thisSM.FindChildStateMachine(childStates[0]);
                        if (thisSM.currentState) {
                            thisSM.currentState.LoadState(finishCallback, childStates.slice(1));
                        } else {
                            if (finishCallback) { finishCallback('Child State ' + childStates[0] + ' Not Found'); }
                        }
                    } else {
                        if (finishCallback) { finishCallback(); }
                    }
                } else {
                    if (finishCallback) { finishCallback(error); }
                }
            }
        );
    };

    TGP.UI.StateMachine.prototype.UnloadState = function(finishCallback) {
        var thisSM = this;

        flow.exec(
            function() {
                if (thisSM.currentState) {
                    thisSM.currentState.UnloadState(this);
                } else {
                    this();
                }
            },
            function(error) {
                if (!error && thisSM.component) {
                    thisSM.component.UnloadState(finishCallback);
                } else {
                    if (finishCallback) { finishCallback(error); }
                }
            }
        );
    };

}, true);
