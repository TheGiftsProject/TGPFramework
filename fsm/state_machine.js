ObjectRepository.Require('TGP.FSM.StateMachine', function() {

    TGP.Namespace('FSM');

    TGP.FSM.StateMachine = function(stateName) {
        TGP.FSM.StateMachine.__super__.constructor.call(this, stateName);
        //TGP.FSM.State.call(this, stateName);
        this.stateMachines = [];
        this.currentState = null;
    };

    TGP.Core.Inherit(TGP.FSM.StateMachine, TGP.FSM.State);

    TGP.FSM.StateMachine.prototype.unloadState = function() {
        // Unload children
        if (this.currentState) { this.currentState.unloadState(); }
        this.currentState = null;

        // Unload self
        //TGP.FSM.State.prototype.unloadState.call(this);
        TGP.FSM.StateMachine.__super__.unloadState.call(this);
    };

}, true);
