ObjectRepository.Require('TGP.FSM.StateMachine', function() {

    TGP.Namespace('FSM');

    TGP.FSM.StateMachine = function(stateName) {
        TGP.FSM.StateMachine.__super__.constructor.call(this, stateName);
        this.stateMachines = [];
        this.currentState = null;
    };

    TGP.Core.Inherit(TGP.FSM.StateMachine, TGP.FSM.State);

    TGP.FSM.StateMachine.prototype.AddStateMachines = function(stateMachines) {
        if (TGP.Core.GetType(stateMachines) !== 'array') {
            stateMachines = [stateMachines];
        }

        this.stateMachines = this.stateMachines.concat(stateMachines);

        for (var i = 0, length = stateMachines.length; i < length; ++i) {
            stateMachines[i].OnCancel.AddListener(this.OnCancel.Trigger, this.OnCancel);
        }
    };

    TGP.FSM.StateMachine.prototype.unloadState = function(postUnloadCallback) {
        var thisState = this;

        function DoneUnloadChildCallback() {
            thisState.currentState = null;

            // Unload self
            TGP.FSM.StateMachine.__super__.unloadState.call(thisState, postUnloadCallback);
        }

        // Unload children
        if (this.currentState) {
            this.currentState.unloadState(DoneUnloadChildCallback);
        } else {
            DoneUnloadChildCallback();
        }
    };

}, true);
